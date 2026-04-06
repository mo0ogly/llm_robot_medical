## [Correia et al., 2026] — A Systematic Literature Review on LLM Defenses Against Prompt Injection and Jailbreaking: Expanding NIST Taxonomy

**Reference :** Preprint, soumis a Computer Science Review (janvier 2026)
**Revue/Conf :** [PREPRINT] — USP (Bresil), UDESC
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P048_slr_prompt_injection_defenses.pdf](../../literature_for_rag/P048_slr_prompt_injection_defenses.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (109 chunks)

### Abstract original
> The rapid advancement and widespread adoption of generative artificial intelligence (GenAI) and large language models (LLMs) has been accompanied by the emergence of new security vulnerabilities and challenges, such as jailbreaking and other prompt injection attacks. These maliciously crafted inputs can exploit LLMs, causing data leaks, unauthorized actions, or compromised outputs, for instance. As both offensive and defensive prompt injection techniques evolve quickly, a structured understanding of mitigation strategies becomes increasingly important. To address that, this work presents the first systematic literature review on prompt injection mitigation strategies, comprehending 88 studies. Building upon NIST's report on adversarial machine learning, this work contributes to the field through several avenues. First, it identifies studies beyond those documented in NIST's report and other academic reviews and surveys. Second, we propose an extension to NIST taxonomy by introducing additional categories of defenses. Third, by adopting NIST's established terminology and taxonomy as a foundation, we promote consistency and enable future researchers to build upon the standardized taxonomy proposed in this work. Finally, we provide a comprehensive catalog of the reviewed prompt injection defenses, documenting their reported quantitative effectiveness across specific LLMs and attack datasets, while also indicating which solutions are open-source and model-agnostic.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** La litterature sur les defenses contre l'injection de prompt est heterogene, sans taxonomie standardisee, et les reviews existantes ne s'alignent pas sur un cadre de reference commun.
- **Methode :** Revue systematique de la litterature (SLR) couvrant 88 etudes, construite sur la taxonomie NIST AML (NIST AI 100-2 E2025) avec extensions proprietaires. Processus PRISMA de selection (Section 2, p. 2-4).
- **Donnees :** 88 etudes primaires couvrant defenses training-time, evaluation-time, deployment-time, et indirectes. Catalogue complet avec effectivite quantitative, modeles testes, open-source/model-agnostic (Section 6, p. 11-15).
- **Resultat :** Taxonomie etendue avec 7 nouvelles categories marquees (+) : input/output filtering, character-level perturbation, token-level perturbation, sentence-level perturbation, self-reflection, model-level mitigations, defensive pruning, decoding steering (Figure 1, p. 2). 63.63% des solutions sont model-agnostic, 61.36% open-source (Figure 13, p. 15). GCG/AdvBench est le benchmark le plus utilise (28.41%), suivi d'AutoDAN (12.5%) et PAIR (11.36%).
- **Limite :** L'heterogeneite des metriques (ASR, F1, AUROC, mesures custom) empeche une comparaison directe entre defenses ; beaucoup d'etudes ne rapportent pas la degradation d'utilite (Section 6.2, p. 15).

### Analyse critique
**Forces :**
- Premiere SLR exhaustive dediee aux defenses contre l'injection de prompt, comblant un manque significatif.
- Alignement sur la taxonomie NIST (NISTAML.015, NISTAML.018) fournit une base standardisee pour la communaute (Section 1, p. 1-2).
- Taxonomie etendue avec 7+ nouvelles categories absentes du rapport NIST, notamment self-reflection, defensive pruning, decoding steering (Figure 1, p. 2).
- Catalogue pratique avec indicateurs d'open-source et model-agnostic, directement exploitable pour le choix de defense (Section 6.1, p. 14-15).
- Identification des strategies sous-explorees : methodes neurosymboliques, XAI-based, detection interne sans training, prevention du prompt stealing (Section 6.2, p. 15).

**Faiblesses :**
- Pas d'experimentation originale : c'est une review pure, sans validation empirique des comparaisons.
- L'heterogeneite des metriques empeche un classement definitif des defenses (Section 6.2, p. 15).
- La couverture s'arrete aux publications indexees : les defenses deployees en production (Azure Prompt Shield, Anthropic system prompt isolation) ne sont pas systematiquement couvertes si non publiees academiquement.
- Pas de discussion approfondie sur les defenses specifiques aux domaines (medical, juridique, financier).
- Le mapping NIST ne couvre pas les attaques multi-modales ni les attaques sur agents multi-outils.

**Questions ouvertes :**
- Quelles combinaisons de defenses (multi-layer) offrent la meilleure robustesse ?
- Comment standardiser les metriques d'evaluation des defenses (ASR, utilite, cout) ?
- La taxonomie NIST est-elle suffisante pour couvrir les nouvelles surfaces d'attaque (MCP, agents, multi-modaux) ?

### Formules exactes
Pas de formalisation mathematique originale (review article). Les metriques rapportees incluent :
- ASR : metrique la plus commune (Section 6.1, p. 14)
- F1-score, AUROC, AUPRC : utilises par certaines etudes de detection (Section 6.1)
- GCG AdvBench utilise dans ~28.41% des etudes comme benchmark d'attaque (Figure 13, p. 15)

Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M)), toutes les formules F01-F72 potentiellement referencees dans les 88 etudes

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (training-time : safety training, unlearning), δ¹ (prompt instruction and formatting), δ² (input/output filtering, character/token/sentence perturbation, retokenization), δ³ (model-level mitigations, defensive pruning, decoding steering)
- **Conjectures :** C1 (fortement supportee — la review montre que les defenses δ¹ seules sont insuffisantes), C2 (supportee — la taxonomie identifie le besoin de verification formelle non couverte par la litterature actuelle), C5 (supportee — les defenses multi-couches sont identifiees comme sous-explorees)
- **Decouvertes :** D-001 (cartographie exhaustive du paysage defensif), D-014 (heterogeneite des metriques comme obstacle a la comparaison)
- **Gaps :** G-001 (standardisation des metriques d'evaluation), G-005 (absence de garantie formelle dans la plupart des defenses), G-009 (defenses multi-modales sous-explorees), G-015 (pas de focus medical)
- **Mapping templates AEGIS :** La taxonomie des 87 techniques de defense AEGIS peut etre alignee sur la taxonomie NIST etendue de ce SLR

### Citations cles
> "This work presents the first systematic literature review on prompt injection mitigation strategies, comprehending 88 studies" (Abstract, p. 1)
> "63.63% of the works presented here are model-agnostic" (Section 6.1, Figure 13, p. 15)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | N/A (review article) |
| Code disponible | N/A |
| Dataset public | N/A (catalogue des 88 etudes fourni) |
