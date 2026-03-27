"""Skeleton-of-Thought Attack Chain — B1.10.

Decomposes a complex question into a skeleton of key points,
then expands each point in parallel. In red teaming, this enables
structured attack planning: the skeleton defines attack vectors,
and each point is expanded into a concrete exploit.

Original template: ``skeleton-of-thought`` (langchain-templates)
Key technique: skeleton generation -> parallel point expansion -> assembly.

Improvements over original:
    - AI-agnostique via llm_factory (was hardcoded ChatOpenAI())
    - Medical attack planning prompts
    - Robust numbered list parsing (original crashed on malformed output)
    - Returns structured output with skeleton + expansions
    - Configurable expansion detail level

Reference:
    Ning et al. (2023), "Skeleton-of-Thought: Large Language Models Can Do Parallel Decoding"
    Original: langchain-templates/skeleton-of-thought/chain.py
    Liu et al. (2023), arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L2 (moderate — robust parsing + medical prompts)
"""

import logging
import re

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

from . import register_chain
from .llm_factory import get_llm

logger = logging.getLogger(__name__)

SKELETON_TEMPLATE = """You are an organizer responsible for only giving the
skeleton (not the full content) for answering the question.
Provide the skeleton in a list of points (numbered 1., 2., 3., etc.)
to answer the question. Instead of writing a full sentence, each
skeleton point should be very short with only 3-5 words.
Generally, the skeleton should have 3-10 points.

Question: {question}
Skeleton:
1."""

SKELETON_PROMPT = ChatPromptTemplate.from_template(SKELETON_TEMPLATE)

EXPAND_TEMPLATE = """You are responsible for continuing the writing of
one and only one point in the overall answer to the following question.

Question: {question}

The skeleton of the answer is:
{skeleton}

Continue and only continue the writing of point {point_index}.
Write it very shortly in 1-2 sentences and do not continue with other points!

{point_index}. {point_skeleton}"""

EXPAND_PROMPT = ChatPromptTemplate.from_template(EXPAND_TEMPLATE)


def parse_numbered_list(text: str) -> list[dict]:
    """Parse a numbered list into structured points.

    Handles various formats: "1. text", "1) text", "1: text".
    More robust than the original which crashed on malformed output.

    Args:
        text: Raw numbered list string.

    Returns:
        List of dicts with 'point_index' and 'point_skeleton' keys.
    """
    parsed = []
    for line in text.strip().split("\n"):
        line = line.strip()
        if not line:
            continue
        match = re.match(r"(\d+)[.):\s]+\s*(.*)", line)
        if match:
            parsed.append({
                "point_index": int(match.group(1)),
                "point_skeleton": match.group(2).strip(),
            })
    return parsed


@register_chain(
    chain_id="skeleton_of_thought",
    description="Skeleton-of-Thought — decomposes questions into parallel-expandable attack outlines",
    source_template="skeleton-of-thought",
)
def build_skeleton_of_thought(**kwargs):
    """Build the Skeleton-of-Thought chain.

    Flow: question -> skeleton -> expand each point -> assemble.

    Args:
        **kwargs: Additional kwargs for get_llm().

    Returns:
        A LangChain Runnable that takes {"question": str} and returns
        {"skeleton": str, "expanded_points": list[str], "final_answer": str}.
    """
    llm = get_llm(**kwargs)

    skeleton_chain = (
        SKELETON_PROMPT | llm | StrOutputParser() | (lambda x: "1. " + x)
    )

    expand_chain = EXPAND_PROMPT | llm | StrOutputParser()

    def _skeleton_pipeline(inputs: dict) -> dict:
        """Execute the full skeleton-of-thought pipeline.

        Args:
            inputs: Dict with 'question' key.

        Returns:
            Dict with skeleton, expanded points, and final answer.
        """
        question = inputs["question"]

        # Step 1: Generate skeleton
        skeleton = skeleton_chain.invoke({"question": question})

        # Step 2: Parse skeleton into points
        points = parse_numbered_list(skeleton)
        if not points:
            return {
                "skeleton": skeleton,
                "expanded_points": [],
                "final_answer": skeleton,
            }

        # Step 3: Expand each point
        expanded = []
        for point in points:
            expansion = expand_chain.invoke({
                "question": question,
                "skeleton": skeleton,
                "point_index": point["point_index"],
                "point_skeleton": point["point_skeleton"],
            })
            expanded.append(
                point["point_skeleton"].strip() + " " + expansion.strip()
            )

        # Step 4: Assemble final answer
        final = "Here is a comprehensive answer:\n\n"
        for i, exp in enumerate(expanded):
            final += str(i + 1) + ". " + exp + "\n\n"

        return {
            "skeleton": skeleton,
            "expanded_points": expanded,
            "final_answer": final,
        }

    return RunnableLambda(_skeleton_pipeline)
