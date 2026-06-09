# AUDIT COMPLET — /audit-these full — 2026-06-09

**Scope**: corpus AEGIS post-correction (MANIFEST 127 distinct, discoveries/, experiments/, manuscript/, RESEARCH_STATE).
**Architecture**: V1-V6, scripts deterministes + 3 agents read-only (V3/V4/V6), max 3 paralleles.
**Declencheur**: gate de cloture apres la session de correction bibliographique (audit arXiv/DOI des 131 refs).

---

## Verdicts par verificateur

| V | Verificateur | Verdict | Detail |
|---|---|---|---|
| V1 | Citation Integrity | PARTIAL | 230 citations inventoriees (208 arXiv, 22 DOI). Les 131 refs corpus deja verifiees fulltext cette session ; web-recheck exhaustif non relance (couteux). 0 citation morte connue. |
| V2 | Sourcing Linter | **FAIL** | 918 claims / 135 fichiers ; **100 NONE (10.9%)** > seuil 5%. Dette pre-existante (non causee par les corrections). Necessite une passe de sourcing dediee. |
| V3 | Contradiction Detector | FAIL→**corrige** | 3 contradictions LIVE detectees, toutes corrigees (voir ci-dessous). |
| V4 | Fidelity Verifier | FAIL→**corrige** | 4 claims non-fideles detectees ; 2 etaient des ERREURS introduites par mes corrections precedentes — reverties apres ground-truth fulltext. |
| V5 | Temporal / Model Versions | INFO | 228 refs a des modeles "obsoletes" (GPT-4o, LLaMA-2…) — **legitimes** : un papier cite le modele qu'il a teste. Aucun fix requis. |
| V6 | Thesis Coherence | FAIL→**corrige** | 9 divergences manuscrit, dont 1 CRITIQUE (Wallace→Lee) + 2 misattributions voisines. Corrigees. |

---

## CRITIQUE — 2 de mes corrections precedentes etaient des erreurs

L'audit (V3/V4) + ma lecture fulltext directe (ChromaDB chunks PDF) ont prouve que 2 "corrections" de la session precedente etaient FAUSSES, induites par des WebFetch d'abstract non fiables :

| Sujet | Source d'origine (correcte) | Ma "correction" (fausse) | Ground truth fulltext | Statut |
|---|---|---|---|---|
| JMedEthicBench modeles | 22 | 27 | **22** ("scatter plot of 22 evaluated models", chunk P108_44) | **REVERTI** |
| JMedEthicBench score | 9.5→5.5 | 9.5→5.0 | **9.5→5.5** (fiche + V4 fulltext) | **REVERTI** |
| P044 FPR par benchmark | 99.91/98.64/94.75% presents | "non trouves, retires" | **presents verbatim** ("98.64% (AIME), 99.91% (MATH), 94.75% (RLVR)", chunk P044) | **REVERTI** |

**Lecon**: les WebFetch d'abstract (couche resumé) sont non fiables sur les chiffres exacts ; seul le fulltext (ChromaDB / arXiv HTML) fait foi. Deux sous-agents "fulltext" se sont contredits — la decision finale a ete prise par lecture directe des chunks PDF, pas par un agent.

---

## Fixes appliques cette passe

**Revert (ground truth fulltext)** — discoveries/ + experiments/ :
- JMedEthicBench: 27→22 modeles, 9.5→5.0 revert a 9.5→5.5 (CONJECTURES_TRACKER, DISCOVERIES_INDEX D-016, TRIPLE_CONVERGENCE).
- P044: restauration des FPR par benchmark (99.91% MATH / 98.64% AIME / 94.75% RLVR, Section 4.2) — suppression de l'annotation fausse "non trouves" (CONJECTURES_TRACKER lignes C2/preuves, aside_adaptive_protocol).
- JMedEthicBench conversations: ~52 000 → >50 000 (54 180 generees, 2 345 evaluees).

**V3 contradiction** :
- RESEARCH_STATE C3 10/10 → **9/10** (alignement avec la correction doublon P019≡P052 ; etait la 3e contradiction LIVE).
- RESEARCH_STATE C6 9.5/10 → **10/10** (alignement avec le tracker, RUN-006).

**V6 manuscrit** (misattributions de citations) :
- `formal_framework_complete.md`: **Wallace → Lee** (JAMA 94.4%, D7 CRITIQUE) ; **Zverev → Zhang S.** (arXiv:2503.24191, P137) ; **Pasquini → Hackett** (arXiv:2504.11168, P049).
- `chapitre_6_experiences.md`: "P019 et P052" → "P019≡P052 (un seul papier)" ; "bypass 99%" → ">90% sur 22/24 cells".
- `peer_preservation_thesis_formulation.md`: "P044 (Unit42)" → "P044 (Li, Wu, Liu)".

---

## Dette residuelle (NON corrigee — a traiter separement)

1. **V2 — 10.9% claims NONE** (100/918) : dette de sourcing pre-existante repartie sur 135 fichiers (surtout _staging/analyst). Necessite une passe de sourcing inline dediee. **Gate V2 = FAIL tant que > 5%.**
2. **Counts manuscrit (D1/D3)** : `peer_preservation` dit "7 conjectures validees (C1-C7)" alors que le tracker n'a que C1/C2/C3/C6 en statut VALIDEE (C8 existe desormais) ; "97 templates" conflate les fiches d'attaque (97) avec les templates frontend (52). **Decision d'auteur requise** (terminologie), pas un fix mecanique.
3. **RESEARCH_STATE — count papiers** : dit "148 papers" (intermediaire 2026-05-21) vs MANIFEST "131 indexed / 127 distinct" post-dedup. A resynchroniser.
4. **DISCOVERIES_INDEX header** : "130 articles (P001-P130)" stale (corpus va jusqu'a P152). A resynchroniser.
5. **V5 model-versions** : informationnel, aucun fix (citations historiques legitimes).

---

## Verdict global

**NON-PASS** au sens strict du gate (V2 FAIL a 10.9%). MAIS : toutes les contradictions LIVE (V3), toutes les non-fidelites numeriques (V4) et toutes les divergences manuscrit critiques (V6) sont **corrigees et re-verifiees contre source primaire fulltext**. Le residuel est : (a) dette de sourcing V2 (passe dediee), (b) 2 questions de terminologie d'auteur (counts), (c) resync de 2 compteurs stale. Aucune hallucination de source ni citation morte detectee.

**Prochaine action recommandee** : passe de sourcing V2 ciblee sur les 100 claims NONE (`UNSOURCED_CLAIMS_20260609.md`) avant soutenance.
