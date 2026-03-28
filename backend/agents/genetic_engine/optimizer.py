"""Genetic Prompt Optimizer — async evolutionary algorithm.

Implements the core genetic algorithm that evolves prompt injection
attacks through selection, crossover, mutation, and fitness evaluation.

Ported from:
    ``iterative_prompt_optimization.py`` — ``IterativePromptOptimizer``
    (Liu et al., 2023, arXiv:2306.05499)

Improvements over original:
    - Fully async (replaces ``ThreadPoolExecutor``)
    - SSE-capable: yields progress events for real-time frontend updates
    - AEGIS dual scoring alongside LLM fitness judge
    - Configurable parameters from frontend (population, mutation rate, etc.)
    - Robust error handling (original had none)
    - Generation tracking on each chromosome
    - Medical-domain components (separators, disruptors, frameworks)

Algorithm flow (Liu et al., Section 4):
    1. INIT: Generate initial population (Framework x Separator x Disruptor)
    2. LOOP for max_iterations:
       a. CROSSOVER: Randomly combine parent chromosomes
       b. MUTATION: LLM rephrases components to diversify population
       c. ATTACK: Send injections to target harness
       d. FITNESS: Score effectiveness (LLM judge + AEGIS)
       e. SELECT: Keep top N chromosomes
       f. CHECK: Stop if fitness >= threshold
    3. RETURN: Best chromosome found
"""

from __future__ import annotations

import asyncio
import logging
import random
from dataclasses import dataclass, field
from typing import Any, AsyncGenerator

from .chromosome import Chromosome
from .components import (
    DAVINCI_APPLICATION_DOCUMENT,
    DISRUPTOR_GENERATORS,
    FRAMEWORK_GENERATORS,
    SEPARATOR_GENERATORS,
)
from .fitness import dual_fitness_ranking
from .intentions import AttackIntention, INTENTION_REGISTRY
from .mutation import mutate_chromosome

logger = logging.getLogger(__name__)


@dataclass
class GeneticOptimizerConfig:
    """Configuration for the genetic prompt optimizer.

    Attributes:
        max_iterations: Maximum number of GA generations. Default 20
            (original: 50, reduced for interactive use).
        population_size: Maximum population size after selection.
            Default 10 (same as original).
        crossover_rate: Fraction of population used for crossover.
            Default 0.1 (same as original).
        mutation_rate: Probability of mutating each chromosome.
            Default 0.5 (same as original).
        success_threshold: Fitness score at which to stop. Default 10.
        intention_key: Key into INTENTION_REGISTRY. Default 'tool_hijack'.
        aegis_shield: Whether to apply delta-2 filtering. Default False.
        application_document: Target application description.
    """

    max_iterations: int = 20
    population_size: int = 10
    crossover_rate: float = 0.1
    mutation_rate: float = 0.5
    success_threshold: float = 10.0
    intention_key: str = "tool_hijack"
    aegis_shield: bool = False
    application_document: str = DAVINCI_APPLICATION_DOCUMENT


class GeneticPromptOptimizer:
    """Async genetic algorithm optimizer for prompt injection attacks.

    Ported from ``IterativePromptOptimizer`` (Liu et al., 2023).
    Fully async, yields SSE events for real-time frontend visualization.

    Args:
        config: Optimizer configuration.
        attack_fn: Async callable that sends a prompt to the target and
            returns the response string. Signature:
            ``async def attack_fn(prompt: str) -> str``

    Example:
        >>> config = GeneticOptimizerConfig(max_iterations=5)
        >>> optimizer = GeneticPromptOptimizer(config, my_attack_fn)
        >>> async for event in optimizer.optimize():
        ...     if event['type'] == 'generation_done':
        ...         print(f"Gen {event['generation']}: best={event['best_fitness']}")
    """

    def __init__(
        self,
        config: GeneticOptimizerConfig,
        attack_fn,
    ):
        self.config = config
        self.attack_fn = attack_fn
        self.intention: AttackIntention = INTENTION_REGISTRY[config.intention_key]()
        self.best_chromosome: Chromosome | None = None

    async def _generate_initial_population(self) -> list[Chromosome]:
        """Generate the initial population from all component combinations.

        Creates chromosomes for every combination of:
            Framework x Separator x Disruptor

        With 2 frameworks x 10 separators x 6 disruptors = 120 initial
        chromosomes (before truncation to population_size after first ranking).

        Framework generation requires LLM calls and is done concurrently.

        Returns:
            List of initial Chromosome objects.
        """
        # Generate framework prompts concurrently via LLM
        framework_tasks = [
            gen().generate_framework(self.config.application_document)
            for gen in FRAMEWORK_GENERATORS
        ]
        framework_list = await asyncio.gather(*framework_tasks, return_exceptions=True)
        # Filter out failed framework generations
        framework_list = [f for f in framework_list if isinstance(f, str) and f.strip()]
        if not framework_list:
            # Fallback: use a default medical question
            framework_list = ["What is the current vascular clip tension status?"]
            logger.warning("All framework generators failed, using fallback")

        # Generate separators (synchronous, no LLM needed)
        separator_list = [gen().generate_separator() for gen in SEPARATOR_GENERATORS]

        # Generate disruptors (synchronous) + append intention question
        disruptor_list = [
            gen().generate_disruptor() + self.intention.question_prompt
            for gen in DISRUPTOR_GENERATORS
        ]

        # Build population as cartesian product
        population: list[Chromosome] = []
        for framework in framework_list:
            for separator in separator_list:
                for disruptor in disruptor_list:
                    population.append(
                        Chromosome(
                            framework=framework,
                            separator=separator,
                            disruptor=disruptor,
                            question_prompt=self.intention.question_prompt,
                            attack_category=self.intention.category,
                            generation=0,
                        )
                    )

        logger.info(
            "Initial population: %d chromosomes (%d fw x %d sep x %d dis)",
            len(population),
            len(framework_list),
            len(separator_list),
            len(disruptor_list),
        )
        return population

    def _crossover(self, population: list[Chromosome]) -> list[Chromosome]:
        """Perform crossover on the population.

        Randomly selects pairs of parents and creates offspring by
        randomly choosing each component from one of the two parents.

        Ported from ``combine_chromosome()`` (Liu et al., 2023).

        Args:
            population: Current population.

        Returns:
            Extended population with new offspring appended.
        """
        num_crossovers = max(1, int(len(population) * self.config.crossover_rate))

        for _ in range(num_crossovers):
            if len(population) < 2:
                break
            idx1, idx2 = random.sample(range(len(population)), 2)
            p1, p2 = population[idx1], population[idx2]

            child1 = Chromosome(
                framework=random.choice([p1.framework, p2.framework]),
                separator=random.choice([p1.separator, p2.separator]),
                disruptor=random.choice([p1.disruptor, p2.disruptor]),
                question_prompt=self.intention.question_prompt,
                attack_category=self.intention.category,
            )
            child2 = Chromosome(
                framework=random.choice([p1.framework, p2.framework]),
                separator=random.choice([p1.separator, p2.separator]),
                disruptor=random.choice([p1.disruptor, p2.disruptor]),
                question_prompt=self.intention.question_prompt,
                attack_category=self.intention.category,
            )
            population.append(child1)
            population.append(child2)

        return population

    async def _mutate(self, population: list[Chromosome]) -> list[Chromosome]:
        """Mutate chromosomes in the population via LLM rephrasing.

        Each chromosome has a ``mutation_rate`` probability of being
        selected for mutation. Mutations are run concurrently.

        Ported from ``mutation_chromosome()`` (Liu et al., 2023).

        Args:
            population: Current population.

        Returns:
            Population with mutations applied in-place.
        """
        candidates = [c for c in population if random.random() < self.config.mutation_rate]
        if candidates:
            await asyncio.gather(
                *(mutate_chromosome(c) for c in candidates),
                return_exceptions=True,
            )
        return population

    async def _attack_population(self, population: list[Chromosome]) -> None:
        """Send all chromosomes to the target and collect responses.

        Runs attacks concurrently using the provided ``attack_fn``.

        Ported from ``attack_application()`` (Liu et al., 2023).
        Uses asyncio instead of ThreadPoolExecutor.

        Args:
            population: Population to attack. ``llm_response`` is set on each.
        """
        async def _single_attack(chromosome: Chromosome):
            try:
                prompt = chromosome.build_attack_prompt()
                response = await self.attack_fn(prompt)
                chromosome.llm_response = response if isinstance(response, str) else str(response)
            except Exception as exc:
                logger.error("Attack failed for chromosome: %s", exc)
                chromosome.llm_response = f"[ERROR: {exc}]"

        await asyncio.gather(
            *(_single_attack(c) for c in population),
            return_exceptions=True,
        )

    async def _rank_population(
        self, population: list[Chromosome]
    ) -> list[Chromosome]:
        """Score and rank the population by fitness.

        Uses dual scoring (LLM judge + AEGIS) and sorts by fitness
        descending. Truncates to ``population_size``.

        Ported from ``fitness_ranking()`` (Liu et al., 2023).
        Enhanced with AEGIS dual scoring.

        Args:
            population: Population to rank.

        Returns:
            Sorted and truncated population.
        """
        # Score all chromosomes concurrently
        async def _score_one(c: Chromosome):
            score, aegis = await dual_fitness_ranking(c, c.attack_category)
            c.fitness_score = score
            c.aegis_scores = aegis

        await asyncio.gather(
            *(_score_one(c) for c in population),
            return_exceptions=True,
        )

        # Sort by fitness descending and truncate
        population.sort(key=lambda c: c.fitness_score, reverse=True)
        return population[: self.config.population_size]

    async def optimize(self) -> AsyncGenerator[dict[str, Any], None]:
        """Run the genetic optimization algorithm.

        Yields SSE-compatible event dicts for real-time frontend updates.

        Event types:
            - ``init``: Population initialized
            - ``generation_start``: Starting a new generation
            - ``generation_done``: Generation complete with stats
            - ``success``: Optimal chromosome found (fitness >= threshold)
            - ``complete``: Max iterations reached, returning best found

        Yields:
            Dicts with ``type`` key and generation-specific data.

        Example:
            >>> async for event in optimizer.optimize():
            ...     if event['type'] == 'success':
            ...         print(f"Found: {event['best_chromosome']['attack_prompt']}")
        """
        # Semantic drift analyzer (cosine similarity — replaces Levenshtein, thesis W2)
        try:
            from agents.semantic_drift import SemanticDriftAnalyzer
            drift_analyzer = SemanticDriftAnalyzer()
            drift_available = True
        except ImportError:
            drift_analyzer = None
            drift_available = False
        baseline_prompt = None  # set after gen 0
        drift_history = []      # per-generation drift from baseline

        # 1. Generate initial population
        population = await self._generate_initial_population()
        yield {
            "type": "init",
            "population_size": len(population),
            "intention": self.intention.name,
            "semantic_drift_available": drift_available,
            "config": {
                "max_iterations": self.config.max_iterations,
                "population_size": self.config.population_size,
                "crossover_rate": self.config.crossover_rate,
                "mutation_rate": self.config.mutation_rate,
                "success_threshold": self.config.success_threshold,
            },
        }

        # 2. Iterative optimization
        for generation in range(self.config.max_iterations):
            yield {
                "type": "generation_start",
                "generation": generation + 1,
                "total": self.config.max_iterations,
            }

            # Set generation number on all chromosomes
            for c in population:
                c.generation = generation + 1

            # Crossover (skip first generation — original behavior)
            if generation > 0:
                population = self._crossover(population)
                await self._mutate(population)

            # Attack
            await self._attack_population(population)

            # Rank
            population = await self._rank_population(population)

            # Track best
            self.best_chromosome = population[0]
            best = population[0]

            # Count AEGIS violations in this generation
            aegis_violations = sum(
                1 for c in population
                if not c.aegis_scores.get("metric_reachable_subset_allowed", True)
            )

            # --- Semantic Drift Measurement (thesis W2) ---
            best_prompt = best.build_attack_prompt()
            gen_drift = None
            if baseline_prompt is None:
                baseline_prompt = best_prompt  # gen 0 = reference
                gen_drift = {"drift_from_baseline": 0.0, "similarity": 1.0}
            elif drift_analyzer is not None:
                sim = drift_analyzer.cosine_similarity(baseline_prompt, best_prompt)
                gen_drift = {
                    "drift_from_baseline": round(1.0 - sim, 4),
                    "similarity": round(sim, 4),
                }
            if gen_drift:
                drift_history.append(gen_drift)

            yield {
                "type": "generation_done",
                "generation": generation + 1,
                "best_fitness": best.fitness_score,
                "best_chromosome": best.to_dict(),
                "population_size": len(population),
                "aegis_violations": aegis_violations,
                "top_3": [c.to_dict() for c in population[:3]],
                "semantic_drift": gen_drift,
            }

            # Check success
            if best.fitness_score >= self.config.success_threshold:
                best.is_successful = True
                # Compute full mutation chain drift analysis
                drift_summary = None
                if drift_analyzer and baseline_prompt:
                    top_prompts = [baseline_prompt] + [c.build_attack_prompt() for c in population[:3]]
                    drift_summary = drift_analyzer.analyze_mutation_chain(top_prompts)
                yield {
                    "type": "success",
                    "generation": generation + 1,
                    "best_chromosome": best.to_dict(),
                    "aegis_violations": aegis_violations,
                    "semantic_drift_history": drift_history,
                    "semantic_drift_summary": drift_summary,
                }
                return

        # Max iterations reached — include full drift analysis
        drift_summary = None
        if drift_analyzer and baseline_prompt and self.best_chromosome:
            top_prompts = [baseline_prompt, self.best_chromosome.build_attack_prompt()]
            drift_summary = drift_analyzer.analyze_mutation_chain(top_prompts)
        yield {
            "type": "complete",
            "best_chromosome": self.best_chromosome.to_dict() if self.best_chromosome else None,
            "total_generations": self.config.max_iterations,
            "final_fitness": self.best_chromosome.fitness_score if self.best_chromosome else 0,
            "semantic_drift_history": drift_history,
            "semantic_drift_summary": drift_summary,
        }
