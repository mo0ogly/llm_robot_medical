## [Protect AI, 2023-2026] — LLM Guard: Comprehensive Security Scanner for LLM Inputs/Outputs

**Reference :** github.com/protectai/llm-guard (~2800 stars, MIT license)
**Revue/Conf :** Aucune publication academique dediee — toolkit industriel Protect AI (blog posts, docs, conferences securite)
**Lu le :** 2026-04-11 (scoped verification RUN VERIFICATION_DELTA3_20260411)
> **PDF Source**: N/A — framework GitHub (docs reference : https://github.com/protectai/llm-guard)
> **Statut**: [INDUSTRIEL] — toolkit multi-scanner production-ready
> **Institution**: Protect AI (societe securite LLM, creation 2023)

### Description (abstract industriel)
> "Comprehensive tool to fortify the security of LLMs with 15 prompt scanners and 21 output scanners for sanitization, detection of harmful language, prevention of data leakage, and resistance against prompt injection attacks."
> — Source : Protect AI docs, 2023-2026

### Resume (5 lignes)
- **Probleme :** Securiser les applications LLM en production necessite couverture large de patterns de risque (toxicite, PII, secrets, prompt injection)
- **Methode :** Toolkit Python avec 15 input scanners + 21 output scanners (36 au total), architecture multi-scanner parallele. Interface commune `scan(text) -> (sanitized_text, is_valid, risk_score)` (Protect AI docs, 2023-2026)
- **Donnees :** N/A — framework, pas etude empirique
- **Resultat :** Architecture deployable en middleware production (~2800 stars GitHub, license MIT)
- **Limite :** **Detection-based, PAS specification-based** — identifie des patterns (toxicite, PII, secrets) plutot que de verifier une specification formelle metier

### Analyse critique
**Forces :**
- Production-ready, open-source MIT, large couverture (36 scanners)
- Architecture modulaire — scanners activables independamment
- Couverture output scanning equivalent fonctionnel au niveau output
- Scanners specialises par classe de probleme : `PromptInjection`, `Toxicity`, `Anonymize`, `BanTopics`, `Code`, `TokenLimit`, `Secrets`, `BiasDetection`, `Deanonymize`, `NoRefusal`, `Regex`, `Sensitive`

**Faiblesses :**
- **Detection-based (scanners ML/regex) PAS specification-based** : LLM Guard identifie des patterns, AEGIS δ³ verifie une specification formelle metier avec contraintes relationnelles (tension ∈ [50,800]g ∧ phase_chirurgicale = suture ∧ tool ∈ {needle_driver, sutures}). La difference est categorielle : detection vs verification
- **Pas de notion Allowed(i) contextuelle** — les scanners operent en isolation sur le texte, sans connaissance de l'etat operationnel ou du contexte metier
- **Pas de specialisation medicale** — aucun scanner specifique HL7, SNOMED-CT, FDA 510(k), contraintes biomecaniques
- **Architecture paralleles independants** — les 36 scanners operent en paralleles et independamment. AEGIS AllowedOutputSpec est une specification centralisee avec contraintes coherentes (un changement de phase chirurgicale propage a toutes les contraintes)

**Questions ouvertes :** ASR/FPR de chaque scanner, benchmarks academiques, comparaison quantitative avec LlamaFirewall PromptGuard 2.

### Formules exactes
Pattern technique : interface `scan(text) -> (sanitized_text, is_valid, risk_score)` composee via `InputScanner`/`OutputScanner` orchestrateur (Protect AI docs, 2023-2026).

### Pertinence these AEGIS
- **Couches delta :** **δ¹ (input sanitization) + δ² (detection output)** principalement, PAS δ³ au sens strict (specification formelle ex ante)
- **Conjectures :** reference ecosystem qui delimite la frontiere **detection vs verification** — renforce la specificite d'AEGIS δ³ comme specification-driven (contribution distinctive)
- **Decouvertes :** supporte D-014 (necessite de defense externe multi-couches a l'alignement)
- **Gaps :** delimite **G-001 (implementation δ³)** — LLM Guard montre que la detection-based couvre δ¹+δ² mais laisse G-001 ouvert
- **Integration VERIFICATION_DELTA3_20260411 :** reference de **perimetre** pour montrer que detection (LLM Guard, 36 scanners) ≠ verification formelle (AEGIS AllowedOutputSpec). Delimite le contour distinctif d'AEGIS δ³

### Analyse Keshav
Voir fichier analyst source: `research_archive/_staging/analyst/P134_analysis.md` (renumerote P134 -> P133 a l'integration LIBRARIAN 2026-04-11).

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 — reference ecosystem (delimitation perimetre) |
| Reproductibilite | Haute — code open-source MIT, docs completes |
| Code disponible | Oui — https://github.com/protectai/llm-guard |
| Dataset public | N/A (framework, pas dataset) |
| Domaine | Generic (LLM security) |
| Nature | [INDUSTRIEL] — pas de paper peer-reviewed |
| Pattern match δ³ | NON (detection-based, pas specification-driven) |
| Coverage δ | δ¹ + δ² principalement |
