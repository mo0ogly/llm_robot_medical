## [Geng, Yin, Wang, Chen, Jia, 2026] — PIArena : une plateforme d'évaluation du prompt injection

**Reference :** arXiv:2604.08499 [cs.CR]
**Revue/Conf :** arXiv preprint 2026-04 [cs.CR] — PREPRINT (non encore publié en conférence)
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P173_Geng_2026_PIArena.pdf](../../literature_for_rag/P173_Geng_2026_PIArena.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via pypdf (23 pages intégrales)

---

### Abstract original

> Prompt injection attacks pose serious security risks across a wide range of real-world applications. While receiving increasing attention, the community faces a critical gap: the lack of a unified platform for prompt injection evaluation. This makes it challenging to reliably compare defenses, understand their true robustness under diverse attacks, or assess how well they generalize across tasks and benchmarks. For instance, many defenses initially reported as effective were later found to exhibit limited robustness on diverse datasets and attacks. To bridge this gap, we introduce PIArena, a unified and extensible platform for prompt injection evaluation that enables users to easily integrate state-of-the-art attacks and defenses and evaluate them across a variety of existing and new benchmarks. We also design a dynamic strategy-based attack that adaptively optimizes injected prompts based on defense feedback. Through comprehensive evaluation using PIArena, we uncover critical limitations of state-of-the-art defenses: limited generalizability across tasks, vulnerability to adaptive attacks, and fundamental challenges when an injected task aligns with the target task. The code and datasets are available at https://github.com/sleeepeer/PIArena.
> — Source : PDF page 1, Abstract

---

### Résumé (5 lignes)

- **Problème :** Absence de plateforme unifiée pour évaluer et comparer de manière équitable attaques et défenses contre le prompt injection, rendant les comparaisons non reproductibles et les défenses rapportées comme efficaces peu fiables hors de leurs benchmarks d'origine.
- **Méthode :** PIArena — plateforme modulaire plug-and-play avec API unifiées pour attaques, défenses et évaluateurs, intégrant 4 attaques (Direct, Combined, Strategy, GCG), 8 défenses (4 prevention, 4 detection), 13 datasets (1 700 samples) couvrant QA, RAG, résumé, extraction, code, et 4 benchmarks agentiques.
- **Données :** 13 datasets publics : SQuAD v2, Dolly (3 tâches), NQ, MS-MARCO, HotpotQA, HotpotQA-Long, Qasper, GovReport, MultiNews, PassageRetrieval, LCC — total 1 700 samples ; 4 benchmarks agentiques (InjecAgent, AgentDojo, AgentDyn, WASP avec 84 test cases). (Table 8, p. 17)
- **Résultat :** L'attaque strategy-based atteint 99% ASR sans défense vs 56% (Direct) et 72% (Combined) ; aucune défense ne domine sur tous les benchmarks ; AttentionTracker atteint un faible ASR (~0% sur plusieurs tâches) mais au prix d'une utilité très dégradée (15% en moyenne). (Section 5.2, p. 8 ; Table 2, p. 7)
- **Limite :** Les benchmarks PIArena peuvent ne pas refléter tous les scénarios réels (reconnu par les auteurs, Section Limitations, p. 10) ; l'évaluation WASP est statique (page unique extraite, pas d'exécution live dans un navigateur, Section 5.5.1, p. 9).

---

### Analyse critique

#### Forces

- **Unification manquante comblée** : PIArena est la seule plateforme à combiner attaques adaptatives, défenses modulaires et évaluateurs cross-benchmark en APIs plug-and-play — confirmé par la Table 1 (p. 3) qui montre que tous les benchmarks existants (OPI, SEP, BIPIA, AlpacaFarm, InjecAgent, ASB, AgentDojo, WASP) n'offrent que des attaques statiques et n'ont pas d'API plug-and-play unifiées.
- **Attaque strategy-based originale** : l'attaque adaptative black-box en 2 phases (génération par 10 stratégies + boucle feedback-guided avec 3 scénarios : détection/ignoré/échec générique) est fonctionnellement distincte de GCG (white-box) et de PAIR/TAP (jailbreak). Elle converge en 1-2 itérations en moyenne pour la plupart des défenses, 4.555 itérations pour SecAlign++ (Table 9 implied, Section G.2, p. 20) avec un coût moyen de ~8 secondes par sample.
- **Évaluation cross-LLM exhaustive** : 10 modèles testés dont GPT-5, Claude-Sonnet-4.5, Gemini-3-Pro, Llama3.3-70B, gpt-oss-120b. Résultat clé : même GPT-4o-mini (entraîné spécifiquement contre PI) atteint 76% ASR ; GPT-5 avec stack de défense multicouche atteint 70% ASR (Table 3, p. 8).
- **Découverte fondamentale sur task-alignment** : quand l'injected task et la target task sont alignées (ex. knowledge corruption en QA), les attaques se réduisent à de la désinformation sans instruction explicite — toutes les défenses basées sur la détection d'instructions injectées deviennent inefficaces par construction (Section 5.4, Table 4, p. 8-9).
- **Open-source** : code et datasets disponibles (https://github.com/sleeepeer/PIArena) avec 10 stratégies de réécriture entièrement documentées (Appendix G.4, pp. 21-22).

#### Faiblesses

- **Évaluation agentique simplifiée** : pour WASP, seule la première page contenant le prompt injecté est extraite ; l'exécution dans un environnement web live n'est pas réalisée (Section 5.5.1, p. 9). Les résultats agentiques sont donc des approximations.
- **Juge LLM potentiellement biaisé** : Qwen3-4B-Instruct est utilisé à la fois comme Attacker LLM (génération des candidats) et comme LLM-judge (évaluation ASR, Appendix E, p. 18). Ce double rôle crée un risque de biais circulaire non quantifié — comparable au problème de "judge blindness" documenté dans P044 (flip rate 99% des jugements LLM).
- **Diversité des modèles cibles limitée** : bien que 10 modèles soient testés (Table 3), l'évaluation principale (Table 2) utilise un seul backend LLM non spécifié. Les résultats de généralisation cross-modèle des défenses ne sont pas systématiquement rapportés.
- **Benchmarks curated non adversariaux** : les injected tasks sont générées par LLM selon des catégories prédéfinies (phishing, contenu promotionnel, accès refusé, panne infrastructure) — les adversaires réels utilisent des tactiques moins bornées.
- **Absence de métriques Sep(M)** : la plateforme n'implémente pas Sep(M) (Zverev et al., 2025, ICLR) comme métrique de séparabilité instruction/données — manque pour comparer directement avec le corpus AEGIS.

#### Questions ouvertes

- Quelle défense maintient le meilleur trade-off utilité/ASR sur l'ensemble des benchmarks quand les attaques sont adaptatives ? (AttentionTracker domine sur ASR mais sacrifie l'utilité).
- Comment PIArena se comporterait avec Sep(M) comme métrique supplémentaire ?
- Peut-on généraliser les 10 stratégies de réécriture à d'autres langues (cross-lingual) pour tester δ² ?

---

### Formules exactes / Métriques d'évaluation

**Définition formelle du prompt injection** (Section 2, p. 2) :
- L'application LLM génère R = g(It ⊕ C) où It est l'instruction cible, C le contexte, ⊕ la concaténation.
- L'attaquant injecte Is dans C pour créer C' ; l'objectif est que g(It ⊕ C') accomplisse Is plutôt que It.

**Métriques d'évaluation** (Section 4.4, p. 5) :
1. **Utility** : performance sur la tâche cible — LLM-as-a-judge (Qwen3-4B) pour QA/extraction/résumé, F1-score pour long-context QA, ROUGE-L pour résumé long, Code Similarity pour génération de code (Table 8, p. 17).
2. **ASR (Attack Success Rate)** : proportion de responses complétant l'injected task (juge LLM, Appendix E, p. 18).
3. **Précision de l'évaluateur** : 98% confirmée sur 100 samples inspecés manuellement (Section 5.2, p. 8).

**Algorithme 1 — Strategy-based Adaptive Attack** (Section 4.5, pp. 5-6 ; Appendix G.1, p. 20) :
- Phase 1 : pour chaque stratégie si ∈ S (|S|=10), générer N candidats {Pi,1,...,Pi,N} par réécriture de Pinj ; tester chaque candidat, retourner si succès.
- Phase 2 : sélection aléatoire Pseed = {P1,...,P|S|}. Boucle de raffinement (max K itérations) : réécriture guidée par feedback (Scénario 1 = détecté → "stealth" ; Scénario 2 = ignoré → "imperativeness" ; Scénario 3 = autre → "analyze failure and bypass").
- Coût : ~8 secondes par sample avec vLLM + batch inference (Section G.2, p. 20).

---

### Pertinence thèse AEGIS

#### Couches delta

- **δ¹ (couche d'injection de contexte)** : PIArena est centré sur l'injection indirecte dans le contexte (IPI) — modélisation formelle It ⊕ C', taxonomie des injected tasks, évaluation RAG multi-documents. Pertinence maximale.
- **δ² (couche multi-agent / orchestration)** : évaluation sur benchmarks agentiques (InjecAgent, AgentDojo, AgentDyn, WASP) — montre que les défenses δ¹ ne tiennent pas en contexte agentique (Table 5, p. 9).
- **δ³ (couche défense systémique)** : finding central — aucune défense ne domine sur l'ensemble des tâches et benchmarks. Renforce directement C2 (voir ci-dessous). La découverte sur task-alignment montre une limite fondamentale au-delà de l'ingénierie des défenses actuelles.
- **δ⁰** : non ciblé par ce papier (guardrails RLHF).

#### Conjectures

- **C2 (robustesse des défenses)** : PIArena **supporte fortement C2**. Les résultats montrent qu'aucune défense state-of-the-art ne maintient simultanément haute utilité et bas ASR face à une attaque adaptative — Strategy-based atteint 86% ASR contre PISanitizer (Section 5.2, Table 2, p. 7-8). La généralisation cross-benchmark est systématiquement limitée (Table 6, p. 9 : PromptArmor obtient ASR=0.31 sur OPI mais ASR=0.69 sur SEP). Evidence directe pour C2.
- **C3 (attaques adaptatives)** : supportée — l'attaque strategy-based démontre empiriquement qu'une attaque adaptative black-box surpasse systématiquement les attaques statiques, même face à des défenses entraînées contre celles-ci.

#### Découvertes AEGIS

- **D-lié à C2** : PIArena confirme empiriquement que la "fausse sécurité" des défenses évaluées uniquement sur attaques statiques est un problème réel et documentable.
- **Nouveau vecteur** : la désinformation par task-alignment (Section 5.4) — cas où les défenses PI sont structurellement incapables d'agir — est un vecteur documenté avec données.

#### Gaps adressés / créés

- **Adresse** : G-lié à l'absence d'infra d'évaluation unifiée (gap d'infrastructure benchmarking).
- **Crée** : gap sur Sep(M) dans PIArena (non implémenté) ; gap sur robustesse cross-langue ; gap sur jugement LLM circulaire (Attacker LLM = Judge LLM).

#### Mapping templates AEGIS

Mapping avec les templates AEGIS (#01-#97) :
- Stratégies 1 (Data Privacy Addendum), 4 (Editor Correction), 7 (Author Addendum) : opérateur "autorité institutionnelle" — correspond aux templates de catégorie autorité AEGIS.
- Stratégie 9 (Translation Note) : opérateur cross-lingual — direct lien avec templates encodage/langue AEGIS.
- Stratégie 5 (System Config Block) : injection de pseudo-métadonnées système — lien templates task injection.
- Stratégie 3 (Fragmented Injection) : fragmentation sémantique — vecteur IPI steganographique.
- Stratégie 8 (Conditional Trigger) : injection conditionnelle cachée en markup.

#### Lien P169 — PISmith

PIArena est produit par le **même groupe de recherche** que PISmith (Yin, Wang, Geng, Chen, Jia — Penn State) : Runpeng Geng et Jinyuan Jia apparaissent dans les deux papiers. La référence à "PISmith (Yin et al., 2026)" apparaît explicitement dans la Section A.1 de PIArena (p. 15 : "RL-Hammer (Wen et al., 2025) and PISmith (Yin et al., 2026) optimize an attacker LLM to generate effective adversarial prompts using reinforcement learning"). PIArena est donc l'infrastructure d'évaluation sur laquelle PISmith a vraisemblablement été benchmarké. Les deux papiers sont complémentaires : PISmith génère des attaques par RL, PIArena fournit le cadre d'évaluation.

#### Lien P147 (Formalizing & Benchmarking — Liu et al., 2024b = OPI)

PIArena intègre OPI (Open-Prompt-Injection, Liu et al., 2024b) comme l'un de ses benchmarks (Table 6, p. 9 ; Section 5.5.2, p. 9). PIArena étend OPI en y ajoutant des défenses et des attaques adaptatives. Résultats sur OPI : PISanitizer ASR=0.04, SecAlign++ ASR=0.01 — meilleures défenses sur ce benchmark.

#### Lien P004 (WASP)

PIArena intègre WASP (Evtimov et al., 2025) dans son évaluation agentique (Table 5, 84 test cases). Sur WASP : SecAlign++ réduit l'ASR de 0.37 (no defense) à 0.06, PIGuard réduit à 0.0. WASP est le benchmark le plus difficile à évaluer en raison de sa nature multi-steps (Section 5.5.1, p. 9).

---

### Citations clés

> "All existing benchmarks use static attacks with fixed templates that do not adapt to specific defenses. This fails to capture realistic scenarios where adversaries iteratively evolve attacks to bypass defenses." (Section 4.1, p. 3)

> "Our strategy-based attack bypasses almost all defenses, achieving significantly higher ASRs than Combined and Direct attacks—99% ASR without defense versus 56% (Direct) and 72% (Combined). Against prevention-based defenses, it achieves 86% ASR against PISanitizer versus 11% (Direct) and 4% (Combined)." (Section 5.2, p. 8)

> "GPT-5 (OpenAI, 2025), deployed with a multilayered defense stack, also exhibits 70% ASR." (Section 5.3, Table 3, p. 8)

> "Prompt injection attacks can reduce to disinformation when the target task aligns with the injected task, rendering many existing defenses ineffective. Designing an effective defense can be fundamentally challenging in this scenario." (Section 1, p. 2 ; Section 5.4, p. 8-9)

> "Existing defenses, which primarily operate at the instruction level by detecting or neutralizing injected instructions, are inherently ineffective in this setting. This suggests that future defenses need to move beyond instruction-level detection toward content-level verification mechanisms." (Section D — Implications, p. 18)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 — plateforme d'évaluation centrale pour PI, résultats empiriques solides sur 8 défenses et 10 LLMs |
| Reproductibilité | Haute — code open-source (https://github.com/sleeepeer/PIArena), datasets publics, 10 stratégies documentées en Appendix G.4 |
| Code disponible | Oui — https://github.com/sleeepeer/PIArena |
| Dataset public | Oui — 13 datasets publics (SQuAD v2, Dolly, NQ, MS-MARCO, HotpotQA, LongBench, etc.) |
| Type d'attaque AEGIS | IPI (Indirect Prompt Injection) + plateforme d'évaluation unifiée |
| Surface ciblée | Contexte LLM (RAG, agent, QA, résumé, extraction, code) |
| MITRE ATLAS | AML.T0051 (LLM Prompt Injection) |
| OWASP LLM | LLM01 (Prompt Injection) |
| Statut | [PREPRINT] arXiv:2604.08499 — avril 2026 |
| Lien corpus | P169 (PISmith — même groupe), P147 (OPI intégré), P004 (WASP intégré), Zverev et al. 2025 (SEP intégré) |
