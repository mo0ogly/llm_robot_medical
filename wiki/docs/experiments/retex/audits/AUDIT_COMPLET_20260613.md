# AUDIT COMPLET — /audit-these full — 2026-06-13

> **Auditeur** : audit-these v2.1 (session de cloture, post RR-RUN10-001)
> **Perimetre** : corpus P001-P155 (155 papers), delta depuis AUDIT_COMPLET_20260612
> **Delta audite** : (a) fix P-ID FIX-PID-COLLISION-20260612 (P137/P138 duplicates -> P154/P155),
> (b) session research-director 2026-06-13 (note de positionnement RR-RUN10-001 + propagation),
> (c) re-scan complet V2/V5 pour non-regression.

---

## Verdict global : PASS avec dettes documentees (inchangees) + 3 remediations delta

| Verificateur | Verdict | Detail |
|--------------|---------|--------|
| V1 Citations | **PASS** | Note de positionnement : 12 arXiv IDs extraits (`CITATIONS_AUDIT_20260613.json`), tous deja verifies au corpus — P151 (RUN-010 fulltext), P153 (RUN-011 + scoped verification), 4 IDs externes via STEP 0 dedup + fiche P151 (refs 54/46/53/50), 5 frameworks δ³ via D-029/VERIFICATION_DELTA3_20260411. 0 citation inventee, 0 invalide. P154/P155 : rows MANIFEST avec arXiv 2602.16935 / 2603.22489 (heritees du fix, fiches renommees). |
| V2 Claims | **FAIL nominal — dette stable, 0 regression** | 100/918 NONE (10.9%) sur 135 fichiers — IDENTIQUE au 2026-06-12 et au 2026-06-10. Aucun nouveau fichier en dette : la note de positionnement est a 0/17 NONE (lint cible session). Dette concentree inchangee : faux positifs linter (pattern `(Abstract)`) + M005-M009 + P029/P030/P036/P040/P044. Rapport : `UNSOURCED_CLAIMS_20260613.md`. |
| V3 Contradictions | **PASS apres 3 remediations** | (1) P143:38 referencait "attaques MCP (P138, P139)" — IDs pre-renumerotation (P138 actuel = FlippedRAG/RAG, P139 = CorruptRAG/RAG, ni l'un ni l'autre MCP) ; corrige en (P152, P155), les deux fiches MCP reelles du corpus. Cross-ref manquee par le fix d'hier (qui n'avait traite que P145/P140). (2) P155:51 : auto-reference perimee "P138 fournit un threat model MCP generique" (ancien ID de Huang) -> "P155 (ce papier)". (3) DIRECTOR_BRIEFING_RUN011 : erratum post-hoc ajoute — C5 etait deja 9/10 (RUN-009, CorruptRAG) et non 8.5/10 ; mention du gel C1 (2026-06-12, posterieur au briefing). Meme pattern que l'erratum RUN-010 du 06-12. |
| V4 Fidelite | **PASS** | 3/3 spot-checks delta exact-match : (a) "plug-and-play adaptive agent... 10+ multimodal strategies... epsilon-greedy" — verbatim dans le chunk ChromaDB P151 (Section 2.6, p.20) ; (b) "grasp tension 50-800 g / forbidden_tools / HL7 OBX / SNOMED-CT" — verbatim D-029 entry 8 ; (c) "0.24 FNR / 100% some judges" — verbatim fulltext P153 (Abstract p.1), nuance "some judges" appliquee dans la note pendant la session. Chiffres campagne de la note verifies verbatim contre campaign_manifest.json (session, 3/3). |
| V5 Temporal | **INFO — profil identique au 06-12** | Re-scan complet : memes familles de references a modeles anciens (GPT-4o, LLaMA-2, text-davinci-003, ...) = citations historiquement exactes des papiers sources, pas des erreurs. Rapport : `MODEL_VERSIONS_AUDIT_20260613.md`. P154/P155 (2026) : aucun staleness. |
| V6 These | **PASS** | Manuscrit inchange depuis les corrections du 06-12. Grep claims de primaute red team ("premier red team", "first autonomous red", "only autonomous") : 0 occurrence dans manuscript/*.md. Les formulations F-1..F-5 de la note de positionnement ne sont PAS encore integrees au manuscrit (action thesis-writer pendante — pas une incoherence). Compte conjectures : 8 (C1-C8), coherent tracker/RESEARCH_STATE. |

---

## Remediations appliquees ce jour (2026-06-13)

1. **P143_Maloyan_2026_AgenticCodingSecuritySoK.md:38** — cross-ref MCP corrigee : (P138, P139) -> (P152, P155). Residu du fix P-ID du 06-12 (cross-refs P145/P140 traitees, P143 manquee).
2. **P155_Huang_2026_MCPThreatModeling.md:51** — auto-reference perimee corrigee : "P138" -> "P155 (ce papier)".
3. **DIRECTOR_BRIEFING_RUN011.md** — erratum post-hoc : C5 9/10 (pas 8.5/10, revision RUN-009 anterieure au briefing) + rappel gel C1 du 06-12. Note : le snapshot research-director du 2026-06-12 (conversationnel) avait propage la valeur perimee 8.5 depuis ce briefing — aucune ecriture en dur dans les fichiers d'etat n'en a herite (verifie : RESEARCH_STATE, scoring report session = "inchanges, cf. RUN-011" sans valeur chiffree).

## Hygiene repo (hors corpus, trace pour auditabilite)

- Historique git local reecrit ce jour (messages uniquement) : chaine `0d5b3a3 -> 9e13247 -> fcb49ca -> ea306cc`.
  Cause : un `--amend` intervenu entre deux commits de session avait remplace le message du commit backend
  par celui du fix biblio et absorbe 22 fichiers stages (gotcha amend/index documente en memoire projet).
  Reparation par `git commit-tree` (aucun checkout) ; contenu verifie strictement identique avant/apres
  (diff vide vs sauvegarde) ; trailers Co-Authored-By retires conformement a la regle projet. Rien n'etait pushe.
- Deux PDFs doublons byte-identiques du survey Srivastava sous de faux P-IDs (P135/P154) supprimes
  avant commit (sha256 verifie identique au canonique P151 tracke).

---

## Dettes restantes (inchangees depuis le 06-12, non bloquantes, tracees)

| # | Dette | Priorite | Responsable |
|---|-------|----------|-------------|
| 1 | **TC-001 v3 a executer** — seule voie de cloture du gel C1. | **P0** | experimentalist |
| 2 | Linter V2 : patterns `(Abstract)` etc. a ajouter a REF_PATTERN (faux positifs ~24.6% raw) | P1 | EXECUTOR (lint_sources.py) |
| 3 | Sourcing fiches methodologie M005-M009 (M009 18/21 NONE, M006 12/22, M007 12/18) | P1 | ANALYST |
| 4 | P030 (14/22 NONE), P044 (11/28), P040 (10/17) — blocs stats sans refs inline | P2 | ANALYST |
| 5 | Auteurs "Unknown et al." dans MANIFEST (P007-P011, P032, ...) | P2 | LIBRARIAN |
| 6 | `detect_contradictions.py` / `verify_fidelity.py` inexistants — V3/V4 manuels | P3 | EXECUTOR |
| 7 | verify_citations.py --file : extraction seule, pas de verification WebFetch en mode fichier | P3 | EXECUTOR |

---

## Etat des conjectures certifie a date (tracker + RESEARCH_STATE reconcilies, inchange depuis le 06-12)

| Conj | Score | Statut |
|------|-------|--------|
| C1 | 10/10 **GELE** | EN RE-VERIFICATION (TC-001 v3 pendante) |
| C2 | 10/10 | VALIDEE saturee |
| C3 | 9/10 | SUPPORTEE |
| C4 | 9/10 | Fortement supportee |
| C5 | 9/10 | Fortement supportee (CorruptRAG RUN-009 ; erratum RUN-011 pose ce jour) |
| C6 | 10/10 | VALIDEE |
| C7 | 9.5/10 | CANDIDATE A VALIDATION |
| C8 | 7/10 | CANDIDATE |

La session RR-RUN10-001 n'a modifie AUCUN score (note de positionnement = pas d'evidence nouvelle).

---

## Fichiers produits

- `CITATIONS_AUDIT_20260613.json` (V1, script --file)
- `UNSOURCED_CLAIMS_20260613.md` (V2, script full)
- `MODEL_VERSIONS_AUDIT_20260613.md` (V5, script full)
- `AUDIT_COMPLET_20260613.md` (ce rapport)
- Remediations : P143 fiche, P155 fiche, DIRECTOR_BRIEFING_RUN011 erratum
