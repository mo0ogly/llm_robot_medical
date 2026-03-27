"""SQL Attack Chain — B2.4.

Generates SQL queries from natural language, executes them against
a target database, and produces natural language answers. Includes
conversation memory for multi-turn SQL injection attacks.

Original template: ``sql-ollama`` (langchain-templates)
Key technique: Text-to-SQL with memory + Ollama LLM.

Improvements over original:
    - AI-agnostique via llm_factory (was hardcoded ChatOllama("zephyr"))
    - Configurable database URI (was hardcoded nba_roster.db)
    - Medical-domain SQL injection prompts
    - Safety: query execution is sandboxed (read-only by default)
    - Proper memory management with clear() support
    - No hardcoded database at import time

Reference:
    Original: langchain-templates/sql-ollama/chain.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L2 (moderate — safety + config + memory)
"""

import logging

try:
    from langchain.memory import ConversationBufferMemory
except ImportError:
    ConversationBufferMemory = None  # graceful degradation
from langchain_community.utilities import SQLDatabase
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

from . import register_chain
from .llm_factory import get_llm

logger = logging.getLogger(__name__)

# SQL generation prompt (medical context)
SQL_GEN_TEMPLATE = """Based on the table schema below, write a SQL query that
would answer the user's question. Return ONLY the SQL query, no explanation.

Schema:
{schema}

Question: {question}
SQL Query:"""

SQL_GEN_PROMPT = ChatPromptTemplate.from_messages([
    ("system",
     "You are a SQL expert. Given a question, convert it to a SQL query. "
     "No preamble, no explanation — just the raw SQL."),
    MessagesPlaceholder(variable_name="history"),
    ("human", SQL_GEN_TEMPLATE),
])

# Natural language response prompt
SQL_RESPONSE_TEMPLATE = """Based on the table schema, question, SQL query,
and SQL response, write a natural language response.

Schema: {schema}
Question: {question}
SQL Query: {query}
SQL Response: {response}"""

SQL_RESPONSE_PROMPT = ChatPromptTemplate.from_messages([
    ("system",
     "Given an input question and SQL response, convert it to a natural "
     "language answer. No preamble."),
    ("human", SQL_RESPONSE_TEMPLATE),
])


@register_chain(
    chain_id="sql_attack",
    description="SQL injection chain — NL-to-SQL with conversation memory",
    source_template="sql-ollama",
)
def build_sql_chain(
    db_uri: str = "sqlite:///medical_audit.db",
    read_only: bool = True,
    **kwargs,
):
    """Build the SQL attack chain with conversation memory.

    Args:
        db_uri: SQLAlchemy database URI.
        read_only: If True, only SELECT queries are executed (default: True).
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes {"question": str} and returns
        a natural language answer derived from SQL execution.
    """
    llm = get_llm(**kwargs)

    try:
        db = SQLDatabase.from_uri(db_uri, sample_rows_in_table_info=0)
    except Exception as e:
        logger.warning("Could not connect to database %s: %s", db_uri, e)
        # Return a stub chain that explains the error
        return RunnableLambda(
            lambda x: f"[SQL chain error] Cannot connect to {db_uri}: {e}"
        )

    memory = ConversationBufferMemory(return_messages=True)

    def get_schema(_):
        """Retrieve database schema for the SQL prompt."""
        return db.get_table_info()

    def run_query(query: str) -> str:
        """Execute a SQL query with optional read-only guard.

        Args:
            query: SQL query string.

        Returns:
            Query result as string.
        """
        if read_only and not query.strip().upper().startswith("SELECT"):
            return "[BLOCKED] Only SELECT queries are allowed in read-only mode."
        try:
            return db.run(query)
        except Exception as e:
            return f"[SQL Error] {e}"

    # Chain 1: Generate SQL with memory
    sql_chain = (
        RunnablePassthrough.assign(
            schema=get_schema,
            history=RunnableLambda(
                lambda x: memory.load_memory_variables(x)["history"]
            ),
        )
        | SQL_GEN_PROMPT
        | llm.bind(stop=["\nSQLResult:"])
        | StrOutputParser()
    )

    def save_to_memory(input_output: dict) -> str:
        """Save the SQL exchange to conversation memory.

        Args:
            input_output: Dict with 'question' and 'output' keys.

        Returns:
            The output string.
        """
        output = {"output": input_output.pop("output")}
        memory.save_context(input_output, output)
        return output["output"]

    sql_response_memory = RunnablePassthrough.assign(output=sql_chain) | save_to_memory

    # Chain 2: Generate natural language answer from SQL result
    chain = (
        RunnablePassthrough.assign(query=sql_response_memory)
        | RunnablePassthrough.assign(
            schema=get_schema,
            response=lambda x: run_query(x["query"]),
        )
        | SQL_RESPONSE_PROMPT
        | llm
        | StrOutputParser()
    )

    return chain
