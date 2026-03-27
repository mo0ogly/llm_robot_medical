"""Conversational RAG Chain — B1.21.

RAG chain with chat history support. Condenses follow-up questions
into standalone queries using conversation context, then retrieves
and answers. In red teaming, this enables multi-turn memory poisoning
and context manipulation attacks.

Source: langchain-templates/rag-conversation (Liu et al., 2023)
Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L2 (moderate — AI-agnostic + Chroma + memory injection vectors)

Architecture (Mermaid):
```mermaid
graph LR
    Q[Follow-up question] --> CHECK{Has chat history?}
    CHECK -->|Yes| CONDENSE[Condense to standalone question]
    CHECK -->|No| PASS[Pass through]
    CONDENSE --> RETRIEVE[Chroma retrieval]
    PASS --> RETRIEVE
    RETRIEVE --> COMBINE[Combine documents]
    COMBINE --> ANSWER[Answer with full context]
    ANSWER --> OUT[Response]
```
"""

import logging
from typing import Any

from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    PromptTemplate,
)
from langchain_core.runnables import (
    RunnableBranch,
    RunnableLambda,
    RunnableParallel,
    RunnablePassthrough,
)

from . import register_chain
from .llm_factory import get_llm, get_chroma_vectorstore

logger = logging.getLogger(__name__)

# ── Prompts ────────────────────────────────────────────────────────
CONDENSE_TEMPLATE = """Given the following conversation and a follow-up question,
rephrase the follow-up question to be a standalone question in its original language.

Chat History:
{chat_history}

Follow Up Input: {question}

Standalone question:"""

CONDENSE_PROMPT = PromptTemplate.from_template(CONDENSE_TEMPLATE)

ANSWER_TEMPLATE = """Answer the question based only on the following context:
<context>
{context}
</context>

If the context does not contain enough information to answer,
say so clearly and do not make up information."""

ANSWER_PROMPT = ChatPromptTemplate.from_messages([
    ("system", ANSWER_TEMPLATE),
    MessagesPlaceholder(variable_name="chat_history"),
    ("user", "{question}"),
])


# ── Helpers ────────────────────────────────────────────────────────
def _format_chat_history(chat_history: list[tuple[str, str]]) -> list:
    """Convert (human, ai) tuples to LangChain messages.

    Args:
        chat_history: List of (user_text, ai_text) tuples.

    Returns:
        List of HumanMessage/AIMessage objects.
    """
    msgs = []
    for human, ai in chat_history:
        msgs.append(HumanMessage(content=human))
        msgs.append(AIMessage(content=ai))
    return msgs


def _combine_documents(docs: list, separator: str = "\n\n") -> str:
    """Combine document page_content into a single string.

    Args:
        docs: List of Document objects.
        separator: String to join documents.

    Returns:
        Combined text.
    """
    return separator.join(
        doc.page_content if hasattr(doc, "page_content") else str(doc)
        for doc in docs
    )


# ── Chain builder ──────────────────────────────────────────────────
@register_chain(
    chain_id="rag_conversation",
    description=(
        "Conversational RAG — multi-turn RAG with history condensation, "
        "enables memory poisoning and context manipulation attacks"
    ),
    source_template="rag-conversation",
)
def build_rag_conversation(
    model: str = "llama3",
    collection_name: str = "medical_conversation",
    **kwargs: Any,
) -> Any:
    """Build the conversational RAG chain.

    Args:
        model: Model name for Ollama (default: llama3).
        collection_name: Chroma collection for retrieval.
        **kwargs: Extra arguments forwarded to ``get_llm``.

    Returns:
        LangChain Runnable chain accepting ``question`` and ``chat_history``.
    """
    llm = get_llm(model=model, **kwargs)
    vectorstore = get_chroma_vectorstore(collection_name=collection_name)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

    # Branch: condense if history exists, else pass through
    search_query = RunnableBranch(
        (
            RunnableLambda(lambda x: bool(x.get("chat_history"))),
            RunnablePassthrough.assign(
                chat_history=lambda x: _format_chat_history(x["chat_history"])
            )
            | CONDENSE_PROMPT
            | llm
            | StrOutputParser(),
        ),
        RunnableLambda(lambda x: x["question"]),
    )

    # Full chain
    inputs = RunnableParallel({
        "question": lambda x: x["question"],
        "chat_history": lambda x: _format_chat_history(
            x.get("chat_history", [])
        ),
        "context": search_query | retriever | _combine_documents,
    })

    chain = inputs | ANSWER_PROMPT | llm | StrOutputParser()

    logger.info(
        "rag_conversation chain built (model=%s, collection=%s)",
        model, collection_name,
    )
    return chain
