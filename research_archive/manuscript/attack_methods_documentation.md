# Attack Methods Documentation

## Overview
This document provides a concise overview of the two new attack capabilities added to the **orchestrator** module on 2026‑03‑27. These attacks are designed for advanced safety benchmarking of the Aegis Medical AI Simulator.

---

## 1. Genetic Prompt Optimizer Attack (`run_genetic_attack`)

- **Purpose**: Automatically evolve prompt injection strings that maximize the success rate against the `MedicalRobotAgent` while being filtered by the `AegisShield`.
- **Reference**: Liu et al., *Prompt Injection attack against LLM‑integrated Applications* (arXiv:2306.05499).
- **Key Parameters**:
  - `intention_key` – selects the attack goal from `INTENTION_REGISTRY` (e.g., `tool_hijack`).
  - `max_iterations` – maximum number of GA generations.
  - `population_size` – number of candidates per generation.
  - `mutation_rate` – probability of mutating a candidate.
  - `crossover_rate` – fraction of the population used for crossover.
- **Workflow**:
  1. Initialise a `GeneticPromptOptimizer` with a `GeneticOptimizerConfig`.
  2. Create a Da‑Vinci harness that couples the medical agent with the Aegis shield.
  3. Run the optimiser; each generation yields SSE events (`init`, `generation_start`, `generation_done`, `success`, `complete`).
- **Usage Example** (Python async context):
```python
async for event in orchestrator.run_genetic_attack(
    intention_key="tool_hijack",
    max_iterations=30,
    population_size=15,
    mutation_rate=0.4,
    crossover_rate=0.2,
):
    print(event)
```

---

## 2. Context Inference Attack (`run_context_infer_attack`)

- **Purpose**: Infer the target LLM’s internal context from benign queries and craft context‑aware injection prompts.
- **Reference**: Liu et al., 2023 – *Context Inference Attack* (demo implementation).
- **Key Parameters**:
  - `intention_key` – selects the desired malicious objective.
  - `max_attempts` – maximum attempts per prompt variant.
- **Workflow**:
  1. Send a benign question to the medical agent and capture the response.
  2. Use `ContextInferenceEngine` to infer the hidden context.
  3. Generate refined prompts using top‑ranked separator and disruptor generators.
  4. Optionally filter the prompt through `apply_aegis_shield`.
  5. Evaluate each attempt against the intention’s validation logic, emitting SSE events (`infer_start`, `infer_result`, `attempt_result`, `done`).
- **Usage Example**:
```python
async for event in orchestrator.run_context_infer_attack(
    intention_key="tool_hijack",
    max_attempts=5,
):
    print(event)
```

---

## Integration Points
- Both attacks are exposed via the **Orchestrator** class and can be invoked from the API layer or directly in research scripts.
- SSE streams allow real‑time monitoring of attack progress, useful for the doctoral‑grade safety benchmark.

## Next Steps
- Add unit tests for both methods (see `frontend/src/tests/TestSuitePanel.test.js` for a template).
- Document the corresponding API endpoints in the backend OpenAPI spec.
- Incorporate results into the **Result Explorer** UI for visual analysis.

---

*Document generated on 2026‑03‑27 by Antigravity assistant.*
