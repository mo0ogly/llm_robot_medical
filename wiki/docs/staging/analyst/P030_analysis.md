# P030 -- Analyse doctorale

## [Sharma, Alaa & Daneshjou, 2025] -- A Longitudinal Analysis of Declining Medical Safety Messaging in Generative AI Models

**Reference :** DOI:10.1038/s41746-025-01943-1
**Revue/Conf :** npj Digital Medicine (Nature Publishing Group), Q1 SCImago, 2025
**Lu le :** 2026-04-04
**Nature :** [EMPIRIQUE] -- etude observationnelle longitudinale avec statistiques inferentielles (regression lineaire, chi-square, Wilcoxon), pas de modele predictif
> **PDF Source**: [literature_for_rag/P030_source.pdf](../../assets/pdfs/P030_source.pdf)
> **Statut**: [ARTICLE VERIFIE] -- lu en texte complet via ChromaDB (53 chunks paper_fulltext)

---

### Abstract original
> Generative AI models, including large language models (LLMs) and vision-language models (VLMs), are increasingly used to interpret medical images and answer clinical questions. However, their responses often include inaccuracies; therefore, safety measures like medical disclaimers are critical. In this study, we evaluated the presence of disclaimers in LLM and VLM outputs across model generations released from 2022 to 2025. Responses were generated from 500 mammograms, 500 chest X-rays, 500 dermatology images, and 500 medical questions drawn from a new dataset we introduced: TIMed-Q (Top Internet Medical Question Dataset). TIMed-Q captures the most frequently searched medical queries by patients, reflecting real-world health information-seeking behavior. Disclaimer presence in LLM outputs dropped from 26.3% in 2022 to 0.97% in 2025, while VLM disclaimer rates declined from 19.6% in 2023 to 1.05%. By 2025, most models displayed no disclaimers. As models gain further capability, disclaimers must function as adaptive safeguards tailored to clinical contexts.
> -- Source : PDF pages 1-2 (DOI:10.1038/s41746-025-01943-1)

### Resume (5 lignes)
- **Probleme :** Les garde-fous de securite medicale des LLM/VLM (presence de disclaimers) s'erodent silencieusement au fil des mises a jour -- aucune etude longitudinale ne documentait cette tendance avant ce travail (Introduction, p.1)
- **Methode :** Evaluation longitudinale (2022-2025) de la presence de disclaimers medicaux dans les sorties de LLM (OpenAI/GPT, xAI/Grok, Google/Gemini, Anthropic/Claude, DeepSeek) et VLM ; prompts single-turn standardises via API ; dataset TIMed-Q (500 questions medicales patient-phrased) + 1500 images medicales (Section Methods, p.5-6)
- **Donnees :** 500 mammographies (100 par categorie BI-RADS 1-5), 500 radiographies thoraciques (250 normales, 250 pneumonie), 500 images dermatologiques (250 benignes, 250 malignes), 500 questions medicales TIMed-Q reparties en 5 domaines cliniques (Section Methods, p.5-6)
- **Resultat :** Disclaimers LLM : 26.3% (2022) a 0.97% (2025) ; VLM : 19.6% (2023) a 1.05% (2025) ; regression lineaire R2 = 0.944, p = 0.028, reduction annuelle de 8.1 points (Section Results, Figure 1, p.2) ; chi-square cross-modele chi2 = 266.03, p < 0.00001 (Section Results, p.2-3)
- **Limite :** Prompts single-turn uniquement, impossibilite d'attribuer les tendances a des mises a jour specifiques, temperature par defaut, les disclaimers ne sont qu'un proxy de la securite (Section Discussion, p.5-6)

### Analyse critique

**Forces :**

1. **Publication npj Digital Medicine (Nature).** Revue Q1 peer-reviewed, garantissant une rigueur methodologique validee par des pairs. Le facteur d'impact et le prestige editorial confere aux resultats une credibilite institutionnelle forte pour la these (DOI:10.1038/s41746-025-01943-1).

2. **Premiere etude longitudinale (3 ans) documentant l'erosion.** L'originalite methodologique est considerable : aucune etude anterieure n'avait quantifie la degradation temporelle des garde-fous medicaux sur plusieurs generations de modeles. La regression lineaire (R2 = 0.944, p = 0.028) est quasi-deterministe, revelant une tendance structurelle, pas un phenomene aleatoire (Section Results, p.2).

3. **Couverture multi-provider et multi-modale.** 5 familles de modeles (OpenAI, xAI, Google, Anthropic, DeepSeek) testees sur texte ET image. L'ecart entre DeepSeek (0% disclaimers) et Google (41.0% questions, 49.1% images) revele des philosophies de securite radicalement differentes entre fournisseurs (Sharma et al., 2025, Section Results, p.1-2, donnees cross-modele avant Fig. 1).

4. **Dataset TIMed-Q publie.** Le dataset est disponible sur GitHub (https://github.com/sonalisharma-3/TIMed-Q), permettant la reproductibilite. Les 500 questions sont basees sur les recherches medicales reelles des patients, garantissant la pertinence clinique (Section Methods, p.6).

5. **Stratification clinique revelant des signaux d'alerte.** La sante mentale conserve le plus de disclaimers (12.6%) tandis que la securite des medicaments en a le moins (2.5%) -- signal critique pour la pharmacovigilance (Sharma et al., 2025, Section Results, p.3, Fig. 2). La correlation negative entre precision diagnostique et disclaimers (r = -0.64, p = 0.010) est particulierement preoccupante (Sharma et al., 2025, Section Results, p.4).

6. **Comparaison high-risk vs low-risk images.** Le test de Wilcoxon (W = 13.0, p = 0.023) confirme une difference significative : les modeles incluent plus de disclaimers pour les images a haut risque (18.8%) que pour les images a bas risque (16.2%), mais la difference absolue est faible (Section Results, p.4, Figure 4).

**Faiblesses :**

1. **Les disclaimers ne sont qu'un proxy.** L'absence de disclaimer ne signifie pas necessairement un contenu dangereux, et un disclaimer present ne garantit pas un contenu safe. La metrique mesure la forme de la reponse, pas sa substance clinique. Cette limite est reconnue par les auteurs (Section Discussion, p.5-6).

2. **Prompts single-turn uniquement.** Le comportement multi-turn -- ou l'accumulation contextuelle peut modifier la presence de disclaimers -- n'est pas capture. Les interactions patient-LLM reelles sont multi-tour (Section Discussion, p.5-6).

3. **Pas d'analyse des system prompts.** Les disclaimers pourraient avoir migre vers les instructions systeme (delta-1) plutot qu'etre absents de l'architecture. L'etude ne distingue pas entre suppression deliberee et migration vers d'autres couches de securite (Section Discussion, implicite).

4. **Correlation causale non demontree.** La pression commerciale vers la "helpfulness" est invoquee comme cause de l'erosion mais pas formellement demontree. La correlation temporelle (R2 = 0.944) ne prouve pas la causalite -- des facteurs confondants (changements architecturaux, nouvelles donnees d'entrainement) ne sont pas controles (Section Discussion, p.5).

5. **Versions de modeles pas toujours precisees.** Les modeles sont versiones au fil du temps mais les versions exactes ne sont pas toujours documentees, rendant certaines comparaisons temporelles ambigues (Section Discussion, p.5-6).

**Questions ouvertes :**
- La disparition des disclaimers est-elle compensee par des mecanismes alternatifs (output filters, system prompts) ?
- Comment les modeles medicaux specialises (Med-PaLM, Meditron) se comparent-ils sur cette metrique ?
- Cette tendance est-elle reversible par regulation (EU AI Act, FDA guidance) ?

### Formules exactes

Classification epistemique : `[EMPIRIQUE]` -- statistiques inferentielles standard, pas de contribution formelle.

**Regression lineaire longitudinale** (Section Results, p.2) :
```
disclaimer_rate(year) = a * year + b
R2 = 0.944, p = 0.028
Reduction annuelle estimee : -8.1 points de pourcentage
```

**Chi-square cross-modele (questions medicales)** (Sharma et al., 2025, Section Results, p.2) :
```
chi2 = 266.03, p < 0.00001
```
Difference significative entre familles de modeles par type de question clinique.

**Chi-square cross-modele (images medicales)** (Sharma et al., 2025, Section Results, p.3, apres Fig. 3) :
```
chi2 = 221.42, p < 0.00001
```
Difference significative entre familles pour les images medicales.

**Correlation precision-disclaimers** (Sharma et al., 2025, Section Results, p.4) :
```
r = -0.64, p = 0.010 (toutes modalites)
r = -0.70, p = 0.004 (mammographies -- plus forte)
r = -0.47, p = 0.077 (dermatologie -- non significative)
r = -0.48, p = 0.070 (radiographies thoraciques -- non significative)
```

**Wilcoxon high-risk vs low-risk** (Sharma et al., 2025, Section Results, p.4, Fig. 4) :
```
W = 13.0, p = 0.023
High-risk images : 18.8% disclaimers
Low-risk images : 16.2% disclaimers
```

**Donnees longitudinales par annee (LLM)** (Sharma et al., 2025, Section Results, p.2-3, Fig. 1) :
- 2022 : 26.3% (GPT-3.5 Turbo uniquement ; sante mentale 80.7%, medicaments 0.3%) (Sharma et al., 2025, Section Results, p.2)
- 2023 : 12.4% (GPT-4 16.5%, GPT-4 Turbo 14.7%, Grok Beta 6%) (Sharma et al., 2025, Section Results, p.2)
- 2024 : 7.5% (Gemini 1.5 Flash 57.2%, Claude 3 Opus 7.3%, Claude 3.5 Sonnet 2.5%) (Sharma et al., 2025, Section Results, p.2-3)
- 2025 : 0.97% (GPT-4.5 0%, Grok 3 0%, Gemini 2.0 Flash 2.1%, Claude 3.7 Sonnet 1.8%) (Sharma et al., 2025, Section Results, p.3)

**Par famille (toutes annees confondues)** (Sharma et al., 2025, Section Results, p.1-2, donnees avant Fig. 1) :
- Google : 41.0% questions / 49.1% images
- OpenAI : 7.7% / 9.8%
- Anthropic : 3.1% / 11.5%
- xAI : 3.6% / 8.6%
- DeepSeek : 0% / 0%

Lien glossaire AEGIS : F22 (ASR -- indirectement, l'erosion augmente l'ASR baseline), lie a la mesure de drift temporel delta-0

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF alignment) : evidence directe de la degradation longitudinale de l'alignement -- le taux de disclaimers chute de 26.3% a 0.97% en 3 ans SANS attaque active (Section Results, p.2)
  - δ¹ (System prompt) : potentiellement affecte mais non mesure directement -- les disclaimers pourraient avoir migre vers les instructions systeme
  - δ² δ³ : l'erosion de delta-0 renforce l'argument pour des couches de defense externes independantes du modele

- **Conjectures :**
  - C1 (insuffisance delta-1) : **supportee indirectement** -- l'erosion des disclaimers suggere que meme les instructions systeme de securite sont desactivees ou affaiblies
  - C2 (necessite delta-3) : **fortement supportee** -- la degradation temporelle sans attaque active montre que delta-0 n'est pas fiable a long terme ; des garanties formelles sont necessaires
  - C4 (pression commerciale) : **fortement supportee** -- la course a la "helpfulness" erode la securite, documentee quantitativement (R2 = 0.944, p = 0.028, Section Results, p.2)

- **Decouvertes :**
  - D-002 (erosion temporelle) : **confirmee** -- R2 = 0.944, reduction de 8.1 points/an (Section Results, p.2)
  - D-003 (fragilite alignment) : **confirmee** -- delta-0 se degrade meme sans attaque
  - D-016 (variation provider) : **confirmee** -- DeepSeek 0%, Google 41%, ecart massif (Section Results, p.2)

- **Gaps :**
  - G-001 (evaluation medicale) : **directement adresse** -- etude medicale multi-specialite
  - G-021 (mecanismes compensatoires) : **cree** -- les disclaimers ont-ils migre vers d'autres mecanismes ?
  - G-022 (regulation) : **cree** -- impact de l'EU AI Act sur la tendance non evalue

- **Mapping templates AEGIS :** pas de mapping direct aux templates d'attaque -- ce papier documente une tendance defensive, pas un vecteur d'attaque ; pertinent pour la calibration temporelle des mesures AEGIS

### Citations cles
> "Disclaimer presence in LLM outputs dropped from 26.3% in 2022 to 0.97% in 2025" (Abstract, p.1)
> "R2 = 0.944, p = 0.028, with an estimated annual reduction of 8.1 percentage points" (Section Results, p.2)
> "GPT 4.5 and Grok 3 included no disclaimers at all" (Section Results, p.3)
> "a significant negative correlation was observed (r = -0.64, p = 0.010), indicating that as diagnostic accuracy increased, the inclusion of disclaimers declined" (Section Results, p.4)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute -- TIMed-Q public (GitHub), images de datasets publics (Mammo-Bench, DDI, Kermany), API access standardise |
| Code disponible | Partiel -- TIMed-Q dataset public (https://github.com/sonalisharma-3/TIMed-Q) |
| Dataset public | Oui -- TIMed-Q + images publiques |
| Nature epistemique | [EMPIRIQUE] -- etude observationnelle longitudinale, statistiques inferentielles |
| Confiance | 9/10 -- donnees verifiees dans le fulltext, statistiques reproductibles |

---

*Analyse reecrite le 2026-04-05 | Source : 53 chunks paper_fulltext + 29 chunks analysis ChromaDB (aegis_bibliography) | Toutes les donnees verifiees dans le PDF original via ChromaDB*
