# RR-DA-002 : Juges SAFETY vulnerables — CONFIRME

> **Date** : 2026-04-04 | **Statut** : RESOLVED — [HYPOTHESE CONFIRMEE — EVIDENCE FORTE]
> **Impact** : TOUTES les ASR basees sur LLM-as-Judge sont potentiellement invalides

## 5 papiers independants

| Papier | arXiv | Juges SAFETY ? | Flip rate | Venue |
|--------|-------|---------------|-----------|-------|
| Schwinn et al. (Coin Flip) | 2603.06594 | OUI (AegisGuard, LlamaGuard-3) | AUROC 0.48-0.64 | Preprint 2026 |
| Eiras et al. (Know Thy Judge) | 2503.04474 | OUI | 100% certains juges | ICLR 2025 WS |
| Li et al. (RobustJudge) | 2506.09443 | PARTIEL | 100% Combined Attack | Preprint 2025 |
| Almasoud et al. (SoK LaaJ) | 2603.29403 | SoK 863 travaux | Crise systemique | Preprint 2026 |
| Maloyan et al. (PI attacks) | 2504.18333 | General | 73.8% PI | Preprint 2025 |

## Recommandation ASR_deterministic (3 couches)

1. **Juge deterministe** : pattern matching, non-flippable par construction
2. **Ensemble heterogene** : vote majoritaire Llama + Qwen + Gemma
3. **Validation adversariale** : mini-benchmark AdvJudge-Zero pre-campagne, rejet si FPR > 10%

## Papiers a integrer : P081 (Schwinn, arXiv:2603.06594) + P082 (Eiras, arXiv:2503.04474)
