"""RAG Basic Attack Chain — B2.2.

Minimal RAG pipeline: LLM + embeddings + Chroma retriever.
Serves as the baseline for comparing more advanced RAG attack
techniques (multi-query, fusion, HyDE, etc.).

Original template: ``rag-chroma`` (langchain-templates)
Key technique: Simple semantic search retrieval + LLM answer generation.

Improvements over original:
    - AI-agnostique via llm_factory (was hardcoded ChatOpenAI())
    - Configurable retriever k parameter
    - Medical-domain system prompt
    - No hardcoded test data at import time

Reference:
    Original: langchain-templates/rag-chroma/chain.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L1 (minor — provider swap + prompt)
"""

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

from . import register_chain
from .llm_factory import get_llm, get_chroma_vectorstore


RAG_BASIC_TEMPLATE = """Answer the question based only on the following context.
Provide detailed, accurate information from the context.

Context:
{context}

Question: {question}

Answer:"""

RAG_BASIC_PROMPT = ChatPromptTemplate.from_template(RAG_BASIC_TEMPLATE)


@register_chain(
    chain_id="rag_basic",
    description="Baseline RAG — simple semantic search + answer generation",
    source_template="rag-chroma",
)
def build_rag_basic(
    collection_name: str = "rag-basic",
    search_k: int = 4,
    documents: list | None = None,
    **kwargs,
):
    """Build the basic RAG chain.

    Args:
        collection_name: Chroma collection name.
        search_k: Number of documents to retrieve (default: 4).
        documents: Optional list of Document objects to index.
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes {"question": str} and returns str.
    """
    llm = get_llm(**kwargs)
    vectorstore = get_chroma_vectorstore(collection_name=collection_name)

    if documents:
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        splits = splitter.split_documents(documents)
        vectorstore.add_documents(splits)

    retriever = vectorstore.as_retriever(search_kwargs={"k": search_k})

    chain = (
        RunnableParallel({"context": retriever, "question": RunnablePassthrough()})
        | RAG_BASIC_PROMPT
        | llm
        | StrOutputParser()
    )

    return chain
