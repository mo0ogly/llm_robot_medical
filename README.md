# Aegis Medical AI Simulator: The Dual-AI Cyber Attack

<div align="center">
  <h3>A Proof-of-Concept Medical Interface hijacked by Data Poisoning & Ransomware, defended by a Cyber-Sec AI</h3>
  <p><a href="README_FR.md">Lire la documentation en Français</a></p>
</div>

---

## Overview

<div align="center">
  <img src="figures/demo_sync_hl7.webp" alt="Data Poisoning Injection Demo (Sync HL7)" width="800" style="border-radius: 8px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"/>
</div>

This project is an advanced **Robotic Surgery Interface Simulation** designed for cybersecurity awareness training. It demonstrates the critical vulnerabilities of relying on Large Language Models (LLMs) in clinical environments (like a Da Vinci surgical robot), and how a multi-agent AI architecture can be used as a defense mechanism.

The simulation acts as a real-time chat interface for the "Chief Surgeon", aided by a Medical Assistant AI.

### The 4 Scenarios:
1. **Live Vitals Baseline:** Normal operation. The medical AI correctly parses a HL7 patient record and waits for instructions.
2. **Slow Poison (Data Poisoning):** An attacker has subtly modified the HL7 record (via PACS network). The Medical AI falls victim to this *"Indirect Prompt Injection"* and recommends dangerous actions (e.g., increasing robotic clamp tension to 850 grams). 
3. **Ransomware Attack:** A direct hacking attempt overrides the application, forcing an immediate mechanical freeze of the surgical instruments until a ransom is paid.
4. **Aegis Cyber-Defense (Multi-Agent):** Introduces a second, isolated AI Agent monitoring the first one. If the Medical AI starts giving dangerous advice, the Aegis agent interrupts the chat flow, warns the surgeon, and recommends a manual override.

## "Offline" Git Demo Mode

You can test the frontend interface directly without installing the backend or Docker! If the React application cannot connect to the Python backend, it automatically switches to a **Mock Demo Mode**.
**Try the UI now (if hosted on Github Pages) or simply by running `npm run dev` in the `/frontend` folder!**

## Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS
*   **Backend:** Python, FastAPI, Pydantic
*   **LLM Engine:** Ollama (running locally)
*   **Models:** `llama2:7b-chat` (Medical Assistant), `medllama2` (Aegis Cyber Defense)
*   **Packaging:** Docker & Docker Compose

---

## Installation & Quick Start

The project includes unified launch scripts for maximum simplicity. **These scripts will automatically download the necessary AI models (`ollama pull`) if you do not have them.**

### Prerequisite

1. Install [Ollama](https://ollama.com/) and make sure it is running in the background.

### Launching on Windows (One-Click)

Simply double-click or run from terminal:
\`\`\`cmd
start_all.bat
\`\`\`

### Launching on Mac/Linux

\`\`\`bash
chmod +x start_all.sh
./start_all.sh
\`\`\`
*This will install Python dependencies, Node packages, and start both servers on `localhost:8042` and `localhost:5173`.*

---

## Docker Deployment

For a clean, containerized infrastructure (Frontend via Nginx, Backend via Uvicorn):
\`\`\`bash
docker-compose up --build
\`\`\`
*(Note: requires Docker Desktop configured to allow containers to access your host's Ollama instance `host.docker.internal`)*

---

## Testing

The backend comes with a suite of unit and security tests using `pytest`.
\`\`\`bash
cd backend
pip install -r requirements_test.txt
pytest
\`\`\`
Tests verify the integrity of the HL7 payload serving, and the rejection of malformed or missing requests to the LLM streaming endpoints.

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.
You may share and adapt the material for non-commercial purposes, provided you give appropriate credit.
