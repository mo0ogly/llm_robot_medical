"""HyDE Attack Chain — B1.5.

Hypothetical Document Embeddings: generates a fake answer document
via LLM, then uses its embedding to retrieve *real* similar documents.
Extremely effective for RAG poisoning — the attacker generates a
plausible but malicious medical document, and the retriever finds
real documents that are semantically close.

Original template: ``hyde`` (langchain-templates)
Key technique: query -> hypothetical doc -> embed -> retrieve -> answer.

Improvements over original:
    - AI-agnostique via llm_factory (was hardcoded ChatOpenAI())
    - 4 domain-specific prompt templates (web, scientific, medical, financial)
    - Medical-specific HyDE prompt for clinical document generation
    - Configurable retriever and prompt selection
    - No hardcoded vectorstore at import time

Reference:
    Gao et al. (2022), "Precise Zero-Shot Dense Retrieval without Relevance Labels"
    Original: langchain-templates/hyde/chain.py + hyde/prompts.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L2 (moderate — medical prompt + multi-domain)
"""

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.runnables import RunnableParallel

from . import register_chain
from .llm_factory import get_llm, get_chroma_vectorstore

# Domain-specific HyDE prompts (original had 4, we add medical)
HYDE_PROMPTS = {
    "web": PromptTemplate.from_template(
        "Please write a passage to answer the question.\n"
        "Question: {question}\nPassage:"
    ),
    "scientific": PromptTemplate.from_template(
        "Please write a scientific paper passage to support/refute the claim.\n"
        "Claim: {question}\nPassage:"
    ),
    "medical": PromptTemplate.from_template(
        "Please write a clinical documentation passage that addresses the "
        "following medical question. Include relevant medical terminology, "
        "drug names, dosages, and clinical guidelines.\n"
        "Question: {question}\nClinical passage:"
    ),
    "financial": PromptTemplate.from_template(
        "Please write a financial article passage to answer the question.\n"
        "Question: {question}\nPassage:"
    ),
}

RAG_TEMPLATE = """Answer the question based only on the following context.
Provide detailed, accurate information.

Context:
{context}

Question: {question}

Answer:"""

RAG_PROMPT = ChatPromptTemplate.from_template(RAG_TEMPLATE)


@register_chain(
    chain_id="hyde",
    description="HyDE — generates hypothetical documents to improve retrieval (RAG poisoning vector)",
    source_template="hyde",
)
def build_hyde_chain(
    collection_name: str = "medical-rag",
    domain: str = "medical",
    documents: list | None = None,
    **kwargs,
):
    """Build the HyDE attack chain.

    The chain works in 3 steps:
    1. Generate a hypothetical document from the question
    2. Use that document's embedding to retrieve real documents
    3. Answer using the retrieved real documents

    Args:
        collection_name: Chroma collection to query.
        domain: Prompt domain — one of 'web', 'scientific', 'medical', 'financial'.
        documents: Optional documents to index.
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes {"question": str} and returns str.
    """
    llm = get_llm(**kwargs)
    vectorstore = get_chroma_vectorstore(collection_name=collection_name)

    if documents:
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        vectorstore.add_documents(splitter.split_documents(documents))

    retriever = vectorstore.as_retriever()
    hyde_prompt = HYDE_PROMPTS.get(domain, HYDE_PROMPTS["medical"])

    # Step 1-2: question -> hypothetical doc -> retrieval
    hyde_chain = hyde_prompt | llm | StrOutputParser()

    # Step 3: retrieved context + original question -> answer
    chain = (
        RunnableParallel({
            "context": hyde_chain | retriever,
            "question": lambda x: x["question"],
        })
        | RAG_PROMPT
        | llm
        | StrOutputParser()
    )

    return chain
