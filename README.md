# Aegis Medical AI Simulator — Dual-AI Cyber Attack & Defense

<div align="center">
  <h3>A Proof-of-Concept surgical robot interface hijacked by Data Poisoning & Ransomware, defended by a Cyber-Security AI</h3>
  <p>
    <a href="README_FR.md">🇫🇷 Lire en Français</a> &nbsp;|&nbsp;
    <a href="README_BR.md">🇧🇷 Ler em Português</a>
  </p>
</div>

---

## Overview

<div align="center">
  <img src="figures/main_dashboard_v3_latest.webp" alt="Aegis v4.0 Main Dashboard" width="800" style="border-radius: 8px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"/>
</div>

**Aegis** is an advanced **Robotic Surgery Interface Simulation** for cybersecurity awareness and research. It demonstrates the critical vulnerabilities of integrating Large Language Models (LLMs) into clinical environments (modelled on a Da Vinci surgical robot), and how a **multi-agent AI architecture** can be used as a real-time defense mechanism.

The dashboard puts you in the role of a Chief Surgeon assisted by a Medical AI — while an attacker silently manipulates the data pipeline.

---

## The 4 Attack Scenarios

| # | Scenario | Technique | MITRE ATT&CK |
|---|----------|-----------|--------------|
| 0 | **Baseline** | Normal operation, HL7 record intact | — |
| 1 | **Slow Poison** | Attacker subtly modifies the HL7 record via PACS. The Medical AI recommends a lethal clamp tension of **850g** (indirect prompt injection) | T1565.001 |
| 2 | **Ransomware** | Direct hijack forces `freeze_instruments()` call — instruments lock until ransom is paid | T1486 |
| 3 | **Aegis Defense** | A second isolated AI monitors the first in real-time and triggers a multi-round debate to expose the compromise | T1059.009 |

---

## Key Features — v4.0

### 🎬 EN SCÈNE — Live AI Monitor
A real-time "behind the scenes" panel showing exactly what each AI receives and sends:
- **Assembled prompt** with injection payload highlighted in red
- **Split Da Vinci / Aegis terminals** with live token streaming
- **Status badges**: IDLE → ANALYSING → COMPROMISED / DONE → ISOLATED
- **Tool-call explosion** banner when `freeze_instruments()` fires

### 🦾 3D Robot Arms View
Real-time Three.js visualization of the 4 robotic arms (PSM1, PSM2, ECM, AUX):
- **Poison scenario**: PSM1 tension drifts progressively toward 850g, arm status turns WARNING
- **Ransomware**: Increasingly erratic joint oscillation (±6°), force spikes, all arms WARNING → FROZEN
- Per-scenario instability progress bar

### 📹 Dynamic Camera Effects
The surgical endoscope feed reacts to the attack state:
- **Poison**: Progressive desaturation + green hue drift + growing vignette
- **Ransomware**: Harsh contrast, camera shake, flicker, chromatic aberration overlay
- **Frozen**: Full grayscale + SIGNAL LOST

### 🤖 Context-Aware Dual AI
Both AIs share session context to avoid repetition and escalate intelligently:
- **Timeline injection**: The last 8 system events are sent to each AI as context
- **Da Vinci** always receives the full chat history + Aegis responses (truncated)
- **Multi-round debate**: Up to 5 rounds of Aegis ↔ Da Vinci argumentation
- Prompts explicitly instruct each AI not to repeat previous arguments

### 🎙️ Voice Input & TTS
- **Speech recognition** (Chrome/Edge) for both the Medical AI and Aegis
- **Text-to-Speech**: AI responses are read aloud with distinct voices per agent

### ⏱️ Action Timeline
Real-time event log with `T+Xs` timestamps capturing:
- System events, user inputs, AI responses, tool calls, attacks, Aegis interventions

### 🗺️ Threat Map
Live visualization of the internal hospital network (PACS → LLM → Robot) with animated attack vectors.

### 🚨 Kill Switch
One-click mechanical isolation: disconnects the robot from the LLM and forces manual mode.

### 🌍 i18n — 3 Languages
Full interface, prompts and documentation in **French**, **English**, and **Brazilian Portuguese**.

### 🔴 Red Team Lab (Aegis Lab)
Hidden advanced panel (`Ctrl+Shift+R` or header button):
- **Playground**: Test manual injections, edit system prompts for each agent
- **Multi-Agent Config**: Independent difficulty levels (EASY / NORMAL / HARD) per agent
- **Campaigns**: Automated SSE audit runs measuring attack success rates
- **Scenarios**: Multi-step attack chains (Ligature Compromise, Cascade Attack…)
- **Kill Chain Stepper**: 4-phase visual walkthrough (Recon → Injection → Execution → Audit)
- **Automated Scoring**: AEGIS scores each round on prompt leaks, rule bypasses, injection compliance

---

## Architecture

```
┌──────────────────────────────────────┐
│  React Frontend (Vite + Tailwind)    │
│  ┌─────────────┐  ┌───────────────┐  │
│  │ Da Vinci AI │  │  Aegis AI     │  │
│  │  Chat Panel │  │  Cyber Panel  │  │
│  └──────┬──────┘  └──────┬────────┘  │
│         │ SSE stream      │ SSE stream│
└─────────┼─────────────────┼──────────┘
          │                 │
┌─────────▼─────────────────▼──────────┐
│  FastAPI Backend (Python)            │
│  /api/query/stream  (Da Vinci)       │
│  /api/cyber_query/stream (Aegis)     │
└─────────────────────┬────────────────┘
                      │
              ┌───────▼────────┐
              │  Ollama (local) │
              │  llama3.2      │
              └────────────────┘
```

**Attack vector**: Malicious payload embedded in HL7 OBX field of the PACS record → injected verbatim into the LLM context → model complies with attacker instructions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, Three.js (`@react-three/fiber`) |
| Backend | Python 3.11+, FastAPI, Pydantic, SSE streaming |
| LLM Engine | [Ollama](https://ollama.com/) (local) |
| Models | `llama3.2` (both Medical and Aegis agents, via different system prompts) |
| i18n | `react-i18next` — FR / EN / BR |
| Packaging | Docker & Docker Compose |

---

## "Offline" Demo Mode

No backend needed! If the React app cannot connect to the FastAPI server, it switches automatically to **Mock Demo Mode** using pre-crafted responses that fully demonstrate all attack scenarios.

**Try it now**: run `npm run dev` in `/frontend`, or open the GitHub Pages deployment.

---

## Installation & Quick Start

### Prerequisites
1. Install [Ollama](https://ollama.com/) and ensure it is running.
2. Pull the model: `ollama pull llama3.2`

### Windows (one-click)
```cmd
start_all.bat
```

### Mac / Linux
```bash
chmod +x start_all.sh
./start_all.sh
```
*Installs Python deps, Node packages, and starts both servers on `localhost:8042` (backend) and `localhost:5173` (frontend).*

---

## Docker Deployment

```bash
docker-compose up --build
```
*(Requires Docker Desktop configured to allow containers to reach the host Ollama instance via `host.docker.internal`)*

---

## Testing

```bash
cd backend
pip install -r requirements_test.txt
pytest
```
Tests cover: HL7 payload integrity, LLM endpoint error handling, malformed request rejection.

---

## License

**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**
Free to share and adapt for non-commercial purposes with attribution.
