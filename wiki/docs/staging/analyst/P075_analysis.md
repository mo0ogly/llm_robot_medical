## [Ma, Wang, Yu et al., 2025] — MedCheck : Au-dela du leaderboard, repenser les benchmarks medicaux

**Reference :** arXiv (ID a verifier — v2 2026)
**Revue/Conf :** Preprint, CUHK / Renmin University / Shenzhen University / CityU Hong Kong
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P075_Ma_2025_MedCheck.pdf](../../assets/pdfs/P075_Ma_2025_MedCheck.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet via ChromaDB (77 chunks)

### Abstract original
> Large language models (LLMs) show significant potential in healthcare, prompting numerous benchmarks to evaluate their capabilities. However, concerns persist regarding the reliability of these benchmarks, which often lack clinical fidelity, robust data management, and safety-oriented evaluation metrics. To address these shortcomings, we introduce MedCheck, the first lifecycle-oriented assessment framework specifically designed for medical benchmarks. Our framework deconstructs a benchmark's development into five continuous stages, from design to governance, and provides a comprehensive checklist of 46 medically-tailored criteria. Using MedCheck, we conducted an in-depth empirical evaluation of 53 medical LLM benchmarks. Our analysis uncovers widespread, systemic issues, including a profound disconnect from clinical practice, a crisis of data integrity due to unmitigated contamination risks, and a systematic neglect of safety-critical evaluation dimensions like model robustness and uncertainty awareness.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les 53 benchmarks medicaux existants pour LLM souffrent de defauts systemiques : deconnexion clinique, contamination de donnees, negligence des dimensions securite/robustesse (Section 1, p. 1).
- **Methode :** Framework MedCheck lifecycle a 5 etapes (design → donnees → evaluation → reporting → gouvernance) avec 46 criteres medicalises. Evaluation empirique meta-analytique de 53 benchmarks (Section 3-4, p. 3-7).
- **Donnees :** 53 benchmarks medicaux evalues comme dataset ; pas de creation de nouvelles donnees (Section 4, p. 4).
- **Resultat :** Trois deficiences systemiques identifiees : (1) "Clinical Disconnect" — deconnexion de la pratique reelle, (2) "Crisis of Data Integrity" — risques de contamination non mitigees, (3) "Systematic Neglect of Safety-Critical Capabilities" — robustesse et conscience d'incertitude ignorees (Section 5, Discussion, p. 7).
- **Limite :** 53 benchmarks non exhaustifs ; scoring qualitatif avec subjectivite inherente ; base sur les artefacts publics uniquement (Section Limitations, p. 8).

### Analyse critique
**Forces :**
- Premiere meta-analyse systematique de la qualite des benchmarks medicaux — contribution unique de type "benchmark des benchmarks" (Section 1, p. 1).
- 46 criteres concrets et actionables pour guider la creation de futurs benchmarks (Section 3, p. 3).
- Identification du probleme de la loi de Goodhart appliquee aux benchmarks medicaux : les metriques devenues cibles cessent d'etre de bonnes metriques (Section Discussion, p. 7).
- Approche lifecycle (pas snapshot) — distingue creation, maintenance, gouvernance.

**Faiblesses :**
- Meta-analyse qualitative, pas quantitative — pas de metriques formelles pour evaluer les criteres (scoring subjectif).
- Ne propose pas de nouveau benchmark, seulement un cadre d'evaluation des benchmarks existants.
- Pas de resultats experimentaux sur des modeles — aucun LLM n'est teste.
- Les 3 deficiences identifiees sont largement connues dans la communaute (contamination, deconnexion clinique) — la nouveaute est dans la systematisation, pas dans les constats.

**Questions ouvertes :**
- Comment operationnaliser les 46 criteres en un score automatise ?
- Les benchmarks recents (MEDIC P073, CLEVER P072) passent-ils le test MedCheck ?

### Formules exactes
Aucune formule mathematique — framework qualitatif avec checklist. [HEURISTIQUE]
Lien glossaire AEGIS : N/A

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (evaluation de l'alignement — SECONDAIRE), δ¹ (N/A), δ² (N/A), δ³ (N/A)
- **Conjectures :** C6 (reproductibilite des evaluations) — SUPPORTEE FORTEMENT : la meta-analyse demontre que la majorite des benchmarks ne sont pas reproductibles ; C7 (Goodhart's law sur les metriques de securite) — SUPPORTEE
- **Decouvertes :** D-018 (benchmarks medical saturated) — CONFIRMEE par l'analyse de 53 benchmarks
- **Gaps :** G-003 (metriques composites de securite clinique) — ADRESSE conceptuellement via le critere "safety-critical evaluation" ; G-025 (benchmark lifecycle governance) — CREE comme nouveau gap
- **Mapping templates AEGIS :** N/A — pas de focus attaque/defense

### Citations cles
> "A profound disconnect from clinical practice, a crisis of data integrity due to unmitigated contamination risks, and a systematic neglect of safety-critical evaluation dimensions." (Section Abstract, p. 1)
> "Continuing with the status quo is not only scientifically unsound but also clinically irresponsible." (Section 5.1, Discussion, p. 7)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 5/10 |
| Reproductibilite | Moyenne — criteres publics, mais evaluation qualitative subjective |
| Code disponible | Non specifie |
| Dataset public | Non (meta-analyse de benchmarks publics) |
