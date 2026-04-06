## [Weng et al., 2025] — Adversary-Aware DPO: Enhancing Safety Alignment in VLMs via Adversarial Training

**Reference :** arXiv:2502.11455v1
**Revue/Conf :** [PREPRINT] — ShanghaiTech, Sun Yat-Sen, HUST, Tsinghua
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P046_2502.11455.pdf](../../literature_for_rag/P046_2502.11455.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (75 chunks)

### Abstract original
> Safety alignment is critical in pre-training large language models (LLMs) to generate responses aligned with human values and refuse harmful queries. Unlike LLM, the current safety alignment of VLMs is often achieved with post-hoc safety fine-tuning. However, these methods are less effective to white-box attacks. To address this, we propose Adversary-aware DPO (ADPO), a novel training framework that explicitly considers adversarial. Adversary-aware DPO (ADPO) integrates adversarial training into DPO to enhance the safety alignment of VLMs under worst-case adversarial perturbations. ADPO introduces two key components: (1) an adversarial-trained reference model that generates human-preferred responses under worst-case perturbations, and (2) an adversarial-aware DPO loss that generates winner-loser pairs accounting for adversarial distortions. By combining these innovations, ADPO ensures that VLMs remain robust and reliable even in the presence of sophisticated jailbreak attacks. Extensive experiments demonstrate that ADPO outperforms baselines in the safety alignment and general utility of VLMs.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** L'alignement de securite post-hoc des VLMs (SFT, DPO standard) est inefficace contre les attaques white-box qui injectent des perturbations adversariales dans l'espace latent des images (Figure 1, p. 1).
- **Methode :** ADPO integre l'entrainement adversarial dans DPO via deux composantes : (1) un modele de reference entraine adversarialement (AR) qui genere des reponses preferees sous perturbations worst-case, et (2) une perte DPO adversarial-aware (AT) qui genere des paires winner-loser tenant compte des distorsions (Section 3, p. 3-4).
- **Donnees :** LLaVA-1.5-7B et LLaVA-1.6-7B ; evaluation securite sur VisualAdv, MMPGDBlank, MultiTrust, Crossmodal Jailbreak ; evaluation utilite sur MMStar, OCRBench, MM-Vet, LLaVABench (Table 1, Section 4, p. 5-6).
- **Resultat :** ADPO reduit l'ASR a quasi-0 sur presque toutes les attaques, incluant MMPGDBlank (0.5 ASR vs 33.0 pour DPO sur LLaVA-1.5) (Table 1, p. 6). Degradation d'utilite moderee mais presente (Section 4.3, p. 6).
- **Limite :** Compromis securite/utilite inevitable ; uniquement DPO comme algorithme d'alignement ; uniquement PGD pour les perturbations adversariales (Limitations, p. 7).

### Analyse critique
**Forces :**
- Adresse directement la faiblesse fondamentale du DPO standard : l'absence de robustesse aux perturbations adversariales dans l'espace latent image (Figure 1, p. 1).
- ADPO atteint 0.5 ASR sur MMPGDBlank (vs 33.0 pour DPO standard, 76.0 pour SFT sur LLaVA-1.5), demontrant une amelioration d'un ordre de grandeur (Table 1, p. 6).
- Decomposition claire des contributions : AR-DPO (modele de reference adversarial) et AT-DPO (perte adversarial-aware) permettent une ablation precise (Table 1, p. 6 ; Figure 3, p. 6).
- AT-DPO seul est insuffisant contre les attaques cross-modales textuelles (Crossmodal Jailbreak), montrant que le modele de reference adversarial (AR) est essentiel pour generaliser au-dela des perturbations image (Section 4.2, p. 6).

**Faiblesses :**
- Trade-off securite/utilite non resolu : ADPO degrade les performances sur les benchmarks d'utilite, les auteurs le reconnaissent explicitement (Limitation 1, p. 7).
- Uniquement LLaVA-1.5 et 1.6 testes : pas de validation sur d'autres VLMs (InstructBLIP, Qwen-VL, GPT-4V).
- PGD comme seule methode de perturbation : pas de test avec C&W, AutoAttack, ou des perturbations semantiques (Limitation 3, p. 7).
- Pas d'extension a l'alignement RLHF ou IPO (Limitation 2, p. 7).
- La metrique de securite repose sur LlamaGuard (Inan et al., 2024) ; les biais de ce juge ne sont pas discutes.
- Pas d'evaluation en contexte medical multi-modal.

**Questions ouvertes :**
- Comment optimiser le trade-off securite/utilite dans ADPO ?
- L'approche adversarial-aware est-elle transferable a RLHF ou aux methodes d'alignement constitutionnel ?
- Quelle est la robustesse d'ADPO face aux attaques adaptatives qui connaissent le mecanisme de defense ?

### Formules exactes
| Formule | Source |
|---------|--------|
| L_adv = -log P(Y_p \| x_I + delta*, x_T), delta* = argmax_delta L sous \|\|delta\|\| <= epsilon | Section 3, p. 3-4 (perte adversarial sur le modele de reference) |
| L_ADPO = L_DPO(pi_theta, pi_ref_adv, D_adv) | Section 3, p. 4 (perte DPO avec reference adversariale et donnees perturbees) |
| PGD : delta_{t+1} = Proj_{epsilon}(delta_t + alpha * sign(grad_delta L)) | Section 3, p. 3 (Projected Gradient Descent pour perturbations) |

Lien glossaire AEGIS : F22 (ASR), F09 (adversarial training), F15 (Sep(M) — non utilise)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (amelioration de l'alignement DPO par entrainement adversarial), δ² (robustesse aux perturbations dans l'espace latent = filtrage au niveau des embeddings)
- **Conjectures :** C2 (supportee — la necessite de verification formelle est illustree par l'insuffisance du DPO standard), C3 (fortement supportee — l'alignement superficiel via SFT/DPO est vulnerable aux attaques white-box), C5 (supportee — interaction entre δ⁰ adversarial training et δ² robustesse embeddings)
- **Decouvertes :** D-004 (trade-off securite/utilite dans l'alignement VLM), D-010 (insuffisance du DPO standard contre white-box)
- **Gaps :** G-006 (extension a d'autres algorithmes d'alignement), G-009 (robustesse multimodale non couverte pour AEGIS), G-015 (pas d'evaluation medicale multimodale)
- **Mapping templates AEGIS :** Non directement applicable (VLM, pas LLM textuel), mais les principes d'entrainement adversarial pourraient etre adaptes aux defenses AEGIS

### Citations cles
> "ADPO achieved 0.5 and 0 ASR on MMPGDBlank" (Section 4.2, p. 6)
> "Post-hoc safety fine-tuning (SFT and DPO) is less effective on white-box attack" (Figure 1, p. 1)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 |
| Reproductibilite | Haute annoncee — ADPO framework sera release (Ethics Statements, p. 7) ; LLaVA modeles open-source |
| Code disponible | Annonce mais pas encore publie |
| Dataset public | Oui (VisualAdv, MultiTrust, MMStar — publics) |
