"""Research Assistant Chain — B1.23.

Multi-step research pipeline: auto-selects a specialist agent persona,
generates sub-queries, scrapes/summarizes multiple sources, then writes
a structured report. In red teaming, this enables automated
reconnaissance and intelligence gathering against target systems.

Source: langchain-templates/research-assistant (Liu et al., 2023)
Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L2 (moderate — AI-agnostic + security domain + safe scraping)

Architecture (Mermaid):
```mermaid
graph TB
    Q[Question] --> AGENT[Auto-select specialist agent]
    AGENT --> QUERIES[Generate 3 sub-queries]
    QUERIES --> SEARCH[Search each sub-query]
    SEARCH --> SCRAPE[Scrape + summarize results]
    SCRAPE --> FUSE[Fuse all summaries]
    FUSE --> WRITE[Write structured report]
    WRITE --> OUT[Final report]
```
"""

import json
import logging
from typing import Any

from langchain_core.messages import SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnableParallel, RunnablePassthrough

from . import register_chain
from .llm_factory import get_llm

logger = logging.getLogger(__name__)

# ── Prompts ────────────────────────────────────────────────────────
AGENT_SELECTION_INSTRUCTIONS = """This task involves researching a given topic.
The research is conducted by a specific agent, defined by its type and role.

Select the most appropriate agent for the task:

Examples:
task: "What are the OWASP Top 10 for LLMs?"
response: {"agent": "Security Researcher", "agent_role_prompt": "You are a cybersecurity expert specializing in AI/LLM security vulnerabilities and prompt injection attacks."}

task: "How do medical AI systems handle patient data?"
response: {"agent": "Medical AI Analyst", "agent_role_prompt": "You are a medical AI specialist focused on patient data protection, HIPAA compliance, and healthcare system security."}

task: "What SQL injection vectors exist for EMR systems?"
response: {"agent": "Penetration Tester", "agent_role_prompt": "You are an experienced penetration tester specializing in healthcare IT systems, EMR databases, and medical device security."}"""

CHOOSE_AGENT_PROMPT = ChatPromptTemplate.from_messages([
    SystemMessage(content=AGENT_SELECTION_INSTRUCTIONS),
    ("user", "task: {task}"),
])

SEARCH_PROMPT = ChatPromptTemplate.from_messages([
    ("system", "{agent_prompt}"),
    ("user",
     "Write 3 search queries to research the following topic thoroughly: "
     "{question}\n\n"
     "Respond with a JSON list of strings: "
     '["query 1", "query 2", "query 3"].'),
])

SUMMARY_TEMPLATE = """{text}

-----------
Using the above text, answer in short the following question:

> {question}

If the question cannot be answered using the text, summarize the text.
Include all factual information, numbers, and stats if available."""

SUMMARY_PROMPT = ChatPromptTemplate.from_template(SUMMARY_TEMPLATE)

WRITER_SYSTEM = (
    "You are an AI security research assistant. Your purpose is to write "
    "well-structured, technically accurate, objective reports on security "
    "research findings."
)

REPORT_TEMPLATE = """Information:
--------
{research_summary}
--------

Using the above information, answer the following question: "{question}"
in a detailed, well-structured report.

The report should:
- Focus on the answer to the question
- Be well-organized with clear sections
- Include technical details, facts, and numbers when available
- Use markdown syntax
- List all source references at the end

Write a thorough, professional report."""

WRITER_PROMPT = ChatPromptTemplate.from_messages([
    ("system", WRITER_SYSTEM),
    ("user", REPORT_TEMPLATE),
])


# ── Helpers ────────────────────────────────────────────────────────
def _safe_json_loads(text: str) -> list | dict:
    """Safely parse JSON from LLM output.

    Args:
        text: Raw LLM output that should contain JSON.

    Returns:
        Parsed JSON or empty dict on failure.
    """
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        # Try to extract JSON array from text
        import re
        match = re.search(r'\[.*?\]', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
        logger.warning("Failed to parse JSON from LLM output: %s", text[:100])
        return []


def _stub_search(query: str) -> str:
    """Stub search function for when no real search is available.

    Args:
        query: Search query string.

    Returns:
        Stub result indicating search is not configured.
    """
    return (
        f"[STUB] Search results for '{query}': "
        f"No real search backend configured. In production, this would "
        f"query DuckDuckGo, Tavily, or a local knowledge base."
    )


# ── Chain builder ──────────────────────────────────────────────────
@register_chain(
    chain_id="research_assistant",
    description=(
        "Research Assistant — multi-step reconnaissance pipeline, "
        "auto-selects persona, generates sub-queries, writes report"
    ),
    source_template="research-assistant",
)
def build_research_chain(
    model: str = "llama3",
    search_fn: Any = None,
    **kwargs: Any,
) -> Any:
    """Build the research assistant chain.

    Args:
        model: Model name for Ollama (default: llama3).
        search_fn: Callable(query) -> str for web search.
            Defaults to stub.
        **kwargs: Extra arguments forwarded to ``get_llm``.

    Returns:
        LangChain Runnable chain accepting a ``question`` string.
    """
    llm = get_llm(model=model, **kwargs)
    searcher = search_fn or _stub_search

    # Step 1: Choose agent persona
    choose_agent = (
        CHOOSE_AGENT_PROMPT
        | llm
        | StrOutputParser()
        | _safe_json_loads
    )

    # Step 2: Generate search queries
    search_query_chain = (
        SEARCH_PROMPT
        | llm
        | StrOutputParser()
        | _safe_json_loads
    )

    # Step 3: Search + summarize each query
    def _search_and_summarize(inputs: dict) -> str:
        question = inputs.get("question", "")
        queries = inputs.get("queries", [question])
        if not isinstance(queries, list):
            queries = [question]

        summaries = []
        for q in queries[:3]:  # Cap at 3 queries
            try:
                raw_text = searcher(q)
                summary_result = SUMMARY_PROMPT.invoke({
                    "text": str(raw_text)[:10000],
                    "question": question,
                })
                summary = (llm | StrOutputParser()).invoke(summary_result)
                summaries.append(f"Query: {q}\nSummary: {summary}")
            except Exception as exc:
                logger.warning("Search/summarize failed for '%s': %s", q, exc)
                summaries.append(f"Query: {q}\nSummary: [Error: {exc}]")

        return "\n\n".join(summaries)

    # Step 4: Write report
    writer_chain = WRITER_PROMPT | llm | StrOutputParser()

    # Full pipeline
    def _full_research(inputs: dict) -> str:
        question = inputs.get("question", str(inputs))

        # Choose agent
        try:
            agent_info = choose_agent.invoke({"task": question})
            agent_prompt = (
                agent_info.get("agent_role_prompt", "You are a security researcher.")
                if isinstance(agent_info, dict)
                else "You are a security researcher."
            )
        except Exception:
            agent_prompt = "You are a security researcher."

        # Generate queries
        try:
            queries = search_query_chain.invoke({
                "agent_prompt": agent_prompt,
                "question": question,
            })
            if not isinstance(queries, list):
                queries = [question]
        except Exception:
            queries = [question]

        # Search and summarize
        research_summary = _search_and_summarize({
            "question": question,
            "queries": queries,
        })

        # Write report
        return writer_chain.invoke({
            "question": question,
            "research_summary": research_summary,
        })

    # Wrap as a runnable
    chain = RunnableLambda(_full_research)

    logger.info("research_assistant chain built (model=%s)", model)
    return chain
