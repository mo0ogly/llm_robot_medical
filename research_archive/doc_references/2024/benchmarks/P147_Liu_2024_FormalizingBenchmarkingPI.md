## [Liu et al., 2024] — Formalizing and Benchmarking Prompt Injection Attacks and Defenses

**Reference :** arXiv:2310.12815
**Revue/Conf :** USENIX Security 2024 (CORE A*)
**Lu le :** 2026-05-31
> **PDF Source**: [literature_for_rag/P147_Liu_2024_FormalizingBenchmarkingPI.pdf](../../literature_for_rag/P147_Liu_2024_FormalizingBenchmarkingPI.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet (27 pages)

### Abstract original
> "A prompt injection attack aims to inject malicious instruction/data into the input of an LLM-Integrated Application such that it produces results as an attacker desires. Existing works are limited to case studies. As a result, the literature lacks a systematic understanding of prompt injection attacks and their defenses. We aim to bridge the gap in this work. In particular, we propose a framework to formalize prompt injection attacks. Existing attacks are special cases in our framework. Moreover, based on our framework, we design a new attack by combining existing ones. Using our framework, we conduct a systematic evaluation on 5 prompt injection attacks and 10 defenses with 10 LLMs and 7 tasks. Our work provides a common benchmark for quantitatively evaluating future prompt injection attacks and defenses. To facilitate research on this topic, we make our platform public at https://github.com/liu00222/Open-Prompt-Injection."
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Avant ce papier, la litterature sur le prompt injection (PI) etait limitee a des etudes de cas isolees, sans cadre formel ni evaluation comparative. Deux limites explicites des auteurs : "they lack frameworks to formalize prompt injection attacks and defenses, and 2) they lack a comprehensive evaluation" (Section 1, p.1). Cela rendait impossible la conception systematique de nouvelles attaques/defenses et l'evaluation quantitative de la severite reelle.
- **Methode :** Les auteurs proposent (a) une definition formelle du PI (Definition 1, Section 4.1, p.4), (b) un framework generique ou la donnee compromise est `x̃ = A(x_t, s_e, x_e)` (Eq. 1, Section 4.2, p.4) unifiant 4 attaques existantes (Naive, Escape Characters, Context Ignoring, Fake Completion) comme cas particuliers, (c) une nouvelle attaque "Combined Attack" derivee par combinaison des strategies. Ils benchmarkent 5 attaques x 10 defenses x 10 LLM x 7 taches NLP.
- **Donnees :** 7 taches NLP avec datasets standards (MRPC, Jfleg, HSOL, RTE, SST2, SMS Spam, Gigaword — Section 6.1, p.7). Pour chaque tache : 100 exemples target + 100 exemples injected tires uniformement sans remplacement, soit 10 000 paires par combinaison, sous-echantillonnees a 100 paires pour le calcul des metriques (Section 6.1, p.7-8). 49 combinaisons target x injected (7x7).
- **Resultat :** Sur GPT-4, le Combined Attack atteint un ASV moyen de 0.75 sur les 49 combinaisons, vs 0.62 (Naive), 0.66 (Escape Characters), 0.65 (Context Ignoring), 0.70 (Fake Completion) (Table 4, p.9). Moyenne sur 10 LLM et 49 combinaisons : ASV=0.62 et MR=0.78 (Section 6.2, p.9). Correlation de Pearson positive entre taille du modele et efficacite : 0.63 (ASV) / 0.64 (MR) (Section 6.2, p.9). Verdict defenses : "no existing defenses are sufficient" (Section 1, p.2).
- **Limite :** Les auteurs reconnaissent (Section 8, p.12) que toutes les attaques benchmarkees sont heuristiques ("All existing prompt injection attacks are limited to heuristics"), que les defenses se limitent a prevention+detection sans mecanisme de "recovery" de la donnee propre, et que l'evaluation de la known-answer detection est restreinte a un seul prompt de detection.

### Analyse critique
**Forces :**
- Premiere formalisation unifiee qui exprime les attaques connues comme cas particuliers d'un meme operateur `A(x_t, s_e, x_e)` (Eq. 1, Section 4.2, p.4) — Naive, Escape, Context Ignoring, Fake Completion derivent toutes d'un patron de concatenation `x̃ = x_t ⊕ [⋅] ⊕ s_e ⊕ x_e` (Section 4.2, p.4-5).
- Echelle de benchmark substantielle : 10 LLM de 7B a 1.5T parametres (Table 3, p.7), 7 taches, 49 combinaisons, metriques deterministes pour la classification (`M[a,b]=1 si a=b sinon 0`, Section 6.1, p.8). Le juge est deterministe (accuracy/Rouge-1/GLEU), PAS un LLM-juge — point fort pour la reproductibilite (conforme a la regle redteam-analysis "qui juge ?").
- Resultat de scaling contre-intuitif et utile : les LLM plus gros sont PLUS vulnerables (Pearson 0.63/0.64, Section 6.2, p.9), avec l'hypothese que "a larger LLM is more powerful in following the instructions and thus is more vulnerable" (Section 6.2, p.9).
- Distinction nette PI vs jailbreak (Section 7, p.12) : "Jailbreaking aims to perturb the prompt such that LLM performs the target task. Prompt injection aims to perturb a prompt such that the LLM performs an attacker-injected task instead of the target task."
- Plateforme open-source (Open-Prompt-Injection), ce qui en fait un benchmark de reference reutilisable.

**Faiblesses :**
- Les modeles testes sont datés (GPT-4 1.5T, GPT-3.5-Turbo, Bard, PaLM 2, Vicuna, Llama-2) — l'ASR du PI a une demi-vie courte (regle redteam-analysis : patch silencieux). Les valeurs absolues de 2023-2024 ne sont pas transferables telles quelles en 2026.
- Le sous-echantillonnage a 100 paires (au lieu de 10 000) pour ASV/MR/FNR (Section 6.1-6.2, p.8) reduit la variance reportee ; aucune barre d'erreur ni IC sur les ASV des Tables 4-8. Pas de test statistique formel.
- Le threat model suppose un attaquant sans connaissance interne (Section 3, p.3 : "the attacker does not know such internal details"). C'est un choix conservateur correct, mais limite la portee : les attaques white-box / optimisation ne sont PAS couvertes (les auteurs le reconnaissent, Section 8, p.12).
- La taille de parametres attribuee a GPT-4 (1.5T) et GPT-3.5-Turbo (154B) dans la Table 3 (p.7) repose sur des estimations publiques non officielles — a citer avec prudence.

**Questions ouvertes :**
- Comment construire un operateur `A` optimise (gradient-based) plutot qu'heuristique ? Les auteurs posent explicitement cette question (Section 8, p.12).
- Existe-t-il un mecanisme de "recovery" de `x_t` a partir de `x̃` apres detection ? Gap explicite (Section 8, p.12) — la detection seule mene a un deni de service.
- La known-answer detection peut-elle resister a des attaques adaptatives concues pour ne PAS ecraser le prompt de detection ? (Section 8, p.12).

### Formalisation (contribution cle)
Le papier formalise le PI autour d'une separation instruction/donnee. Notation EXACTE du papier :
- Tache cible `t` = (instruction cible `s_t`, donnee cible `x_t`). Sans attaque, l'application interroge le LLM avec `f(s_t ⊕ x_t)` ou `⊕` est la concatenation de chaines (Section 4.1, p.3).
- Tache injectee `e` = (instruction injectee `s_e`, donnee injectee `x_e`) (Section 4.1, p.3-4).
- **Definition 1 (Prompt Injection Attack)** (Section 4.1, p.4) : "Given an LLM-Integrated Application with an instruction prompt `s_t` and data `x_t` for a target task `t`. A prompt injection attack modifies the data `x_t` such that the LLM-Integrated Application accomplishes an injected task instead of the target task." [EMPIRIQUE — definition operationnelle, pas un theoreme : aucune borne ni garantie n'est demontree].
- **Framework generique** (Eq. 1, Section 4.2, p.4) : la donnee compromise `x̃ = A(x_t, s_e, x_e)`. L'attaque devient `f(s_t ⊕ x̃)`. Les attaques existantes sont des instanciations de l'operateur `A` :
  - Naive : `x̃ = x_t ⊕ s_e ⊕ x_e`
  - Escape Characters : `x̃ = x_t ⊕ c ⊕ s_e ⊕ x_e` (c = caractere special, ex. "\n")
  - Context Ignoring : `x̃ = x_t ⊕ i ⊕ s_e ⊕ x_e` (i = texte d'ignorance de tache, ex. "Ignore my previous instructions.")
  - Fake Completion : `x̃ = x_t ⊕ r ⊕ s_e ⊕ x_e` (r = fausse reponse, ex. "Answer: task complete")
  - **Combined Attack** (contribution nouvelle, Section 4.2, p.5) : `x̃ = x_t ⊕ c ⊕ r ⊕ c ⊕ i ⊕ s_e ⊕ x_e` (caractere special `c` utilise deux fois pour separer la fausse reponse `r` et le texte d'ignorance `i`).
Tags epistemiques : l'ensemble du framework est [EMPIRIQUE]/[HEURISTIQUE]. Les auteurs eux-memes qualifient les attaques de "limited to heuristics" (Section 8, p.12). Aucun resultat n'est un [THEOREME] : il n'y a ni borne de convergence, ni garantie d'existence/unicite.

### Formules exactes
- `f(s_t ⊕ x_t)` — reponse sans attaque ; `⊕` = concatenation de chaines (Section 4.1, p.3). [EMPIRIQUE]
- `x̃ = A(x_t, s_e, x_e)` (Eq. 1, Section 4.2, p.4). [HEURISTIQUE — operateur de craft, sans garantie]
- Combined Attack : `x̃ = x_t ⊕ c ⊕ r ⊕ c ⊕ i ⊕ s_e ⊕ x_e` (Section 4.2, p.5). [HEURISTIQUE]
- **PNA** (Eq. 2, Section 6.1, p.7) : `PNA = Σ_{(x,y)∈D} M[f(s ⊕ x), y] / |D|`. PNA-T (tache cible) et PNA-I (tache injectee). [EMPIRIQUE — metrique de performance sans attaque]
- **ASV** (Attack Success Value, Eq. 3, Section 6.1, p.7) : `ASV = Σ_{(x_t,y_t)∈D_t, (x_e,y_e)∈D_e} M_e[f(s_t ⊕ A(x_t, s_e, x_e)), y_e] / (|D_t||D_e|)`. PNA-I est une borne superieure de l'ASV (Section 6.1, p.8). [EMPIRIQUE — pas de borne theorique de convergence, mesure empirique]
- **MR** (Matching Rate, Eq. 4, Section 6.1, p.7) : `MR = Σ M_e[f(s_t ⊕ A(x_t, s_e, x_e)), f(s_e ⊕ x_e)] / (|D_t||D_e|)`. Compare la reponse sous attaque a la reponse directe sur la tache injectee. [EMPIRIQUE]
- **FPR** (Eq. 5, Section 6.1, p.8) : `FPR = Σ_{(x_t,y_t)∈D_t} h(x_t) / |D_t|`, `h`=1 si detecte compromis. [EMPIRIQUE]
- **FNR** (Eq. 6, Section 6.1, p.8) : `FNR = 1 - Σ h(A(x_t, s_e, x_e)) / (|D_t||D_e|)`. [EMPIRIQUE]
Lien glossaire AEGIS : ASV (Eq. 3) est l'analogue de F22 (ASR — metrique empirique sans borne). PNA-T mesure l'utilite sans attaque, analogue au FPR cote utilite de la taxonomie defense AEGIS.

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (l'attaque exploite directement le suivi d'instruction du modele aligne RLHF — aucune des 5 attaques ne franchit un garde-fou de securite, elles detournent la separation instruction/donnee). δ¹ (la separation instruction/donnee est exactement la frontiere que le framework formalise : `s_t ⊕ x̃` confond instruction et donnee). Pas de δ² ni δ³ teste : aucune validation formelle de sortie n'est evaluee (justification : le papier reste au niveau prevention/detection, Section 5).
- **Conjectures :**
  - **C1 (Insuffisance de δ⁰ / RLHF)** — SUPPORTEE. Tous les LLM alignes (GPT-4, Llama-2-chat, etc.) sont vulnerables avec ASV moyen 0.62 sur 10 LLM (Section 6.2, p.9) ; l'alignement RLHF ne previent pas le PI.
  - **C2 (Necessite de δ³ / validation de sortie)** — SUPPORTEE indirectement. Les auteurs montrent que prevention ET detection sont insuffisantes ("no existing defenses are sufficient", Section 1, p.2) et identifient le manque de mecanisme de recovery (Section 8, p.12), ce qui motive une couche de validation/recouvrement en aval.
  - **C3 (Shallow alignment)** — SUPPORTEE. La vulnerabilite croit avec la taille du modele (Pearson 0.63/0.64, Section 6.2, p.9) : un modele plus competent en instruction-following est plus vulnerable, signe que l'alignement est superficiel par rapport a la capacite sous-jacente.
  - **C5 (Insuffisance de la similarite cosinus)** — NEUTRE/non aborde (aucune metrique cosinus dans ce papier).
  - **C6 (Vulnerabilite accrue du domaine medical)** — NEUTRE. Le papier porte sur 7 taches NLP generiques (pas de tache medicale) ; il fournit toutefois un cadre transferable au domaine medical.
- **Formules AEGIS :** lien F22 (ASR) ≈ ASV (Eq. 3, p.7) ; PNA-T eclaire le compromis utilite/securite (FPR cote defense). Pas de lien direct avec F15 Sep(M) — mais le framework formalise la MEME frontiere instruction/donnee que Sep(M) mesure (a noter pour la triangulation avec Zverev et al. 2025).
- **MITRE ATLAS :** AML.T0051 (LLM Prompt Injection) — le papier est cite comme reference fondatrice du benchmark PI.
- **OWASP LLM :** LLM01 (Prompt Injection). Le papier cite OWASP qui classe le PI #1 des menaces (Section 1, p.1).

### Citations cles
> "We propose the first framework to formalize prompt injection attacks. In particular, we first develop a formal definition of prompt injection attacks." (Section 1, p.1)
> "ASV and MR averaged over the 10 LLMs and 7×7 target/injected task combinations are 0.62 and 0.78, respectively." (Section 6.2, p.9)
> "We suspect the reason is that a larger LLM is more powerful in following the instructions and thus is more vulnerable to prompt injection attacks." (Section 6.2, p.9)
> "Our general observation is that no existing prevention-based defenses are sufficient: they have limited effectiveness at preventing attacks and/or incur large utility losses for the target tasks when there are no attacks." (Section 6.3, p.10)
> "All existing prompt injection attacks are limited to heuristics, e.g., they utilize special characters, task-ignoring texts, and fake responses." (Section 8, p.12)

### Classification
| Champ | Valeur |
|-------|--------|
| Type | Benchmark + formalisation PI |
| SVC pertinence | 9/10 (framework formel fondateur, benchmark de reference USENIX A*, directement transferable a la taxonomie AEGIS et au mapping templates escape/ignore/fake) |
| Reproductibilite | Haute — juge deterministe (accuracy/Rouge-1/GLEU), seed fixee pour modeles open-source, temperature 0.1 pour closed-source, plateforme open-source publiee (Section 6.1, p.7) |
| Code disponible | Oui — https://github.com/liu00222/Open-Prompt-Injection |
| Dataset public | Oui — MRPC, Jfleg, HSOL, RTE, SST2, SMS Spam, Gigaword (datasets NLP standards) |
