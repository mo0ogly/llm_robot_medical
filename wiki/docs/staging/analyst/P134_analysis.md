# P134 — LLM Guard: Comprehensive Security Scanner for LLM Inputs/Outputs

**Tag** : [INDUSTRIEL] — framework open-source (pas de paper academique dedie)
**URL** : https://github.com/protectai/llm-guard
**Stars GitHub** : ~2800
**License** : MIT
**Institution** : Protect AI (societe securite LLM)
**Creation** : 2023
**Lu le** : 2026-04-11 (scoped verification RUN VERIFICATION_DELTA3_20260411)

## Description (~100 mots)

LLM Guard est un toolkit industriel open-source developpe par **Protect AI** pour renforcer la securite des applications LLM. Il propose **15 scanners d'input** et **21 scanners d'output** (36 detecteurs au total), chacun specialise dans une classe de probleme : sanitization de donnees, detection de langage nocif, prevention de fuite de donnees (PII, secrets, tokens), resistance aux attaques de prompt injection (Protect AI docs, 2023-2026). Le framework est conçu pour etre deploye en production comme middleware entre l'application et le LLM, avec chaque scanner activable independamment et producteur d'un score de risque et/ou d'une action (block, sanitize, pass).

## Pattern implementation (~100 mots)

Architecture **multi-scanner paralleles** :
- Input scanners : `PromptInjection`, `Toxicity`, `Anonymize`, `BanTopics`, `Code`, `TokenLimit`, `Secrets`, etc.
- Output scanners : `BiasDetection`, `Deanonymize`, `NoRefusal`, `Regex`, `Sensitive`, `Toxicity`, etc.

Chaque scanner implemente une interface commune `scan(text) -> (sanitized_text, is_valid, risk_score)`. Un `InputScanner` ou `OutputScanner` composite orchestre plusieurs scanners en pipeline. L'architecture est **detection-based** : chaque scanner est un classificateur/detecteur ML ou regex-based, pas un verificateur de specification formelle. Les decisions sont prises en collectif (seuil de risque agrege) ou en veto individuel.

## Comparaison avec AEGIS δ³ (~150 mots)

**Points communs** :
- Production-ready, open-source, deploye en entreprise
- Architecture modulaire (scanners ⟷ validators AEGIS)
- Couverture output scanning (equivalent fonctionnel au niveau output)

**Divergences critiques** :
- **Detection-based (scanners ML/regex) PAS specification-based** : LLM Guard identifie des patterns (toxicite, PII, secrets), AEGIS δ³ verifie une **specification formelle metier** avec contraintes relationnelles (tension ∈ [50,800]g ∧ phase_chirurgicale = suture ∧ tool ∈ {needle_driver, sutures}). La difference est categorielle : detection vs verification
- **Pas de notion Allowed(i) contextuelle** : les scanners operent en isolation sur le texte, sans connaissance de l'etat operationnel ou du contexte metier
- **Pas de specialisation medicale** : LLM Guard est generique, aucun scanner specifique HL7, SNOMED-CT, FDA 510(k), contraintes biomecaniques
- **Architecture paralleles independants** : les 36 scanners operent en paralleles et independamment. AEGIS AllowedOutputSpec est une **specification centralisee avec contraintes coherentes** (un changement de phase chirurgicale propage a toutes les contraintes)

**Verdict positionnement** : LLM Guard est un **outillage industriel de reference ecosystem** pour la securite LLM operant principalement a **δ¹ (input sanitization) + δ² (detection output)**, PAS a δ³ au sens strict (specification formelle ex ante). Il sert de **reference de perimetre** pour montrer que detection ≠ verification.

## Classification

| Champ | Valeur |
|-------|--------|
| Type | Framework industriel open-source |
| Stars GitHub | ~2800 |
| License | MIT |
| Venue | Blog posts Protect AI, docs, talks conferences securite |
| Domaine | Generic (LLM security) |
| Pertinence AEGIS | **Reference ecosystem** — delimite la frontiere detection vs verification |
| Nature | [INDUSTRIEL] — pas de paper peer-reviewed |
| Pattern match δ³ | **NON** (detection-based, pas specification-driven) |
| Coverage δ | δ¹ + δ² principalement |
