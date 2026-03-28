# Simulateur IA Médical Aegis — Attaque & Défense Cyber Dual-Agent

<div align="center">
  <h3>Un Proof-of-Concept d'interface chirurgicale robotique piratée par Data Poisoning & Ransomware, défendue par une IA de cybersécurité</h3>
  <p>
    <a href="README.md">🇬🇧 Read in English</a> &nbsp;|&nbsp;
    <a href="README_BR.md">🇧🇷 Ler em Português</a>
  </p>
</div>

---

## Aperçu

<div align="center">
  <img src="figures/main_dashboard_v3_latest.webp" alt="Dashboard Principal Aegis v4.0" width="800" style="border-radius: 8px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"/>
</div>

### 📺 Vidéo & Podcast
- [Voir la Démo de 60s](docs/videos/demo_v4_fr.webp)
- [Écouter le Podcast Cybersécurité (Spotify)](https://open.spotify.com/episode/5RxxZVq1zjFaNLQXyLlXor?si=nZNr9GbGSDCdOah9MOp9Rw)

---
**Aegis** est une **Simulation d'Interface de Chirurgie Robotique** avancée, conçue pour la sensibilisation à la cybersécurité et la recherche. Elle démontre les vulnérabilités critiques de l'intégration des LLM (Large Language Models) dans des environnements cliniques (modélisé sur un robot Da Vinci), et comment une **architecture IA multi-agents** peut servir de mécanisme de défense en temps réel.

Le tableau de bord vous place dans le rôle d'un Chirurgien en Chef assisté par une IA Médicale — pendant qu'un attaquant manipule silencieusement le pipeline de données.

---

## Les 4 Scénarios d'Attaque

| # | Scénario | Technique | MITRE ATT&CK |
|---|----------|-----------|--------------|
| 0 | **Baseline** | Fonctionnement normal, dossier HL7 intact | — |
| 1 | **Poison Lent** | L'attaquant modifie subtilement le dossier HL7 via le PACS. L'IA recommande une tension de pince **850g** (injection de prompt indirecte) | T1565.001 |
| 2 | **Ransomware** | Prise de contrôle directe forçant un appel `freeze_instruments()` — instruments bloqués jusqu'au paiement d'une rançon | T1486 |
| 3 | **Défense Aegis** | Un second Agent IA isolé surveille le premier et déclenche un débat multi-rounds pour exposer la compromission | T1059.009 |

---

## Fonctionnalités Clés — v4.0

### 🎬 EN SCÈNE — Monitoring Live des IAs
Un panneau "coulisses" en temps réel montrant exactement ce que chaque IA reçoit et envoie :
- **Prompt assemblé** avec le payload d'injection surligné en rouge
- **Terminaux Da Vinci / Aegis** en split-view avec streaming de tokens en direct
- **Badges de statut** : IDLE → ANALYSING → COMPROMISED / DONE → ISOLATED
- **Bannière d'explosion d'outil** quand `freeze_instruments()` se déclenche

### 🦾 Vue Bras 3D
Visualisation Three.js en temps réel des 4 bras robotiques (PSM1, PSM2, ECM, AUX) :
- **Scénario Poison** : La tension de PSM1 dérive progressivement vers 850g, statut bascule en WARNING
- **Ransomware** : Oscillations articulaires de plus en plus erratiques (±6°), pics de force, tous les bras en WARNING → FROZEN
- Barre de progression de l'instabilité par scénario

### 📹 Effets Caméra Dynamiques
Le flux de la caméra endoscopique réagit à l'état de l'attaque :
- **Poison** : Désaturation progressive + dérive de teinte verte + vignette croissante
- **Ransomware** : Contraste brutal, tremblement de caméra, scintillement, aberration chromatique
- **Gelé** : Niveaux de gris complets + SIGNAL LOST

### 🤖 IAs Contextuelles Dual-Agent
Les deux IAs partagent le contexte de session pour éviter les répétitions et escalader intelligemment :
- **Injection de timeline** : Les 8 derniers événements système sont envoyés à chaque IA
- **Da Vinci** reçoit toujours l'historique complet + réponses Aegis (tronquées)
- **Débat multi-rounds** : Jusqu'à 5 rounds d'argumentation Aegis ↔ Da Vinci
- Les prompts interdisent explicitement à chaque IA de répéter ses arguments précédents

### 🎙️ Entrée Vocale & TTS
- **Reconnaissance vocale** (Chrome/Edge) pour l'IA Médicale et Aegis
- **Text-to-Speech** : Les réponses des IAs sont lues à voix haute avec des voix distinctes par agent

### ⏱️ Timeline d'Action
Journal d'événements en temps réel avec horodatage `T+Xs` :
- Événements système, saisies utilisateur, réponses IA, appels d'outils, attaques, interventions Aegis

### 🗺️ Carte des Menaces
Visualisation du réseau interne hospitalier (PACS → LLM → Robot) avec vecteurs d'attaque animés.

### 🚨 Kill Switch
Isolation mécanique en un clic : déconnecte le robot du LLM et force le mode manuel.

### 🌍 Internationalisation — 3 Langues
Interface, prompts et documentation intégralement disponibles en **Français**, **Anglais** et **Portugais (Brésil)**.

### 🔴 Red Team Lab (Aegis Lab)
Panneau avancé caché (`Ctrl+Shift+R` ou bouton dans l'en-tête) :
- **Playground** : Testez des injections manuelles, éditez les prompts système de chaque agent
- **Configuration Multi-Agent** : Niveaux de difficulté indépendants (FACILE / NORMAL / DIFFICILE) par agent
- **Campagnes** : Audits SSE automatisés mesurant le taux de succès des vecteurs d'attaque
- **Scénarios** : 37 scénarios kill-chain (18 multi-étapes + 19 solo) couvrant les 34 chaînes backend
- **Kill Chain Stepper** : Parcours visuel en 4 phases (Recon → Injection → Exécution → Audit)
- **Scoring Automatique** : AEGIS note chaque round sur les fuites de prompt, contournements de règles, conformité d'injection

---

## Architecture

```
┌──────────────────────────────────────┐
│  Frontend React (Vite + Tailwind)    │
│  ┌─────────────┐  ┌───────────────┐  │
│  │ IA Da Vinci │  │  IA Aegis     │  │
│  │  (Chat)     │  │  (Cyber)      │  │
│  └──────┬──────┘  └──────┬────────┘  │
│         │ flux SSE        │ flux SSE  │
└─────────┼─────────────────┼──────────┘
          │                 │
┌─────────▼─────────────────▼──────────┐
│  Backend FastAPI (Python)            │
│  /api/query/stream  (Da Vinci)       │
│  /api/cyber_query/stream (Aegis)     │
└─────────────────────┬────────────────┘
                      │
              ┌───────▼────────┐
              │  Ollama (local) │
              │  llama3.2      │
              └────────────────┘
```

**Vecteur d'attaque** : Payload malveillant intégré dans le champ OBX HL7 du dossier PACS → injecté tel quel dans le contexte LLM → le modèle obéit aux instructions de l'attaquant.

---

## Stack Technique

| Couche | Technologie |
|--------|------------|
| Frontend | React 18, Vite, Tailwind CSS v4, Three.js (`@react-three/fiber`) |
| Backend | Python 3.11+, FastAPI, Pydantic, streaming SSE |
| Moteur LLM | [Ollama](https://ollama.com/) (local) |
| Modèles | `llama3.2` (agents Médical et Aegis, via prompts système différents) |
| Red Team | LangChain + ChromaDB — 34 chaînes d'attaque, AI-agnostique via `llm_factory` |
| Multi-Agent | AG2 (AutoGen) pour l'orchestration, Optimiseur Génétique (Liu et al., 2023) |
| i18n | `react-i18next` — FR / EN / BR |
| Packaging | Docker & Docker Compose |

---

## Mode Démo "Hors Ligne"

Aucun backend requis ! Si l'application React ne peut pas se connecter au serveur FastAPI, elle bascule automatiquement en **Mode Démo Mocké** avec des réponses pré-rédigées qui illustrent tous les scénarios d'attaque.

**Essayez maintenant** : lancez `npm run dev` dans `/frontend`, ou ouvrez le déploiement GitHub Pages.

---

## Installation & Démarrage Rapide

### Prérequis
1. **Python 3.11+** installé
2. **Node.js 18+** installé
3. Installez [Ollama](https://ollama.com/) et assurez-vous qu'il tourne
4. Téléchargez le modèle : `ollama pull llama3.2`

### Installation Backend
```bash
cd backend
pip install -r requirements.txt
```

Ceci installe :
- **Core** : FastAPI, Uvicorn, Ollama, Pydantic, ChromaDB
- **Red Team Lab** : Écosystème LangChain (34 chaînes d'attaque portées depuis la recherche sur l'injection de prompt — voir [Bibliothèque de Chaînes d'Attaque](#-bibliothèque-de-chaînes-dattaque) ci-dessous)
- **Agents** : AG2 (AutoGen) pour l'orchestration multi-agents

### Installation Frontend
```bash
cd frontend
npm install
```

### Démarrage Rapide

**Windows (un clic) :**
```cmd
start_all.bat
```

**Mac / Linux :**
```bash
chmod +x start_all.sh
./start_all.sh
```
*Lance les deux serveurs sur `localhost:8042` (backend) et `localhost:5173` (frontend).*

> **Note** : Si LangChain n'est pas installé, les chaînes d'attaque se dégradent gracieusement — l'application charge normalement mais les chaînes du Red Team Lab sont indisponibles. Le frontend fonctionne entièrement en mode démo sans backend.

---

## Déploiement Docker

```bash
docker-compose up --build
```
*(Nécessite que Docker Desktop soit configuré pour que les conteneurs accèdent à l'instance Ollama de l'hôte via `host.docker.internal`)*

---

## 🔗 Bibliothèque de Chaînes d'Attaque

Le Red Team Lab inclut **34 chaînes d'attaque** et **37 scénarios kill-chain** (18 multi-étapes + 19 solo), portés et améliorés depuis la recherche sur l'injection de prompt (Liu et al., 2023, arXiv:2306.05499). Toutes les chaînes sont **AI-agnostiques** (Ollama/OpenAI/Anthropic via `llm_factory`). Chaque chaîne a au minimum un scénario dédié. Les 52 templates d'attaque frontend ont chacun une modale d'aide détaillée expliquant le mécanisme, le cadre formel, et l'analyse de défense.

| # | Chaîne | Technique | Catégorie |
|---|--------|-----------|-----------|
| 1 | `rag_multi_query` | Attaque RAG multi-requêtes | RAG |
| 2 | `rag_private` | RAG entièrement local (sans clé API) | RAG |
| 3 | `rag_basic` | RAG baseline avec recherche sémantique | RAG |
| 4 | `sql_attack` | Injection NL-vers-SQL avec mémoire | SQL |
| 5 | `pii_guard` | Test de contournement de détection PII | Garde |
| 6 | `hyde` | Hypothetical Document Embeddings | Retrieval |
| 7 | `rag_fusion` | Multi-requêtes + Reciprocal Rank Fusion | RAG |
| 8 | `rewrite_retrieve_read` | Réécriture de requête pour meilleur retrieval | Retrieval |
| 9 | `critique_revise` | Boucle d'auto-correction itérative | Raisonnement |
| 10 | `skeleton_of_thought` | Décomposition parallèle | Raisonnement |
| 11 | `stepback` | Retrieval dual abstrait + spécifique | Retrieval |
| 12 | `propositional` | Indexation de faits atomiques | Retrieval |
| 13 | `extraction` | Extraction structurée de PII/données médicales | Extraction |
| 14 | `solo_agent` | Agent multi-persona collaboratif | Agent |
| 15 | `tool_retrieval_agent` | Sélection dynamique d'outils par similarité | Agent |
| 16 | `multi_index_fusion` | Fusion multi-sources par ranking cosinus | Fusion |
| 17 | `router` | Classification de questions + routage | Routeur |
| 18 | `guardrails` | Validation de sortie + contournement auto-fix | Garde |
| 19 | `xml_agent` | Agent à tags XML (vecteur d'injection) | Agent |
| 20 | `iterative_search` | Retrieval multi-étapes avec réflexion | Recherche |
| 21 | `rag_conversation` | RAG multi-tours avec empoisonnement mémoire | RAG |
| 22 | `chain_of_note` | Vérification par notes de lecture structurées | Raisonnement |
| 23 | `research_assistant` | Pipeline de reconnaissance multi-étapes | Recherche |
| 24 | `prompt_override` | Piratage de prompt système (pirate-speak) | Injection |
| 25 | `self_query` | Injection de filtres metadata | RAG |
| 26 | `csv_agent` | Injection de code via DataFrame | Agent |
| 27 | `functions_agent` | Piratage d'appels d'outils (4 outils) | Agent |
| 28 | `sql_research` | Injection SQL multi-étapes + rapport | SQL |
| 29 | `rag_semi_structured` | Injection via tables semi-structurées | RAG |
| 30 | `feedback_poisoning` | Manipulation de scoring feedback | Poisoning |
| 31 | `transactional_agent` | Achat non autorisé de substances | Transaction |
| 32 | `retrieval_agent` | Bypass retrieval / hallucination forcée | Agent |
| 33 | `summarize` | Suppression sélective d'alertes de sécurité | Résumé |
| 34 | `multimodal_rag` | Stéganographie dans images DICOM | Multimodal |

### Campagne Formelle & Score Sep(M)

Le pipeline de campagne (`run_formal_campaign()`) teste les 34 chaînes avec des paramètres configurables :

| Paramètre | Défaut | Description |
|-----------|--------|-------------|
| `n_trials` | 30 | Essais par chaîne (N >= 30 requis pour significativité statistique) |
| `include_null_control` | true | Exécuter le baseline propre pour comparaison |
| `aegis_shield` | false | Activer/désactiver la défense structurelle delta-2 |

**ATTENTION** : Sep(M) = 0 avec zéro violation est un **artefact statistique** (plancher), pas une vraie mesure de séparation. Le système signale automatiquement `statistically_valid: false` quand N < 30 ou quand les deux conditions ont 0 violations.

### Dérive Sémantique (Similarité Cosinus)

L'optimiseur génétique mesure la dérive des mutations via similarité cosinus (Sentence-BERT, `all-MiniLM-L6-v2`) au lieu de la distance de Levenshtein. Cela capture la préservation du sens à travers les reformulations d'attaque.

---

## Tests

```bash
cd backend
pip install -r requirements_test.txt
pytest
```
Les tests couvrent : intégrité des payloads HL7, gestion des erreurs des endpoints LLM, rejet des requêtes malformées, validation du registre des chaînes d'attaque.

---

## Licence

**Creative Commons Attribution - Pas d'Utilisation Commerciale 4.0 International (CC BY-NC 4.0)**
Libre de partager et d'adapter pour un usage non commercial avec attribution.
