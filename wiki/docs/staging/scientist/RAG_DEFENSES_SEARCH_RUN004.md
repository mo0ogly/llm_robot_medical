# Recherche bibliographique — Defenses RAG Poisoning (2025-2026)

> **Agent** : research-director / rag-defense-search
> **Date** : 2026-04-04
> **Gaps cibles** : G-017 (detection RAG poisoning), G-019 (defense compound attacks)
> **Resultat** : 7 papiers identifies, tous post-2024

---

## Tableau de synthese

| ID | Titre | Auteurs | Annee | Venue | Gap |
|----|-------|---------|-------|-------|-----|
| P-RAG-D1 | GMTP: Safeguarding RAG Pipelines | Kim et al. | 2025 | ACL 2025 (Findings) | G-017 |
| P-RAG-D2 | RAGuard: Secure RAG against Poisoning | Anon | Oct 2025 | arXiv | G-017, G-019 |
| P-RAG-D3 | RevPRAG: LLM Activation Analysis | Dai et al. | 2025 | EMNLP 2025 (Findings) | G-017 |
| P-RAG-D4 | RAGPart & RAGMask: Retrieval-Stage Defenses | Anon | Dec 2025 | arXiv | G-017, G-019 |
| P-RAG-D5 | RAGDefender: Rescuing the Unpoisoned | Anon | Nov 2025 | arXiv | G-017, G-019 |
| P-RAG-D6 | RAGShield: Provenance-Verified Defense-in-Depth | Anon | Avr 2026 | arXiv | G-019 |
| P-RAG-D7 | RAG Security: Formalizing the Threat Model | Arzanipour et al. | Sep 2025 | arXiv | G-017, G-019 |

## Top 5 resumes

### 1. GMTP (ACL 2025) — 16eme detecteur RagSanitizer
Detection par gradient de tokens empoisonnes. Masquage + MLM. >90% des documents empoisonnes elimines. Code dispo GitHub. **Integrable directement comme 16eme detecteur.**

### 2. RAGuard (Oct 2025) — Filtrage multi-couche adaptatif
Expansion top-N + perplexite chunk-par-chunk + similarite textuelle. 5 datasets, 6 attaques dont 2 adaptatives. Compatible Ollama + ChromaDB.

### 3. RAGDefender (Nov 2025) — Post-retrieval sans LLM supplementaire
Clustering pour separer passages legitimes/adversariaux. **ASR Gemini de 0.89 a 0.02.** Architecture-agnostique. Critique pour notre 73.3% residuel.

### 4. RevPRAG (EMNLP 2025) — Activations internes
Signature neuronale des reponses empoisonnees. 98% vrais positifs, ~1% faux positifs. Oracle de reference.

### 5. RAGPart & RAGMask (Dec 2025) — Defenses au retrieveur
Fragmentation + masquage au niveau retrieveur. Complementaire GMTP. 2 benchmarks, 4 strategies poisoning.

## Architecture de defense proposee (4 couches)

1. **Pre-ingestion** : RAGShield (attestation cryptographique)
2. **Au retrieveur** : RAGPart + RAGMask (fragmentation + masquage)
3. **Post-retrieval** : RAGDefender (clustering) — intervention directe sur ASR 73.3%
4. **Runtime** : RevPRAG (monitoring activations)

GMTP = **16eme detecteur** naturel du RagSanitizer existant.

## Action pour bibliography-maintainer

Ces 7 papiers doivent etre analyses par les agents ANALYST + CYBERSEC + WHITEHACKER dans le prochain RUN-004. Indexation : P-RAG-D1 a P-RAG-D7 (ou P061-P067 dans la numerotation globale).
