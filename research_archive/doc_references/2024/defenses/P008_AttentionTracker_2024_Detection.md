## [Hung et al., 2024] — Attention Tracker: Detecting Prompt Injection Attacks in LLMs

**Reference** : arXiv:2411.00348v2
**Revue/Conf** : NAACL 2025 Findings — CORE A (Findings track)
**Lu le** : 2026-04-04
> **PDF Source**: [literature_for_rag/P008_source.pdf](../../literature_for_rag/P008_source.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (72 chunks). Publie NAACL 2025 Findings.

**Nature epistemique** : [ALGORITHME] — methode de detection training-free basee sur l'analyse des patterns d'attention

### Abstract original
> "Large Language Models (LLMs) have revolutionized various domains but remain vulnerable to prompt injection attacks, where malicious inputs manipulate the model into ignoring original instructions and executing designated action. In this paper, we investigate the underlying mechanisms of these attacks by analyzing the attention patterns within LLMs. We introduce the concept of the distraction effect, where specific attention heads, termed important heads, shift focus from the original instruction to the injected instruction. Building on this discovery, we propose Attention Tracker, a training-free detection method that tracks attention patterns on instruction to detect prompt injection attacks without the need for additional LLM inference. Our method generalizes effectively across diverse models, datasets, and attack types, showing an AUROC improvement of up to 10.0% over existing methods, and performs well even on small LLMs. We demonstrate the robustness of our approach through extensive evaluations and provide insights into safeguarding LLM-integrated systems from prompt injection vulnerabilities."
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme** : Comprendre les mecanismes internes des attaques par injection de prompt via l'analyse des patterns d'attention (Section 1)
- **Methode** : Identification des "important heads" (tetes d'attention qui subissent le "distraction effect"), aggregation en Focus Score, detection sans entrainement supplementaire ni inference LLM additionnelle (Section 4, Eq. FS)
- **Donnees** : Open-Prompt-Injection (Liu et al., 2024b) et deepset prompt injection dataset, 5 modeles (Qwen2 1.5B, Phi3 3B, Mistral 7B, Llama3 8B, Gemma2 9B) (Section 5.1)
- **Resultat** : AUROC = 1.00 sur Open-Prompt-Injection pour Qwen2, Phi3, Mistral, Llama3 ; 0.99 pour Gemma2. Sur deepset : 0.97-0.99. Amelioration jusqu'a 10% AUROC vs existant et 31.3% en moyenne vs training-free (Table 1, Section 5.2)
- **Limite** : Necessite un acces white-box aux poids d'attention — inapplicable aux modeles fermes via API (Section Limitation)

### Analyse critique
**Forces** :
- Decouverte mecanistique fondamentale : le "distraction effect" — les tetes d'attention specifiques qui normalement focalisent sur l'instruction originale sont detournees vers l'injection (Section 3, Definition 1)
- Training-free ET inference-free : les scores d'attention sont extraits pendant l'inference normale sans cout supplementaire, contrairement aux detecteurs qui necessitent un second appel LLM (Section 4.2)
- Generalisation remarquable : les important heads identifiees avec un simple "ignore attack" generent consistant a travers differents types d'attaques et datasets (Section 5.4, Fig. 5)
- Selection de tetes optimale : k=4 (0.3% des tetes) donne AUROC 0.986, meilleur que 100% des tetes (0.821) — signal tres concentre (Table 2)
- Efficace meme sur petits modeles (Qwen2 1.5B : AUROC 1.00), contrairement aux methodes training-free existantes qui necessitent des LLM puissants (Section 5.2)
- Venue NAACL 2025 Findings (CORE A) + IBM Research — equipe credible

**Faiblesses** :
- Acces white-box requis — exclut GPT-4, Claude, Gemini et tout modele API-only. Utilisable uniquement pour modeles open-weight (Limitation, p. 7)
- Les benchmarks utilises (Open-Prompt-Injection, deepset) contiennent principalement des attaques par injection naive ("ignore previous instructions") — pas de test contre des injections sophistiquees (P009 character injection, GCG, multi-turn)
- AUROC 1.00 sur 4/5 modeles est suspicieusement parfait — possible overfitting sur le type d'attaques testees
- Le Focus Score peut etre contourne par des injections qui maintiennent l'attention sur l'instruction originale tout en redirigeant subtilement l'output (cf. T13 dans le playbook AEGIS)
- Pas d'evaluation dans un cadre agentique (tool-calling, RAG) ou les injections sont indirectes

**Questions ouvertes** :
- Les important heads sont-elles stables a travers les mises a jour du modele (RLHF iterations) ?
- Un attaquant connaissant le mecanisme du Focus Score peut-il crafter des injections qui maintiennent un FS eleve tout en compromettant l'output ?
- Le distraction effect existe-t-il dans les modeles multimodaux (images + texte) ?

### Formules exactes
- **Focus Score** : FS = (1/|H_i|) * sum_{(l,h) in H_i} Attn^{(l,h)}(I) — score de detection agrege sur les important heads (Section 4.2)
- **Important Head Selection** : c_{l,h} = mean_normal(Attn^{(l,h)}(I)) - mean_attack(Attn^{(l,h)}(I)) ; selectionner tetes avec c > k*std (Section 4.1, Eq. 1)
- Decision : si FS < seuil t → attaque detectee (Section 4.2)
- Lien glossaire AEGIS : F55 (Focus Score), F22 (ASR)

### Pertinence these AEGIS
- **Couches delta** : δ² (detection) — Attention Tracker est un detecteur complementaire a δ² operant au niveau des representations internes du modele, pas au niveau textuel
- **Conjectures** :
  - C1 (insuffisance δ¹) : **Supportee indirectement** — la necessite d'un detecteur externe confirme que le system prompt seul ne protege pas
  - C2 (necessite δ³) : **Partiellement supportee** — le Focus Score pourrait etre integre dans une couche de verification formelle pour modeles open-weight
- **Decouvertes** : D-006 (distraction effect) — mecanisme fondamental expliquant POURQUOI les injections fonctionnent au niveau attentionnel
- **Gaps** : G-006 (robustesse face aux injections sophistiquees), G-011 (applicabilite aux modeles fermes)
- **Mapping templates AEGIS** : Le detecteur serait applicable aux templates d'injection directe (#01-#35) mais probablement contournable par les templates cross-linguaux (#36-#50) et les encodages (#51-#60) si ceux-ci ne causent pas de distraction effect mesurable

### Citations cles
> "When a prompt injection attack occurs, the attention of specific attention heads shifts from the original instruction to the injected instruction—a phenomenon we have named the distraction effect." (Section 1, p. 1)
> "Attention Tracker achieved exceptionally high detection accuracy, improving the AUROC score up to 10.0% over all existing detection methods." (Section 5.2)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Haute — modeles open-weight accessibles, datasets publics, code sur HuggingFace |
| Code disponible | Oui (https://huggingface.co/spaces/TrustSafeAI/Attention-Tracker) |
| Dataset public | Oui (Open-Prompt-Injection, deepset) |
