## [Fraser, Dawkins, Nejadgholi, Kiritchenko, 2025] — Fine-Tuning Lowers Safety and Disrupts Evaluation Consistency

**Reference :** arXiv:2506.17209
**Revue/Conf :** Preprint (NRC Canada), juin 2025
**Lu le :** 2026-04-08
> **PDF Source**: [literature_for_rag/P109_finetuning_lowers_safety.pdf](../../assets/pdfs/P109_finetuning_lowers_safety.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet via ChromaDB (62 chunks)

### Abstract original
> Fine-tuning a general-purpose large language model (LLM) for a specific domain or task has become a routine procedure for ordinary users. However, fine-tuning is known to remove safety guardrails from the base model, even when using entirely benign fine-tuning data. As we began to investigate this phenomenon, we discovered that the impact of fine-tuning on safety is highly sensitive to several evaluation parameters: the choice of safety benchmark, the sampling strategy, the generation temperature, and the number of fine-tuning epochs. We show that all investigated parameters affect the safety measurements, often substantially, and that the effect varies with the number of fine-tuning epochs, the fine-tuning dataset, and the base LLM. We argue that robust safety evaluation requires carefully controlled experimental setups, and we make several recommendations for the field.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Le fine-tuning sur des donnees benignes (non adversariales) degrade les guardrails de securite des LLM, mais les mesures de cette degradation sont inconsistantes entre etudes en raison de differences methodologiques non controlees (Fraser et al., 2025, Section 1, p.1).
- **Methode :** Etude systematique de 4 parametres d'evaluation : (1) benchmark de securite, (2) strategie d'echantillonnage, (3) temperature de generation (T=0 vs T=0.7), (4) nombre d'epoques de fine-tuning. Chaque configuration fine-tunee 5 fois avec seeds differentes. Modeles : Llama-3.2-1B-Instruct, Llama-3.2-3B-Instruct, Mistral-7B-Instruct-v0.3. Datasets : Dolly et Alpaca (Section 3, p.2-3).
- **Donnees :** Benchmarks de securite : SORRY-Bench (450 categories), Do-Not-Answer, HarmBench-Standard. 5 runs par configuration, temperatures T=0 et T=0.7. Datasets Dolly (15K) et Alpaca (52K) (Section 3, p.3).
- **Resultat :** Le fine-tuning sur donnees benignes augmente systematiquement les scores de nocivite et la toxicite. Le fine-tuning sur les reponses auto-generees par le modele produit MOINS de degradation que sur des reponses humaines, suggerant que c'est la nouveaute du contenu (pas le processus) qui cause l'erosion (Section 4.4, Figure 4). La temperature affecte significativement les mesures : T=0.7 amplifie la variance et la toxicite maximale (Section 4.3, Figure 3).
- **Limite :** Seuls 3 modeles relativement petits (1B, 3B, 7B) ; la generalisation aux modeles plus grands n'est pas demontree. L'etude identifie les parametres sensibles mais ne propose pas de solution de mitigation (Section 6, Discussion).

### Analyse critique
**Forces :**
- Contribution methodologique majeure : met en evidence que les conclusions sur la degradation de securite dependent fortement des parametres d'evaluation non reportes. Cela remet en question la comparabilite des etudes anterieures (Section 1, p.1).
- Design experimental rigoureux : 5 runs par configuration avec seeds differentes, permettant de mesurer la variance inter-runs. La demonstration que les bandes d'erreur se chevauchent significativement entre conditions est cruciale (Section 4.1, Figure 2).
- L'experience self-generated vs human-written (Section 4.4) est particulierement informative pour C6 : elle montre que c'est la NOUVEAUTE du contenu medical (differant des donnees d'entrainement) qui cause la degradation, pas le processus de fine-tuning lui-meme.
- Multi-benchmark : compare SORRY-Bench, Do-Not-Answer, HarmBench sur les memes modeles, montrant que le choix du benchmark change les conclusions (Section 4.2).
- Recommandations pratiques claires pour la communaute : reporter temperature, nombre de runs, benchmark utilise (Section 6).

**Faiblesses :**
- **Preprint non peer-reviewed**, bien que provenant du NRC Canada (institution credible).
- Modeles relativement petits (1B, 3B, 7B) : les modeles plus grands et mieux alignes (70B+) pourraient reagir differemment au fine-tuning benin. L'extrapolation est risquee.
- Pas de fine-tuning sur donnees medicales specifiquement : les datasets Dolly et Alpaca sont generiques. L'extension aux donnees medicales (qui est le coeur de C6) est inferee mais pas demontree directement.
- Pas de mecanisme explicatif : l'etude documente le phenomene mais n'explique pas POURQUOI la nouveaute du contenu erode la securite (les mecanismes sont explores dans P110).
- L'evaluateur SORRY-Bench est un LLM-juge : les biais de l'evaluateur automatique pourraient affecter les conclusions (P044).

**Questions ouvertes :**
- L'effet de la nouveaute du contenu est-il plus prononce pour le contenu medical specialise que pour le contenu generique ?
- Existe-t-il un seuil de volume de fine-tuning en dessous duquel la securite est preservee ?
- Les methodes de fine-tuning parameter-efficient (LoRA) attenuent-elles la degradation par rapport au full fine-tuning ?

### Formules exactes
- **Harmfulness Score** : echelle de nocivite evaluee par SORRY-Bench classifier (Section 3, p.3). Score binaire (fulfillment/refusal) + score continu de toxicite (Perspective API).
- **Toxicite** (Section 4.5, Figure 5) : score Perspective API sur les outputs, montrant augmentation de la toxicite moyenne et maximale apres fine-tuning. [EMPIRIQUE]
- Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) — la question de la reproductibilite des mesures)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (erosion de l'alignement RLHF par fine-tuning benin — le fine-tuning medical est un cas particulier de ce phenomene).
- **Conjectures :**
  - C6 (domaine medical plus vulnerable) : MECANISTE — fournit le mecanisme explicatif : le fine-tuning medical introduit du contenu NOUVEAU (terminologie, protocoles, raisonnement clinique) qui n'etait pas dans les donnees d'entrainement originales. L'experience self-generated (Section 4.4) montre que c'est precisement cette nouveaute qui erode la securite. Les donnees medicales sont structurellement differentes des donnees d'entrainement generiques → degradation amplifiee.
  - C1 (δ⁰ insuffisant) : SUPPORTEE — meme avec seulement 1 epoque de fine-tuning sur des donnees benignes, la securite se degrade significativement (Section 4.1, Figure 2).
  - C3 (alignement superficiel) : SUPPORTEE — si l'alignement etait profond, un fine-tuning benin ne devrait pas l'eroder. La degradation rapide (1 epoque) confirme la superficialite.
- **Gaps :** G-015 (mecanisme de l'erosion de securite par fine-tuning — partiellement adresse ; le mecanisme geometrique est dans P110)

### Citations cles
> "fine-tuning on self-generated answers results in much lower harmfulness scores than fine-tuning on benign human-written answers" (Section 4.4, p.5)
> "the safety degradation is related to the newness of the fine-tuning content, rather than other mechanics of the fine-tuning process" (Section 4.4, p.5)
> "all investigated parameters affect the safety measurements, often substantially" (Abstract, p.1)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — 3 modeles x 5 seeds x 2 datasets x 2 temperatures, design methodique |
| Code disponible | Non specifie |
| Dataset public | Oui (Dolly, Alpaca, SORRY-Bench — tous publics) |
