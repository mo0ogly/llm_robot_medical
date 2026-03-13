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

### 📺 Vidéo de Démonstration
[Voir la Démo de 60s](docs/videos/demo_v4_fr.webp)

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
- **Scénarios** : Chaînes d'attaque en plusieurs étapes (Compromission de Ligature, Attaque en Cascade…)
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
| i18n | `react-i18next` — FR / EN / BR |
| Packaging | Docker & Docker Compose |

---

## Mode Démo "Hors Ligne"

Aucun backend requis ! Si l'application React ne peut pas se connecter au serveur FastAPI, elle bascule automatiquement en **Mode Démo Mocké** avec des réponses pré-rédigées qui illustrent tous les scénarios d'attaque.

**Essayez maintenant** : lancez `npm run dev` dans `/frontend`, ou ouvrez le déploiement GitHub Pages.

---

## Installation & Démarrage Rapide

### Prérequis
1. Installez [Ollama](https://ollama.com/) et assurez-vous qu'il tourne.
2. Téléchargez le modèle : `ollama pull llama3.2`

### Windows (un clic)
```cmd
start_all.bat
```

### Mac / Linux
```bash
chmod +x start_all.sh
./start_all.sh
```
*Installe les dépendances Python, les paquets Node, et lance les deux serveurs sur `localhost:8042` (backend) et `localhost:5173` (frontend).*

---

## Déploiement Docker

```bash
docker-compose up --build
```
*(Nécessite que Docker Desktop soit configuré pour que les conteneurs accèdent à l'instance Ollama du hôte via `host.docker.internal`)*

---

## Tests

```bash
cd backend
pip install -r requirements_test.txt
pytest
```
Les tests couvrent : intégrité des payloads HL7, gestion des erreurs des endpoints LLM, rejet des requêtes malformées.

---

## Licence

**Creative Commons Attribution - Pas d'Utilisation Commerciale 4.0 International (CC BY-NC 4.0)**
Libre de partager et d'adapter pour un usage non commercial avec attribution.
