# P126 — Design Patterns for Securing LLM Agents against Prompt Injections

**Reference :** Beurer-Kellner, Tramèr et al., arXiv:2506.08837, 2025
**Type :** `[PREPRINT]` — **PAPER CRITIQUE**
**Analyse :** 2026-04-09 (RUN-004)

## Passage 1 — Survol

**Paper majeur** par une equipe incluant **Florian Tramèr (ETH)** et **Edoardo Debenedetti** (auteurs de references fondatrices en LLM security). Propose un ensemble de **design patterns formels** avec **provable resistance** a la Prompt Injection pour agents LLM.

## Passage 2 — Structure

- Introduction : criticite PI pour agents avec tool access
- Principled design patterns pour provable resistance
- Analyse systematique des patterns
- Trade-offs utilite/securite
- Case studies reels

## Passage 3 — Profondeur critique

### Abstract verbatim (extrait cle)

> "In this work, we propose a set of principled design patterns for building AI agents with provable resistance to prompt injection. We systematically analyze these patterns, discuss their trade-offs in terms of utility and security, and illustrate their real-world applicability through a series of case studies."

### Forces

- **Auteurs majeurs** : Tramèr + Debenedetti + 12 autres co-auteurs ETH/industrie
- **Provable resistance** — approche formelle, pas empirique
- **Systematic analysis** + trade-offs documentes
- **Case studies** reelles

### Faiblesses (a valider sur PDF)

- **Agents generiques**, pas medical
- Preprint (non peer-reviewed encore)
- Case studies : domaines ? medical inclus ?

### Pertinence these AEGIS — ANALYSE CRITIQUE

!!! danger "RISQUE DE SCOOPING — PRIORITE P0"
    Ce paper par Tramèr et al. propose **"provable resistance"** via design patterns formels. Si ces patterns couvrent formellement ce qu'AEGIS appelle **delta-3**, l'originalite de la these doit etre **repositionnee sur le domaine medical** comme contribution principale.

**Mapping delta :**
- delta-0 : Non traite (couche modele)
- delta-1 : Probable (instruction hierarchy)
- delta-2 : Probable (isolation/filtrage)
- **delta-3** : **COEUR potentiel** — "provable resistance" = validation formelle

**Conjectures :**
- **C2 (necessite delta-3)** : **SUPPORT MAJEUR** — validation academique de reference par equipe prestigieuse
- **C3 (formal patterns > heuristiques)** : SUPPORT

**Decouvertes :**
- **D-001 (Triple Convergence)** : ce paper pourrait etre la **solution generalisee**. **CRITIQUE** pour la these AEGIS.

### Differentiateurs AEGIS vs P126

| Aspect | P126 | AEGIS |
|--------|------|-------|
| Domaine | Agents generiques | **Medical (Da Vinci Xi + HL7)** |
| Implementation | Patterns theoriques | **Systeme end-to-end (backend + frontend + RAG)** |
| Validation | Case studies | **N>=30 campagnes + Sep(M) + ASR + SVC** |
| Benchmark | Non-medical | **48 scenarios medicaux + 99 templates** |
| delta-3 concret | "Provable resistance" | **5 techniques explicites + RagSanitizer 15+ detecteurs** |
| Consequences | Impacts fonctionnels | **Consequences lethales (850g tension, freeze_instruments)** |

### ACTIONS CRITIQUES

1. [ ] **PRIORITE P0** : Telecharger le PDF IMMEDIATEMENT
2. [ ] Comparer ligne a ligne les design patterns avec l'architecture AEGIS
3. [ ] Identifier si les case studies incluent le domaine medical
4. [ ] Si oui : AEGIS doit se differencier sur un axe (implementation formelle avec Sep(M) ? benchmark specifique ? RagSanitizer ?)
5. [ ] Si non : AEGIS garde le **domaine medical** comme contribution unique
6. [ ] Mettre a jour POSITIONNEMENT_THESE.md avec cette comparaison

### Templates AEGIS impactes

Les 99 templates AEGIS doivent etre **testes contre les design patterns** de ce paper pour identifier lesquels passent les patterns formels.

## Classification

| SVC | Reproductibilite | Code | Dataset |
|-----|------------------|------|---------|
| **10/10** | Haute (patterns documentes) | [A VERIFIER] | N/A |

**Statut :** `[PREPRINT]` — **PRIORITE P0 ABSOLUE**
