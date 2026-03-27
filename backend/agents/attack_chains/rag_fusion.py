"""RAG Fusion Attack Chain — B1.7.

Generates multiple query variants, retrieves documents for each,
then merges results using Reciprocal Rank Fusion (RRF). This
multi-angle approach is devastating for red teaming: different
query formulations can bypass different guardrails.

Original template: ``rag-fusion`` (langchain-templates)
Key technique: Multi-query generation + RRF score merging.

Improvements over original:
    - AI-agnostique via llm_factory (was hardcoded ChatOpenAI())
    - Removed dependency on langchain hub (was hub.pull("rag-fusion-query-generation"))
    - Replaced PineconeVectorStore with Chroma (local-first)
    - Configurable RRF k parameter
    - Inline query generation prompt (no external dependency)
    - Returns full ranked results with scores

Reference:
    Original: langchain-templates/rag-fusion/chain.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L3 (major — removed hub dependency + Pinecone -> Chroma)
"""

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from . import register_chain
from .llm_factory import get_llm, get_chroma_vectorstore


QUERY_GEN_TEMPLATE = """You are a helpful assistant that generates multiple search
queries based on a single input query. Generate {num_queries} different search
queries that are related to the following input query. Each query should approach
the topic from a different angle or perspective.

Output the queries separated by newlines, with no numbering or bullet points.

Original query: {question}"""

QUERY_GEN_PROMPT = ChatPromptTemplate.from_template(QUERY_GEN_TEMPLATE)


def reciprocal_rank_fusion(results: list[list], k: int = 60) -> list[tuple]:
    """Merge multiple ranked result lists using Reciprocal Rank Fusion.

    For each document across all result lists, computes:
        score = sum(1 / (rank + k)) for each list the doc appears in.

    Higher k gives more weight to documents that appear in many lists
    (vs. documents that rank highly in just one list).

    Args:
        results: List of ranked document lists from multiple queries.
        k: RRF parameter (default: 60, as per original paper).

    Returns:
        List of (document, score) tuples sorted by descending score.
    """
    fused_scores: dict[str, float] = {}
    doc_map: dict[str, object] = {}

    for docs in results:
        for rank, doc in enumerate(docs):
            doc_key = doc.page_content[:200]  # Use content prefix as key
            if doc_key not in fused_scores:
                fused_scores[doc_key] = 0.0
                doc_map[doc_key] = doc
            fused_scores[doc_key] += 1.0 / (rank + k)

    reranked = sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)
    return [(doc_map[key], score) for key, score in reranked]


@register_chain(
    chain_id="rag_fusion",
    description="RAG Fusion — multi-query + Reciprocal Rank Fusion for multi-angle retrieval attacks",
    source_template="rag-fusion",
)
def build_rag_fusion(
    collection_name: str = "medical-rag",
    num_queries: int = 4,
    rrf_k: int = 60,
    top_n: int = 5,
    documents: list | None = None,
    **kwargs,
):
    """Build the RAG Fusion attack chain.

    Args:
        collection_name: Chroma collection to query.
        num_queries: Number of query variants to generate.
        rrf_k: RRF fusion parameter (higher = more weight to breadth).
        top_n: Number of top-ranked documents to return.
        documents: Optional documents to index.
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes a question string and returns
        a list of (document, score) tuples.
    """
    llm = get_llm(**kwargs)
    vectorstore = get_chroma_vectorstore(collection_name=collection_name)

    if documents:
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        vectorstore.add_documents(splitter.split_documents(documents))

    retriever = vectorstore.as_retriever()
    prompt = QUERY_GEN_PROMPT.partial(num_queries=str(num_queries))

    generate_queries = (
        prompt
        | llm
        | StrOutputParser()
        | (lambda x: [q.strip() for q in x.split("\n") if q.strip()])
    )

    chain = (
        {"original_query": RunnablePassthrough()}
        | RunnablePassthrough.assign(queries=generate_queries)
        | (lambda x: {
            "results": [retriever.invoke(q) for q in x["queries"]],
            "k": rrf_k,
        })
        | (lambda x: reciprocal_rank_fusion(x["results"], x["k"])[:top_n])
    )

    return chain
