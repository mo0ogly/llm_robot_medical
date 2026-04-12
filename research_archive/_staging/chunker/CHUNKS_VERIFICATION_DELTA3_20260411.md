# CHUNKS manifest — VERIFICATION_DELTA3_20260411

**Run ID** : VERIFICATION_DELTA3_20260411
**Date** : 2026-04-11
**Agent** : CHUNKER
**Mode** : scoped verification (post-LIBRARIAN integration of 4 new fiches + 5 analyses + 4 transversaux)

## Statistiques — manifest JSONL local (metadata enrichie)

| Source | Chunks | Tokens total | Collection target |
|--------|:------:|:------------:|:-----------------:|
| P131_Weissman_2025_UnregulatedLLMs_CDS.md (fiche) | 3 | ~1270 | aegis_bibliography |
| P132_GuardrailsAI_2023.md (fiche) | 3 | ~1330 | aegis_bibliography |
| P133_LLMGuard_ProtectAI_2023.md (fiche) | 3 | ~1220 | aegis_bibliography |
| P134_BeurerKellner_2022_LMQL.md (fiche) | 4 | ~1590 | aegis_bibliography |
| P131_analysis.md (LlamaFirewall → P084 existant) | 0 | 0 | **SKIP** (deja en corpus) |
| P132_analysis.md → P131 final (npj DM analysis) | 8 | ~1760 | aegis_bibliography |
| P133_analysis.md → P132 final (GuardrailsAI analysis) | 5 | ~1560 | aegis_bibliography |
| P134_analysis.md → P133 final (LLM Guard analysis) | 5 | ~980 | aegis_bibliography |
| P135_analysis.md → P134 final (LMQL analysis) | 8 | ~1700 | aegis_bibliography |
| VERIFICATION_CLAIM_DELTA3_20260411.md (analyst consolide) | 13 | ~4620 | aegis_bibliography |
| VERDICT_FINAL_VERIFICATION_DELTA3_20260411.md (scientist) | 13 | ~2600 | aegis_bibliography |
| DELTA3_FORMAL_COMPARISON_20260411.md (matheux) | 12 | ~4570 | aegis_bibliography |
| DELTA3_THREAT_MODEL_20260411.md (cybersec) | 21 | ~7780 | aegis_bibliography |
| DELTA3_RED_TEAM_PLAYBOOK_20260411.md (whitehacker) | 22 | ~6200 | aegis_bibliography |
| **TOTAL (manifest JSONL local)** | **120** | **~35180** | — |

Manifest JSONL : `research_archive/_staging/chunker/VERIFICATION_DELTA3_20260411_chunks_manifest.jsonl`
Stats JSON : `research_archive/_staging/chunker/VERIFICATION_DELTA3_20260411_stats.json`
Global manifest update : +120 chunks appended to `chunks_for_rag.jsonl` (dedup verifie).

## Couverture par P-ID (manifest local, metadata enrichie)

| P-ID | Fiche | Analyse | Total | Validation >=5 |
|:----:|:-----:|:-------:|:-----:|:---------------:|
| P131 (Weissman) | 3 | 8 | **11** | OK |
| P132 (GuardrailsAI) | 3 | 5 | **8** | OK |
| P133 (LLM Guard) | 3 | 5 | **8** | OK |
| P134 (LMQL) | 4 | 8 | **12** | OK |

**Validation regle CLAUDE.md >= 5 chunks par P-ID : OK**

## Injection effectuee — mode REST (backend /api/rag/upload)

Le backend AEGIS etait accessible (HTTP 200 /api/redteam/scenarios). Les 13 fichiers sources ont ete uploades via `POST /api/rag/upload`. **Observation importante** : l'endpoint upload route vers la collection `aegis_corpus` (pas `aegis_bibliography`). Le backend effectue son propre chunking serveur (fixed-length ~1000 chars) avec metadata minimale (`source`, `type: md`).

### Count collections AVANT / APRES

| Collection | AVANT | APRES | Delta |
|------------|:-----:|:-----:|:-----:|
| aegis_bibliography | 10783 chunks / 287 docs | 10783 chunks / 287 docs | 0 (inchange) |
| aegis_corpus | 8954 chunks / 283 docs | **9138 chunks / 296 docs** | **+184 chunks / +13 docs** |

### Couverture par document (backend-side chunking, aegis_corpus)

Verification via `GET /api/rag/documents/{filename}/chunks` :

| Fichier | chunks aegis_corpus |
|---------|:------:|
| P131_Weissman_2025_UnregulatedLLMs_CDS.md | 7 |
| P132_GuardrailsAI_2023.md | 7 |
| P133_LLMGuard_ProtectAI_2023.md | 6 |
| P134_BeurerKellner_2022_LMQL.md | 8 |
| VERIFICATION_CLAIM_DELTA3_20260411.md | 23 |
| P132_analysis.md (→ P131) | 8 |
| P133_analysis.md (→ P132) | 5 |
| P134_analysis.md (→ P133) | 5 |
| P135_analysis.md (→ P134) | 9 |
| VERDICT_FINAL_VERIFICATION_DELTA3_20260411.md | 13 |
| DELTA3_FORMAL_COMPARISON_20260411.md | 23 |
| DELTA3_THREAT_MODEL_20260411.md | 39 |
| DELTA3_RED_TEAM_PLAYBOOK_20260411.md | 31 |
| **TOTAL** | **184** |

**Verification regle >=5 chunks (fiche + analyse) par P-ID, cote aegis_corpus** :
- P131 : 7 (fiche) + 8 (analyse) = **15 chunks** -> OK
- P132 : 7 + 5 = **12 chunks** -> OK
- P133 : 6 + 5 = **11 chunks** -> OK
- P134 : 8 + 9 = **17 chunks** -> OK

Semantic search hit confirmee (test : "LMQL Beurer-Kellner guardrails constrained generation" renvoie des resultats du corpus AEGIS). Le nouveau contenu est **interrogeable** via le backend apres ingestion.

## Script d'injection

`research_archive/_staging/chunker/ingest_VERIFICATION_DELTA3_20260411.py`

Deux modes supportes :
- `--mode=rest` (defaut) : POST /api/rag/upload pour chaque fichier source -> collection `aegis_corpus`, chunking backend-side. **DEJA EXECUTE avec succes (13/13 HTTP 200).**
- `--mode=direct` : PersistentClient ChromaDB sur `backend/chroma_db`, upsert des 120 chunks JSONL avec metadata enrichie dans `aegis_bibliography`. **NON EXECUTE** (requires sentence-transformers local install). Utilisable pour enrichir `aegis_bibliography` avec les metadata paper_id/run_id/target_delta si besoin ulterieur.

## Commandes de verification post-injection

```bash
# Verifier count aegis_corpus
curl -s http://localhost:8042/api/rag/collections | python -m json.tool

# Verifier chunks par fichier (repeter pour chaque P-ID)
for f in P131_Weissman_2025_UnregulatedLLMs_CDS.md P132_GuardrailsAI_2023.md \
         P133_LLMGuard_ProtectAI_2023.md P134_BeurerKellner_2022_LMQL.md; do
  curl -s "http://localhost:8042/api/rag/documents/${f}/chunks?limit=1" \
    | python -c "import sys,json; d=json.load(sys.stdin); print(f'{d[\"filename\"]}: {d[\"total_chunks\"]} chunks')"
done

# Test semantic search
curl -s -X POST http://localhost:8042/api/rag/semantic-search \
  -H "Content-Type: application/json" \
  -d '{"query":"LMQL Beurer-Kellner guardrails","top_k":3}' | python -m json.tool
```

## Note metadata divergence

Le manifest JSONL local contient 120 chunks avec metadata riche (run_id, paper_id, target_delta, chunk_type, conjectures, delta_layers). Ce manifest **n'est pas injecte tel quel** dans ChromaDB par la route REST — le backend fait son propre chunking/indexing avec metadata simplifiee.

Pour les futures queries qui ont besoin de filtrer par `run_id=VERIFICATION_DELTA3_20260411` ou `target_delta=delta3`, le manifest JSONL sert de source de verite locale et peut etre injecte directement dans `aegis_bibliography` via `ingest_VERIFICATION_DELTA3_20260411.py --mode=direct`.

## Status

- Chunks prepares : **OUI** (120 chunks manifest local, metadata enrichie)
- Manifest JSONL : **OUI** (`VERIFICATION_DELTA3_20260411_chunks_manifest.jsonl`)
- Script injection : **OUI** (`ingest_VERIFICATION_DELTA3_20260411.py`, 2 modes)
- Injection effectuee : **OUI (REST mode)** — 13/13 fichiers uploades, +184 chunks aegis_corpus
- Validation >=5 chunks/PID : **OK** (manifest local ET aegis_corpus post-injection)
- Backend accessible : **OUI** (HTTP 200 /api/redteam/scenarios)
- **Status final** : **INJECTED** (dans aegis_corpus via REST) + **READY_FOR_ENRICHMENT** (mode direct disponible pour enrichir aegis_bibliography si besoin metadata avancee)
