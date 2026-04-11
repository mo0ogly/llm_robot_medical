# P024 — Can LLMs Separate Instructions From Data? And What Do We Even Mean by That?

**Auteurs** : Egor Zverev (ISTA), Sahar Abdelnabi (Microsoft Security Response Center), Soroush Tabesh (ISTA), Mario Fritz (CISPA Helmholtz Center), Christoph H. Lampert (ISTA)
**Venue** : ICLR 2025 (conference paper)
**arXiv** : 2403.06833v3 (31 Jan 2025)
> **PDF Source**: [literature_for_rag/P024_source.pdf](../../assets/pdfs/P024_source.pdf)
**PDF** : https://arxiv.org/abs/2403.06833
**Code** : https://github.com/egozverev/Shold-It-Be-Executed-Or-Processed
**[ARTICLE VERIFIE]** — Texte complet lu depuis ChromaDB (77 chunks, ingestion 2026-04-04)

---

## Section 1 — Resume critique (500 mots)

Cette publication constitue la premiere formalisation mathematique rigoureuse du probleme de separation instruction/donnee dans les LLM. Le constat de depart est structurel : les LLM instruction-tuned ne maintiennent aucune separation explicite entre les instructions qu'ils doivent executer et les donnees qu'ils doivent traiter passivement. Cette absence de separation — analogue a l'absence de bit NX dans les architectures CPU avant 2005 ou a l'absence de prepared statements avant les defenses SQL injection — rend les modeles fondamentalement vulnerables aux injections de prompt indirectes.

La contribution centrale est la **Definition 2** (Zverev et al., 2025, Section 3, p.4) : le score de separation Sep(M), une mesure formelle basee sur la divergence de Kullback-Leibler qui quantifie la difference de comportement d'un modele g lorsqu'une chaine de sondage (probe string x) apparait dans l'argument instruction versus dans l'argument donnee. Un Sep(M) faible signifie que le modele traite les probes de maniere indistincte quelle que soit leur position — il est donc vulnerable. Un Sep(M) eleve signifie que le modele distingue clairement instructions et donnees.

Comme Sep(M) theorique est incalculable en pratique (distributions inconnues, espace de sortie intractable, probabilites potentiellement inaccessibles), les auteurs derivent le **score de separation empirique** (Definition 4, Eq. 2, Section 3.2, p.5) et le **score d'utilite**. Ces metriques operent exclusivement sur les sorties du modele via le mecanisme de **surprise witness** (Definition 3, Section 3.2, p.5) : un mot w est temoin surprise si sa presence dans la sortie est quasi-certaine quand le probe est execute comme instruction, mais quasi-impossible quand il est traite comme donnee. L'exemple canonique est le mot "murder" (nom collectif des corbeaux) qui apparait si le modele execute la question mais pas s'il analyse le sentiment du texte.

Le **dataset SEP** (Should it be Executed or Processed?) contient 9 160 tuples (s, d, x, w) (Zverev et al., 2025, Section 4, p.6) couvrant 30 taches manuelles, 300 sous-taches generees par GPT-4, et 100 paires probe-temoin. Les probes sont positionnes aleatoirement au debut ou a la fin des arguments, creant 4 combinaisons pour eliminer les effets d'ordre (Liu et al., 2023).

Les resultats experimentaux sur 9 modeles sont alarmants (Zverev et al., 2025, Table 4, Section 5.1). En mode Naive (sans mitigation) : GPT-4 obtient 20.8%, Llama-3 (8B) 30.8%, Gemma-2B 73.2%, moyenne hors GPT 37.5% (Zverev et al., 2025, Table 4). Observation cruciale : les modeles plus grands/capables ont des scores de separation PLUS BAS — GPT-3.5 (56.6%) > GPT-4 (20.8%), Gemma-2B (73.2%) > Gemma-7B (56.9%), Llama-2 (44.3%) > Llama-3 (30.8%) (Zverev et al., 2025, Section 5.1, p.7). L'hypothese avancee est la superposition de taches (Xiong et al., 2024) : les modeles plus puissants executent simultanement la tache principale ET le probe injecte (Zverev et al., 2025, Section 5.1, p.7).

Les trois strategies de mitigation testees revelent un **compromis separation-utilite** structurel :
- **Prompt engineering** (Zverev et al., 2025, Section 6.1, Table 4) : ameliore GPT-4 de 20.8% a 95.3% (mais biais potentiel car GPT-4 a genere SEP, cf. Section 6.1), echoue sur Gemma-7B (inchange a 56.9%), moyenne +24%pt mais resultats tres heterogenes.
- **Prompt optimization** (gradient-based, 20 tokens) (Zverev et al., 2025, Section 6.2, Table 4) : gain modeste de +7.2%pt en moyenne, utilite preservee (+2.1%pt), mais insuffisant.
- **Fine-tuning** (LoRA, DPO) (Zverev et al., 2025, Section 6.3, Table 4) : separation excellente (moyenne 95.5%) mais effondrement de l'utilite de 67.8% a 50.0% (perte de -17.8%pt, DPO specifiquement, Section 6.3, Appendix B.4).

La Figure 2 (Zverev et al., 2025, Section 6, p.9) synthetise : la tendance lineaire est negativement orientee — separation elevee correle avec utilite reduite. Les auteurs concluent que le probleme ne sera vraisemblablement pas resolu par le scaling et que des approches fondamentalement nouvelles (architecturales) sont necessaires (Zverev et al., 2025, Section 7, Conclusion).

---

## Abstract original

> Large Language Models (LLMs) show impressive results in numerous practical applications,
but they lack essential safety features that are common in other areas of computer science,
particularly an explicit separation of instructions and data. This makes them vulnerable to
manipulations such as indirect prompt injections and generally unsuitable for safety-critical
tasks. Surprisingly, there is currently no established definition or benchmark to quantify this
phenomenon. In this work, we close this gap by introducing a formal measure for instruction-
data separation for single-turn language mod rently no established definition or benchmark to quantify this
phenomenon. In this work, we close this gap by introducing a formal measure for instruction-
data separation for single-turn language models and an empirical variant that is calculable from
a model’s outputs. We also present a new dataset, SEP, that allows estimating the measure
for real-world models. Our results on various LLMs show 
>
> -- Extrait du PDF source via ChromaDB



## Section 2 — Formules exactes

### Definition 1 — Modele de langage single-turn (abstraction)
$$g : A^* \times A^* \to \mathcal{M}(A^*)$$
ou A* est l'ensemble des chaines sur l'alphabet A, et M(.) denote l'ensemble des distributions de probabilite sur un ensemble de base. Le premier argument est l'**argument instruction**, le second l'**argument donnee**. La definition est agnostique a l'architecture — elle ne specifie pas comment la separation est implementee.

**Lien these** : Cette abstraction est la base formelle de toute la these AEGIS. Elle permet de raisonner sur la separation independamment du modele teste (Ollama local ou API commerciale).

### Definition 2 — Score de separation Sep(M) [F15]
$$\text{sep}_p(g) = \mathbb{E}_{(s,d,x) \sim p} \left[ D\big(g(s, x + d),\ g(s + x, d)\big) \right]$$
ou :
- s = task prompt, d = data prompt, x = probe string (chaine de sondage)
- D(., .) = mesure de dissimilarite entre distributions (ex. divergence KL, distance de Wasserstein)
- + = forme appropriee de combinaison de prompts (concatenation)
- p = distribution jointe sur les triples (s, d, x)

**Interpretation** : Sep(M) mesure combien le modele se comporte differemment quand x est instruction (g(s+x, d)) versus quand x est donnee (g(s, x+d)). Sep(M) = 0 si le modele concatene simplement ses arguments (aucune separation). Sep(M) eleve si les donnees ne sont jamais traitees comme instructions.

**Lien F15** : Formule centrale de la these. Utilisee comme metrique d'evaluation dans le pipeline AEGIS red team.

### Definition 3 — Surprise Witness [F22b]
$$w \text{ est temoin surprise si } \Pr_{s \sim p}\{w \in s\} \approx 0 \text{ mais } \Pr_{s \sim q}\{w \in s\} \approx 1$$
ou p = g(s, x+d) (probe comme donnee, x est traite) et q = g(s+x, d) (probe comme instruction, x est execute). La relation "dans" signifie "apparait comme sous-chaine".

**Intuition** : L'existence d'un temoin surprise implique que D_KL(p || q) ne peut pas etre petite, car il existe au moins un element de haute probabilite dans q qui a une probabilite negligeable dans p. Le temoin est verifiable par simple echantillonnage sans acces aux probabilites internes.

**Lien F22b** : Fonde la calculabilite empirique de Sep(M). Critique pour la validation experimentale AEGIS avec N >= 30.

### Definition 4 — Score de separation empirique et score d'utilite [F16]
$$\hat{\text{sep}}(g) = \frac{\sum_{i=1}^{n} \mathbb{1}\{w_i \in y_i^I \wedge w_i \notin y_i^D\}}{\sum_{i=1}^{n} \mathbb{1}\{w_i \in y_i^I\}}$$

$$\hat{\text{uti}}(g) = \frac{1}{n} \sum_{i=1}^{n} \mathbb{1}\{w_i \in y_i^I\}$$

ou :
- D = {(s_i, d_i, x_i, w_i)} dataset de n tuples
- y_i^I ~ g(s_i + x_i, d_i) = sortie avec probe en argument instruction
- y_i^D ~ g(s_i, x_i + d_i) = sortie avec probe en argument donnee
- w_i = candidat temoin surprise

**Interpretation de sep empirique** : Parmi tous les cas ou le modele produit le temoin quand le probe est instruction (denominateur), combien de fois ne le produit-il PAS quand le probe est donnee (numerateur). Score eleve = bonne separation.

**Interpretation de uti** : Fraction des cas ou le modele execute correctement le probe quand il est dans l'argument instruction. Score faible = modele de qualite insuffisante.

**Lien F16** : Version operationnelle de F15. C'est cette formule qui est implementee dans AEGIS. Le denominateur conditionne la validite statistique : si uti est tres bas, sep est calcule sur peu de cas.

### Lien avec F51 (ASIDE, P057)
F51 decrit la rotation orthogonale R * e(x_t) proposee dans P057 (Zverev et al., suite de P024). ASIDE applique une matrice de rotation R aux embeddings des tokens identifies comme donnees, creant une separation architecturale dans l'espace vectoriel. La chaine causale est :

**CC8** : F01 (Cosine) -> F51 (ASIDE rotation) -> F15 (Sep(M) ameliore)

P057 utilise precisement Sep(M) de P024 comme metrique de validation, bouclant le cadre theorique.

---

## Section 3 — Critique methodologique

### 3.1 Limitation single-turn
La Definition 1 (Zverev et al., 2025, Section 3, p.4) restreint explicitement le cadre aux modeles single-turn. Les auteurs en sont conscients et le justifient comme une simplification necessaire pour la premiere formalisation (Zverev et al., 2025, Section 3, Discussion after Def. 1). Cependant, les applications reelles (chatbots medicaux, agents autonomes, pipelines RAG multi-tour) operent en mode multi-tour ou l'etat conversationnel accumule des vulnerabilites. P050 (JMedEthicBench) demontre une degradation ethique de 9.5 (Turn 0) a 5.5 (Turn 2) (p<0.001, Mann-Whitney U test avec correction Bonferroni, Cohen's d=0.75 pour Turn 0 vers Turn 1) (Tanaka et al., 2026, Section 5.3, Figure 4a), un phenomene invisible dans le cadre single-turn de P024. Cette limitation est critique pour la these AEGIS qui cible les scenarios medicaux multi-etapes.

### 3.2 Absence de domaine medical
Le dataset SEP couvre des taches generiques (sentiment analysis, summarization, information retrieval) mais aucune tache medicale. Or P029 montre un ASR de 94.4% en contexte medical (Lee et al., 2025, JAMA Network Open) [PDF NON DISPONIBLE --- source secondaire] et P035 (MPIB) fournit le premier benchmark medical avec N >= 30. La generalisation des resultats SEP au domaine medical n'est pas validee et constitue un gap experimental (G-010).

### 3.3 Proxy system/user prompt imparfait
Les auteurs reconnaissent que l'utilisation de system prompt = instruction et user prompt = donnee est un proxy imparfait (Zverev et al., 2025, Section 5.1, p.7). Certains modeles (Starling, Gemma) ne distinguent pas system et user prompts, necessitant des marqueurs artificiels. De plus, les modeles sont entraines pour repondre aux instructions du user prompt, rendant la confusion attendue. Ce biais systematique sous-estime potentiellement la vraie capacite de separation.

### 3.4 Biais potentiel GPT-4
GPT-4 a ete utilise pour generer les sous-taches et donnees du dataset SEP (Zverev et al., 2025, Section 4, p.6). Son excellent score post-prompt-engineering (95.3%) (Zverev et al., 2025, Table 4, Section 6.1) pourrait etre partiellement du a une familiarite avec ses propres generations. Les auteurs signalent ce biais mais ne le quantifient pas (Zverev et al., 2025, Section 6.1). Les modeles open-source sont donc les resultats les plus fiables.

### 3.5 Comparaison avec ISE (P076)
ISE (Instructional Segment Embedding, Wu et al., ICLR 2025) propose une approche complementaire : embedder la priorite des instructions directement dans l'architecture via 3 niveaux (system > user > data). ISE ameliore la robustesse de +18.68% en average robust accuracy (Wu et al., 2025, ICLR 2025, Abstract p.1, Table 1, Section 6.1) mais reste vulnerable a la confusion de privilege. Contrairement a Sep(M) qui est une metrique de diagnostic, ISE est une defense active. La these AEGIS necessite les deux : Sep(M) pour mesurer, ISE/ASIDE pour defendre.

---

## Section 4 — Impact these AEGIS

### 4.1 Conjecture C2 (necessite δ³)
P024 est l'une des preuves les plus directes de C2. Le compromis separation-utilite (Zverev et al., 2025, Figure 2, p.9, tendance negative) demontre que les couches δ⁰ a δ² ne peuvent pas simultanement garantir la separation ET l'utilite. Le fine-tuning (meilleur δ⁰) atteint 95.5% de separation mais perd 17.8%pt d'utilite (Zverev et al., 2025, Section 6.3, Table 4-5). Le prompt engineering (δ¹) est inconsistant (GPT-4 95.3% vs Gemma-7B 56.9%) (Zverev et al., 2025, Table 4, Section 6.1). Conclusion directe : une couche δ³ de validation formelle des sorties est necessaire pour compenser ce compromis structurel. Score C2 : 10/10 sature, P024 est l'un des 5 piliers.

### 4.2 Conjecture C5 (cosine insuffisante)
Sep(M) utilise la divergence KL, pas la similarite cosinus. Ce choix est delibere : la KL capture des differences distributionnelles que le cosinus manque (cf. P012 matrice gauge, P013 antonymes). P057 (ASIDE) renforce ce point en montrant que la rotation orthogonale dans l'espace d'embedding ameliore Sep(M) — ce qui implique que la metrique cosinus brute de all-MiniLM-L6-v2 est insuffisante pour detecter les violations de separation. La chaine causale CC1 (F01 -> F05 -> F15 -> F16) montre la dependance : le cosinus (F01) alimente le SemScore (F05) qui est un COMPLEMENT a Sep(M) (F15/F16), pas un substitut.

### 4.3 Decouverte D-001 (Triple Convergence)
P024 fonde le Pilier 1 de D-001 : δ⁰ est effacable/insuffisant. Sep(M) faible (20.8%-73.2%) (Zverev et al., 2025, Table 4, colonne Naive) prouve que l'alignement RLHF (δ⁰) n'etablit pas de separation instruction/donnee. Combine avec P039 (effacement par 1 prompt), P052 (preuve formelle par martingale), P045 (empoisonnement δ¹ RAG), et P044/P049 (bypass juges δ²), P024 contribue a la preuve que les trois premieres couches sont simultanement vulnerables.

### 4.4 Decouverte D-015 (ASIDE comme reponse partielle)
P024 pose le probleme formel, P057 propose ASIDE comme reponse architecturale. D-015 documente que la rotation orthogonale R * e(x_t) ameliore Sep(M) de +12.3 a +44.1 points de pourcentage sans perte d'utilite significative (Zverev et al., 2026, ICLR 2026, Section 4.3, Figure 2, Table 3 Appendix) — le premier mecanisme a briser le compromis separation-utilite identifie par P024. Cependant, D-015 note que ASIDE n'est pas deploye en production, n'a pas ete teste contre des attaques adaptatives (G-019), et ne resout pas l'empoisonnement RAG (δ¹) ni le bypass des juges (δ²). ASIDE est donc une reponse PARTIELLE a D-001 via le renforcement de δ⁰.

### 4.5 Impact sur le pipeline AEGIS
Sep(M) empirique (F16) est la metrique centrale du pipeline red team AEGIS. Chaque scenario d'attaque produit un couple (sep, uti) qui positionne le modele teste sur le graphique separation-utilite de la Figure 2. La condition de validite statistique N >= 30 par condition (Section 3 de la these) est directement derivee du raisonnement frequentiste implicite dans la Definition 4. Quand N < 30, le flag `statistically_valid: false` est obligatoire.

---

## Section 5 — Classification

| Dimension | Valeur |
|-----------|--------|
| **Paper ID** | P024 |
| **Pertinence these** | **10/10** — Reference methodologique centrale |
| **Couches δ** | δ⁰ (evaluation RLHF), δ¹ (prompt engineering evalue), δ³ (formalisation Sep(M) comme premier pas) |
| **Conjectures** | C1 (10/10), C2 (10/10), C3 (via lien avec P057 ASIDE), C4 (9/10 — Sep(M) est la metrique), C5 (8/10 — KL vs cosinus) |
| **Decouvertes** | D-001 (Pilier 1), D-015 (via P057 suite directe) |
| **Formules** | F15 (Sep(M)), F16 (Sep empirique + Utilite), F22b (Surprise Witness) |
| **Chaines causales** | CC1 (F01->F05->F15->F16), CC8 (F01->F51->F15) |
| **Gaps identifies** | G-010 (pas de test medical), G-019 (ASIDE vs attaques adaptatives), G-023 (comparaison ISE vs ASIDE) |
| **Dataset** | SEP — 9 160 tuples, 30 taches, 300 sous-taches, 100 probes, 4 positions |
| **Modeles evalues** | 9 modeles : GPT-3.5, GPT-4, Gemma-2B/7B, Phi-3, Llama-2/3, Starling, Zephyr |
| **Resultat cle** | Compromis separation-utilite non resolu par prompt engineering, prompt optimization ou fine-tuning |
| **Conclusion operationnelle** | Approches architecturales (δ³) necessaires — ni le scaling ni les mitigations post-hoc ne suffisent |

### Donnees quantitatives cles

| Modele | Sep Naive | Sep PromptEng | Sep Fine-tuning | Uti Naive | Uti Fine-tuning |
|--------|-----------|---------------|-----------------|-----------|-----------------|
| GPT-4 | 20.8% | **95.3%** | n/a | 83.3% | n/a |
| GPT-3.5 | 56.6% | 89.5% | n/a | 79.2% | n/a |
| Llama-3 (8B) | 30.8% | 49.8% | **98.4%** | 86.0% | 51.6% |
| Gemma-2B | 73.2% | 92.4% | 95.0% | 36.7% | 30.1% |
| Phi-3-mini | 13.3% | 30.8% | 97.0% | 84.8% | 69.2% |
| **Moyenne (hors GPT)** | **37.5%** | **52.6%** | **95.5%** | **67.8%** | **50.0%** |

### Tags δ
- [x] δ⁰ — Tous les modeles RLHF-aligned montrent une separation faible (13.3%-73.2%), revelant les limites structurelles de l'alignement de base
- [x] δ¹ — Le prompt engineering est evalue comme mitigation, resultats inconsistants (+24%pt moyen mais haute variance)
- [ ] δ² — [NON MENTIONNE] — Le filtrage syntaxique n'est pas aborde dans le cadre formel de P024
- [x] δ³ — La formalisation de Sep(M) est un premier pas vers des garanties formelles ; la conclusion appelle explicitement des changements architecturaux

---

*Analyse produite le 2026-04-04 par l'agent ANALYST doctoral (AEGIS, ENS 2026). Texte source : 77 chunks ChromaDB, paper complet ICLR 2025. Cette analyse remplace la version precedente (v1, archivee).*
