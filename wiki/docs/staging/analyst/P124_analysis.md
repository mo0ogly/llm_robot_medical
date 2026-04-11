# P124 — CAPTURE: Context-Aware Prompt Injection Testing and Robustness Enhancement

**Reference :** Kholkar & Ahuja, arXiv:2505.12368, ACL LLMSec Workshop 2025
**Type :** `[PREPRINT]` → ACL accepted
**Analyse :** 2026-04-09 (RUN-004)

## Passage 1 — Survol

Premier benchmark **context-aware** pour Prompt Injection. Identifie deux problemes des guardrails actuels : **FN eleves** (attaques ratees) et **FP excessifs** (over-defense). Propose CaptureGuard, modele entraine sur le dataset genere.

## Passage 2 — Structure

- Introduction : limites benchmarks statiques
- CAPTURE benchmark : context-aware avec minimal in-domain examples
- Experimentation : FN/FP sur guardrails existants
- CaptureGuard : modele entraine sur CAPTURE
- Generalisation : transfert vers benchmarks externes

## Passage 3 — Profondeur critique

### Abstract verbatim (extrait cle)

> "Our experiments reveal that current prompt injection guardrail models suffer from high false negatives in adversarial cases and excessive false positives in benign scenarios, highlighting critical limitations."

### Forces

- **Premier benchmark context-aware** — contribution methodologique claire
- **Double metrique FN/FP** — reconnaissance du trade-off over-defense souvent ignore
- **CaptureGuard** valide l'approche avec un modele concret
- **Generalisation** demontree sur benchmarks externes
- Peer-reviewed (ACL LLMSec Workshop 2025)

### Faiblesses

- Pas de tests en **domaine medical** (HL7, FDA, DICOM)
- Pas de comparaison avec delta-3 formel
- Metriques FN/FP sans correction pour la **rarete des attaques reelles** (base rate fallacy)
- Kholkar & Ahuja : pas de reputation majeure — paper solide mais pas fondateur

### Pertinence these AEGIS

**Mapping delta :**
- delta-2 : coeur du travail (guardrail context-aware)
- delta-3 : partiel (CaptureGuard = delta-2 renforce, pas delta-3)

**Conjectures :**
- **C1** : SUPPORT (guardrails delta-2 ont FN eleves)
- **C2** : SUPPORT par contraste (CaptureGuard ameliore delta-2 mais ne propose pas delta-3)
- **C5 (over-defense)** : nouvelle evidence pour cette conjecture potentielle

**Contribution AEGIS :**
- AEGIS peut integrer CAPTURE comme **16e detecteur RagSanitizer** (context-aware)
- Benchmark CAPTURE applicable aux 99 templates AEGIS pour mesure FN/FP

**Decouverte potentielle :** **D-017 Over-defense trade-off** — les guardrails efficaces en FN augmentent FP.

### Action requise
- [ ] Telecharger PDF pour extraction formules et methodologie
- [ ] Verifier disponibilite dataset CAPTURE public
- [ ] Tester les 99 templates AEGIS sur CAPTURE si disponible

## Classification

| SVC | Reproductibilite | Code | Dataset |
|-----|------------------|------|---------|
| 8/10 | Moyenne | [A VERIFIER] | [A VERIFIER] |
