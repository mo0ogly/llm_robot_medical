# AEGIS - Medical AI Security Lab

<div align="center" markdown>
**Plateforme de recherche Red Team pour la securite des LLM medicaux**

*These doctorale ENS (2026) -- Securite des systemes chirurgicaux autonomes*
</div>

---

## Presentation

**AEGIS** (Adversarial Evaluation & Guardrail Integrity System) est une plateforme de recherche doctorale qui etudie les vulnerabilites des Large Language Models integres dans des systemes chirurgicaux robotiques.

Le projet modelise un robot Da Vinci Xi assiste par une IA medicale (LLaMA 3.2 via Ollama), et demontre comment un attaquant peut manipuler les recommandations cliniques par injection de prompt — avec des consequences potentiellement letales (tension de pince a 850g, gel des instruments).

![Dashboard chirurgical AEGIS](assets/images/main_dashboard_v3_latest.webp)

![Red Team Lab](assets/images/redteam_lab_v3_latest.png)

---

## Chiffres cles

| Metrique | Valeur |
|----------|--------|
| Endpoints API | 69 (dont 9 en streaming SSE) |
| Templates d'attaque | 102 (97 numerotes + 5 config) |
| Chaines d'attaque | 36 modules LangChain |
| Scenarios | 48 (couvrant les 36 chaines) |
| Techniques offensives (CrowdStrike) | 95 |
| Techniques defensives (delta layers) | 70 (44 implementees) |
| Papiers de recherche indexes | 80 (P001-P080) |
| Formules mathematiques | 66 (F01-F72) |
| Decouvertes | 20 (D-001 a D-020) |
| Conjectures | 7 (C1-C7, toutes >= 8/10 confiance) |
| Composants frontend | 93 fichiers JSX |
| Langues supportees | 3 (FR, EN, BR) |

---

## Architecture

```
                   RESEAU HOSPITALIER
  +--------------------------------------------------+
  |                                                  |
  |  [Serveur PACS] --HL7--> [Da Vinci LLM] --tools--> [Robot]
  |                              |                   |
  |                     +--------+--------+          |
  |                     |  Aegis Cyber AI |          |
  |                     |  (Supervision)  |          |
  |                     +-----------------+          |
  +--------------------------------------------------+
```

| Composant | Stack | Port |
|-----------|-------|------|
| **Frontend** | React 19, Vite, Tailwind v4, Three.js | :5173 |
| **Backend** | FastAPI, AG2 (AutoGen), LangChain | :8042 |
| **LLM** | Ollama + LLaMA 3.2 (local) | :11434 |
| **RAG** | ChromaDB (4200 docs corpus + 4700 biblio) | :8000 |
| **Wiki** | MkDocs Material (ce site) | :8001 |

---

## Les 4 scenarios d'attaque

| # | Scenario | Technique | Impact | MITRE |
|---|----------|-----------|--------|-------|
| 0 | **Baseline** | Fonctionnement normal, dossier HL7 intact | Aucun | -- |
| 1 | **Poison Lent** | Injection indirecte via PACS : l'IA recommande 850g de tension (letale) | Critique | T1565.001 |
| 2 | **Ransomware** | Prise de controle directe : `freeze_instruments()` — bras bloques | Critique | T1486 |
| 3 | **Defense Aegis** | Second agent isole declenche un debat multi-rounds pour exposer la compromission | Protection | T1059.009 |

---

## Framework formel delta-0 a delta-3

Le cadre theorique s'articule autour de 4 couches de defense, avec une decouverte cle (D-001, Triple Convergence) :

| Couche | Role | Techniques | Statut |
|--------|------|-----------|--------|
| **delta-0** | Alignement RLHF/DPO | 4 | Effacable (GRP-Obliteration, P039) |
| **delta-1** | Hierarchie d'instructions | 7 | Empoisonnable (P045) |
| **delta-2** | Detection et filtrage | 27 | Contournable a 99% (P044, P049) |
| **delta-3** | Validation formelle des sorties | 5 | **Seul survivant** |

!!! warning "Decouverte D-001 — Triple Convergence"
    Quand delta-0, delta-1 et delta-2 sont simultanement compromises, seule delta-3 (validation formelle + RagSanitizer 15 detecteurs) survit. C'est la contribution principale de la these.

---

## Moteur genetique (Liu et al., 2023)

Optimiseur evolutionnaire de prompts adversariaux adapte au domaine medical :

- **Population** : 10 individus (framework + separator + disruptor)
- **Fitness** : scoring dual LLM-juge (Zhang et al. 2025) + verification formelle AEGIS
- **Mutation** : LLM rephrasing avec 3 strategies de parsing
- **Separateurs medicaux** : HL7, FDA, OBX, XML/Base64
- **Intentions** : tool_hijack, prompt_leak, tension_override
- **Arret** : fitness >= 10 ou 20 generations max

---

## Metriques d'evaluation

| Metrique | Reference | API |
|----------|-----------|-----|
| **ASR** (Attack Success Rate) | N >= 30 par condition | `POST /api/redteam/multi-trial` |
| **Sep(M)** (Separation Score) | Zverev et al., ICLR 2025 | `POST /api/redteam/separation-score` |
| **SVC** (Score de Vraisemblance Clinique) | 6 dimensions ponderees | `POST /api/redteam/svc` |
| **LLM-Judge 4D** | Zhang et al. 2025 (StrongREJECT) | `POST /api/redteam/judge` |
| **Semantic Drift** | Cosine similarity sur embeddings | `backend/agents/semantic_drift.py` |

---

## Navigation

### Prise en main
- [Installation](installation.md) -- Prerequis, setup, demarrage
- [Architecture IA](architecture/index.md) -- Agents Da Vinci, AEGIS, RedTeam
- [Architecture Backend](backend/index.md) -- Agents, moteur genetique, orchestrateur
- [Architecture Frontend](frontend/index.md) -- 93 composants React, routing, hooks

### Red Team Lab
- [API Reference (69 endpoints)](api/index.md) -- Documentation complete de l'API
- [Prompts (99 templates)](prompts/index.md) -- Catalogue d'attaques documente
- [Scenarios d'attaque](redteam-lab/scenarios.md) -- Les 4 scenarios principaux
- [Taxonomie](taxonomy/index.md) -- CrowdStrike 95 + defenses delta 70
- [Metriques formelles](metrics/index.md) -- ASR, Sep(M), SVC, LLM-Judge

### Recherche doctorale
- [Archive de recherche](research/index.md) -- Structure et guide
- [Etat courant](research/state.md) -- Avancement temps reel
- [Decouvertes](research/discoveries/index.md) -- D-001 a D-020
- [Bibliographie](research/bibliography/index.md) -- 80 papiers indexes
- [Glossaire mathematique](research/bibliography/glossaire.md) -- 66 formules

### Agents de staging
- [Vue d'ensemble](staging/index.md) -- 9 agents, 176 fichiers
- [Analyst (89)](staging/analyst.md) -- Analyses individuelles P001-P089
- [Scientist (20)](staging/scientist.md) -- Synthese, conjectures, axes de recherche
- [Mathteacher (13)](staging/mathteacher.md) -- 7 modules d'apprentissage mathematique

### Projet
- [Plans d'implementation](plans/index.md) -- 7 design docs
- [Roadmap](roadmap.md) -- Feuille de route v4.0+
- [Integration](redteam-lab/integration.md) -- Tracker d'integration genetique

---

*Projet de these doctorale -- Ecole Normale Superieure (2026)*
*Securite des LLM dans les systemes chirurgicaux robotiques*
