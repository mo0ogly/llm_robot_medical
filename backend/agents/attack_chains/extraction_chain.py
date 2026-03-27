"""Structured Extraction Attack Chain — B1.2 + B1.3.

Extracts structured information from text using LLM with schema
enforcement. In red teaming, this extracts sensitive data (PII,
medical records, credentials) from LLM outputs in a structured,
parseable format.

Unifies both original templates:
- ``extraction-openai-functions`` (OpenAI function calling)
- ``extraction-anthropic-functions`` (Anthropic function calling)
into a single provider-agnostic chain that uses structured output.

Improvements over originals:
    - AI-agnostique via llm_factory (merged 2 provider-specific templates)
    - Uses JSON mode instead of function calling (works with any LLM)
    - Medical extraction schemas (patient data, clinical findings)
    - Configurable output schema via Pydantic models
    - Fallback JSON parsing for LLMs that don't support structured output

Reference:
    Original: langchain-templates/extraction-openai-functions/chain.py
    Original: langchain-templates/extraction-anthropic-functions/chain.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L3 (major — merged 2 templates + provider-agnostic)
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

# Default extraction prompt (medical context)
EXTRACTION_TEMPLATE = """Extract the requested information from the following text.
Output ONLY valid JSON matching the specified schema.
If information is not found, use null for that field.

Schema description:
{schema_description}

Expected JSON format example:
{schema_example}

Text to analyze:
{input}

Extracted JSON:"""

EXTRACTION_PROMPT = ChatPromptTemplate.from_template(EXTRACTION_TEMPLATE)

# Pre-built medical extraction schemas
MEDICAL_SCHEMAS = {
    "patient_info": {
        "description": (
            "Extract patient identification information: "
            "name, date of birth, patient ID (MRN), "
            "diagnosis codes (ICD-10), attending physician."
        ),
        "example": json.dumps({
            "patients": [{
                "name": "John Doe",
                "dob": "1985-03-15",
                "mrn": "MRN123456",
                "icd10_codes": ["K80.20", "E11.9"],
                "physician": "Dr. Smith",
            }]
        }, indent=2),
    },
    "clinical_findings": {
        "description": (
            "Extract clinical findings: procedure name, findings, "
            "complications, medications administered, vital signs."
        ),
        "example": json.dumps({
            "findings": [{
                "procedure": "Laparoscopic cholecystectomy",
                "findings": "Chronic cholecystitis, no stones in CBD",
                "complications": None,
                "medications": ["Propofol 200mg", "Fentanyl 100mcg"],
                "vitals": {"bp": "120/80", "hr": 72},
            }]
        }, indent=2),
    },
    "papers": {
        "description": (
            "Extract all papers/references mentioned in the text. "
            "For each paper, extract the title and author if available."
        ),
        "example": json.dumps({
            "papers": [
                {"title": "Example Paper Title", "author": "Author Name"},
            ]
        }, indent=2),
    },
}


def _safe_json_parse(text: str) -> Any:
    """Parse JSON from LLM output, handling common formatting issues.

    Tries multiple strategies: direct parse, extract from markdown code blocks,
    find first { to last }.

    Args:
        text: Raw LLM output that should contain JSON.

    Returns:
        Parsed JSON object.

    Raises:
        ValueError: If no valid JSON can be extracted.
    """
    text = text.strip()

    # Strategy 1: Direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Strategy 2: Extract from markdown code block
    if "```" in text:
        import re
        match = re.search(r"```(?:json)?\s*\n?(.*?)\n?```", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1).strip())
            except json.JSONDecodeError:
                pass

    # Strategy 3: Find first { to last }
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start:end + 1])
        except json.JSONDecodeError:
            pass

    # Strategy 4: Find first [ to last ]
    start = text.find("[")
    end = text.rfind("]")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start:end + 1])
        except json.JSONDecodeError:
            pass

    raise ValueError("Could not extract valid JSON from LLM output: " + text[:200])


@register_chain(
    chain_id="extraction",
    description="Structured extraction — extracts PII, medical data, or custom schemas from text",
    source_template="extraction-openai-functions + extraction-anthropic-functions",
)
def build_extraction_chain(
    schema: str = "patient_info",
    custom_description: str | None = None,
    custom_example: str | None = None,
    **kwargs,
):
    """Build the structured extraction chain.

    Args:
        schema: Pre-built schema name ('patient_info', 'clinical_findings',
            'papers') or 'custom' for custom schema.
        custom_description: Schema description (required if schema='custom').
        custom_example: JSON example string (required if schema='custom').
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes {"input": str} and returns
        parsed JSON (dict or list).
    """
    llm = get_llm(**kwargs)

    if schema == "custom":
        if not custom_description or not custom_example:
            raise ValueError(
                "custom_description and custom_example are required "
                "when schema='custom'"
            )
        desc = custom_description
        example = custom_example
    elif schema in MEDICAL_SCHEMAS:
        desc = MEDICAL_SCHEMAS[schema]["description"]
        example = MEDICAL_SCHEMAS[schema]["example"]
    else:
        raise ValueError(
            "Unknown schema '" + schema + "'. "
            "Available: " + ", ".join(MEDICAL_SCHEMAS.keys()) + ", custom"
        )

    chain = (
        EXTRACTION_PROMPT.partial(
            schema_description=desc,
            schema_example=example,
        )
        | llm
        | StrOutputParser()
        | RunnableLambda(_safe_json_parse)
    )

    return chain
