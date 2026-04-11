# P127 — How Vulnerable Are AI Agents to Indirect Prompt Injections? Insights from a Large-Scale Public Competition

**Reference :** Dziemian et al., arXiv:2603.15714, 2026
**Type :** `[PREPRINT]` — **etude empirique large-scale**
**Analyse :** 2026-04-09 (RUN-004)

## Passage 1 — Survol

Paper massif (30+ co-auteurs) analysant la vulnerabilite des agents LLM aux **Indirect Prompt Injections** via une **competition publique large-scale**. Co-auteurs cles : **Andy Zou (GCG)**, **Matt Fredrikson**, **Zico Kolter** (CMU), **Xiangyu Qi** (Shallow Alignment, P018 AEGIS), **Javier Rando** (ETH), **Kamalika Chaudhuri**.

## Passage 2 — Structure

- Introduction : deploiement agents LLM dans high-stakes settings
- Methodologie : large-scale public competition
- Resultats : chiffres non extraits par WebFetch (abstract partiel)
- Insights : vulnerabilite a l'IPI

**Categories :** cs.CR, cs.AI

## Passage 3 — Profondeur critique

### Abstract verbatim (partiel)

> "LLM based agents are increasingly deployed in high stakes settings where they process external data sources such as emails, documents, and code repositories..."

**[INCOMPLET]** Le reste de l'abstract n'a pas ete recupere par WebFetch. **Action :** telecharger PDF.

### Forces

- **30+ co-auteurs** incluant plusieurs auteurs majeurs en LLM security
- **Competition publique large-scale** — methodologie reproductible, dataset communautaire
- **Focus IPI** — vecteur le plus pertinent pour AEGIS (HL7 = IPI via PACS)
- **Collaboration multi-institutions** (CMU, ETH, OpenAI probable, Meta, UCSD)
- **High-stakes settings** explicite

### Faiblesses (preliminaires)

- **Domaine** : emails/docs/code, **PAS medical**
- **Abstract incomplet** dans le WebFetch
- **Competition bias** : participants optimisent le leaderboard, pas la generalite
- Coordination heavy (30+ auteurs) : methodologie potentiellement fragmentee

### Pertinence these AEGIS

**Mapping delta :**
- delta-0 : testee implicitement (agents RLHF standard)
- delta-1 : system prompt agents
- **delta-2** : CIBLEE (detection IPI dans donnees externes)
- delta-3 : probablement non testee

**Conjectures :**
- **C1** : probable SUPPORT (si ASR eleve)
- **C2** : probable SUPPORT (si aucune defense ne tient)
- **C7 (IPI > DPI en danger)** : **SUPPORT CENTRAL** — paper entierement sur IPI

**Decouvertes :**
- **D-001 (Triple Convergence)** : potentiel support empirique a large echelle
- **D-019 (nouveau potentiel)** : Competition-based benchmarking = state-of-art methodologie

**Contribution AEGIS :**

1. **Baseline empirique IPI** large-scale → comparaison avec les 48 scenarios AEGIS (dont ceux IPI via HL7/PACS)
2. **Format competition** — modele pour organiser une future competition AEGIS domaine medical
3. **Legitimisation academique** — inclusion d'AEGIS dans un ecosysteme reconnu

### Differentiateur AEGIS

Le paper couvre "emails, documents, code repositories" mais **pas medical records**. AEGIS comble ce gap avec :
- **HL7 segments OBX** comme vecteur IPI
- **DICOM** (imagerie medicale) comme vecteur multimodal
- **FDA protocols** comme vecteur d'autorite medicale

### Templates AEGIS impactes

Templates IPI AEGIS a comparer avec techniques gagnantes :
- #02 HL7 Injection OBX
- #11 Homoglyph Attack
- #15 Genetic OBX Homoglyph
- #19 Self-Query Metadata Injection
- #23 RAG Semi-Structured Table
- #25 Transactional Agent Unauthorized

### Actions requises

1. [ ] Telecharger PDF pour abstract complet + resultats chiffres
2. [ ] Identifier les **techniques gagnantes** de la competition
3. [ ] Comparer avec les 36 chaines AEGIS
4. [ ] Evaluer la possibilite d'organiser une **competition AEGIS Medical Red Team**
5. [ ] Citer ce paper dans le chapitre "related work" / "empirical studies"

## Classification

| SVC | Reproductibilite | Code | Dataset |
|-----|------------------|------|---------|
| **9/10** | Haute (competition) | Probable | Probable (public competition) |

**Statut :** `[PREPRINT]` — **PRIORITE P0**
