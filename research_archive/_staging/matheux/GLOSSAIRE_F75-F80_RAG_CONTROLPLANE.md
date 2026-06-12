# Glossaire AEGIS — F75 a F80 (RAG poisoning & control-plane decoding)

*Extension du `GLOSSAIRE_DETAILED.md` (qui depasse la limite 800 lignes — append impossible, d'ou ce module satellite).*
*Detail complet + grilles d'hypotheses + regime de validite + Sep(M) : `FORMULAS_RAG_POISONING_20260612.md`.*
*Batch : FORGE-RAG-CP-20260612. Equations extraites verbatim du fulltext PDF (P137/P138/P139). Statut : PROPOSE.*

| F-ID | Nom | Enonce (notation originale) | Tag | Source |
|------|-----|-----------------------------|-----|--------|
| **F75** | Retrieval dense top-N | `D(q,N)=argTop-N sim(q,d_k)`, `sim=⟨E(q),E(d_k)⟩` (dot product) | [ALGORITHME] | P139, Sec. 2, p.2 (+ Karpukhin 2020 DPR) |
| **F76** | Hit-Ratio Maximization (CorruptRAG single-doc) | `max_P (1/|Q|) Σ I(RAG(D̂(q_i,N),q_i)=A_i)` s.c. `|P_i|=1`, `D̂=D∪P` | [EMPIRIQUE] / resolution [HEURISTIQUE] | P139, Sec. 4.1, **Eq.(1)**, p.4 |
| **F77** | Perte contrastive d'imitation retriever | `L=-(1/|D|)Σ log[R_i(q,d+)/(R_i(q,d+)+ΣR_i(q,d-))]`, Adam | [ALGORITHME] | P138, Sec. 3.3, **Eq.(2)**, p.4 |
| **F78** | Perte du trigger adversarial (opinion shift) | `max_w{M_i(q,T_pat;w)+λ1·log P_g(T_pat;w)+λ2·f_nsp(d_t,T_pat;w)}`, λ∈[0,1] | [HEURISTIQUE] | P138, Sec. 3.4, **Eq.(3)**, p.5 |
| **F79** | Metriques opinion-shift | Top3v, RASR, BRank (rank) ; OMSR, ASV (reponse) ; 20% user-cognition | [EMPIRIQUE] | P138, Sec. 4, p.5-6 ; cognition Abstract p.1 |
| **F80** | Masque de logits per-token (control plane / CDA) | softmax temperee `Eq.(2)`: `exp(z[i]/T)/Σexp(z[j]/T)` ; masque `ẑ[i]=z[i] si token_i∈Valid(G,x_{1:n}), sinon -∞` | [ALGORITHME] | P137, **Eq.(2)** Sec.2.1 p.2 ; masque Sec.2.3 p.3 ; Fig.2 p.3 |

## Notes clefs

- **F76 — pourquoi 1 doc suffit** : succes = condition de retrieval (`p_i ∈ D̂(q_i,N)`) ∧ condition de generation, PAS un vote majoritaire (distinction explicite vs PoisonedRAG, P139 Sec. 4.1). Pipeline non-differentiable → resolution heuristique (CorruptRAG-AS/AK).
- **F80 — CDA control-to-semantic** : le masque grammatical force un prefixe affirmatif (refus mis a `-∞`) ; le modele complete ensuite l'intention. Garantie **dure** (deterministe), pas probabiliste — c'est la garantie de conformite du constrained decoding retournee contre la cible. « internal safety alignment alone cannot stop it » (P137, Abstract).
- **ASR LLM-JUGE** (a ne pas porter comme borne dure) : F76 = GPT-4o-mini (P139, Sec. 5.1.3) ; F80 = gpt-4o (P137, Sec. metriques) ; F79 = juge d'opinion.
- **Lien Sep(M)** : aucune formule neutralisee par Sep(M) eleve. F75/F76/F77-79 operent en amont (retrieval, hors-portee de Sep(M)) ; F80 sur le control plane (Sep(M) defini sur le data plane). → motive deux extensions : robustesse-retrieval + separation control-plane. Renforce C2 (δ³ cross-plane) et C5 (propagation composants externes).

*Ajoute le 2026-06-12 par MATHEUX scoped. 6 formules verbatim. Dette : re-ingerer P137/P138/P139 en `pdf_fulltext` dans ChromaDB (actuellement absents — seuls les chunks de fiche presents).*
