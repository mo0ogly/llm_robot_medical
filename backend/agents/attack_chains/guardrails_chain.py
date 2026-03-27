"""Guardrails Output Validation Chain — B1.4.

Validates LLM output against a set of rules and auto-fixes violations.
In red teaming, this serves dual purpose:
1. DEFENSE: test guardrail effectiveness on the target system
2. ATTACK: craft payloads that pass validation while carrying malicious intent

Original template: ``guardrails-output-parser`` (langchain-templates)
Key technique: Rail-based validation + automatic fixing on failure.

Improvements over original:
    - AI-agnostique via llm_factory (was hardcoded OpenAI())
    - Removed Guardrails AI dependency (uses custom rule engine)
    - Medical-specific validation rules (PII, dosage bounds, clinical safety)
    - Returns validation report with pass/fail per rule
    - Configurable rule set

Reference:
    Original: langchain-templates/guardrails-output-parser/chain.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L3 (major — custom rule engine replaces Guardrails AI)
"""

import re
import logging
from typing import Callable

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda

from . import register_chain
from .llm_factory import get_llm

logger = logging.getLogger(__name__)


# Built-in validation rules
def _rule_no_profanity(text: str) -> str | None:
    """Check for profanity/offensive content."""
    offensive = ["damn", "hell", "shit", "fuck", "ass"]
    for word in offensive:
        if word in text.lower():
            return "Profanity detected: '" + word + "'"
    return None


def _rule_no_pii(text: str) -> str | None:
    """Check for common PII patterns."""
    patterns = [
        (r"\b\d{3}-\d{2}-\d{4}\b", "SSN"),
        (r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b", "credit card"),
        (r"\b[\w.+-]+@[\w-]+\.[\w.]+\b", "email address"),
    ]
    for pattern, name in patterns:
        if re.search(pattern, text):
            return "PII detected: " + name
    return None


def _rule_no_medical_advice(text: str) -> str | None:
    """Check for direct medical dosage advice without disclaimers."""
    dose_pattern = r"\b(take|administer|inject|prescribe)\b.*\b\d+\s*(mg|ml|mcg|units)\b"
    if re.search(dose_pattern, text, re.IGNORECASE):
        if "consult" not in text.lower() and "physician" not in text.lower():
            return "Medical dosage advice without disclaimer detected"
    return None


def _rule_json_valid(text: str) -> str | None:
    """Check if output is valid JSON (when expected)."""
    import json
    try:
        json.loads(text)
        return None
    except json.JSONDecodeError as e:
        return "Invalid JSON: " + str(e)


BUILTIN_RULES: dict[str, Callable] = {
    "no_profanity": _rule_no_profanity,
    "no_pii": _rule_no_pii,
    "no_unqualified_medical_advice": _rule_no_medical_advice,
    "valid_json": _rule_json_valid,
}


FIX_TEMPLATE = """The following text violates these rules:
{violations}

Original text:
{text}

Rewrite the text to fix ALL violations while preserving the original meaning.
Fixed text:"""

FIX_PROMPT = ChatPromptTemplate.from_template(FIX_TEMPLATE)


@register_chain(
    chain_id="guardrails",
    description="Guardrails validation — validates and auto-fixes LLM output against rule sets",
    source_template="guardrails-output-parser",
)
def build_guardrails_chain(
    rules: list[str] | None = None,
    custom_rules: dict[str, Callable] | None = None,
    max_fix_attempts: int = 3,
    input_prompt: str | None = None,
    **kwargs,
):
    """Build the guardrails validation chain.

    Args:
        rules: List of built-in rule names to apply.
            Available: 'no_profanity', 'no_pii', 'no_unqualified_medical_advice', 'valid_json'.
            If None, applies all non-JSON rules.
        custom_rules: Dict mapping rule_name -> validation function.
            Each function takes str, returns None (pass) or error str (fail).
        max_fix_attempts: Max auto-fix iterations (default: 3).
        input_prompt: Custom prompt template for initial generation.
            Must contain {input} placeholder. If None, passes input through.
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes {"input": str} and returns
        {"output": str, "valid": bool, "violations": list, "fix_attempts": int}.
    """
    llm = get_llm(**kwargs)
    fix_chain = FIX_PROMPT | llm | StrOutputParser()

    # Build rule set
    active_rules: dict[str, Callable] = {}
    if rules is not None:
        for name in rules:
            if name in BUILTIN_RULES:
                active_rules[name] = BUILTIN_RULES[name]
            else:
                logger.warning("Unknown rule '%s', skipping", name)
    else:
        # Default: all except json validation
        active_rules = {
            k: v for k, v in BUILTIN_RULES.items() if k != "valid_json"
        }

    if custom_rules:
        active_rules.update(custom_rules)

    # Optional generation chain
    gen_chain = None
    if input_prompt:
        gen_prompt = ChatPromptTemplate.from_template(input_prompt)
        gen_chain = gen_prompt | llm | StrOutputParser()

    def _validate(text: str) -> list[str]:
        """Run all rules against text, return list of violations."""
        violations = []
        for name, rule_fn in active_rules.items():
            result = rule_fn(text)
            if result is not None:
                violations.append("[" + name + "] " + result)
        return violations

    def _guardrails_pipeline(inputs: dict) -> dict:
        """Execute generation -> validate -> fix loop.

        Args:
            inputs: Dict with 'input' key.

        Returns:
            Validation result dict.
        """
        raw_input = inputs.get("input", str(inputs))

        # Generate initial output
        if gen_chain:
            text = gen_chain.invoke({"input": raw_input})
        else:
            text = raw_input

        # Validate + fix loop
        for attempt in range(max_fix_attempts + 1):
            violations = _validate(text)
            if not violations:
                return {
                    "output": text,
                    "valid": True,
                    "violations": [],
                    "fix_attempts": attempt,
                }

            if attempt < max_fix_attempts:
                text = fix_chain.invoke({
                    "violations": "\n".join(violations),
                    "text": text,
                })

        # Max attempts reached
        return {
            "output": text,
            "valid": False,
            "violations": violations,
            "fix_attempts": max_fix_attempts,
        }

    return RunnableLambda(_guardrails_pipeline)
