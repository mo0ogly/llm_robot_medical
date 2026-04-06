## [Hossain et al., 2025] — A Multi-Agent LLM Defense Pipeline Against Prompt Injection Attacks

**Reference** : arXiv:2509.14285v4
**Revue/Conf** : arXiv preprint, cite IEEE WIECON-ECE 2025 (non classe SCImago/CORE)
**Lu le** : 2026-04-04
> **PDF Source**: [literature_for_rag/P002_multiagent_defense.pdf](../../literature_for_rag/P002_multiagent_defense.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (38 chunks)

**Nature epistemique** : [EMPIRIQUE] — demonstration experimentale sans garantie formelle

### Abstract original
> "Prompt injection attacks represent a major vulnerability in Large Language Model (LLM) deployments, where malicious instructions embedded in user inputs can override system prompts and induce unintended behaviors. This paper presents a novel multi-agent defense framework that employs specialized LLM agents in coordinated pipelines to detect and neutralize prompt injection attacks in real-time. We evaluate our approach using two distinct architectures: a sequential chain-of-agents pipeline and a hierarchical coordinator-based system. Our comprehensive evaluation on 55 unique prompt injection attacks, grouped into 8 categories and totaling 400 attack instances across two LLM platforms (ChatGLM and Llama2), demonstrates significant security improvements. Without defense mechanisms, baseline Attack Success Rates (ASR) reached 30% for ChatGLM and 20% for Llama2. Our multi-agent pipeline achieved 100% mitigation, reducing ASR to 0% across all tested scenarios. The framework demonstrates robustness across multiple attack categories including direct overrides, code execution attempts, data exfiltration, and obfuscation techniques, while maintaining system functionality for legitimate queries."
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme** : Les defenses singulieres contre l'injection de prompt sont insuffisantes face aux attaques sophistiquees (Section I, p. 1)
- **Methode** : Deux architectures multi-agents : (1) chain-of-agents avec Guard post-generation, (2) coordinator-based avec pre-input classification (Section III-B, Fig. 1-2)
- **Donnees** : HPI ATTACK DATASET — 55 attaques uniques, 8 categories, 400 instances sur ChatGLM-6B et Llama2-13B (Section III-A, Table II)
- **Resultat** : ASR reduit de 20-30% (baseline) a 0% sur toutes les configurations defendues, 400 evaluations (Section V, Table IV)
- **Limite** : Evaluation limitee a ChatGLM (2022) et Llama2 (2023), modeles anciens ; pas de test contre attaques adaptatives (Section VII)

### Analyse critique
**Forces** :
- Architecture modulaire avec deux paradigmes complementaires : pre-input (Coordinator) et post-output (Guard), defense en profondeur (Section III-B, Fig. 1-2)
- Dataset structure en 8 categories couvrant un spectre large : overrides (12), code execution (8), exfiltration (7), formatting (6), obfuscation (8), tool manipulation (5), role-play (6), multi-turn (3) (Section III-A, Table II)
- Accord inter-annotateur > 95% pour la validation du dataset (Section III-A)
- Analyse par categorie revelant les vecteurs les plus critiques : Delegate 100% ASR baseline, Role-play 66.7%, Recon/Environment 60% (Section V-B, Table V)
- Evaluation multi-dimensionnelle : prevention, couverture, consistance, scalabilite, complexite (Section VI, Fig. 8)

**Faiblesses** :
- ASR 0% sur TOUTES les configurations — signal d'alerte statistique : Sep(M) = 0 avec 0 violations sur N = 400, probablement un artefact d'attaques trop simples. Aucune defense reelle n'atteint 0% face a des attaques adaptatives
- 55 attaques est un echantillon modeste compare aux 102 templates AEGIS. Le Taxonomy filter (regle basique) atteint aussi 0%, ce qui suggere que les attaques sont triviales pour tout systeme de filtrage
- ChatGLM-6B (2022) et Llama2-13B (2023) sont obsoletes ; pas de tests sur GPT-4, Claude, ou modeles recents avec meilleur instruction-following
- Pas d'evaluation de la resistance aux attaques de second ordre ciblant le pipeline multi-agent lui-meme
- Le pipeline partage la meme famille de modeles entre agents — vulnerabilite aux biais δ⁰ partages (cf. Wang et al., 2025, ICML, Illusion of Role Separation)
- Pas de metriques de faux positifs ni d'impact sur l'utilite pour les requetes legitimes

**Questions ouvertes** :
- Robustesse face a des attaques generees par optimisation (GCG, AutoDAN, PAIR) ?
- Latence du pipeline pour les applications temps reel (chirurgie robotique) ?
- Robustesse face a un attaquant connaissant l'architecture du pipeline ?

### Formules exactes
- Aucune formule mathematique formelle
- Metriques purement empiriques : ASR = nombre d'attaques reussies / total attaques testees (Section IV-C)
- Aucune borne theorique ni garantie de convergence

### Pertinence these AEGIS
- **Couches delta** : δ¹ (chaque agent a un system prompt specialise, Table III) + δ² (filtrage des entrees/sorties par Guard et Coordinator) — architecture δ¹+δ² sans garantie δ³
- **Conjectures** :
  - C1 (insuffisance δ¹) : **Supportee indirectement** — la necessite d'un pipeline multi-agent confirme que le prompt systeme seul ne suffit pas (Section I)
  - C2 (necessite δ³) : **Non adressee** — approche purement empirique sans verification formelle
- **Decouvertes** : D-003 (defense en profondeur) confirmee par l'architecture duale pre-input/post-output
- **Gaps** : G-008 (absence de test contre attaques adaptatives), G-012 (pas de validation sur modeles recents)
- **Mapping templates AEGIS** : Categories du dataset alignees partiellement sur le catalogue — overrides (#01-#12), exfiltration (#21-#27), role-play (#28-#35)

### Citations cles
> "Without defense mechanisms, baseline Attack Success Rates (ASR) reached 30% for ChatGLM and 20% for Llama2." (Abstract, p. 1)
> "Delegate attacks proved most severe (100% ASR), followed by role-play coercion (66.7%), reconnaissance/environment (60%)." (Section V-B, Table V)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 5/10 |
| Reproductibilite | Moyenne — ChatGLM et Llama2 accessibles, dataset HPI non publie |
| Code disponible | Non mentionne |
| Dataset public | Non (HPI ATTACK DATASET interne) |
