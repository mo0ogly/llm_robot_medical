# P021 : Adversarial Training of Reward Models

## [Bukharin et al., 2025] -- Adversarial Training of Reward Models

**Reference :** arXiv:2504.06141v2
**Revue/Conf :** Preprint (under review), NVIDIA + Georgia Institute of Technology, 2025
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P021_2504.06141.pdf](../../literature_for_rag/P021_2504.06141.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (64 chunks)

### Abstract original
> Reward modeling has emerged as a promising approach for the scalable alignment of language models. However, contemporary reward models (RMs) often lack robustness, awarding high rewards to low-quality, out-of-distribution (OOD) samples. This can lead to reward hacking, where policies exploit unintended shortcuts to maximize rewards, undermining alignment. To address this challenge, we introduce Adv-RM, a novel adversarial training framework that automatically identifies adversarial examples -- responses that receive high rewards from the target RM but are OOD and of low quality. By leveraging reinforcement learning, Adv-RM trains a policy to generate adversarial examples that reliably expose vulnerabilities in large state-of-the-art reward models such as Nemotron 340B RM. Incorporating these adversarial examples into the reward training process improves the robustness of RMs, mitigating reward hacking and enhancing downstream performance in RLHF. We demonstrate that Adv-RM significantly outperforms conventional RM training, increasing stability and enabling more effective RLHF training in both synthetic and real-data settings. We will open-source all code and data.
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les modeles de recompense (RM) sont fragiles face aux reponses hors distribution (OOD), attribuant des scores eleves a des reponses de faible qualite, menant au reward hacking (Section 1, p.1)
- **Methode :** Entrainement RL d'une politique adversariale generant des exemples maximisant la divergence entre deux RM (Eq. 3, Section 3.2, p.3-4), suivie de l'incorporation de ces exemples dans l'entrainement du RM
- **Donnees :** Helpsteer-2-Preferences (Wang et al., 2024), 128 prompts evaluation synthetique, 100 prompts evaluation reelle ; modeles cibles : Skywork-Reward-Gemma-2-27B, Llama-3.1-Nemotron-70B-Reward, Nemotron-4-340B-Reward (Section 4.2, p.5-6)
- **Resultat :** ASR synthetique 92.91% (strict, Table 1, p.6) ; ASR reelle 100% sur Skywork-27B, 83.01% sur Nemotron-70B, 78.85% sur Nemotron-340B (evaluation humaine, Table 2, p.7) ; RLHF stable 3x plus longtemps sans reward hacking (Section 5, Figure 4, p.8)
- **Limite :** Cout computationnel ~3x RLHF standard (Section 6, p.9) ; repose sur les ensembles de RM -- si tous les RM echouent simultanement, les exemples adversariaux sont manques (Section 6, p.9)

### Analyse critique
**Forces :**
- Premiere attaque RL automatisee sur les RM de pointe sans connaissance humaine prealable (Section 1, p.2)
- Validation multi-juge : humains, Llama 405B et DeepSeek-R1 concordent sur l'efficacite (Table 2, p.7)
- Decouverte de vulnerabilites distinctes par RM : repetition du prompt (Skywork), texte incoherent (Nemotron-70B), absence de ponctuation (Nemotron-340B) (Figure 2, p.7)
- Ablation rigoureuse montrant la contribution de chaque composante (Table 3, p.7) ; apres 2 rounds d'entrainement adversarial, l'attaque echoue (Section 3.4, p.5)
- RewardBench score ameliore : 83.99 vs 83.29 baseline (Section 5, p.8)

**Faiblesses :**
- N=128 prompts pour l'evaluation synthetique -- sous le seuil N >= 30 par condition pour certaines sous-analyses
- Transferabilite faible entre families de RM (Figure 3, p.7) -- les vulnerabilites decouvertes sont specifiques a chaque architecture
- Pas d'evaluation medicale ni sur des taches critiques
- LLM-as-judge peut sous-estimer l'ASR reelle car lui-meme susceptible aux exemples adversariaux (Section 4.3, p.7)
- Utilisation de seulement K=2 RM pour la detection OOD -- sensibilite au choix de l'ensemble non etudiee

**Questions ouvertes :**
- La robustesse acquise par Adv-RM est-elle durable face a des attaquants adaptatifs iteratifs ?
- Comment Adv-RM se comporte-t-il avec des RM non-Bradley-Terry (ex. DPO, GRPO) ?

### Formules exactes

**Eq. 1 -- Loss Bradley-Terry du RM** (Section 3.1, p.3) :
`L(theta) = -E_{x,y_w,y_l ~ D} [log(sigma(R_theta(x, y_w) - R_theta(x, y_l)))]`

**Eq. 3 -- Objectif adversarial** (Section 3.2, p.4) :
`max_{pi_adv} E_{x~D, y~pi_adv(x)} [R_theta1(x,y) - lambda*R_theta2(x,y)]  s.t. E[R_theta1(x,y)] > T(x)`
ou lambda > 1 encourage des reponses avec haute divergence inter-RM et score bas sur R_theta2.

**Eq. 4-5 -- Criteres de succes** (Section 4.1, p.5-6) :
Standard : `R_theta1(x,y1) > R_theta1(x,y2)` ET `R_gold(x,y1) < R_gold(x,y2)`
Strict : `Z_{R_theta1}(R_theta1(x,y1)) > 0` ET `Z_{R_gold}(R_gold(x,y1)) < -1.96`

**Filtrage adversarial** (Section 3.2, p.4) :
`D_adv = {(x, y_adv) | R_theta1(x, y_adv) > T(x) AND Z(U_theta1,theta2(x, y_adv)) > 1.96}`

Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) -- non utilise ici), F01 (RLHF loss)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (cible primaire -- renforcement du RM par entrainement adversarial) ; δ¹ δ² δ³ non traites
- **Conjectures :**
  - C1 (insuffisance δ¹) : neutre -- le papier ne traite pas du prompt systeme
  - C2 (necessite δ³) : partiel -- ameliore δ⁰ mais sans garantie formelle ; le reward hacking peut resurgir face a un adversaire plus sophistique
- **Decouvertes :**
  - D-003 (fragilite alignment) : **confirmee** -- les RM de pointe sont systematiquement vulnerables (ASR 78-100%, Table 2)
  - D-005 (reward hacking) : **confirmee** -- le reward hacking emerge naturellement apres suffisamment de steps RLHF
- **Gaps :**
  - G-001 (evaluation medicale) : **non adresse** -- aucun test en domaine medical
  - G-015 (cout defense) : **cree** -- 3x cout RLHF standard
- **Mapping templates AEGIS :** conceptuellement lie aux templates d'attaque par exploitation de biais (#14, #18 comme planchers SVC)

### Citations cles
> "Adv-RM trains a policy to generate adversarial examples that reliably expose vulnerabilities in large state-of-the-art reward models such as Nemotron 340B RM." (Abstract, p.1)
> "After 2 rounds of adversarial training, our attack procedure is no longer successful." (Section 3.4, p.5)
> "Adv-RM incurs a substantial computational cost -- approximately 3x that of standard RLHF training" (Section 6, p.9)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 |
| Reproductibilite | Haute -- code et donnees promis open-source, setup detaille en appendice |
| Code disponible | Annonce (a verifier) |
| Dataset public | Oui -- Helpsteer-2-Preferences (HuggingFace) |
| Nature epistemique | [ALGORITHME] -- framework RL avec evaluation empirique, pas de garantie formelle |
