# Projet de Thèse : Séparation Instruction/Données dans les LLMs

## 1. Le problème ouvert
- **Contexte** : Séparation I/D formellement mesurée (Zverev et al., 2025), mais preuve d'impossibilité manquante.
- **Résultats récents** : 
  - Wolf et al. (BEB) : impossibilité de l'alignement comportemental général.
  - CaMeL (DeepMind) : défense structurelle externe (CFI).
  - Chen et al. : H-Neurons prédisant la compliance forcée.
- **Problème** : Les LLM sont des "confusable deputies" car l'architecture ne sépare pas code/données.

## 2. Positionnement (Strates de défense)
- **Strate 1** (Comportementale) : RLHF, Auto-critique, Filtres (trop tard pour les agents), Prompt hardening. *Bilan : Ne peut pas éliminer l'attaque.*
- **Strate 2** (Architecturale interne) : Séparateurs spéciaux, SecAlign. *Ici opère la thèse.*
- **Strate 3** (Structurelle externe) : CaMeL.
- **Strate 4** (Mécaniste) : H-Neurons.

## 3. Formalisme (DY-AGENT)
- **Définition 1-3** : Système S = (M, T, E, C). M oracle non déterministe.
- **Taxonomie séparation** : 
  - δ¹ (Faible) : Signalisation (dépend du comportement).
  - δ² (Moyenne) : Syntaxe.
  - δ³ (Forte) : Enforcement externe (CaMeL).
- **Définition 7** : `Integrity(S)` -> Invocations atteignables ⊆ Invocations autorisées.

## 4. Programme de Recherche
- **Conjecture 1** : Insuffisance de δ¹ (Signalisation) pour les systèmes agentiques avec effets de bord. 
- **Conjecture 2** : Nécessité de δ³ (Enforcement externe) pour garantir l'intégrité.

## 5. Validation Empirique (Terrain)
- **Opération OpenClaw** : Kill chain IA (5 phases).
- **LLM Robot Médical (Aegis)** : Jailbreak d'un LLM connecté au robot Da Vinci (Agent avec actuateur physique !). Les conséquences physiques (E) discriminent la sécurité agentique (vs chatbots).
- **LIA-Scan** : Scan en production ANSSI.
