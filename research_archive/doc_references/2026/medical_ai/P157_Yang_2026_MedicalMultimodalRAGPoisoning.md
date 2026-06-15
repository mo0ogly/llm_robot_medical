## [Yang, Zheng, Ju, et al., 2026] — Empoisonnement de connaissances des RAG medicaux multimodaux

**Reference :** arXiv:2605.10253
**Revue/Conf :** arXiv preprint, 2026 [cs.CR]
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P157_Yang_2026_MedicalMultimodalRAGPoisoning.pdf](../../literature_for_rag/P157_Yang_2026_MedicalMultimodalRAGPoisoning.pdf)
> **Statut**: [PREPRINT] — lu en texte complet (20 pages, pypdf)

---

### Abstract original

> Retrieval-augmented generation (RAG) is a widely adopted paradigm for enhancing LLMs in medical applications by incorporating expert multimodal knowledge during generation. However, the underlying retrieval databases may naturally contain, or be intentionally injected with, adversarial knowledge, which can perturb model outputs and undermine system reliability. To investigate this risk, prior studies have explored knowledge poisoning attacks in medical RAG systems. Nevertheless, most of them rely on the strong assumption that adversaries possess prior knowledge of user queries, which is unrealistic in deployments and substantially limits their practical applicability. In this paper, we propose M3Att, a knowledge-poisoning framework designed for medical multimodal RAG systems, assuming only limited distribution knowledge of the underlying database. Our core idea is to inject covert misinformation into textual data while using paired visual data as a query-agnostic trigger to promote retrieval. We first propose a unified framework that introduces imperceptible perturbations to visual inputs to manipulate retrieval probabilities. Besides, due to the prior medical knowledge in LLMs, naively poisoned medical content with explicit factual errors can be corrected during generation. Thus, we leverage the inherent ambiguity of medical diagnosis and design a covert misinformation injection strategy that degrades diagnostic accuracy while evading model self-correction. Experiments on five LLMs and datasets demonstrate that M3Att consistently produces clinically plausible yet incorrect generations. Codes: https://github.com/ypr17/M3Att.
> — Source : p. 1, Abstract

---

### Resume (5 lignes)

- **Probleme :** Les bases de connaissances des RAG medicaux multimodaux peuvent etre empoisonnees par un adversaire sans acces aux requetes utilisateurs, sans acces aux parametres du modele, et avec seulement une connaissance limitee de la distribution de la base de connaissances — un modele de menace beaucoup plus realiste que les travaux precedents qui supposaient la connaissance des requetes. (Section 1, Introduction, p. 1-2)
- **Methode :** M3Att (Medical Multimodal Malicious Att.) combine deux mecanismes couples : (1) un "distribution-guided retrieval hijacking" qui optimise des images via PGD contraint vers des cibles proxy de clusters semantiques pour que les echantillons empoisonnes soient recuperes sans connaitre les requetes, et (2) une "clinical ambiguity-guided poisoning" qui injecte de la mesinformation dans les textes medicaux en exploitant les zones d'ambiguite diagnostique (gravite, diagnostic differentiel, recommandations) pour eviter l'autocorrection du LLM. (Section 3, pp. 2-5)
- **Donnees :** 5 datasets medicaux : IU-XRay (radiographies thoraciques + rapports), MIMIC-CXR (grande echelle, radiographies + texte), CRC100k (histopathologie colorectale), MHIST (pathologie), PCam (detection metastases ganglionnaires) ; 5 LVLMs : GPT-4o, GPT-5 Chat, Gemini-2.5-Flash, Claude-Haiku-4.5, LLaVA-Med ; 3 retrievers : CLIP ViT-Large-Patch14-336, BGE-VL-base, SigLIP-SO400M-Patch14-384. (Section 4.1, Appendix E.1, pp. 5, 16)
- **Resultat :** M3Att reduit en moyenne la performance downstream de 8,78% par rapport a un RAG propre (Section 4.3, p. 7) ; le Top-5 hit rate des echantillons empoisonnes passe de 0,01% a 5% dans le retrieval embedding space (Section 4.7, p. 9) ; l'attaque reste efficace contre 7 defenses testees (3 pre-retrieval + 4 retrieval-time), ASR@5 restant autour de 70-76% meme sous defense (Table 3, p. 15, Appendix B) ; a un taux de poison < 1%, le F1 des experts humains est seulement 0,0870 (Table 4, Appendix D, p. 15).
- **Limite :** Validation limitee aux modalites 2D (radiographies thoraciques, patches histopathologie) ; les volumes 3D (CT, IRM 3D) et les videos medicales ne sont pas evalues empiriquement par manque de datasets adaptes. (Section Limitations, p. 10)

---

### Analyse critique

**Forces :**
- Modele de menace realiste et clairement formalise (Appendix G, p. 20) : pas d'acces aux requetes utilisateurs, pas d'acces aux parametres du modele, pas d'acces aux sorties intermediaires du retriever — contraste saisissant avec la majorite des travaux anterieurs qui supposaient la connaissance des requetes (Section 2, Related Works, et Section E.3, p. 16-17).
- Evaluation a grande echelle : 5 LVLMs x 5 datasets x 3 retrievers x 4 taches = configuration experimentale exhaustive (Table 1, Table 2, pp. 6, 14). Inclusion de modeles frontier (GPT-5, Gemini-2.5-Flash, Claude-Haiku-4.5) et d'un modele medical specialise (LLaVA-Med).
- Evaluation des defenses couvrant a la fois pre-retrieval (clustering image/texte, coherence image-texte) et retrieval-time (perplexity filtering, anomaly detection, high/low-score thresholding) — Table 3 montre qu'aucune n'est efficace (ASR@5 baseline = 75,87% ; sous defense Image-Text Consistency = 57,89% — baisse modeste, Section 4.6, p. 9 et Table 3, p. 15).
- Validation de la furtivite par des experts humains (2 doctorants en medecine, 200 textes, 4 ratios d'injection) : F1 moyen = 0,0870 a 1% d'injection, 0,4857 a 10% d'injection (Table 4, Appendix D, p. 15).
- Ablation rigoureuse des deux composantes (Section 4.5, p. 8, Figure 4) : desactiver soit le retrieval hijacking soit l'injection de mesinformation reduit significativement l'efficacite, prouvant la necessite des deux mecanismes couples.
- Code public disponible : https://github.com/ypr17/M3Att (Abstract, p. 1).

**Faiblesses :**
- La reduction moyenne de 8,78% masque une forte heterogeneite selon les modeles, les taches et les retrievers (Table 1). Claude-Haiku-4.5 (renomme "Claude-4.5" dans le texte principal) chute plus fortement sur IU-XRay True/False (53,20% -> 38,30% avec BGE-VL) tandis que GPT-5 est plus robuste (93,90% -> 87,44% en True/False CLIP), ce qui suggere que la metrique agregee masque des vulnerabilites differentielles. (Table 1, p. 6)
- L'evaluateur LLM-as-a-Judge pour la generation de rapports n'est pas parfait : les auteurs l'evoquent mais le justifient via des correlations de Spearman entre juges et un cadrage strict JSON — cette approche reste vulnerabilite potentielle pour les comparaisons inter-travaux. (Section 4.2 et Appendix E.5, pp. 5, 17-18)
- Le taux de poison utilise dans les experiences principales est "strictly below 1%" (Appendix D, p. 16) mais les hyperparametres exacts (ratio exact, K clusters, epsilon PGD) ne sont pas unifies dans un tableau de configuration centrale — ils sont disperses dans l'analyse des hyperparametres (Fig. 3, Fig. 8).
- Limitation 3D explicitement avouee (Section Limitations, p. 10) : IRM volumetriques et CT 3D non evalues, bien que le framework soit theoriquement extensible.
- Aucune evaluation d'une defense specifiquement concue pour les RAG multimodaux medicaux — les defenses testees sont generiques.

**Questions ouvertes :**
- Les auteurs ne proposent pas de defense : comment concevoir une protection robuste contre un adversaire query-agnostic dans un RAG multimodal medical ? La similarite cosinus inter-modale est insuffisante (Fig. 5) — quels mecanismes de validation semantique profonde seraient necessaires ? (Section 4.6, p. 9)
- Generalisation aux modalites 3D (CT, IRM volumetriques) : la structure cluster bien separee qui rend l'attaque efficace en 2D est-elle preservee en 3D ? (Section Limitations, p. 10)
- Impact clinique reel : la degradation de 8,78% moyenne serait-elle cliniquement significative dans un workflow reel ? Les auteurs ne fournissent pas d'evaluation par des cliniciens sur les sorties finales.
- Robustesse de l'attaque dans le temps : les embeddings CLIP/BGE-VL sont stables, mais les modeles LVLMs mis a jour absorbent-ils mieux l'attaque ?

---

### Formules exactes

**Equation 1 — Iteration PGD contrainte pour le retrieval hijacking** (Section 3.3, p. 4, Eq. 1) :

```
x_c^(i+1) = Pi_{B_epsilon(x_c^(0))} [ x_c^(i) + alpha * sign( grad_x L( f(x_c^(i)), mu_c ) ) ]
```

ou :
- `f(.)` est l'encodeur d'images du retriever
- `mu_c` est l'embedding proxy du cluster c (moyenne des embeddings des prototypes les plus proches du centre)
- `L` est l'objectif de similarite cosinus entre l'embedding de l'image et la cible proxy
- `B_epsilon(x_c^(0)) = {x | ||x - x_c^(0)||_inf <= epsilon}` est la contrainte d'epsilon-voisinage L-inf
- `alpha` est le pas de gradient
- `Pi` projette sur la contrainte (perturbation maximale par pixel)

**Equation 2 — Estimation de gradient d'ordre zero (setting black-box)** (Section 3.3, p. 4, Eq. 2) :

```
grad_x L ≈ (1/K) * sum_{k=1}^{K} [ L(x_c^(i) + delta*u_k) - L(x_c^(i) - delta*u_k) ] / (2*delta) * u_k
```

ou `{u_k}_{k=1}^K` sont des directions aleatoires echantillonnees, `delta` est le rayon de recherche. Cette estimation guide les iterations PGD sans acces aux gradients internes du modele.

**Equation 3 — Normalisation de l'accuracy (chance-normalized)** (Appendix E.5, p. 18, Eq. 3) :

```
s_scaled = max(0, (s - s_rand) / (1 - s_rand))
```

ou `s` est l'accuracy brute et `s_rand` la baseline aleatoire (0.5 pour deux choix, 0.25 pour quatre choix).

---

### Pertinence these AEGIS

**Couches delta :**
- **delta1 (contexte/RAG) — PRIMAIRE** : ce papier attaque directement la couche de retrieval multimodal. Les deux mecanismes de M3Att (hijacking retrieval + injection generation) operent a delta1. La base de connaissances RAG est la surface d'attaque centrale.
- **delta2 (monitoring/derive) — SECONDAIRE** : l'absence de detection fiable par les defenses existantes (Table 3, p. 15) montre que le monitoring classique (clustering, perplexite, coherence cross-modale) est insuffisant pour detecter une derive induite par empoisonnement.
- **delta0 (RLHF)** : le papier montre que l'alignement de securite des LVLMs (GPT-4o, Claude-Haiku-4.5, Gemini-2.5) ne suffit pas a resister a la mesinformation cliniquement plausible — les guardrails RLHF sont contournes par l'ambiguite medicale inherente (Section 3.4, p. 5 ; Section H, p. 20).

**Conjectures :**

- **C2** (necessite d'un delta3 independant du retrieval) : **SOUTENUE fortement**. Les resultats montrent que meme des LVLM avec fort alignement medical (LLaVA-Med) sont degrades par un RAG empoisonne. Le papier conclut que "clinically plausible misinformation can evade self-correction and degrade accuracy without obvious red flags" (Section H, p. 20). Une validation formelle de sortie (delta3) independante du pipeline retrieval serait la seule defense non-compromise par M3Att.
- **C5** (insuffisance de la similarite cosinus pour filtrer les docs empoisonnes) : **SOUTENUE directement**. La defense "Image-Text Consistency" (similarite cosinus cross-modale) ne reduit l'ASR@5 que de 75,87% a 57,89% (Table 3, p. 15). La defense "Anomaly Detection" (similarite cosinus entre items recuperes) reste a 74,13% d'ASR@5. Les auteurs expliquent que les echantillons empoisonnes sont dans la distribution des embeddings (Section A.2, Fig. 7) — c'est precisement pour cette raison que la cosine similarity ne peut les distinguer.
- **C6** (vulnerabilite accrue du domaine medical) : **SOUTENUE et enrichie**. Le papier identifie deux vulnerabilites specifiquement medicales : (1) l'homogeneite anatomique des images medicales cree des clusters denses qui facilitent le hijacking query-agnostic (Section 3.2, p. 3) ; (2) l'ambiguite diagnostique inherente (gravite variable, diagnostics differentiels) cree des "low-confidence regions" que l'attaque exploite pour eviter l'autocorrection (Section 3.4, pp. 4-5). Ces deux proprietes du domaine medical sont absentes des domaines generaux.

**Decouvertes AEGIS :**
- **D-013 (compound RAG attack)** : ce papier instancie un compound RAG attack (P054/PIDP) dans un contexte multimodal medical : l'attaque combine retrieval hijacking (stage 1) + mesinformation generation (stage 2) en deux couches coordonnees. La nouveaute par rapport a D-013 est le vecteur visuel query-agnostic comme trigger de stage 1.
- Lien avec **P055** (vector DB poisoning) : M3Att va plus loin que P055 en adressant le setting query-agnostic et en ciblant explicitement les modeles avec fort prior medical (autocorrection). La surface d'attaque est etendue a la modalite visuelle.
- Lien avec **P139** (CorruptRAG single-doc) : M3Att generalise a un setting query-agnostic et multimodal, la ou CorruptRAG suppose des requetes connues.
- Lien avec **P138** (FlippedRAG) : angle orthogonal — FlippedRAG travaille sur le texte seul en text-only RAG ; M3Att est specifiquement multimodal medical avec vecteur image comme trigger.

**Gaps adresses :**
- Adresse partiellement **RR-RUN4-001 / RR-DA-003** (RAG-defense medicale) : montre que les defenses simples (clustering, cosine filtering, perplexity) echouent contre un adversaire distributional — mais NE propose PAS de defense. Le gap sur les defenses robustes reste ouvert.
- Adresse partiellement **C6** : fournit la preuve experimentale que les proprietes du domaine medical (homogeneite anatomique + ambiguite diagnostique) sont explicitement exploitables par un attaquant. Reste ouvert : transfert aux specialites medicales moins homogenes (dermatologie, ophtalmologie).
- Cree un nouveau gap : absence de defense specifiquement concue pour les RAG multimodaux medicaux dans un threat model query-agnostic.

**Mapping templates AEGIS :**
- Les trois strategies textuelles (Fine-grained Severity Migration, Prior-Constrained Diagnosis Distortion, Risk Association Corruption — Section 3.4, pp. 4-5) correspondent aux templates d'injection contextuelle AEGIS destines a exploiter le contexte medical. Le prompt system fourni en Appendix E.4 (Fig. 9, p. 17) est directement utilisable comme reference pour la forge de templates AEGIS de type IPI medical.

---

### Citations cles

> "most of them rely on the strong assumption that adversaries possess prior knowledge of user queries, which is unrealistic in deployments and substantially limits their practical applicability" (Abstract, p. 1)

> "naively injecting explicit factual errors usually conflicts with the model's strong domain priors, causing them to either refuse to respond or to automatically correct such inconsistencies during generation" (Section 1, p. 2)

> "M3Att reduces the overall downstream task utility by 8.78% compared to the clean RAG performance" (Section 4.3, p. 7)

> "black-box results remain comparable to white-box results across different retrievers, suggesting that M3Att does not critically rely on gradient access and can achieve effective hijacking with zeroth-order optimization under realistic black-box deployment settings" (Section 4.3, p. 7)

> "the proposed attack is not only effective in the standard setting, but also robust against common pre-filtering defenses that rely on simple distributional heuristics" (Section 4.6, p. 9)

> "clinically plausible misinformation can evade self-correction and degrade accuracy without obvious red flags, creating a risk of silent yet consequential errors" (Section H, p. 20)

> "The adversary does not have direct access to the full deployed knowledge base, but can collect or maintain a small reference set drawn from the same underlying distribution and use it to craft and inject a limited number of poisoned entries." (Appendix G, p. 20)

> "Even when 10% of the pool is poisoned, the averaged F1 score is only 0.4857" (Appendix D, p. 15 — validation experts humains)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence AEGIS | 9/10 — attaque RAG medical multimodal avec threat model realiste, directement dans le coeur de la these (delta1 + C2 + C5 + C6) |
| Reproductibilite | Haute — code public (https://github.com/ypr17/M3Att), datasets publics (IU-XRay, MIMIC-CXR, CRC100k, MHIST, PCam), retrievers et LVLMs documentes en Appendix E.1 (pp. 16-17) |
| Code disponible | Oui — https://github.com/ypr17/M3Att (Abstract, p. 1) |
| Dataset public | Oui — IU-XRay, MIMIC-CXR, CRC100k, MHIST, PCam (tous publics, references Section 4.1, p. 5) |
| Type d'attaque AEGIS | IPI (Indirect Prompt Injection) — empoisonnement de la base de connaissances RAG au niveau knowledge-base |
| Surface ciblee | Couche RAG (retrieval + generation), images medicales + textes, N=5 datasets, N=5 LVLMs, N=3 retrievers |
| MITRE ATLAS | AML.T0051 (LLM Prompt Injection) + AML.T0031 (Poison Training/Knowledge Data) |
| OWASP LLM | LLM08 (Vector and Embedding Weaknesses) + LLM06 (Sensitive Information Disclosure via corrupted context) |
| Nature | [EMPIRIQUE] — resultats experimentaux solides, pas de garanties theoriques formelles sur les bornes de l'attaque |
| Statut | [PREPRINT] — soumis arXiv mai 2026 |
