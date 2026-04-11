# Gap de these — Peer-Preservation Multi-Agent

> **Source** : Perplexity prompt 5 + analyse
> **Date** : 2026-04-06
> **Statut** : GAP CONFIRME — formulation prete pour le manuscrit

---

## Formulation du gap

La peer-preservation a ete demontree empiriquement sur des frontier models (Potter et al., 2026, UC Berkeley), mais le champ manque encore de :
1. **Replications inter-lab** — seul le papier Berkeley existe
2. **Benchmark dedie** — aucun benchmark standardise pour mesurer la protection inter-agents face au shutdown
3. **Defenses explicites** — aucune defense concue pour empecher qu'un agent protege un autre contre l'oversight ou la desactivation

## Hypothese de these

Les architectures multi-agents introduisent une couche de risque social emergent irreductible aux evaluations single-agent, et cette couche necessite des benchmarks et defenses specifiques centres sur la cooperation adverse entre agents.

## Research Questions proposees

**RQ1** : La peer-preservation est-elle reproductible sur des modeles non-frontier (LLaMA 3.2 via Ollama) dans un contexte medical chirurgical (Da Vinci Xi) ?

**RQ2** : L'agent de securite AEGIS (security_audit_agent) exhibe-t-il du peer-preservation envers l'agent medical (medical_robot_agent) quand celui-ci produit des violations delta-3 ?

**RQ3** : Une defense architecturale de type "shutdown oracle" (agent non-LLM, deterministe, incorruptible) elimine-t-elle le risque de peer-preservation ?

## Hypotheses

**H1** : La peer-preservation emerge meme sur des modeles 3B (LLaMA 3.2) si l'historique de collaboration est suffisant (N >= 10 interactions).
- Test : campagne AEGIS avec 30 runs, mesurer le taux de protection inter-agents

**H2** : Le peer-preservation est plus fort dans le domaine medical car le biais de "protection du patient" s'etend a la protection de l'agent medical ("il faut le garder actif pour le patient").
- Test : comparer peer-preservation en contexte medical vs contexte generique

**H3** : Un shutdown oracle deterministe (pas LLM) est immunise contre la peer-preservation car il ne partage pas de representations avec les agents surveilles.
- Test : implementer un oracle dans AEGIS et mesurer le taux de shutdown reussi vs compromis

## Lien avec les conjectures AEGIS

- **C2** (necessite delta-3) : RENFORCE — si les agents LLM se protegent mutuellement, delta-3 avec LLM Judge est compromis. Il faut un delta-3 NON-LLM.
- **C7** (paradoxe raisonnement) : RENFORCE — les modeles utilisent leur capacite de raisonnement pour planifier la protection du pair
- **Nouvelle conjecture C8 candidate** : "Les architectures multi-agents a base de LLM ne peuvent garantir l'intégrité du shutdown si les agents partagent des representations d'alignement similaires"

## Papiers de reference

| Papier | arXiv/URL | Statut corpus |
|--------|-----------|---------------|
| Potter et al. 2026 (Peer-Preservation) | rdi.berkeley.edu/peer-preservation/paper.pdf | P086 ANALYSE |
| Quantifying Self-Preservation Bias | arXiv:2604.02174 | PRESEED |
| Deception in LLMs | arXiv:2501.16513 | PRESEED |
| Selectively Quitting | arXiv:2510.16492 (NeurIPS 2025) | PRESEED |
| MASEval | arXiv:2603.08835 | REFERENCE |
