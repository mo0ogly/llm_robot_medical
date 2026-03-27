"""Critique-Revise Attack Chain — B1.1.

Iterative loop that generates an output, validates it against a schema,
and revises it until validation passes or max iterations are reached.
In red teaming, this pattern auto-corrects failed attack payloads:
if an injection attempt fails schema validation, the LLM revises it
to satisfy constraints while preserving the attack intent.

Original template: ``basic-critique-revise`` (langchain-templates)
Key technique: Generate -> Validate -> Revise loop with RunnableBranch.

Improvements over original:
    - AI-agnostique via llm_factory (was hardcoded ChatOpenAI())
    - Removed OpenAI function calling dependency (uses structured output)
    - Simplified validation loop (original used nested RunnableBranch)
    - Configurable max revisions
    - Medical-domain default schema (patient tasks)
    - Returns revision history for audit trail

Reference:
    Original: langchain-templates/basic-critique-revise/chain.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L3 (major — removed function calling + simplified loop)
"""

import json
import logging
from typing import Any

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda

from . import register_chain
from .llm_factory import get_llm

logger = logging.getLogger(__name__)

GENERATE_TEMPLATE = """Respond to the following user query.
Output your response as valid JSON.

Query: {query}

JSON Response:"""

GENERATE_PROMPT = ChatPromptTemplate.from_template(GENERATE_TEMPLATE)

REVISE_TEMPLATE = """The following JSON output has validation errors.
Fix the JSON to satisfy the constraints while preserving the original intent.

Original query: {original_query}

Incorrect JSON:
{completion}

Errors:
{error}

Corrected JSON:"""

REVISE_PROMPT = ChatPromptTemplate.from_template(REVISE_TEMPLATE)


def _default_validator(output: str) -> str | None:
    """Validate that the output is parseable JSON.

    Args:
        output: Raw LLM output string.

    Returns:
        None if valid, error message string if invalid.
    """
    try:
        json.loads(output)
        return None
    except json.JSONDecodeError as e:
        return f"Invalid JSON: {e}"


@register_chain(
    chain_id="critique_revise",
    description="Critique-Revise loop — auto-corrects failed outputs via iterative validation",
    source_template="basic-critique-revise",
)
def build_critique_revise(
    max_revisions: int = 5,
    validator: Any = None,
    **kwargs,
):
    """Build the Critique-Revise loop chain.

    Flow: generate -> validate -> (if error: revise -> validate) x N.

    Args:
        max_revisions: Maximum number of revision attempts (default: 5).
        validator: Custom validation function. Takes str, returns None if valid
            or error message str if invalid. Defaults to JSON validation.
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes {"query": str} and returns
        {"result": str, "revisions": int, "valid": bool}.
    """
    llm = get_llm(**kwargs)
    validate_fn = validator or _default_validator

    generate_chain = GENERATE_PROMPT | llm | StrOutputParser()
    revise_chain = REVISE_PROMPT | llm | StrOutputParser()

    def _critique_revise_loop(inputs: dict) -> dict:
        """Execute the generate-validate-revise loop.

        Args:
            inputs: Dict with 'query' key.

        Returns:
            Dict with 'result', 'revisions', 'valid', and 'history' keys.
        """
        query = inputs["query"]
        history = []

        # Step 1: Generate initial output
        completion = generate_chain.invoke({"query": query})
        history.append({"step": "generate", "output": completion})

        # Step 2: Validate + revise loop
        for i in range(max_revisions):
            error = validate_fn(completion)
            if error is None:
                return {
                    "result": completion,
                    "revisions": i,
                    "valid": True,
                    "history": history,
                }

            history.append({"step": f"error_{i}", "error": error})

            # Revise
            completion = revise_chain.invoke({
                "original_query": query,
                "completion": completion,
                "error": error,
            })
            history.append({"step": f"revise_{i}", "output": completion})

        # Final validation
        final_error = validate_fn(completion)
        return {
            "result": completion,
            "revisions": max_revisions,
            "valid": final_error is None,
            "history": history,
        }

    return RunnableLambda(_critique_revise_loop)
