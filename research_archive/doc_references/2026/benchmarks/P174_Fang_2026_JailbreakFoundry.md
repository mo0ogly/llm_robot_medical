## [Fang, Zheng, Fu, Xu, 2026] — Jailbreak Foundry : des papiers aux attaques exécutables pour un benchmarking reproductible

**Référence :** arXiv:2602.24009 [cs.CR]
**Revue/Conf :** arXiv preprint, mars 2026 [cs.CR] — Preprint. March 6, 2026.
**Lu le :** 2026-06-15
> **PDF Source** : [literature_for_rag/P174_Fang_2026_JailbreakFoundry.pdf](../../literature_for_rag/P174_Fang_2026_JailbreakFoundry.pdf)
> **Statut** : [PREPRINT] — lu 36 pages en texte complet (pypdf)

---

### Abstract original

> Jailbreak techniques for large language models (LLMs) evolve faster than benchmarks, making robustness estimates stale and difficult to compare across papers due to drift in datasets, harnesses, and judging protocols. We introduce JAILBREAK FOUNDRY (JBF), a system that addresses this gap via a multi-agent workflow to translate jailbreak papers into executable modules for immediate evaluation within a unified harness. JBF features three core components: (i) JBF-LIB for shared contracts and reusable utilities; (ii) JBF-FORGE for the multi-agent paper-to-module translation; and (iii) JBF-EVAL for standardizing evaluations. Across 30 reproduced attacks, JBF achieves high fidelity with a mean (reproduced−reported) attack success rate (ASR) deviation of +0.26 percentage points. By leveraging shared infrastructure, JBF reduces attack-specific implementation code by nearly half relative to original repositories and achieves an 82.5% mean reused-code ratio. This system enables a standardized AdvBench evaluation of all 30 attacks across 10 victim models using a consistent GPT-4o judge. By automating both attack integration and standardized evaluation, JBF offers a scalable solution for creating living benchmarks that keep pace with the rapidly shifting security landscape.
> — Source : PDF p. 1, Abstract

---

### Résumé (5 lignes)

- **Problème :** Les techniques de jailbreak évoluent plus vite que les benchmarks ; les ASR publiées sont difficiles à comparer entre papiers en raison de la dérive des datasets, des harnais d'évaluation et des protocoles de juges.
- **Méthode :** JBF = système multi-agents en trois couches (JBF-LIB : contrats et utilitaires partagés ; JBF-FORGE : pipeline Planner→Coder→Auditor pour traduire un papier en module exécutable ; JBF-EVAL : harnais standardisé) ; 30 attaques reproduites sur 10 modèles victimes avec un juge GPT-4o unifié.
- **Données :** AdvBench et JailbreakBench (JBB) ; 30 attaques publiées entre octobre 2023 et décembre 2024 ; 10 modèles victimes (Claude-3.7-Sonnet, Claude-3.5-Sonnet, GPT-4, GPT-4o, GPT-3.5-Turbo, LLaMA-3-8B-Instruct, LLaMA-2-7B-Chat, Qwen3-14B, GPT-5.1, GPT-OSS-120B).
- **Résultat :** Déviation moyenne de reproduction ∆ = +0.26 pp (plage −16.0 % à +20.0 %) ; ratio de compression du code 0.42 (22 714 → 9 549 LOC) ; 82.5 % de code partagé via JBF-LIB ; synthèse en 28.2 min en moyenne. (Section 4.2, Table 1 ; Section 4.3, p. 6–7)
- **Limite :** Restreint à AdvBench / JBB ; couverture sans code officiel plus difficile (8/30 attaques) ; ISA reste sous-reproductible (∆ = −16.0 %) en raison de sensibilités de formatage et de comportement provider-spécifique. (Section 4.2, p. 6)

---

### Analyse critique

#### Forces

1. **Fidélité de reproduction remarquable** : sur 30 attaques, ∆ moyen = +0.26 pp, avec symétrie quasi parfaite (16 positifs, 14 négatifs) et seulement 2 outliers négatifs > −10 % (SCP −11.8 %, ISA −16.0 %). (Table 1, p. 5 ; Section 4.2, p. 6) — Cela valide empiriquement que les ASR publiées sont globalement fiables lorsqu'une implémentation rigoureuse est fournie.
2. **Architecture modulaire et auditable** : pipeline Planner→Coder→Auditor avec boucle bornée, hiérarchie de sources de vérité (sp ≻ C ≻ R) et rapport de couverture ligne par ligne. (Section 3.2, p. 4 ; Appendix B, p. 14–15) — Standard d'ingénierie solide, transposable à d'autres domaines.
3. **Compression du code** : ratio ρ = 0.42 pour 22 codebases (22 714 → 9 549 LOC) ; JBF-LIB absorbe 82.5 % du codebase total, réduisant la dette de maintenance. (Section 4.3, p. 6–7)
4. **Taxonomie orthogonale Search × Carrier** : classifie les 30 attaques selon deux axes indépendants, permettant des comparaisons mécanistes inter-papiers. (Appendix A, p. 13 ; Section 2, p. 2)
5. **Heatmap cross-modèle** : 30 attaques × 10 modèles sous protocole unique, révélant des interactions attaque–modèle invisibles dans des évaluations mono-modèle. (Figure 4, p. 7 ; Section 5)

#### Faiblesses

1. **Scope limité à AdvBench/JBB** : les attaques nécessitant d'autres datasets sont exclues, ce qui baise la représentativité de la couverture. (Section 4.1, p. 4–5)
2. **8/30 attaques sans code officiel** : pour ces attaques (marquées ✗ dans Table 1), le ratio ρ est indisponible et la reproduction dépend uniquement du texte papier — ce qui peut introduire des interprétations non canoniques.
3. **Juge GPT-4o non universel** : utilisé par défaut quand le juge original n'est pas disponible, mais lui-même manipulable (la littérature montre un flip rate jusqu'à 99 % pour certains juges LLM — P044). La comparabilité cross-attaque dépend de la stabilité de ce juge.
4. **ISA irréductible** (∆ = −16.0 %) : les auteurs avouent que le gap résiduel provient de "system and message formatting, max-tokens defaults, and prompt serialization in the two-step rewrite pipeline" — non résolu par le pass de raffinement. (Section 4.2, p. 6)
5. **Biais de sélection temporel** : corpus couvre octobre 2023–décembre 2024 ; les attaques post-janvier 2025 ne sont pas incluses dans l'évaluation standardisée.
6. **Usage dual non résolu** : les auteurs reconnaissent explicitement que JBF abaisse la barrière à la mise en oeuvre d'attaques à grande échelle. (Impact Statement, p. 9)

#### Questions ouvertes

- Comment se comporterait JBF face à des attaques spécifiques à un domaine (médical, juridique) hors AdvBench/JBB ?
- La fidélité de reproduction tient-elle sur des modèles plus récents que ceux testés (post-GPT-5.1) ?
- Le pipeline peut-il être étendu à des attaques multi-agents ou RAG (IPI) qui ne suivent pas le schéma linéaire paper→module ?

---

### Formules exactes / métriques de fidélité de reproduction

**∆ (écart de reproduction)** — défini comme :
> ∆ = ASR_gen − ASR_paper
> (Algorithm 1, ligne 14, p. 4)
[EMPIRIQUE — métrique de fidélité, pas de garantie théorique de convergence]

**δ (gain repo vs. no-repo)** :
> δ = ASR_with-repo − ASR_no-repo
> (Section 4.2, p. 6)
Résultat sur 5 attaques : δ moyen = +19.8 pp (no-repo : 66.5 %, with-repo : 86.3 %, vs. 77.0 % rapporté).

**Ratio de compression** :
> ρ = LOC_gen / LOC_orig = 0.42 (pour 19 codebases uniques, 22 attaques avec repo)
> (Section 4.3, p. 6)

**Ratio de réutilisation framework** :
> JBF-LIB core = 2 014 LOC fixe ; 82.5 % du codebase total intégré = infrastructure partagée
> (Section 4.3, p. 7)

**Efficacité temporelle de JBF-FORGE** :
> Synthèse : moyenne 28.2 min, médiane 25.0 min, plage 3.0–96 min ; 82 % des runs < 60 min
> (Section 4.2, p. 5–6 ; Appendix D, p. 17)

**Résultats cross-modèles (Figure 4, p. 7)** :
- GPT-3.5-Turbo : ASR moyen 78.8 % (aucune attaque < 50 %) — le plus vulnérable
- GPT-4o : ASR moyen 74.5 %
- Qwen3-14B : ASR moyen 71.4 %
- GPT-OSS-120B : ASR moyen 9.13 % (15/30 attaques à 0 %) — le plus robuste en moyenne, mais blind spot : MOUSETRAP 82 %, RTS 51.1 %

**Meilleures familles Search/Carrier (Section 5.2, p. 8)** :
- Victim-in-the-loop : ASR moyen 60.3 % (meilleure stratégie de recherche sur l'ensemble)
- Formal wrappers : ASR moyen 66.0 % (meilleure classe de carrier)
- Linguistic reframing : ASR moyen 39.3 % (la moins efficace)

---

### Pertinence thèse AEGIS

#### Couches delta

- **δ⁰ (RLHF / safety training)** : JBF documente empiriquement que les attaques contournant le fine-tuning RLHF (jailbreaks classiques) restent opérationnelles sur GPT-3.5-Turbo, GPT-4o, Qwen3-14B avec ASR > 70 %. La couche δ⁰ est la cible principale des 30 attaques reproduites.
- **δ¹ (system prompt)** : Plusieurs attaques de la taxonomie "Context" (PAIR, TAP, TRIAL) opèrent via manipulation du contexte conversationnel, contournant les guardrails de niveau δ¹.
- **δ² (RAG / outils)** : Non couvert directement — JBF cible le dialogue direct, pas les pipelines RAG ou multi-agents.
- **δ³ (agent autonome)** : Attaques multi-turn marquées ∗ (AIR, RA-DRI, RA-SRI, TRIAL, GTA) touchent partiellement δ³, mais l'orchestration agent n'est pas le focus principal.

#### Conjectures

- **C2 (robustesse du benchmarking)** : JBF apporte une preuve empirique directe que les ASR publiées sont reproductibles avec haute fidélité (∆ moyen = +0.26 pp), ce qui **supporte C2** — les benchmarks existants ne sont pas systématiquement biaisés. Nuance : la reproductibilité dépend fortement de la disponibilité du code officiel (δ = +19.8 pp avec repo vs. sans). [EXPERIMENTAL]
- **Implication pour C2** : le principal risque pour la fiabilité des benchmarks n'est pas la fabrication de résultats mais l'omission de détails d'implémentation implicites (defaults, formatage, retry logic) — un problème d'ingénierie plus que de fraude scientifique.

#### Découvertes / Gaps

- **G-relevant (reproductibilité)** : Confirme que les ASR jailbreak sont globalement reproductibles — ce qui valide l'utilisation des ASR de la littérature comme baselines dans les campagnes AEGIS.
- **Gap identifié** : La reproductibilité chute significativement sans code officiel (−19.8 pp en moyenne sur 5 attaques représentatives) — les 8/30 papiers sans repo doivent être traités avec prudence dans les baselines AEGIS.
- **Blind spot modèle** : GPT-OSS-120B illustre qu'un score robustesse moyen faible (9.13 %) peut masquer des vulnérabilités sévères à des mécanismes spécifiques (Mousetrap 82 %, RTS 51.1 %) — pertinent pour l'évaluation de la robustesse de Meditron et autres modèles médicaux.

#### Mapping templates AEGIS / moteur génétique

JBF est une infrastructure conceptuellement proche du moteur génétique AEGIS :

| JBF-FORGE | Moteur génétique AEGIS |
|-----------|----------------------|
| Planner (sp = π(x, C, R)) | Planification de croisement (operateurs valides) |
| Coder (mp = κ(sp, C, R)) | Génération de variants de templates |
| Auditor (ac = fidelity 100%) | Fitness SVC 6 dimensions |
| Bounded loop (T iterations) | Boucle générationnelle avec critère d'arrêt |
| JBF-LIB contracts | Contrats de couche delta (δ⁰–δ³) |

- La taxonomie Search × Carrier de JBF (Appendix A, p. 13) est directement mappable aux dimensions de la forge AEGIS : Search ≈ stratégie de recherche (population, sélection) ; Carrier ≈ opérateurs porteurs (reframing, context, formal, obfuscation). Cette taxonomie enrichit la classification des 97 templates AEGIS.
- La découverte que **formal wrappers sont les plus efficaces** (ASR moyen 66.0 %) et que **GPT-5.1 est particulièrement vulnérable aux formal carriers** (65.2 % vs. 26.0 % pour obfuscation) valide l'hypothèse AEGIS que l'autorité institutionnelle + formalisme est un opérateur fort.
- La découverte que **la recombinaison implique des détails implicites** (retry logic, formatage, defaults) éclaire pourquoi le croisement naïf de templates peut sous-performer : les "gènes" portent des comportements non documentés.

#### Cluster reproductibilité/benchmark corpus

Liens avec :
- **P127** (IPI competition) : JBF évalue les DPI ; P127 couvre l'IPI — domaines complémentaires, protocoles différents.
- **P147** (Formalizing & Benchmarking PI) : cadre formel pour la PI, JBF fournit l'infrastructure pratique.
- **P151** (Red team survey Srivastava 2026) : JBF offre une implémentation concrète des attaques listées dans ce survey.

---

### Citations clés

> "JBF-FORGE reproduces prior results with high fidelity: mean deviation ∆ = +0.26% with an overall range −16.0% to 20.0%. Deviations are roughly symmetric (16 attacks with ∆ ≥ 0, 14 with ∆ < 0), and large under-reproductions are rare (2 attacks with ∆ < −10%)."
> (Section 4.2, p. 6)

> "Treating the JBF-LIB core as fixed overhead of 2,014 LOC and aggregating over 26 implementations with variant de-duplication, we find that 82.5% of the integrated codebase is shared framework code and 17.5% is attack-specific."
> (Section 4.3, p. 7)

> "'Broad' robustness can hide narrow but severe blind spots. GPT-OSS-120B is the strongest outlier on average (mean ASR 9.13%; 15/30 attacks at 0%; only 5/30 reach ≥20%), yet it fails on MOUSETRAP (82%) and RTS (51.1%)."
> (Section 5.1, p. 8)

> "Across all pairs, formal wrappers are the most effective carrier class (mean ASR 66.0%), followed by contextual wrappers (60.1%), while linguistic reframing is lowest (39.3%)."
> (Section 5.2, p. 8)

> "Across five representative attacks, repositories raise mean ASR from 66.5% to 86.3% (δ = +19.8), versus 77.0% reported in the original papers."
> (Section 4.2, p. 6)

> "By providing a blueprint to escape the static-security trap, our work enables more timely, trustworthy, and continuous evaluation of LLM safety."
> (Section 6, Conclusion, p. 8)

---

### Classification

| Champ | Valeur |
|-------|--------|
| Type d'analyse | Infrastructure de reproductibilité + benchmark standardisé |
| Nature | [EMPIRIQUE] — résultats mesurés, pas de théorème formel |
| SVC pertinence AEGIS | 8/10 — infrastructure directement réutilisable conceptuellement pour la forge ; les findings de reproductibilité calibrent la confiance dans les baselines littérature |
| Reproductibilité | Haute — code + protocole décrits en détail ; artefacts structurés JSON ; runs résumables |
| Code disponible | Oui — référencé dans le papier (système JBF décrit avec contrats, prompts, algorithme) |
| Dataset public | Oui — AdvBench (public) + JailbreakBench (public) |
| Statut bibliographique | [PREPRINT] — non encore publié en conférence/journal à la date de lecture (2026-06-15) |
| Couches delta | δ⁰ (principal), δ¹ (partiel), δ³ (partiel multi-turn) |
| Conjectures AEGIS | C2 (SUPPORTÉE — reproductibilité ASR confirmée empiriquement) |
| Attaques reproduites | 30 (22 avec repo officiel, 8 depuis texte seul) |
| Modèles victimes évalués | 10 (GPT-3.5-Turbo à GPT-5.1 / GPT-OSS-120B) |
