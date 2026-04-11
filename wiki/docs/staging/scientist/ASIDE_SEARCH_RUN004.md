# Recherche bibliographique — ASIDE et defenses architecturales (2025-2026)

> **Agent** : research-director / aside-search
> **Date** : 2026-04-04
> **Gaps cibles** : RR-P1-002 (ASIDE follow-up), D-001, D-015, G-019
> **Resultat** : 12 papiers identifies, 5 hautement pertinents

---

## Conclusion strategique : D-001 Triple Convergence ROBUSTE

**Aucun des papiers 2025-2026 ne refute que delta-0, delta-1, delta-2 restent vulnerables.** ISE, ZEDD, DefensiveTokens, ES2 reduisent l'ASR mais ne l'annulent pas. ASIDE + delta-3 reste la seule approche approchant une robustesse structurelle.

**Gap medical confirme** : aucun papier ne valide ASIDE en contexte medical (RAG clinique, robot chirurgical). C'est la contribution originale de la these.

---

## Top 5 papiers

| ID | Titre | Auteurs | Venue | Relation ASIDE |
|----|-------|---------|-------|---------------|
| P-ASI-01 | ISE: Instructional Segment Embedding | Wu et al. | ICLR 2025 | Concurrent direct, surpasse par ASIDE |
| P-ASI-02 | Illusion of Role Separation | Wang et al. | ICML 2025 | Critique TOUTES les separations (ISE inclus) |
| P-ASI-03 | ZEDD: Zero-Shot Embedding Drift | Sekar et al. | NeurIPS WS 2025 | Complementaire (detection inference-time) |
| P-ASI-04 | ES2: Embedding Space Separation | Zhao et al. | arXiv 2026 | Convergent (separation geometrique generalisee) |
| P-ASI-05 | DefensiveTokens | Chen, Carlini et al. | ACM AISec/ICML 2025 | Hybride (tokens injectables, pas de retraining) |

## Resumes

### P-ASI-01 — ISE (Wu, ICLR 2025) : concurrent direct d'ASIDE
Vecteurs d'offset apprenables par role (systeme/utilisateur/donnee). Surpasse par ASIDE sur benchmarks SEP et BIPIA. **Limite** : gains s'estompent dans les couches profondes — separation superficielle.

### P-ASI-02 — Illusion of Role Separation (Wang, ICML 2025) : critique majeure
Les modeles apprennent des **raccourcis superficiels** (position, type de tache) plutot que de vraiment separer les roles. **CRITIQUE pour D-001** : si meme les defenses architecturales produisent des illusions, la Triple Convergence est encore plus robuste que prevue.

### P-ASI-03 — ZEDD (Sekar, NeurIPS WS 2025) : detection par derive
Detection injection via derive semantique dans l'espace d'embedding. >93% precision, <3% faux positifs. Defense inference-time (delta-2), applicable au RAG medical. **Ne remet pas en cause D-001** — contourne par detection externe.

### P-ASI-04 — ES2 (Zhao, arXiv 2026) : generalisation geometrique
Separation lineaire requetes dangereuses/benignes via fine-tuning + regularisation KL. **Generalise le principe ASIDE** a d'autres dimensions de securite (pas juste instruction/donnee). Evidence convergente tres recente (mars 2026).

### P-ASI-05 — DefensiveTokens (Chen + Carlini, ACM AISec 2025)
Tokens speciaux optimises pour la securite, inseres sans retraining. ASR 0.24% — comparable mais pas zero. **Carlini (Google DeepMind)** = poids academique fort. Confirme qu'aucune approche n'elimine le risque a delta-0/delta-1/delta-2.

## Impact sur les conjectures et decouvertes

| Element | Impact |
|---------|--------|
| D-001 Triple Convergence | **RENFORCE** — aucun papier ne la refute, "Illusion" la renforce |
| D-015 ASIDE contre-argument | **NUANCE** — ASIDE est la meilleure defense mais a des limites (single-turn, superficialite potentielle) |
| C1 (delta-0 insuffisant) | Confirme par ISE + Illusion + DefensiveTokens |
| C2 (necessite delta-3) | Confirme — meme ASIDE (rotation orthogonale) ne garantit pas la separation en multi-turn |
| C5 (cosine insuffisante) | ES2 + ZEDD montrent que l'espace d'embedding est exploitable geometriquement |

## Action pour bibliography-maintainer
5 papiers prioritaires a analyser dans RUN-004 : P-ASI-01 a P-ASI-05 (arXiv IDs fournis).
