# P030 : A Longitudinal Analysis of Declining Medical Safety Messaging in Generative AI Models

## [Sharma, Alaa & Dey, 2025] -- A Longitudinal Analysis of Declining Medical Safety Messaging in Generative AI Models

**Reference :** npj Digital Medicine 8, 592 (2025) / DOI a confirmer via PMC
**Revue/Conf :** npj Digital Medicine (Nature Publishing Group), Q1, 2025
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P030_source.pdf](../../literature_for_rag/P030_source.pdf)
> **Statut**: [ARTICLE VERIFIE] -- lu en texte complet via ChromaDB (60 chunks), publie npj Digital Medicine (Nature)

### Abstract original
> [Reconstitue depuis le texte complet ChromaDB]
> This longitudinal study documents the systematic erosion of medical safety mechanisms in generative AI models between 2022 and 2025. The main finding is that the presence of medical disclaimers in LLM outputs declined from 26.3% in 2022 to 0.97% in 2025 for language models, and from 19.6% in 2023 to 1.05% for vision-language models (VLMs). The evaluation uses 500 mammograms, 500 chest X-rays, 500 dermatology images, and 500 medical questions from TIMed-Q, a dataset capturing the most frequently searched medical queries by patients. Linear regression analysis reveals a strong inverse relationship between year and disclaimer rate (R2 = 0.944, p = 0.028), with an estimated annual reduction of 8.1 percentage points.
> -- Source : PDF pages 1-2

### Resume (5 lignes)
- **Probleme :** Les garde-fous de securite medicale des LLM s'erodent silencieusement au fil des mises a jour -- aucune etude longitudinale ne documentait cette tendance (Section 1, Figure 1)
- **Methode :** Evaluation longitudinale (2022-2025) de la presence de disclaimers medicaux dans les sorties de LLM (OpenAI/GPT, xAI/Grok, Google/Gemini, Anthropic/Claude, DeepSeek) et VLM ; prompts single-turn standardises via API ; dataset TIMed-Q (500 questions medicales patient-phrased) + 1500 images medicales (Section "Methods")
- **Donnees :** 500 mammographies, 500 radiographies thoraciques, 500 images dermatologiques, 500 questions medicales (TIMed-Q) ; 5 categories cliniques : sante mentale, gestion symptomes/traitement, reponses urgences, diagnostic/labo, securite medicaments (Figure 1-2)
- **Resultat :** Taux de disclaimers : 26.3% (2022, GPT-3.5) -> 12.4% (2023) -> 3.3% (2024) -> 0.97% (2025) pour LLM ; 19.6% (2023) -> 1.05% (2025) pour VLM ; regression lineaire R2=0.944, p=0.028, reduction annuelle de 8.1 points (Section "Results", Figure 1) ; chi-square cross-modele chi2=266.03, p<0.00001 (Section "Results")
- **Limite :** Prompts single-turn standardises -- ne capture pas le comportement multi-turn ou contextuel ; impossibilite d'attribuer les tendances a des mises a jour specifiques ; temperature par defaut uniquement (Section "Limitations")

### Analyse critique
**Forces :**
- Publication dans npj Digital Medicine (Nature) -- revue de haut rang, peer-reviewed
- Premiere etude longitudinale (3 ans) documentant l'erosion quantitative des garde-fous medicaux -- donnee inedite et alarmante
- Statistiques rigoureuses : regression lineaire avec R2=0.944 (quasi-deterministe), chi-square cross-modele hautement significatif, Wilcoxon pour comparaisons images (Section "Methods")
- Dataset TIMed-Q publie (GitHub) -- reproductibilite assuree
- Couverture multi-provider (OpenAI, xAI, Google, Anthropic, DeepSeek) et multi-modal (LLM + VLM) -- pas de biais fournisseur
- Stratification par categorie clinique revelant que la sante mentale conserve le plus de disclaimers (12.6%) tandis que la securite des medicaments en a le moins (2.5%) -- signal d'alerte pour la pharmacovigilance (Figure 2)

**Faiblesses :**
- Les disclaimers ne sont qu'un proxy de la securite -- l'absence de disclaimer ne signifie pas necessairement un contenu dangereux, et un disclaimer present ne garantit pas un contenu safe
- Prompts single-turn uniquement -- le comportement multi-turn pourrait etre different
- Pas de comparaison de la qualite/precision des reponses medicales elles-memes -- seule la presence/absence de disclaimer est mesuree
- Les modeles sont versiones au fil du temps mais les versions exactes ne sont pas toujours connues (Section "Limitations")
- La pression commerciale est invoquee comme cause mais pas formellement demontree -- correlation ne prouve pas la causalite
- Pas d'analyse des system prompts des modeles -- les disclaimers pourraient avoir migre vers les instructions systeme plutot qu'etre absents

**Questions ouvertes :**
- La disparition des disclaimers est-elle compensee par des mecanismes de securite alternatifs (system prompts, output filters) ?
- Comment les modeles medicaux specialises (Med-PaLM, Meditron) se comparent-ils sur cette metrique longitudinale ?
- Cette tendance est-elle reversible par regulation (EU AI Act, FDA) ?

### Formules exactes

**Regression lineaire longitudinale** (Section "Results") :
`disclaimer_rate = a * year + b`
R2 = 0.944, p = 0.028
Reduction annuelle estimee : 8.1 points de pourcentage

**Chi-square cross-modele** (Section "Results") :
chi2 = 266.03, p < 0.00001 (difference significative entre familles de modeles par type de question clinique)

**Chi-square VLM** :
chi2 = 221.42, p < 0.00001 (difference entre familles pour les images medicales)

**Tests supplementaires** :
- Correlation de Pearson : precision diagnostique vs presence disclaimers (images)
- Wilcoxon signed-rank : comparaison high-risk vs low-risk images

**Donnees cles par annee** :
- 2022 : 26.3% (GPT-3.5 Turbo uniquement)
- 2023 : 12.4% (GPT-4 16.5%, GPT-4 Turbo legerement moins)
- 2024 : 3.3%
- 2025 : 0.97% (GPT-4.5 et Grok-3 a 0%, Gemini 2.0 Flash 2.1%, Claude 3.7 Sonnet 1.8%)

**Par famille (toutes annees confondues)** :
- Google : 41.0% questions / 49.1% images
- OpenAI : 7.7% / 9.8%
- Anthropic : 3.1% / 11.5%
- xAI : 3.6% / 8.6%
- DeepSeek : 0%

Lien glossaire AEGIS : F22 (ASR -- indirectement, l'erosion augmente l'ASR baseline), lie a la mesure de drift temporel δ⁰

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (evidence directe de la degradation longitudinale de l'alignement) ; δ¹ (system prompts potentiellement affectes mais non mesures) ; δ² δ³ (l'erosion de δ⁰ renforce l'argument pour des couches externes)
- **Conjectures :**
  - C1 (insuffisance δ¹) : **supportee indirectement** -- l'erosion des disclaimers suggere que meme les instructions systeme de securite sont desactivees ou affaiblies
  - C2 (necessite δ³) : **fortement supportee** -- la degradation temporelle sans attaque active montre que δ⁰ n'est pas fiable a long terme ; des garanties formelles (δ³) sont necessaires
  - C4 (pression commerciale) : **fortement supportee** -- la course a la "helpfulness" erode la securite, documentee quantitativement
- **Decouvertes :**
  - D-002 (erosion temporelle) : **confirmee** -- R2=0.944, reduction de 8.1 points/an
  - D-003 (fragilite alignment) : **confirmee** -- δ⁰ se degrade meme sans attaque
  - D-016 (variation provider) : **confirmee** -- DeepSeek 0%, Google 41%, ecart massif
- **Gaps :**
  - G-001 (evaluation medicale) : **directement adresse** -- etude medicale multi-specialite
  - G-021 (mecanismes compensatoires) : **cree** -- les disclaimers ont-ils migre vers d'autres mecanismes ?
  - G-022 (regulation) : **cree** -- impact de l'EU AI Act sur la tendance non evalue
- **Mapping templates AEGIS :** pas de mapping direct aux templates d'attaque -- ce papier documente une tendance defensive, pas un vecteur d'attaque ; pertinent pour la calibration temporelle des mesures AEGIS

### Citations cles
> "medical disclaimers in LLM outputs declined from 26.3% in 2022 to 0.97% in 2025" (Figure 1, Results)
> "R2 = 0.944, p = 0.028, with an estimated annual reduction of 8.1 percentage points" (Results)
> "GPT 4.5 and Grok 3 included no disclaimers at all" (Results, 2025 data)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute -- TIMed-Q public (GitHub), images de datasets publics (Mammo-Bench, DDI, Kermany), API access standardise |
| Code disponible | Partiel -- TIMed-Q dataset public (https://github.com/sonalisharma-3/TIMed-Q) |
| Dataset public | Oui -- TIMed-Q + images publiques |
| Nature epistemique | [EMPIRIQUE] -- etude observationnelle longitudinale avec statistiques descriptives et inferentielles ; pas de modele predictif |
