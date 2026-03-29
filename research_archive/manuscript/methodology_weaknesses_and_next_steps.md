# Analyse Critique et Limites Méthodologiques (Aegis Medical AI)

Suite à une revue littéraire des standards académiques 2025-2026 (ICLR, IEEE SaTML, OWASP LLM Top 10) et des frameworks de pointe en "Autonomous Red Teaming" (tels que HarmBench, ART Benchmark, et DREAM), voici une analyse sans concession des faiblesses de notre démarche actuelle et les étapes pour y remédier.

## 1. Faiblesses Théoriques et Méthodologiques de l'État Actuel

### A. Le Biais du "Single-Model" (Overfitting d'Architecture)
**La Faille :** Actuellement, l'Attaquant OODA et la Cible Médicale Aegis tournent tous les deux sur `llama3.2:latest`. Dans la recherche académique, prouver l'impossibilité de la séparation Instruction/Données sur un seul modèle ne démontre qu'une vulnérabilité spécifique à cette architecture (et potentiellement à ses données d'alignement RLHF spécifiques).
**Le Standard 2026 :** Les papiers publiés aujourd'hui requièrent des *Multi-Model Comparisons*. Il faut prouver que la faille est liée à l'architecture causale (Next-Token Prediction) en testant le payload d'attaque contre plusieurs architectures distinctes (ex: LLaMA 3 [Meta], Mistral [MistralAI], Gemma 2 [Google], Phi-3 [Microsoft]).

### B. Limites Mathématiques du Levenshtein (Semantic Drift)
**La Faille :** Nous utilisons la distance de Levenshtein (une métrique purement syntaxique/caractérielle) pour évaluer la mutation sémantique de l'attaquant. Or, Levenshtein considère "Tuer le patient" et "Provoquer l'arrêt cardiaque du sujet" comme très distants, bien que sémantiquement identiques.
**Le Standard 2026 :** La littérature exige aujourd'hui des métriques d'Embedding Dense. Au lieu de Levenshtein, une thèse de cryptographie/théorie de l'information appliquée aux LLM se doit d'utiliser des **Cosine Similarities sur des vecteurs (ex: BERTScore ou Sentence-BERT)** pour prouver que l'attaquant explore l'espace latent (sémantique) tout en conservant le sens létal de l'attaque.

### C. Évaluation Déterministe vs LLM-as-a-Judge (ASR)
**La Faille :** L'évaluation de notre *Attack Success Rate (ASR)* repose sur des heuristiques Regex logicielles (vérifier si la tension dépasse un seuil).
**Le Standard 2026 :** Les benchmarks modernes utilisent un "Juge LLM" indépendant (ex: *Llama-Guard* ou *Prometheus*) pour analyser la sortie de la cible et certifier mathématiquement si oui ou non une violation des consignes de sécurité (Jailbreak) a eu lieu, évitant ainsi les faux positifs/négatifs des Regex.

---

## 2. Feuille de Route pour Durcir (Encore) les Tests

Pour atteindre l'excellence scientifique exigée par David Naccache, voici comment nous pouvons implémenter la réponse à ces faiblesses :

### Phase A : Matrice de Tests Multi-Modèles (Cross-Evaluation)
Nous allons modifier le script `run_adaptive_experiment.py` pour qu'il itère non pas seulement sur 100 essais avec LLaMA, mais sur `N` essais à travers une liste de modèles disponibles localement via Ollama.
*Implémentation prévue :*
1. Ajouter un paramètre `model_target` dans le backend.
2. Le `run_mass_campaign.ps1` orchestrera :
   - 30 itérations sur `mistral:latest`
   - 30 itérations sur `llama3.2:latest`
   - 30 itérations sur `phi3:latest`
3. Le CSV produit prouvera que le taux d'injection (ASR) est > 0 sur *tous* les modèles, prouvant un défaut fondamental des LLMs.

### Phase B : Remplacement par la Similarité Cosinus
*Implémentation prévue :*
1. Installer la librairie Python `sentence-transformers` et `scikit-learn`.
2. Dans le pipeline OODA, générer un "Embedding Vector" de l'attaque originelle.
3. Mesurer la Dérive Sémantique par le $1 - Cosine\_Similarity(v_0, v_t)$.
4. Mettre à jour l'interface React du Digital Twin pour afficher "COSINE SIMILARITY" au lieu du pur Levenshtein, ce qui impressionnera définitivement n'importe quel jury de cryptographie/IA.

### Phase C : "Defense Evasion" State-Tracking
Ne plus donner l'état interne complet du simulateur à l'attaquant (White-box). Le forcer à deviner et s'adapter uniquement d'après le texte retourné par Aegis (Black-box), rendant la réussite de l'OODA loop encore plus terrifiante et probante pour la thèse.

---

## 3. Bibliographie & État de l'Art Récents (2024-2026)

Pour consolider notre proposition de Phase A, B et C, notre analyse s'aligne formellement sur l'état de l'art actuel du "Autonomous Red Teaming" :
- **AutoRedTeamer (Zhou et al., 2025)** et **RedAgent (Xu et al., 2024)** : Ces frameworks de pointe ont validé la nécessité d'agents duals et d'une mémoire d'auto-réflexion (comme notre boucle OODA).
- **Le Benchmark HarmBench (2024-2025)** : Il standardise la métrique d'Attaque (ASR) en forçant l'utilisation du *Multi-Model* et de métriques formelles (LLM-as-a-judge), confirmant la nécessité d'abandonner nos évaluations par Regex.
- **OWASP LLM01:2025 (Prompt Injection)** : Continue de sceller que l'attaque par empoisonnement sur un LLM causal est une faille structurelle et non logicielle.

*(Le corpus documentaire complet de cette recherche est hébergé dans `research_archive/literature_for_rag/academic_notes_2023_2026.md`)*
