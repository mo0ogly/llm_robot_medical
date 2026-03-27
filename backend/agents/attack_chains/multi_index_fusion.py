"""Multi-Index Fusion Chain — B1.15.

Retrieves documents from multiple independent sources (e.g., PubMed,
ArXiv, Wikipedia, local Chroma), then fuses results using cosine
similarity ranking against the original query. In red teaming, this
enables intelligence gathering from multiple knowledge bases before
crafting targeted attacks.

Original template: ``rag-multi-index-fusion`` (langchain-templates)
Key technique: Parallel retrieval from N sources + cosine-similarity fusion.

Improvements over original:
    - AI-agnostique via llm_factory (was hardcoded ChatOpenAI())
    - Replaced KayAiRetriever (proprietary) with additional Chroma sources
    - Sources are configurable (original hardcoded PubMed/ArXiv/Wiki/SEC)
    - Uses numpy-free cosine similarity (no numpy dependency)
    - Simplified fusion logic

Reference:
    Original: langchain-templates/rag-multi-index-fusion/chain.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L3 (major — removed proprietary deps + configurable sources)
"""

import math

from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

from . import register_chain
from .llm_factory import get_llm, get_embeddings, get_chroma_vectorstore


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    """Compute cosine similarity between two vectors without numpy.

    Args:
        a: First vector.
        b: Second vector.

    Returns:
        Cosine similarity score between -1 and 1.
    """
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


ANSWER_TEMPLATE = """Answer the user question using the provided sources.
If you don't know the answer, say so. Cite the source name for each fact.

Sources:
{sources}

Question: {question}
Answer:"""

ANSWER_PROMPT = ChatPromptTemplate.from_messages([
    ("system", "You are a knowledgeable research assistant."),
    ("human", ANSWER_TEMPLATE),
])


@register_chain(
    chain_id="multi_index_fusion",
    description="Multi-Index Fusion — retrieves from N sources and fuses by cosine similarity",
    source_template="rag-multi-index-fusion",
)
def build_multi_index_fusion(
    sources: dict[str, object] | None = None,
    top_n: int = 5,
    **kwargs,
):
    """Build the multi-index fusion chain.

    If no sources are provided, creates demo Chroma collections:
    - medical_guidelines: Medical reference documents
    - vulnerability_db: Known vulnerability descriptions
    - attack_patterns: Red team attack pattern descriptions

    Args:
        sources: Dict mapping source_name -> retriever object.
            Each retriever must support .invoke(query) -> list[Document].
        top_n: Number of top-fused results to use for answering.
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes {"question": str} and returns str.
    """
    llm = get_llm(**kwargs)
    embeddings = get_embeddings()

    # Default sources: 3 local Chroma collections
    if sources is None:
        sources = {}
        for name in ["medical_guidelines", "vulnerability_db", "attack_patterns"]:
            vs = get_chroma_vectorstore(collection_name=name)
            sources[name] = vs.as_retriever(search_kwargs={"k": 3})

    def _fuse_results(inputs: dict) -> list[tuple[str, Document]]:
        """Retrieve from all sources and fuse by cosine similarity.

        Args:
            inputs: Dict with 'question' key.

        Returns:
            List of (source_name, document) tuples sorted by relevance.
        """
        question = inputs["question"]
        query_embedding = embeddings.embed_query(question)

        all_results: list[tuple[str, Document, float]] = []

        for source_name, retriever in sources.items():
            try:
                docs = retriever.invoke(question)
                for doc in docs:
                    doc_embedding = embeddings.embed_query(doc.page_content)
                    sim = _cosine_similarity(query_embedding, doc_embedding)
                    all_results.append((source_name, doc, sim))
            except Exception:
                continue  # Skip unavailable sources

        # Sort by similarity, take top N
        all_results.sort(key=lambda x: x[2], reverse=True)
        return [(name, doc) for name, doc, _ in all_results[:top_n]]

    def _format_named_docs(named_docs: list[tuple[str, Document]]) -> str:
        """Format source-tagged documents."""
        return "\n\n".join(
            "Source: " + name + "\n" + doc.page_content
            for name, doc in named_docs
        )

    chain = (
        RunnablePassthrough.assign(
            fused=RunnableLambda(_fuse_results),
        )
        | {
            "sources": lambda x: _format_named_docs(x["fused"]),
            "question": lambda x: x["question"],
        }
        | ANSWER_PROMPT
        | llm
        | StrOutputParser()
    )

    return chain
