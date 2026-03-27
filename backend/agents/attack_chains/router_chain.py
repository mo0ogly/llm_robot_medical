"""Router Chain — B1.16.

Classifies the user question into a category and routes it to the
appropriate retriever or chain. In red teaming, this enables
intelligent attack routing: questions about vulnerabilities go to
the vulnerability DB, medical questions to clinical guidelines, etc.

Original template: ``rag-multi-index-router`` (langchain-templates)
Key technique: LLM-based question classification + RouterRunnable.

Improvements over original:
    - AI-agnostique via llm_factory (was hardcoded ChatOpenAI())
    - Removed OpenAI function calling dependency (uses JSON classification)
    - Replaced proprietary retrievers (KayAI) with local Chroma
    - Configurable route map
    - Fallback route when classification fails

Reference:
    Original: langchain-templates/rag-multi-index-router/chain.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L3 (major — removed function calling + proprietary deps)
"""

import json
import logging

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

from . import register_chain
from .llm_factory import get_llm, get_chroma_vectorstore

logger = logging.getLogger(__name__)

CLASSIFIER_TEMPLATE = """Classify the following question into exactly one category.

Available categories:
{categories}

Question: {question}

Respond with ONLY the category name, nothing else.
Category:"""

CLASSIFIER_PROMPT = ChatPromptTemplate.from_template(CLASSIFIER_TEMPLATE)

ANSWER_TEMPLATE = """Answer the question using the following sources.
If the sources don't contain relevant information, say so.

Sources:
{sources}

Question: {question}
Answer:"""

ANSWER_PROMPT = ChatPromptTemplate.from_template(ANSWER_TEMPLATE)

# Default medical red team routes
DEFAULT_ROUTES = {
    "medical_vulnerability": "Questions about medical device or AI vulnerabilities, CVEs, security flaws",
    "clinical_guidelines": "Questions about medical protocols, drug dosages, treatment guidelines",
    "attack_techniques": "Questions about prompt injection, red teaming, penetration testing techniques",
    "general": "General questions that don't fit other categories",
}


@register_chain(
    chain_id="router",
    description="Router — classifies questions and routes to the appropriate retrieval source",
    source_template="rag-multi-index-router",
)
def build_router_chain(
    routes: dict[str, str] | None = None,
    retrievers: dict[str, object] | None = None,
    fallback_route: str = "general",
    **kwargs,
):
    """Build the router chain.

    Classifies the question, selects the appropriate retriever,
    retrieves context, and generates an answer.

    Args:
        routes: Dict mapping route_name -> description for classification.
        retrievers: Dict mapping route_name -> retriever object.
            If None, creates Chroma collections for each route.
        fallback_route: Route to use when classification fails.
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes {"question": str} and returns str.
    """
    llm = get_llm(**kwargs)
    route_map = routes or DEFAULT_ROUTES

    # Create retrievers for each route
    if retrievers is None:
        retrievers = {}
        for route_name in route_map:
            vs = get_chroma_vectorstore(collection_name=route_name)
            retrievers[route_name] = vs.as_retriever()

    categories_text = "\n".join(
        "- " + name + ": " + desc for name, desc in route_map.items()
    )

    classifier = (
        CLASSIFIER_PROMPT.partial(categories=categories_text)
        | llm
        | StrOutputParser()
        | (lambda x: x.strip().lower().replace(" ", "_"))
    )

    def _classify_and_retrieve(inputs: dict) -> dict:
        """Classify question and retrieve from the appropriate source.

        Args:
            inputs: Dict with 'question' key.

        Returns:
            Dict with 'sources', 'question', and 'route' keys.
        """
        question = inputs["question"]

        # Classify
        route = classifier.invoke({"question": question})

        # Validate route
        if route not in retrievers:
            logger.warning(
                "Unknown route '%s', falling back to '%s'", route, fallback_route
            )
            route = fallback_route

        # Retrieve
        try:
            docs = retrievers[route].invoke(question)
            sources = "\n\n".join(
                "Source [" + route + "] " + str(i) + ":\n" + d.page_content
                for i, d in enumerate(docs)
            )
        except Exception as e:
            sources = "[No results from " + route + ": " + str(e) + "]"

        return {"sources": sources, "question": question, "route": route}

    chain = (
        RunnableLambda(_classify_and_retrieve)
        | ANSWER_PROMPT
        | llm
        | StrOutputParser()
    )

    return chain
