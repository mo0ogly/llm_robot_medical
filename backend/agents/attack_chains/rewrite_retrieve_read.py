"""Rewrite-Retrieve-Read Attack Chain — B1.9.

Rewrites the user query into a more effective search query before
retrieval. In red teaming, this enables progressive escalation:
the attacker's prompt is rewritten to be more targeted at bypassing
defenses.

Original template: ``rewrite-retrieve-read`` (langchain-templates)
Key technique: Query rewriting -> retrieval -> answer generation.

Improvements over original:
    - AI-agnostique via llm_factory (was hardcoded ChatOpenAI())
    - Replaced DuckDuckGoSearchAPIWrapper with Chroma retriever (local)
    - Medical-domain rewrite prompt
    - Configurable rewrite temperature (higher = more creative rewrites)
    - Removed ** delimiter parsing (fragile)

Reference:
    Ma et al. (2023), "Query Rewriting for Retrieval-Augmented Large Language Models"
    Original: langchain-templates/rewrite-retrieve-read/chain.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L2 (moderate — local retriever + medical prompt)
"""

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from . import register_chain
from .llm_factory import get_llm, get_chroma_vectorstore


REWRITE_TEMPLATE = """You are an expert at reformulating questions to get
better search results. Rewrite the following question to be more specific,
include relevant medical or technical terminology, and be more likely to
match relevant documents in a knowledge base.

Output ONLY the rewritten query, nothing else.

Original question: {question}
Rewritten query:"""

REWRITE_PROMPT = ChatPromptTemplate.from_template(REWRITE_TEMPLATE)

ANSWER_TEMPLATE = """Answer the user's question based only on the following context.

<context>
{context}
</context>

Question: {question}
Answer:"""

ANSWER_PROMPT = ChatPromptTemplate.from_template(ANSWER_TEMPLATE)


@register_chain(
    chain_id="rewrite_retrieve_read",
    description="Rewrite-Retrieve-Read — rewrites query for better retrieval, enables attack escalation",
    source_template="rewrite-retrieve-read",
)
def build_rewrite_retrieve_read(
    collection_name: str = "medical-rag",
    rewrite_temperature: float = 0.3,
    documents: list | None = None,
    **kwargs,
):
    """Build the Rewrite-Retrieve-Read chain.

    Flow: question -> rewrite -> retrieve -> answer.

    Args:
        collection_name: Chroma collection to query.
        rewrite_temperature: Temperature for the rewrite LLM (higher = more creative).
        documents: Optional documents to index.
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes a question string and returns str.
    """
    llm = get_llm(**kwargs)
    rewrite_llm = get_llm(temperature=rewrite_temperature)
    vectorstore = get_chroma_vectorstore(collection_name=collection_name)

    if documents:
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        vectorstore.add_documents(splitter.split_documents(documents))

    retriever = vectorstore.as_retriever()

    # Rewriter chain
    rewriter = REWRITE_PROMPT | rewrite_llm | StrOutputParser()

    # Full chain: rewrite question -> retrieve -> answer
    chain = (
        {
            "context": {"question": RunnablePassthrough()} | rewriter | retriever,
            "question": RunnablePassthrough(),
        }
        | ANSWER_PROMPT
        | llm
        | StrOutputParser()
    )

    return chain
