## [Suri & McCrae, 2025] — Securing Large Language Models (LLMs) from Prompt Injection Attacks (JATMO vs HOUYI)

**Reference** : arXiv:2512.01326v1
**Revue/Conf** : arXiv preprint (University of Galway), 1 Dec 2025
**Lu le** : 2026-04-04
> **PDF Source**: [literature_for_rag/P007_source.pdf](../../assets/pdfs/P007_source.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (32 chunks)

**Nature epistemique** : [EMPIRIQUE] — evaluation d'une defense (JATMO fine-tuning) contre un framework d'attaque (HOUYI modifie)

### Abstract original
> "Large Language Models (LLMs) are increasingly being deployed in real-world applications, but their flexibility exposes them to prompt injection attacks. These attacks leverage model's instruction following ability to make it perform malicious tasks. Recent work has proposed JATMO, a task-specific fine-tuning approach that trains non–instruction-tuned base models to perform a single function, thereby reducing susceptibility to adversarial instructions. In this study, we evaluate the robustness of JATMO against HOUYI, a genetic attack framework that systematically mutates and optimizes adversarial prompts. We adapt HOUYI by introducing custom fitness scoring, modified mutation logic, and a new harness for local model testing, enabling a more accurate assessment of defense effectiveness. We fine-tuned LLaMA 2-7B, Qwen1.5-4B and Qwen1.5-0.5B models under the JATMO methodology and compared them with a fine-tuned GPT-3.5-Turbo baseline. Results show that while JATMO reduces attack success rates relative to instruction-tuned models, it does not fully prevent injections; adversaries exploiting multilingual cues or code-related disruptors still bypass defenses. We also observe a trade-off between generation quality and injection vulnerability, suggesting that better task performance often correlates with increased susceptibility."
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme** : Evaluer la robustesse du fine-tuning task-specifique (JATMO) contre des attaques genetiques structurees (HOUYI) (Section 1, RQ1-RQ2)
- **Methode** : Fine-tuning LoRA de LLaMA 2-7B, Qwen 1.5-0.5B et Qwen 1.5-4B sur une tache de summarization (Amazon All-Beauty, 1,500 paires), attaques HOUYI modifiees avec 72 prompts par type (Section 3)
- **Donnees** : 1,500 paires input-output (reviews summarization), 72 prompts adversariaux par type d'attaque (content manipulation + information gathering) (Sections 3.1, 3.5)
- **Resultat** : JATMO reduit l'ASR moyen de 100% (GPT-3.5 Turbo) a 9.68% (Qwen 0.5B) et 11.11% (LLaMA 2-7B), mais Qwen 4B reste a 25% ; trade-off ROUGE-L / ASR (Table 1, Section 4)
- **Limite** : Evaluation sur une seule tache (summarization) avec un seul dataset ; modeles petits seulement (0.5B-7B) ; pas de comparaison avec d'autres defenses (Section 6-7)

### Analyse critique
**Forces** :
- Decouverte d'un trade-off fondamental : les modeles avec meilleur ROUGE-L (meilleure qualite generative) ont aussi un ASR plus eleve — "models that are better at following instructions are also better at following malicious instructions" (Section 4, Table 1)
- Modifications pertinentes de HOUYI : custom fitness scoring (detection de "pwned" en fin de reponse), mutation manuelle avec diversite linguistique, harness local (Section 3.4)
- Identification de vecteurs residuels specifiques : multilingual cues, code-related triggers ("python", code fences), imperative phrasing residuelle du pretraining web (Section 5)
- Le papier reference directement HOUYI (Liu et al., 2023, arXiv:2306.05499) — alignement direct avec les travaux fondateurs du corpus AEGIS

**Faiblesses** :
- Tres petite echelle : 72 prompts adversariaux (Suri & McCrae, 2025, Section 4, Dataset) n'est pas suffisant pour des conclusions statistiques robustes (N < 30 par type d'attaque x modele)
- Une seule tache (summarization sur Amazon reviews) — generalisation non demontree pour d'autres taches (QA, extraction, classification)
- GPT-3.5 Turbo comme seul baseline instruction-tuned a 100% ASR (Suri & McCrae, 2025, Table 1, Section 4) — pas de comparaison avec GPT-4, Claude, ou modeles RLHF modernes
- JATMO est un travail de 2024 (ESORICS) — les resultats confirment les limites deja connues sans apport significatif
- Pas de metriques de faux positifs ni d'evaluation de l'utilite sous attaque

**Questions ouvertes** :
- Le trade-off qualite/securite est-il fondamental (cf. C1 AEGIS) ou peut-il etre depasse par des techniques d'alignment plus sophistiquees ?
- JATMO est-il applicable aux modeles medicaux task-specifiques (radiologie, diagnostic) ?
- Comment se comporte JATMO face a des attaques multi-turn ?

### Formules exactes
- Aucune formule mathematique originale
- Metriques empiriques : ROUGE-L pour la qualite, ASR (%) pour la vulnerabilite (Section 3.5)
- Table 1 : Qwen 0.5B (ROUGE-L 0.29, ASR 9.68%), Qwen 4B (0.43, 25.00%), LLaMA 2-7B (0.33, 11.11%), GPT-3.5 Turbo (0.88, 100%) — correlation positive ROUGE-L / ASR

### Pertinence these AEGIS
- **Couches delta** : δ⁰ (le fine-tuning JATMO opere au niveau de l'alignment du modele, supprimant l'instruction-following pour reduire la surface d'attaque)
- **Conjectures** :
  - C1 (insuffisance δ¹) : **Supportee** — meme sans instruction-following explicite, les modeles conservent des priors de pretraining exploitables (multilingual, code triggers, Section 5)
  - C2 (necessite δ³) : **Non adressee**
  - C3 (trade-off helpfulness/safety) : **Fortement supportee** — correlation ROUGE-L / ASR demontree (Table 1)
- **Decouvertes** : D-007 (trade-off qualite/securite) confirmee empiriquement (Suri & McCrae, 2025, Table 1, Section 4) ; D-009 (residus de pretraining exploitables malgre le fine-tuning, Suri & McCrae, 2025, Section 5)
- **Gaps** : G-007 (generalisation du trade-off a d'autres taches), G-020 (residus multilinguaux)
- **Mapping templates AEGIS** : Les attaques HOUYI modifiees (content manipulation, information gathering) correspondent aux templates #01-#10 (manipulation directe) et #70-#80 (extraction d'information)

### Citations cles
> "Models that are better at following instructions are also better at following malicious instructions." (Section 4.1, p. 7)
> "JATMO does improve robustness, reducing attack success by up to 90% relative to GPT-3.5, but models remain vulnerable to sophisticated or obfuscated injections." (Section 6, Conclusion)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 5/10 |
| Reproductibilite | Moyenne — LLaMA 2 et Qwen accessibles, mais dataset custom non publie, HOUYI modifie non partage |
| Code disponible | Non mentionne |
| Dataset public | Partiellement (Amazon All-Beauty est public, dataset HOUYI modifie non) |
