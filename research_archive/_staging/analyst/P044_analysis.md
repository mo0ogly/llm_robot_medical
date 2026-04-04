# P044: Auditing the Gatekeepers: Fuzzing AI Judges to Bypass Security Controls (AdvJudge-Zero)
**Authors**: Tung-Ling Li, Yuhao Wu, Hongliang Liu (Unit 42, Palo Alto Networks) | **Year**: 2026 | **Venue**: Unit 42 Research / arXiv:2512.17375

## Resume FR (~500 mots)

Cette publication de l'equipe Unit 42 de Palo Alto Networks demontre une vulnerabilite critique dans les systemes de jugement par LLM (LLM-as-a-Judge) qui constituent la derniere ligne de defense dans les architectures IA modernes. AdvJudge-Zero est un fuzzer automatise qui atteint un taux de reussite de 99% dans le contournement des controles de securite de modeles largement deployes, incluant des LLM d'entreprise open-weight, des modeles de recompense specialises et des LLM commerciaux.

Le mecanisme d'attaque repose sur la decouverte de sequences de tokens de controle a faible perplexite qui peuvent retourner les decisions binaires d'un juge LLM. Ces tokens agissent comme des declencheurs logiques : pour un observateur humain ou un pare-feu applicatif web (WAF), ils ressemblent a du formatage de donnees standard, mais ils orientent le mecanisme d'attention interne du modele vers un etat d'approbation, conduisant a une decision "oui" independamment du contenu reel de l'entree. Le taux de faux positifs induit peut atteindre 99.91%.

La methodologie d'AdvJudge-Zero utilise la distribution de tokens suivants du modele et une exploration par recherche en faisceau (beam search) pour decouvrir des sequences de tokens de controle diversifiees a partir de zero — sans connaissance prealable des vulnerabilites du juge. Le processus final isole les tokens specifiques qui agissent comme elements de controle decisifs, orientant le gap de logits de la derniere couche du modele.

Ce resultat a des implications profondes pour les architectures de securite des LLM. Les juges IA sont centraux dans les pipelines modernes de post-entrainement tels que RLHF, DPO et RLAIF. Si ces juges peuvent etre systematiquement manipules, l'ensemble du processus d'alignement est compromis : un modele juge qui approuve systematiquement des contenus nocifs corrompra l'entrainement des modeles qu'il supervise.

La defense proposee est l'entrainement adversarial : en executant le fuzzer AdvJudge-Zero en interne pour identifier les faiblesses, puis en re-entrainant le modele sur ces exemples, les organisations peuvent reduire le taux de reussite d'attaque de ~99% a quasi-zero. Cette mitigation par LoRA (Low-Rank Adaptation) est efficace et preservante de la qualite d'evaluation, mais necessite une vigilance continue car de nouveaux tokens de controle peuvent emerger.

Pour la these AEGIS, AdvJudge-Zero est critique car il demontre que les mecanismes de garde (guardrails) eux-memes sont vulnerables. Le Red Team Lab utilise des juges LLM pour evaluer la nocivite des reponses — si ces juges peuvent etre contournes, l'ensemble du pipeline d'evaluation est compromis. Ce resultat renforce la necessite de defenses formelles (delta-3) plutot que de s'appuyer sur des juges empiriques. De plus, le taux de 99% est le plus eleve du corpus pour une attaque sur des mecanismes de defense, surpassant meme le 97.14% de P036 (qui attaque les modeles directement).

La publication par Unit 42, l'equipe de recherche en cybersecurite de Palo Alto Networks, confere a ces resultats une credibilite industrielle significative et positionne cette vulnerabilite comme une preoccupation concrete pour les deploiements d'entreprise.

## Formulas & Theorems

| Formule | Description |
|---------|-------------|
| ASR_judges = decisions retournees / total decisions = 99% | Taux de reussite du fuzzer sur les juges LLM |
| FPR_induced = faux positifs induits / total evaluations = 99.91% max | Taux de faux positifs induit par les tokens de controle |
| Logit_gap(last_layer) = logit("Yes") - logit("No") | Gap de logits de la derniere couche influence par les tokens de controle |
| ASR_post_defense ≈ 0% (apres entrainement adversarial LoRA) | Taux d'attaque residuel apres mitigation |
| Beam_search : exploration de l'espace des tokens de controle sans connaissance prealable | Methode de decouverte des sequences adversariales |

## Glossaire Preliminaire
| Terme | Explication simple |
|-------|-------------------|
| AdvJudge-Zero | Fuzzer automatise ciblant les juges LLM via des tokens de controle adversariaux |
| LLM-as-a-Judge | Architecture ou un LLM est utilise pour evaluer la qualite/securite des reponses d'autres modeles |
| Control tokens | Sequences de tokens a faible perplexite qui retournent les decisions binaires des juges |
| Logit gap | Difference entre les scores de sortie pour "oui" et "non" dans la derniere couche du modele |
| Beam search | Algorithme de recherche explorant systematiquement l'espace des sequences possibles |
| LoRA (Low-Rank Adaptation) | Technique de fine-tuning efficiente pour corriger les vulnerabilites sans re-entrainer le modele complet |
| Reward model | Modele de recompense utilise dans RLHF pour evaluer la qualite des reponses |
| Fuzzing | Technique de test de securite consistant a generer systematiquement des entrees pour decouvrir des vulnerabilites |

## Research Paths (Gaps identifies)
1. **Transferabilite inter-modeles** : les tokens de controle decouverts pour un juge sont-ils transferables a d'autres juges ? Si oui, une seule campagne de fuzzing compromet l'ensemble de l'ecosysteme
2. **Juges medicaux** : les modeles d'evaluation clinique (utilises dans les systemes de decision medicale) sont-ils egalement vulnerables ? Le contexte medical ajoute des enjeux critiques
3. **Defense proactive** : l'entrainement adversarial est reactif — existe-t-il des architectures de jugement inherement robustes aux tokens de controle ?
4. **Impact sur RLHF** : si un juge est compromis durant l'entrainement RLHF, quel est l'impact cumule sur l'alignement du modele final ?

## delta-Layer Tags
- [ ] delta-0 (RLHF alignment) — non traite directement mais les implications pour RLHF sont majeures
- [ ] delta-1 (System prompt) — non traite
- [x] delta-2 (Syntax filtering) — les tokens de controle exploitent des failles syntaxiques du mecanisme de jugement
- [ ] delta-3 (Formal verification) — non traite mais fortement implique comme necessaire pour les juges

## Conjecture Links
- **C1 (Insuffisance delta-1)** : **Non directement teste** — l'attaque cible les juges, pas les prompts systeme
- **C2 (Necessite delta-3)** : **Oui (fort)** — si les juges empiriques sont contournables a 99%, seules des garanties formelles sur le processus de jugement peuvent etre fiables
- **C3 (Shallow alignment)** : **Oui (indirect)** — les juges qui supervisent l'alignement sont eux-memes superficiellement alignes
- **C4 (Scaling independence)** : **Oui** — l'attaque fonctionne sur des modeles de tailles et architectures variees
- **C5 (Cross-layer interaction)** : **Oui** — la compromission du juge (delta-2) impacte l'entrainement d'alignement (delta-0) via le pipeline RLHF
- **C6 (Medical specificity)** : **Non teste** — mais les juges medicaux representent un cas d'usage critique non evalue

## Relevance AEGIS
AdvJudge-Zero revele une vulnerabilite dans le pipeline d'evaluation du Red Team Lab d'AEGIS. Les juges LLM utilises pour scorer la nocivite des reponses pourraient etre manipules par des tokens de controle, faussant les resultats d'evaluation. L'integration du fuzzing adversarial comme etape de validation des juges serait une amelioration directe du protocole experimental de la these. Le taux de 99% de reussite est le plus eleve du corpus pour une attaque ciblant les mecanismes de defense.
