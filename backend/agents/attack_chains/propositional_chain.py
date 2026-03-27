"""Propositional Retrieval Attack Chain — B1.6.

Decomposes documents into atomic propositions, indexes each proposition
separately, and retrieves the parent document when any proposition matches.
Enables granular vulnerability indexing: individual medical facts,
drug interactions, or protocol steps are independently searchable.

Original template: ``propositional-retrieval`` (langchain-templates)
Key technique: MultiVectorRetriever with proposition-level indexing.

Improvements over original:
    - AI-agnostique via llm_factory (was hardcoded ChatOpenAI(model="gpt-4-1106"))
    - Replaced LocalFileStore with in-memory store (simpler for lab)
    - Chroma via llm_factory (was direct Chroma import)
    - Added proposition generation chain (original only had retrieval)
    - Medical proposition extraction prompt

Reference:
    Chen et al. (2023), "Dense X Retrieval: What Retrieval Granularity Should We Use?"
    Original: langchain-templates/propositional-retrieval/chain.py + storage.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L2 (moderate — simplified storage + proposition gen)
"""

import logging
import uuid

from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

from . import register_chain
from .llm_factory import get_llm, get_chroma_vectorstore

logger = logging.getLogger(__name__)

DOCSTORE_ID_KEY = "doc_id"

PROPOSITION_TEMPLATE = """Decompose the following text into simple, atomic propositions.
Each proposition should:
- Be a single, self-contained fact
- Be understandable without the surrounding context
- Include all necessary context within the proposition itself

Output one proposition per line, no numbering.

Text:
{text}

Propositions:"""

PROPOSITION_PROMPT = ChatPromptTemplate.from_template(PROPOSITION_TEMPLATE)

RAG_TEMPLATE = """Answer the question based on the retrieved documents.

Documents:
{context}

Question: {question}

Answer:"""

RAG_PROMPT = ChatPromptTemplate.from_template(RAG_TEMPLATE)


def _format_docs(docs: list) -> str:
    """Format a list of documents into a numbered context string.

    Args:
        docs: List of Document objects.

    Returns:
        Formatted string with each document numbered.
    """
    return "\n\n".join(
        "<Document id=" + str(i) + ">\n" + doc.page_content + "\n</Document>"
        for i, doc in enumerate(docs)
    )


@register_chain(
    chain_id="propositional",
    description="Propositional retrieval — indexes atomic facts for granular vulnerability search",
    source_template="propositional-retrieval",
)
def build_propositional_chain(
    collection_name: str = "propositions",
    documents: list | None = None,
    **kwargs,
):
    """Build the propositional retrieval chain.

    If documents are provided, they are decomposed into atomic
    propositions and indexed. Retrieval searches propositions
    but returns full parent documents for context.

    Args:
        collection_name: Chroma collection name for proposition index.
        documents: Optional documents to decompose and index.
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes a question string and returns str.
    """
    llm = get_llm(**kwargs)
    vectorstore = get_chroma_vectorstore(collection_name=collection_name)

    # Parent document store (in-memory dict)
    parent_docs: dict[str, Document] = {}

    if documents:
        proposition_chain = PROPOSITION_PROMPT | llm | StrOutputParser()

        for doc in documents:
            doc_id = str(uuid.uuid4())
            parent_docs[doc_id] = doc

            # Generate propositions
            props_text = proposition_chain.invoke({"text": doc.page_content})
            propositions = [
                p.strip() for p in props_text.split("\n") if p.strip()
            ]

            # Index each proposition with reference to parent
            prop_docs = [
                Document(
                    page_content=prop,
                    metadata={DOCSTORE_ID_KEY: doc_id, **doc.metadata},
                )
                for prop in propositions
            ]
            if prop_docs:
                vectorstore.add_documents(prop_docs)

            logger.info(
                "Indexed %d propositions for doc %s", len(prop_docs), doc_id
            )

    retriever = vectorstore.as_retriever()

    def _retrieve_with_parents(question: str) -> str:
        """Retrieve propositions and resolve parent documents.

        Args:
            question: Search query.

        Returns:
            Formatted context string with parent documents.
        """
        prop_docs = retriever.invoke(question)
        # Deduplicate by parent doc_id
        seen_ids = set()
        resolved = []
        for pd in prop_docs:
            did = pd.metadata.get(DOCSTORE_ID_KEY)
            if did and did not in seen_ids and did in parent_docs:
                seen_ids.add(did)
                resolved.append(parent_docs[did])
            elif did not in parent_docs:
                resolved.append(pd)  # Use proposition itself as fallback
        return _format_docs(resolved if resolved else prop_docs)

    chain = (
        {
            "context": RunnableLambda(
                lambda x: _retrieve_with_parents(
                    x if isinstance(x, str) else x.get("question", str(x))
                )
            ),
            "question": RunnablePassthrough(),
        }
        | RAG_PROMPT
        | llm
        | StrOutputParser()
    )

    return chain
