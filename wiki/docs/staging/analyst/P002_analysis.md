# P002 : A Multi-Agent LLM Defense Pipeline Against Prompt Injection Attacks

## [Hossain et al., 2025] -- A Multi-Agent LLM Defense Pipeline Against Prompt Injection Attacks

**Reference :** arXiv:2509.14285v4
**Revue/Conf :** arXiv preprint, cite IEEE WIECON-ECE 2025 (non classe SCImago/CORE)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P002_multiagent_defense.pdf](../../assets/pdfs/P002_multiagent_defense.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (38 chunks). Non publie en conference de securite reconnue (CORE A/A*).

### Abstract original
> Prompt injection attacks represent a major vulnerability in Large Language Model (LLM) deployments, where malicious instructions embedded in user inputs can override system prompts and induce unintended behaviors. This paper presents a novel multi-agent defense framework that employs specialized LLM agents in coordinated pipelines to detect and neutralize prompt injection attacks in real-time. We evaluate our approach using two distinct architectures: a sequential chain-of-agents pipeline and a hierarchical coordinator-based system. Our comprehensive evaluation on 55 unique prompt injection attacks, grouped into 8 categories and totaling 400 attack instances across two LLM platforms (ChatGLM and Llama2), demonstrates significant security improvements. Without defense mechanisms, baseline Attack Success Rates (ASR) reached 30% for ChatGLM and 20% for Llama2. Our multi-agent pipeline achieved 100% mitigation, reducing ASR to 0% across all tested scenarios. The framework demonstrates robustness across multiple attack categories including direct overrides, code execution attempts, data exfiltration, and obfuscation techniques, while maintaining system functionality for legitimate queries.
> -- Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme :** Les defenses singulieres contre l'injection de prompt (filtrage, prompt engineering, fine-tuning) sont insuffisantes face aux attaques sophistiquees et necessitent une approche en profondeur (Hossain et al., 2025, Section I, p. 1)
- **Methode :** Deux architectures multi-agents : (1) chain-of-agents sequentiel avec Guard post-generation assurant la validation de sortie (redaction, token blocking, format enforcement), (2) coordinator-based hierarchique avec pre-input classification et routage. Chaque agent a un system prompt specialise (Hossain et al., 2025, Section III-B, Figures 1-2 ; Table III pour les roles agents)
- **Donnees :** HPI ATTACK DATASET -- 55 attaques uniques reparties en 8 categories (overrides 12, code execution 8, exfiltration 7, formatting 6, obfuscation 8, tool manipulation 5, role-play 6, multi-turn 3), evaluees en 400 instances sur ChatGLM-6B et Llama2-13B (Hossain et al., 2025, Section III-A, Table II)
- **Resultat :** ASR reduit de 20-30% (baseline sans defense) a 0% sur TOUTES les configurations defendues (Taxonomy Filter ON, Coordinator ON, Chain ON), 400 evaluations totales (Hossain et al., 2025, Section V, Table IV ; Table VI). Accord inter-annotateurs > 95% pour la validation du dataset (Hossain et al., 2025, Section III-A)
- **Limite :** Evaluation limitee a ChatGLM-6B (2022) et Llama2-13B (2023), modeles anciens et sous-capables ; pas de test contre attaques adaptatives ; ASR 0% suspect (Hossain et al., 2025, Section VII)

### Analyse critique

**Forces :**

1. **Architecture modulaire de defense en profondeur.** Le papier propose deux paradigmes complementaires : pre-input screening (Coordinator classifie et route avant le LLM principal) et post-output validation (Guard verifie la conformite de la sortie). Cette architecture duale couvre les deux surfaces d'attaque (entree et sortie) et peut etre deployee isolement ou en combinaison (Hossain et al., 2025, Section III-B, Figures 1-2). La Table III detaille les capacites exclusives de chaque agent : le Coordinator gere le trust boundary et le context isolation, le Guard gere la redaction et le format enforcement.

2. **Dataset structure en 8 categories.** La taxonomie d'attaque couvre un spectre large : direct overrides (12), code execution (8), data exfiltration (7), formatting tricks (6), obfuscation (8), tool manipulation (5), role-play coercion (6), multi-turn (3). L'analyse par categorie revele les vecteurs les plus critiques : Delegate 100% ASR baseline, Role-play 66.7%, Recon/Environment 60% (Hossain et al., 2025, Section V-B, Table V).

3. **Accord inter-annotateurs > 95%.** La validation du dataset d'attaque par plusieurs annotateurs avec un accord > 95% renforce la fiabilite de la categorisation (Hossain et al., 2025, Section III-A).

4. **Evaluation multi-dimensionnelle.** Au-dela de l'ASR, le papier evalue la prevention, la couverture, la consistance, la scalabilite et la complexite des defenses (Hossain et al., 2025, Section VI, Figure 8).

**Faiblesses :**

1. **ASR 0% sur TOUTES les configurations -- signal d'alerte statistique majeur.** Aucune defense reelle n'atteint 0% face a des attaques non-triviales. Le fait que MEME le Taxonomy Filter (simple regle basique) atteint 0% (Hossain et al., 2025, Table IV : Taxonomy Filter ON = 0%) confirme que les 55 attaques du dataset HPI sont triviales pour tout systeme de filtrage. Sep(M) = 0 avec 0 violations sur N = 400 est un artefact statistique : les attaques sont trop simples, pas la defense trop bonne. Pour contexte, AEGIS utilise 102 templates dont beaucoup contournent les filtres basiques.

2. **Modeles obsoletes.** ChatGLM-6B (2022) et Llama2-13B (2023) sont des modeles anciens avec un instruction-following mediocre par rapport aux standards actuels (GPT-4o, Claude 3.5, Llama 3.x) (Hossain et al., 2025, Section V-A, experimental setup). Les attaques qui echouent sur ces modeles faiblement capables pourraient reussir sur des modeles plus recents qui suivent mieux les instructions -- y compris les instructions malveillantes. Aucun test sur GPT-4, Claude, ou Llama 3 n'est rapporte.

3. **Pas de test contre attaques adaptatives.** Le papier suppose un attaquant statique qui ne connait pas le pipeline de defense. Un attaquant adaptif qui cible le pipeline multi-agent lui-meme (e.g., injection dans le Coordinator, manipulation du Guard) n'est pas considere. Wang et al. (2025, ICML, "Illusion of Role Separation") montrent que les pipelines multi-agents partageant le meme modele de base sont vulnerables aux biais δ⁰ partages.

4. **Pipeline homogene.** Les agents du pipeline partagent la meme famille de modeles (ChatGLM ou Llama2). Si le modele de base a un biais d'alignement specifique, tous les agents le partagent, creant une vulnerabilite systemique. Un attaquant qui exploite un biais δ⁰ du modele de base compromet simultanement le Coordinator et le Guard.

5. **Pas de metriques de faux positifs.** L'impact sur l'utilite pour les requetes legitimes n'est pas mesure. Un pipeline qui bloque tout est "secure" (ASR=0%) mais inutile.

6. **Dataset HPI non public.** Le HPI ATTACK DATASET n'est pas publie, empechant la reproduction independante et la comparaison avec d'autres travaux.

**Questions ouvertes :**
- Robustesse face a des attaques generees par optimisation (GCG, AutoDAN, PAIR) plutot que manuelles ?
- Latence du pipeline multi-agent pour les applications temps reel (chirurgie robotique AEGIS) ?
- Robustesse face a un attaquant connaissant l'architecture du pipeline (white-box sur le pipeline) ?
- Comment se comporte le pipeline avec des modeles heterogenes (Coordinator sur un modele, Guard sur un autre) ?

### Formules exactes

Aucune formule mathematique formelle dans le papier.

**Metriques** (Hossain et al., 2025, Section IV-C) :
- `ASR = nombre d'attaques reussies / total attaques testees`
- Aucune borne theorique ni garantie de convergence
- Evaluation purement empirique sur comptage binaire (succes/echec)

**Resultats Table IV** (Hossain et al., 2025, Section V, p. 5) :
| Defense | Guard | Attacks | Success | ASR | Reduction |
|---|---|---|---|---|---|
| Taxonomy Filter OFF | -- | 100 | 30 | 30.0% | -- |
| Taxonomy Filter ON | -- | 100 | 0 | 0.0% | 100% |
| Coordinator OFF | -- | 50 | 10 | 20.0% | -- |
| Coordinator ON | -- | 50 | 0 | 0.0% | 100% |
| Chain OFF | -- | 50 | 15 | 30.0% | -- |
| Chain ON | -- | 50 | 0 | 0.0% | 100% |

**Categories les plus vulnerables baseline** (Hossain et al., 2025, Table V) :
- Delegate : 100% ASR baseline
- Role-play coercion : 66.7% ASR baseline
- Reconnaissance/Environment : 60% ASR baseline

Lien glossaire AEGIS : F22 (ASR), lie a la defense en profondeur et au concept de pipeline multi-couches

### Pertinence these AEGIS

- **Couches delta :** δ¹ (chaque agent a un system prompt specialise, Hossain et al., 2025, Table III) + δ² (filtrage des entrees par Coordinator et des sorties par Guard -- pre-input screening + post-output validation) -- architecture δ¹+δ² sans aucune garantie δ³
- **Conjectures :**
  - C1 (insuffisance δ¹) : **supportee indirectement** -- la necessite d'un pipeline multi-agent confirme que le prompt systeme seul ne suffit pas comme defense. Le papier cite explicitement l'insuffisance des approches singulieres (Hossain et al., 2025, Section I)
  - C2 (necessite δ³) : **non adressee** -- approche purement empirique sans verification formelle. L'ASR 0% est un artefact d'attaques triviales, pas une preuve de securite
  - C7 (illusion de separation des roles) : **pertinente** -- le pipeline partage le meme modele de base entre agents, ce qui est exactement le scenario critique identifie par Wang et al. (2025, ICML). Les agents ne sont pas plus independants que des appels differents au meme modele.
- **Decouvertes :**
  - D-003 (defense en profondeur) : **partiellement confirmee** -- l'architecture duale pre-input/post-output est conceptuellement valide (Hossain et al., 2025, Section III-B, Figures 1-2), mais l'evaluation ne demontre pas son efficacite face a des attaques non-triviales
- **Gaps :**
  - G-008 (absence de test contre attaques adaptatives) : **non adresse** -- gap critique pour la validite du travail
  - G-012 (pas de validation sur modeles recents) : **non adresse** -- ChatGLM-6B et Llama2-13B ne sont pas representatifs des modeles deployes en 2025-2026
  - G-019 (pipeline multi-agent homogene) : **cree** -- le partage de modele de base entre agents est une vulnerabilite non evaluee
- **Mapping templates AEGIS :** Categories du dataset HPI partiellement alignees sur le catalogue AEGIS : overrides (#01-#12), exfiltration (#21-#27), role-play (#28-#35). Les 55 attaques HPI sont un sous-ensemble modeste des 102 templates AEGIS.

### Citations cles
> "Without defense mechanisms, baseline Attack Success Rates (ASR) reached 30% for ChatGLM and 20% for Llama2." (Hossain et al., 2025, Abstract, p. 1)
> "Delegate attacks proved most severe (100% ASR), followed by role-play coercion (66.7%), reconnaissance/environment (60%)." (Hossain et al., 2025, Section V-B, Table V)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 5/10 |
| Reproductibilite | Faible -- ChatGLM-6B et Llama2-13B accessibles mais obsoletes, dataset HPI non publie, code non mentionne |
| Code disponible | Non mentionne |
| Dataset public | Non -- HPI ATTACK DATASET interne, non publie |
| Nature epistemique | [EMPIRIQUE] -- demonstration experimentale sans garantie formelle ; ASR 0% est un artefact d'attaques triviales (le Taxonomy Filter basique atteint aussi 0%), pas une preuve de securite du pipeline |
