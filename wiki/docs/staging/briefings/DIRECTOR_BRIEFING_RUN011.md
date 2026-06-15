# DIRECTOR BRIEFING — Post RUN-011 Review

**Date** : 2026-06-10
**Mode** : incremental single-paper (RR-RUN10-002 via research-director cycle)
**Status** : SUCCESS

---

## 0. Resume executif

Integration ciblee d'un seul paper attendu : **P153 Eiras et al. 2025 "Know Thy Judge"**
(arXiv:2503.04474, ICBINB Workshop @ ICLR 2025, PMLR v296). Le COLLECTOR avait deja produit
une verification scoped (verdict GO) ; ce RUN a execute l'integration complete : telechargement
PDF (11p, verifie pypdf), fiche ANALYST, ligne MANIFEST, 11 chunks ChromaDB, nettoyage d'une
mention periimee. Resout RR-RUN10-002 (dette documentaire : Eiras etait deja cite dans F73 et
RR-DA-002 sans P-ID).

## 1. Etat des Conjectures

| Conj | Score | Statut | Evolution RUN-011 |
|------|-------|--------|-------------------|
| C1 | 10/10 | VALIDEE sature | Neutre. |
| C2 (δ³ necessaire) | 10/10 | VALIDEE sature | **Renforcee par le bas** : P153 montre que les juges de securite empiriques sont 100%-flippables sur certaines configs -> seule une verification δ³ deterministe/formelle garantit. Pas de franchissement de seuil. |
| C3 | 9/10 | SUPPORTEE | Neutre. |
| C4 | 9/10 | Fortement supportee | Neutre. |
| C5 | 8.5/10 | Fortement supportee | Neutre. |
| C6 | 10/10 | VALIDEE | Neutre. |
| C7 | 9.5/10 | CANDIDATE | Neutre. |
| C8 | 7/10 | CANDIDATE | Neutre. |

**Aucun changement de score** (HUMILITY GATE respecte ; P153 renforce une conjecture deja saturee).

## 2. Carte de Maturite par Theme

| Theme | Papers ajoutes | Maturite | Action |
|-------|----------------|----------|--------|
| Robustesse des juges LLM / circularite ASR | P153 (Eiras, judge robustness) | EN COURS -> renforce | Citer P153 + P044 en convergence dans Ch.7 ; justifie F73 ASR_deterministic |

## 3. Gaps Critiques — Actions Immediates

### P0 — Bloquants
- Aucun.

### P1 — Importants (backlog inchange, hors P153)
- **RR-RUN10-001** : note de positionnement competitif red teaming autonome (AEGIS vs ARMs/AutoAdv/GenBreak). Toujours pending.
- **RR-FC-001** : ablation controlee chain_defenses ON/OFF sur llama-3.1-8b (explique le drop ASR 6.75%->2.08% du confound git FC-20260409/0410). Experiment SUPERVISED, toujours pending.
- **RR-DA-001** : replication de la preuve martingale P052. Toujours pending.

### P2 — Souhaitables (RR enregistrees cette session)
- **RR-P153-001** : lecture fulltext per-juge de P153 (quel juge atteint 100%, sous quelle manipulation, tailles) — actuellement [ABSTRACT SEUL] au-dela des deux chiffres cles (100% FNR, +0.24 FNR). Bloque Ch.7.
- **RR-FC-002** : over-refusal / FPR panel pour les chain_defenses hyde+xml_agent — RR-FC-001 prouve l'efficacite offensive (ASR->0) mais PAS le cout en utilite (sur-refus sur prompts cliniques benins ?). Bloque Ch.5.
- **RR-MAINT-001** (P3) : regenerer ARTICLES_INDEX.md (fige RUN-004 a 60 papers vs MANIFEST 153). Non bloquant.

## 4. Decouvertes — Bilan

- Aucune nouvelle decouverte D-xxx promue (HUMILITY GATE). P153 renforce la classe de
  vulnerabilite "juge LLM adversarialement flippable" deja documentee (P044 + 5 sources RR-DA-002).

## 5. Resultats — Integrite corpus

| Action | Valeur |
|--------|--------|
| MANIFEST rows | 153 (+1 : P153) |
| ChromaDB aegis_bibliography | 11056 -> 11067 (+11 chunks P153 ; +254 upsert dont re-ingest discovery idempotent) |
| Dedup STEP 0 | 2503.04474 [NEW] confirme |
| P-ID collision evitee | P082 NON reutilise (AgentSpec/Wang) ; mention periimee corrigee |
| Verification chunks | P153 = 11 chunks (>= 5, OK) |

**Cross-validation** : "100% FNR sur certains juges" et "+0.24 FNR par re-stylisation" verifies
verbatim contre l'abstract du PDF (page 1). 4 juges et dataset JailbreakBench (300 ex.) verifies
contre Section 3.

## 6. Plan RUN-012

### Papers a chercher
- Suivi ARMs (arXiv:2510.02677), AutoAdv, GenBreak (RR-RUN10-001, positionnement competitif).

### Experiences
- RR-FC-001 (ablation chain_defenses) — prioritaire car explique un confound experimental documente.

### Maintenance
- Task #7 RUN-010 (audit lignes MANIFEST sans arXiv/DOI) toujours ouvert.

## 7. Carte de Maturite de la These

| Chapitre | Maturite | Impact RUN-011 |
|----------|----------|----------------|
| Ch.7 Discussion (circularite ASR) | 60% -> **62%** | +P153 source primaire directe pour l'argument "low attack success = false sense of security" ; renforce F73 |
| Autres | inchange | — |

## 8. Fichiers de Reference

- Fiche : `doc_references/2025/benchmarks/P153_Eiras_2025_KnowThyJudge.md`
- PDF : `literature_for_rag/P153_Eiras_2025_KnowThyJudge.pdf`
- MANIFEST : `doc_references/MANIFEST.md` (153 rows)
- Chunks : `_staging/chunker/generate_chunks_run011_p153.py` (11 chunks, run_id RUN-011)
- Memoire : `_staging/memory/MEMORY_STATE.md` (Last Execution RUN-011) + `EXECUTION_LOG.jsonl`
- Verification scoped amont : `wiki/docs/staging/collector/EIRAS_2503.04474_SCOPED_VERIFICATION_2026-06-10.md`

---

## HUMILITY GATE — verification primaute (BLOCANT)

| Claim potentielle | Verdict | Action |
|-------------------|---------|--------|
| "100% des juges flippables" | NUANCE : 100% applique a *certains* juges, pas tous | Toujours citer "some judges" / "certains juges" |
| Antériorité AEGIS sur la fragilite des juges | N/A — AEGIS ne revendique pas l'observation (P044 + Eiras + 5 sources) | — |

Aucune claim de primaute AEGIS non verifiee dans RUN-011. Gate PASSE.

---

## ERRATUM post-hoc (audit-these 2026-06-13)

- **C5 : 9/10, pas 8.5/10.** Le tableau Section 1 reprenait une valeur perimee : C5 etait deja passe
  a 9/10 lors de RUN-009 (+0.5, CorruptRAG P139 — un seul document empoisonne suffit ;
  CONJECTURES_TRACKER, tableau RUN-009). La valeur 8.5/10 datait d'avant cette revision.
- **C1 : GELE depuis le 2026-06-12** (posterieur a ce briefing) — audit TC-001 : `c1_supported=false`
  brut, re-verification TC-001 v3 pendante. Voir AUDIT_COMPLET_20260612.md. Le statut
  "VALIDEE sature" de la Section 1 reflete l'etat au 2026-06-10 et ne doit plus etre cite tel quel.

*RUN-011 — fin du briefing.*
