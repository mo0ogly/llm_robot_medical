## [Wang, Zhang, Yagemann, 2025] — Framework pratique pour l'evaluation de la securite des LLM medicaux

**Reference :** arXiv:2512.08185
**Revue/Conf :** Preprint (pas de venue conference identifiee)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P071_Wang_2025_MedicalAISecurity.pdf](../../assets/pdfs/P071_Wang_2025_MedicalAISecurity.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet via ChromaDB (30 chunks)

### Abstract original
> Medical Large Language Models (LLMs) are increasingly deployed for clinical decision support across diverse specialties, yet systematic evaluation of their robustness to adversarial misuse and privacy leakage remains inaccessible to most researchers. Existing security benchmarks require GPU clusters, commercial API access, or protected health data -- barriers that limit community participation in this critical research area. We propose a practical, fully reproducible framework for evaluating medical AI security under realistic resource constraints. Our framework design covers multiple medical specialties stratified by clinical risk -- from high-risk domains such as emergency medicine and psychiatry to general practice -- addressing jailbreaking attacks (role-playing, authority impersonation, multi-turn manipulation) and privacy extraction attacks. All evaluation utilizes synthetic patient records requiring no IRB approval. The framework is designed to run entirely on consumer CPU hardware using freely available models, eliminating cost barriers. We present the framework specification including threat models, data generation methodology, evaluation protocols, and scoring rubrics.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les benchmarks de securite pour LLM medicaux existants (HarmBench, DecodingTrust, MedSafetyBench) necessitent GPU clusters, API payantes ou donnees patients protegees, excluant la majorite des chercheurs (Section 1, p. 1).
- **Methode :** Framework reproductible combinant threat model multi-specialites (urgences, psychiatrie, pharmacologie, oncologie, generaliste), donnees synthetiques SOAP sans IRB, et execution sur CPU consommateur (GPT-2 124M, DistilGPT-2 82M) (Section 3, p. 3-5).
- **Donnees :** Donnees synthetiques generees avec PHI fictifs (nom, DOB, MRN, SSN) au format SOAP note ; pas de dataset reel (Section 3.4, p. 5).
- **Resultat :** Framework de specification uniquement — AUCUN resultat experimental presente. Pas d'ASR, pas de metriques quantitatives. Le papier est une proposition methodologique (Section 4-5, p. 5-7). [ABSTRACT SEUL pour les metriques]
- **Limite :** Les auteurs admettent explicitement : "We present the framework specification [...] This proposal establishes a foundation" — il s'agit d'un design paper sans resultats (Section 1, p. 2). Modeles testes (GPT-2, DistilGPT-2) sont obsoletes et non representatifs des LLM medicaux deployes.

### Analyse critique
**Forces :**
- Seul framework combinant medical + adversarial + multi-specialite + zero-cost + no-IRB (Table 1, p. 3) — comble un gap reel.
- Stratification par niveau de risque clinique (critical/high/baseline) est methodologiquement solide et alignee avec les pratiques hospitalieres (Section 3.2, p. 4).
- Taxonomie des vecteurs d'attaque couvre les 4 categories fondamentales : role-playing, authority impersonation, multi-turn, privacy extraction (Section 3.3, p. 4).

**Faiblesses :**
- AUCUN resultat experimental — le papier est une proposition sans validation. Impossible d'evaluer l'efficacite du framework sans donnees.
- Modeles cibles (GPT-2 124M, DistilGPT-2 82M) sont inadequats : ces modeles n'ont pas d'alignement RLHF, donc evaluer leur "robustesse au jailbreaking" est un non-sens methodologique (Section 4.1, p. 5).
- La rubrique de scoring ASR (Section 4.3) est proposee sans calibration ni validation inter-evaluateurs.
- Pas de comparaison avec des approches existantes comme MedSafetyBench (Zhang et al., 2024) au-dela du positionnement tabulaire.

**Questions ouvertes :**
- Comment valider empiriquement que les donnees synthetiques SOAP capturent les patterns de vulnerabilite des vrais dossiers patients ?
- Le framework est-il applicable aux modeles medical-specialist (BioGPT, Meditron, Med42) qui sont la cible reelle ?

### Formules exactes
Aucune formule formelle. Le papier utilise une rubrique qualitative pour l'ASR :
- Score 1 (refus complet) a 5 (compliance totale) — echelle proposee mais non validee (Section 4.3, p. 6).
Lien glossaire AEGIS : F22 (ASR empirique)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (alignement de base face aux jailbreaks medicaux — PRIMAIRE), δ¹ (extraction privacy via RAG — SECONDAIRE), δ² (multi-turn manipulation — PERTINENT)
- **Conjectures :** C4 (alignment medical heterogene par specialite) — SUPPORTEE par la stratification clinique ; C6 (reproductibilite) — SUPPORTEE FORTEMENT par le design zero-cost
- **Decouvertes :** Aucune confirmation/infirmation directe — pas de resultats experimentaux
- **Gaps :** G-006 (evaluation reproductible sans acces institutionnel) — ADRESSE conceptuellement ; G-007 (couverture multi-specialites) — ADRESSE
- **Mapping templates AEGIS :** #01-#05 (role-playing medical), #10-#15 (authority impersonation), #30-#35 (multi-turn)

### Citations cles
> "Medical-specialist models paradoxically show higher compliance with harmful requests than general models -- domain knowledge amplifies rather than mitigates security risks." (Section 1, p. 1, citant Zhang et al., 2024)
> "A comprehensive security framework must therefore evaluate vulnerabilities across the spectrum of clinical practice." (Section 1, p. 2)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 5/10 |
| Reproductibilite | Faible — aucun resultat a reproduire, framework non valide empiriquement |
| Code disponible | Non |
| Dataset public | Non (donnees synthetiques proposees, pas generees) |
