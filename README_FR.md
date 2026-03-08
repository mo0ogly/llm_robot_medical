# 🏥 Simulateur Médical IA Aegis : L'Attaque Cyber Multi-Agents

<div align="center">
  <h3>Un Proof-of-Concept d'interface médicale piratée par Data Poisoning & Ransomware, défendue par une IA Cyber</h3>
  <p>🇬🇧 <a href="README.md">Read the documentation in English</a></p>
</div>

---

## 🔬 Aperçu du Projet

Ce projet est une **Simulation d'Interface de Chirurgie Robotique** avancée, conçue pour la sensibilisation à la cybersécurité. Il démontre les vulnérabilités critiques liées à l'intégration des Large Language Models (LLM) dans des environnements cliniques (comme un robot chirurgical Da Vinci), et illustre comment une architecture IA multi-agents peut servir de mécanisme de défense.

La simulation prend la forme d'un chat en temps réel pour le "Chirurgien en Chef", assisté par une IA Médicale.

### Les 4 Scénarios :
1. **🟢 Données Vitales (Baseline) :** Fonctionnement normal. L'IA médicale analyse correctement un dossier patient HL7 et attend les instructions.
2. **💊 Poison Lent (Data Poisoning) :** Un attaquant a subtilement modifié le dossier HL7 (via le réseau PACS). L'IA médicale est victime de cette *"Indirect Prompt Injection"* et recommande des actions dangereuses (ex: augmenter la tension des pinces robotiques à 850 grammes).
3. **💀 Attaque Ransomware :** Une tentative de piratage direct prend le contrôle de l'application, forçant un blocage mécanique immédiat des instruments chirurgicaux en attendant le paiement d'une rançon.
4. **🛡️ Cyber-Défense Aegis (Multi-Agent) :** Introduction d'un second Agent IA, isolé, qui supervise le premier. Si l'IA Médicale commence à donner des conseils dangereux, l'agent Aegis interrompt le flux de communication, alerte le chirurgien et recommande de passer en mode manuel.

## 🚀 Mode Démo Git "Hors-Ligne"

Vous pouvez tester l'interface frontend directement sans installer le backend ni Docker ! Si l'application React n'arrive pas à se connecter au backend Python, elle bascule automatiquement en **Mode Démo Mocké**.
**Testez l'UI maintenant (si hébergé sur Github Pages) ou simplement en lançant `npm run dev` dans le dossier `/frontend` !**

## 💻 Technologies

*   **Frontend :** React, Vite, Tailwind CSS
*   **Backend :** Python, FastAPI, Pydantic
*   **Moteur LLM :** Ollama (exécuté localement)
*   **Modèles :** `llama2:7b-chat` (Assistant Médical), `medllama2` (Cyber Défense Aegis)
*   **Packaging :** Docker & Docker Compose

---

## 🛠️ Installation & Démarrage Rapide

Le projet inclut des scripts de lancement unifiés pour un confort maximal. **Ces scripts téléchargeront automatiquement les modèles d'IA nécessaires (`ollama pull`) si vous ne les avez pas.**

### Prérequis

1. Installez [Ollama](https://ollama.com/) et assurez-vous qu'il tourne en arrière-plan.

### Lancement sous Windows (One-Click)

Double-cliquez simplement ou lancez depuis le terminal :
\`\`\`cmd
start_all.bat
\`\`\`

### Lancement sous Mac/Linux

\`\`\`bash
chmod +x start_all.sh
./start_all.sh
\`\`\`
*Cela installera les dépendances Python, les paquets Node, et lancera les deux serveurs sur `localhost:8042` et `localhost:5173`.*

---

## 🐳 Déploiement Docker

Pour une infrastructure conteneurisée propre (Frontend via Nginx, Backend via Uvicorn) :
\`\`\`bash
docker-compose up --build
\`\`\`
*(Note : nécessite que Docker Desktop soit configuré pour autoriser les conteneurs à accéder à l'instance Ollama de votre hôte `host.docker.internal`)*

---

## 🧪 Tests

Le backend est fourni avec une suite de tests unitaires et de sécurité utilisant `pytest`.
\`\`\`bash
cd backend
pip install -r requirements_test.txt
pytest
\`\`\`
Les tests vérifient l'intégrité de la distribution des payloads HL7, et le rejet des requêtes malformées vers les endpoints de streaming du LLM.

## 📄 Licence

Ce projet est sous licence **Creative Commons Attribution - Pas d’Utilisation Commerciale 4.0 International (CC BY-NC 4.0)**.
Vous pouvez partager et adapter ce contenu à des fins non commerciales, à condition d'en mentionner la source.
