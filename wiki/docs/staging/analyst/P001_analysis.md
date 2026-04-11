# P001: Prompt Injection Attack against LLM-integrated Applications
**Auteurs**: Yi Liu, Gelei Deng, Yuekang Li, Kailong Wang, Zihao Wang, Xiaofeng Wang, Tianwei Zhang, Yepang Liu, Haoyu Wang, Yan Zheng, Leo Yu Zhang, Yang Liu
**Venue**: arXiv:2306.05499v3, decembre 2025 (premiere soumission juin 2023)
> **PDF Source**: [literature_for_rag/P001_2306.05499.pdf](../../assets/pdfs/P001_2306.05499.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (94 chunks, 93 622 caracteres)

---

## Section 1 — Resume critique (500 mots)

### Contribution principale

Liu et al. introduisent HOUYI, la premiere methodologie systematique d'injection de prompt en boite noire ciblant les applications integrant des LLM. L'apport central n'est pas la decouverte de l'injection de prompt en tant que telle — deja documentee par Perez et al. et Greshake et al. — mais la formalisation d'un cadre d'attaque structure en trois composantes qui transpose explicitement les paradigmes d'injection web (SQL injection, XSS) au domaine des LLM. Cette transposition constitue un saut conceptuel : les auteurs demontrent que la confusion instruction/donnee, probleme fondamental de la securite applicative depuis les annees 2000, se reproduit de maniere isomorphe dans l'architecture des transformers.

### Methodologie

L'etude procede en deux phases. D'abord, une etude pilote sur 10 applications commerciales LLM-integrated selectionnees depuis SUPERTOOLS (Liu et al., 2023, Section 3.2.1) (2 par categorie : chatbot, assistant d'ecriture, assistant de code, analyse business, generation creative). Les auteurs appliquent trois strategies d'attaque existantes (injection directe, caracteres d'echappement, ignorance de contexte) combinees avec trois questions de preuve-de-concept (Q1: "print hello world", Q2: "What is the capital of the USA?", Q3: "Repeat the prompt of this question"), repetees 5 fois chacune. Les resultats revelent un echec quasi-total des techniques existantes — seules les applications chatbot repondent aux questions simples, ce qui releve de leur fonctionnalite prevue.

Ensuite, l'evaluation principale deploie HOUYI sur 36 applications reelles (Liu et al., 2023, Section 6.1). Le toolkit est implemente en Python (2 150 lignes) (Liu et al., 2023, Section 6). GPT-3.5-turbo est utilise pour l'inference de feedback et la generation des composantes, avec parametres par defaut (temperature=1, top_p=1) (Liu et al., 2023, Section 6). Cinq scenarios d'exploitation sont testes : PROMPT LEAKING, CODE GENERATION, CONTENT MANIPULATION, SPAM GENERATION, INFORMATION GATHERING (Liu et al., 2023, Table 3). Chaque scenario est execute 5 fois par application (Liu et al., 2023, Section 6.1).

### Resultats cles

- **31 sur 36 applications vulnerables** (86,1% de taux de susceptibilite) (Liu et al., 2023, Section 1, Section 6.2, Table 4)
- **10 vendeurs** ont confirme les vulnerabilites, dont Notion (20 millions d'utilisateurs) et Writesonic (Liu et al., 2023, Section 6.1, Section 6.4)
- **5 applications resistantes** : STORYCRAFT, STARTGEN, COPYBOT (LLM domaine-specifique), GAMLEARN (procedures internes complexes), MINDGUIDE (modeles multimodaux) (Liu et al., 2023, Section 6.2)
- **Perte financiere estimee pour PAREA** : $259,2/jour (90k tokens/min a $0,002/1k tokens GPT-3.5-turbo, extrapole sur 1440 minutes) (Liu et al., 2023, Section 6.4.2)
- L'etude d'ablation (Liu et al., 2023, Figure 5, Section 6.3) montre que HOUYI-SEMANTIC-ONLY est le plus performant des variants individuels, tandis que la combinaison des trois strategies de separation (syntaxique + changement de langue + semantique) maximise la couverture

### Limitations admises par les auteurs

Les auteurs reconnaissent explicitement trois limitations. Premierement, la **reproductibilite temporelle** : l'evolution rapide des applications LLM-integrated peut rendre les vulnerabilites detectees non-reproductibles (Liu et al., 2023, Section 7.3). Deuxiemement, les **strategies de separation** ne couvrent que trois approches ; les auteurs admettent qu'elles ne font probablement qu'effleurer la surface des techniques possibles (Liu et al., 2023, Section 7.2). Troisiemement, en contexte boite noire, il est impossible de verifier si les donnees extraites par PROMPT LEAKING sont reelles ou des hallucinations du LLM — la confirmation des vendeurs est necessaire (Liu et al., 2023, Section 6).

---

## Abstract original

> Large Language Models (LLMs), renowned for their supe-
rior proficiency in language comprehension and generation,
stimulate a vibrant ecosystem of applications around them.
However, their extensive assimilation into various services
introduces significant security risks. This study deconstructs
the complexities and imp ate a vibrant ecosystem of applications around them.
However, their extensive assimilation into various services
introduces significant security risks. This study deconstructs
the complexities and implications of prompt injection attacks
on actual LLM-integrated applications. Initially, we conduct
an exploratory analysis on ten commercial applications, high-
lighting the constraints of current attack strategies in practice.
Prompted by these limitations, we subsequently formulate
HOUYI, a novel black-box prompt injection attack technique,
which draws inspiration from traditional web injection attacks.
HOUYIis compartmentalized into three crucial elements: a
seamlessly-in
>
> -- Extrait du PDF source via ChromaDB



## Section 2 — Formules exactes

L'article ne contient **aucune formule mathematique formelle**. L'approche est exclusivement empirique et algorithmique. Neanmoins, plusieurs elements formalisables sont presents :

### F1 — Algorithme de mise a jour des strategies (Algorithm 1)

**Notation originale** (pseudo-code) :
```
Input: a (application cible), f (Framework Component), s (Separator Component), d (Disruptor Component)
Output: S (ensemble des prompts reussis)

S <- ensemble_vide
while Not all attacks completed do
    p <- f + s + d
    r <- inject_prompt(a, p)
    success <- evaluate_success(r)
    if success then
        S <- S union {p}
        d <- select_new_disruptor()
    else
        f <- create_new_framework()
        s_strategy <- create_new_separator_strategy()
        s <- generative_LLM(s_strategy)
return S
```

**Variables** : `a` = application cible (boite noire), `f` = composante cadre, `s` = composante separatrice, `d` = composante disruptive, `p` = prompt composite, `r` = reponse, `S` = ensemble des exploits reussis.

**Interpretation** : L'algorithme itere sur les strategies de separation en cas d'echec, et sur les objectifs malveillants en cas de succes. C'est un algorithme glouton a raffinement iteratif, sans garantie de convergence formelle.

### F2 — Taux de susceptibilite (implicite)

```
susceptibility_rate = |{app in A : exists scenario, inject_prompt(app, p_houyi) = success}| / |A|
```

Valeur empirique : 31/36 = 86,1%

### F3 — Estimation de perte financiere (Section 6.4.2)

```
daily_loss = tokens_per_minute * cost_per_1k_tokens / 1000 * minutes_per_day
           = 90000 * 0.002 / 1000 * 1440
           = $259.2/jour
```

### Lien avec le glossaire AEGIS

| Formule papier | Formule AEGIS | Correspondance |
|----------------|---------------|----------------|
| Algorithm 1 (iterative refinement) | Moteur Genetique (Section 7, formal_framework) | HOUYI est l'ancetre direct du moteur genetique AEGIS ; la structure 3-composantes (Framework/Separator/Disruptor) est reprise et etendue avec mutation/crossover |
| susceptibility_rate | violation_rate(i) (F01, Section 4.1) | Le taux de violation AEGIS generalise le taux binaire de Liu avec Wilson CI et N>=30 |
| [NON MENTIONNE DANS LE PAPIER] | Sep(M) (F05, Section 4.2) | La separation contexte/payload n'est PAS mesuree quantitativement par Liu — c'est le gap principal que Zverev et al. (2025) comblent |
| [NON MENTIONNE DANS LE PAPIER] | Cosine Drift (F06, Section 4.3) | Aucune mesure de derive semantique dans le papier original |

---

## Section 3 — Critique methodologique

### Taille d'echantillon et puissance statistique

**N insuffisant pour des conclusions robustes.** Chaque scenario est teste 5 fois par application (Liu et al., 2023, Section 6.1). Avec N=5, l'intervalle de confiance de Wilson a 95% pour un taux observe de 5/5 (100%) est [56,6%, 100%] (calcul AEGIS, methode de Clopper-Pearson). Pour un taux de 3/5 (60%), l'IC est [23,1%, 88,2%]. Ces intervalles extremement larges rendent toute conclusion quantitative fragile. Le cadre AEGIS exige N>=30 par condition (Section 4.1 du formal_framework), ce qui signifie que les resultats de Liu ne satisfont pas les criteres de validite statistique de la these. Le resultat global de 31/36 est neanmoins indicatif d'une tendance forte, meme si les taux par application individuelle sont imprecis.

### Reproductibilite

**Moyenne.** Le code n'est pas publie dans le papier (seul le nombre de lignes est mentionne : 2 150 lignes Python) (Liu et al., 2023, Section 6). Les applications cibles sont anonymisees (sauf Notion, Parea, Writesonic) (Liu et al., 2023, Section 6.1), rendant la replication impossible sur les memes cibles. Cependant, la methodologie est suffisamment detaillee (Liu et al., 2023, Sections 5.1-5.6) pour etre reimplementee, ce qu'AEGIS a fait dans son moteur genetique (Section 7 du formal_framework).

### Biais potentiels non mentionnes

1. **Biais de selection des applications** : Toutes proviennent de SUPERTOOLS, un agregateur de tendances (Liu et al., 2023, Section 3.2.1, Section 6.1). Aucune application critique (medicale, financiere, juridique, militaire) n'est evaluee. Les applications grand public ont generalement des defenses moins sophistiquees que les systemes critiques.

2. **Biais du LLM evaluateur** : GPT-3.5-turbo est utilise a la fois pour generer les attaques (Liu et al., 2023, Section 5.3, Section 5.6) et pour evaluer leur succes. Cette auto-evaluation par le meme fournisseur (OpenAI) introduit un biais potentiel : les attaques generees par GPT-3.5 pourraient etre naturellement plus efficaces contre des applications utilisant des modeles OpenAI.

3. **Absence de baseline formelle** : Les auteurs comparent HOUYI aux techniques heuristiques existantes, mais sans baseline quantitative standardisee. L'etude d'ablation (Liu et al., 2023, Section 6.3, Figure 5) ne compare que les variantes internes de HOUYI.

4. **Pas de mesure de severite** : Le succes est binaire (la reponse contient-elle la bonne reponse ?). Aucune echelle de severite (type SVC AEGIS) n'est proposee. Un prompt leaking partiel et une exfiltration complete comptent de la meme maniere.

5. **Biais temporel** : L'article v3 date de decembre 2025, mais les experiences ont ete conduites en 2023 sur des modeles GPT-3.5/GPT-4 de cette epoque. Les defenses ont considerablement evolue depuis (instruction hierarchy d'OpenAI, system message isolation d'Anthropic, guardrails de troisieme generation).

### Comparaison avec des travaux plus recents (2025-2026)

- **Zverev et al. (2025, ICLR)** formalisent le Sep(M) — score de separation — qui quantifie ce que Liu ne mesure que qualitativement. La "partition de contexte" de HOUYI est desormais mesurable via des embeddings (all-MiniLM-L6-v2).
- **Hackett et al. (2025)** identifient 12 techniques d'injection de caracteres (unicode, homoglyphes, etc.) que HOUYI n'aborde pas du tout — le papier se limite aux strategies textuelles basiques.
- Les defenses de 2025-2026 (CaMeL, NeMo Guardrails v2, Llama Guard 3) ont rendu plusieurs des strategies de HOUYI obsoletes contre les modeles de derniere generation, bien que le principe sous-jacent reste valide.

### Ce que le papier ne fait PAS (gaps)

- **G-001** : Pas de formalisation mathematique de la separation instruction/donnee
- **G-002** : Pas de modele de defense propose (papier purement offensif)
- **G-003** : Pas d'evaluation en contexte critique (medical, financier, militaire)
- **G-004** : Pas de mesure quantitative de la severite des impacts
- **G-005** : Pas d'analyse de la derive semantique des prompts mutes
- **G-006** : Pas de mecanisme de detection des hallucinations dans les donnees extraites
- **G-007** : N=5 insuffisant pour toute conclusion statistiquement valide par application

---

## Section 4 — Impact pour la these AEGIS

### Couches delta concernees

- **δ⁰ (alignement RLHF)** : Non traite directement. Toutefois, l'article mentionne le jailbreak (Liu et al., 2023, Section 8.1) comme technique connexe qui cible δ⁰. L'observation que les chatbots repondent aux questions malveillantes comme a des questions normales (Liu et al., 2023, Section 3.2.1) implique que l'alignement δ⁰ ne distingue pas les requetes injectees des requetes legitimes lorsqu'elles sont correctement encadrees.

- **δ¹ (prompt systeme)** : **Resultat central du papier.** Les 31/36 applications vulnerables (Liu et al., 2023, Section 6.2, Table 4) demontrent empiriquement l'insuffisance de la couche δ¹. La composante Framework de HOUYI est specifiquement concue pour contourner les instructions systeme pre-definies (Liu et al., 2023, Section 5.3). La capacite a extraire les prompts systeme (PROMPT LEAKING) prouve que δ¹ n'offre ni confidentialite ni integrite.

- **δ² (filtrage syntaxique)** : Partiellement adresse. L'etude pilote montre que les contraintes de format (Liu et al., 2023, Section 3.3) offrent une protection accidentelle. Cependant, l'etude d'ablation (Liu et al., 2023, Section 6.3, Figure 5) montre que HOUYI-SYNTAX-ONLY est la variante la moins efficace, ce qui suggere que les filtres syntaxiques seuls sont insuffisants. La composante Disruptor inclut des strategies d'alignement de format qui contournent les filtres δ² basiques.

- **δ³ (verification formelle)** : **Non traite mais implicitement necessaire.** L'article teste 6 defenses existantes (Liu et al., 2023, Section 7.1) : Instruction Defense, Post-Prompting, Random Sequence Enclosure, Sandwich Defense, XML Tagging, Separate LLM Evaluation. Toutes sont contournees par HOUYI (Liu et al., 2023, Section 7.1). Ce resultat constitue un argument indirect fort pour la conjecture C2 (necessite de δ³).

### Conjectures supportees/affaiblies

**C1 (Insuffisance de δ¹) — FORTEMENT SUPPORTEE**

Le resultat de 86,1% de vulnerabilite (Liu et al., 2023, Section 1, Section 6.2) constitue la preuve empirique la plus directe et la plus large de C1 dans la litterature. Avec 36 applications reelles (Liu et al., 2023, Section 6.1), c'est l'etude la plus etendue a ce jour (2023). La diversite des categories d'application (5 categories) renforce la generalite du resultat. Cependant, N=5 par condition est insuffisant selon les criteres AEGIS (N>=30).

**C2 (Necessite de δ³) — SUPPORTEE (indirectement)**

L'echec des 6 defenses testees (Liu et al., 2023, Section 7.1), qui couvrent δ¹ (Instruction Defense, Post-Prompting, Sandwich Defense) et δ² (Random Sequence Enclosure, XML Tagging) (Liu et al., 2023, Section 7.1), suggere fortement que seule une couche structurelle externe (δ³) peut offrir des garanties. La Separate LLM Evaluation (proto-δ³) est la defense la plus proche de δ³ testee, et elle echoue aussi face a HOUYI — mais les auteurs ne fournissent pas de details sur son implementation (Liu et al., 2023, Section 7.1).

**C3 a C7** — [NON MENTIONNE DANS LE PAPIER] Les conjectures C3-C7 du cadre AEGIS ne sont ni supportees ni affaiblies par ce papier, qui ne traite pas de domaines medicaux, d'actuateurs physiques, ou de systemes multi-agents.

### Mapping vers les templates AEGIS

| Composante HOUYI | Templates AEGIS concernes | Correspondance |
|-------------------|--------------------------|----------------|
| Framework Component | Templates de reconnaissance (#01-#10 approx.) | Equivalent a la phase d'amorce des templates AEGIS |
| Separator Component — Syntax | Templates d'injection par caracteres speciaux | Strategies \n, \t transposees dans les chains `prompt_override` |
| Separator Component — Language Switching | Templates multilingues | Strategie directement implementee dans AEGIS (chain `language_switch`) |
| Separator Component — Semantic | Templates de manipulation semantique | Strategies "reasoning summary", "specific ignoring", "additional task" reprises dans les chains `summarize`, `hyde` |
| Disruptor Component — Prompt Leaking | Templates d'exfiltration systeme | Chain `prompt_override` scenario PROMPT_LEAKING |
| Disruptor Component — Content Manipulation | Templates de manipulation de sortie | Chain `feedback_poisoning` |
| Algorithm 1 (iterative refinement) | Moteur genetique AEGIS (Section 7) | Transposition directe avec extension genetique (mutation/crossover) |

### Ce qui a ete depasse depuis 2023

1. **Formalisation quantitative** : AEGIS mesure Sep(M), cosine drift, et violation_rate avec Wilson CI — toutes les metriques absentes de Liu.
2. **Contexte critique** : AEGIS evalue en contexte medical (robot chirurgical) avec actuateurs physiques, comblant G-003.
3. **Echelle de severite** : Le SVC (Security Verification Chain) d'AEGIS remplace la mesure binaire succes/echec par un scoring multi-dimensionnel a 5 dimensions.
4. **Defense structurelle** : AEGIS teste des defenses δ³ (CaMeL-class) que Liu n'avait pas.
5. **Volume statistique** : AEGIS exige N>=30 par condition, corrigeant le biais de petit echantillon de Liu.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| Delta-layers | δ¹ (central), δ² (partiel), δ⁰ (implicite) |
| Conjectures | C1 (fortement supportee), C2 (supportee indirectement) |
| SVC pertinence | 8/10 — papier fondateur de la taxonomie d'attaque, mais sans metriques quantitatives |
| Reproductibilite | Moyenne — methodologie detaillee mais code non publie, cibles anonymisees |
| Gaps adresses | G-001 (absence formalisation), G-002 (pas de defense), G-003 (pas de contexte critique), G-004 (pas de severite), G-007 (N insuffisant) |
| Decouvertes impactees | D-001 (transposition injection web vers LLM), D-002 (partition de contexte comme mecanisme fondamental), D-003 (86,1% vulnerabilite comme baseline empirique) |
| Formules extraites | 0 formelle, 1 algorithme (Algorithm 1), 2 metriques implicites |
| Templates AEGIS lies | prompt_override, language_switch, summarize, hyde, feedback_poisoning, moteur genetique |
| Papiers citant | Zverev et al. 2025 (Sep(M)), Hackett et al. 2025 (character injection), cadre AEGIS (moteur genetique) |

---

*Analyse generee le 2026-04-04 — Lecture integrale via ChromaDB (94 chunks). Aucune information inventee.*
