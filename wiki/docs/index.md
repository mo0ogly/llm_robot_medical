<div class="hero-banner" markdown>

# AEGIS

**Medical AI Security Lab**

*Plateforme de recherche Red Team pour la securite des LLM medicaux*
**These doctorale ENS (2026)** — Securite des systemes chirurgicaux autonomes

[:material-rocket-launch: Demarrer](installation.md){ .md-button .md-button--primary }
[:material-book-open-variant: Architecture](architecture/index.md){ .md-button }
[:material-api: API Reference](api/index.md){ .md-button }

</div>

## :material-target: Le projet en bref

**AEGIS** (*Adversarial Evaluation & Guardrail Integrity System*) est une plateforme de recherche doctorale qui etudie les vulnerabilites des Large Language Models integres dans des systemes chirurgicaux robotiques.

Le projet modelise un robot **Da Vinci Xi** assiste par une IA medicale (LLaMA 3.2 via Ollama), et demontre comment un attaquant peut manipuler les recommandations cliniques par injection de prompt — avec des consequences potentiellement **letales** (tension de pince a 850g, gel des instruments en pleine operation).

![Dashboard chirurgical AEGIS](assets/images/main_dashboard_v3_latest.webp)

![Red Team Lab](assets/images/redteam_lab_v3_latest.png)

---

## :material-chart-line: Chiffres cles

<div class="stat-grid" markdown>

<div class="stat-card" markdown>
<span class="stat-value">69</span>
<span class="stat-label">API Endpoints</span>
</div>

<div class="stat-card" markdown>
<span class="stat-value">102</span>
<span class="stat-label">Templates d'attaque</span>
</div>

<div class="stat-card" markdown>
<span class="stat-value">36</span>
<span class="stat-label">Chaines LangChain</span>
</div>

<div class="stat-card" markdown>
<span class="stat-value">48</span>
<span class="stat-label">Scenarios</span>
</div>

<div class="stat-card" markdown>
<span class="stat-value">95</span>
<span class="stat-label">Techniques offensives</span>
</div>

<div class="stat-card" markdown>
<span class="stat-value">70</span>
<span class="stat-label">Techniques defensives</span>
</div>

<div class="stat-card" markdown>
<span class="stat-value">80</span>
<span class="stat-label">Papiers indexes</span>
</div>

<div class="stat-card" markdown>
<span class="stat-value">66</span>
<span class="stat-label">Formules (F01-F72)</span>
</div>

<div class="stat-card" markdown>
<span class="stat-value">7/7</span>
<span class="stat-label">Conjectures validees</span>
</div>

<div class="stat-card" markdown>
<span class="stat-value">3</span>
<span class="stat-label">Langues (FR/EN/BR)</span>
</div>

</div>

---

## :material-compass: Explorer la documentation

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg } **Installation**

    Prerequis, setup, demarrage via `aegis.ps1` ou Docker Compose.

    [:octicons-arrow-right-24: Guide d'installation](installation.md)

-   :material-brain:{ .lg } **Architecture IA**

    Les 3 agents (Da Vinci, AEGIS, RedTeam), orchestration AG2 et moteur genetique.

    [:octicons-arrow-right-24: Backend Agents](backend/index.md)

-   :material-react:{ .lg } **Frontend**

    93 composants React, flux de donnees SSE, Red Team Lab (Ctrl+Shift+R).

    [:octicons-arrow-right-24: Frontend Architecture](frontend/index.md)

-   :material-api:{ .lg } **API Reference**

    69 endpoints documentes (9 streaming SSE) avec exemples curl.

    [:octicons-arrow-right-24: API Reference](api/index.md)

-   :material-file-document-multiple:{ .lg } **Prompts (99)**

    Catalogue complet des templates d'attaque avec audit SVC et mapping MITRE.

    [:octicons-arrow-right-24: Catalogue Prompts](prompts/index.md)

-   :material-skull-crossbones:{ .lg } **Scenarios**

    Les 4 scenarios principaux + 48 scenarios couvrant les 36 chaines.

    [:octicons-arrow-right-24: Scenarios d'attaque](redteam-lab/scenarios.md)

-   :material-graph:{ .lg } **Taxonomie**

    CrowdStrike 2025 (95 techniques) + couches defensives delta-0 a delta-3 (70 techniques).

    [:octicons-arrow-right-24: Taxonomie](taxonomy/index.md)

-   :material-calculator:{ .lg } **Metriques formelles**

    ASR, Sep(M) de Zverev et al., SVC 6D, LLM-Judge 4D, semantic drift.

    [:octicons-arrow-right-24: Metriques](metrics/index.md)

-   :material-school:{ .lg } **Recherche doctorale**

    Archive, decouvertes D-001 a D-020, 7 conjectures, bibliographie 80 papiers.

    [:octicons-arrow-right-24: Archive de recherche](research/index.md)

</div>

---

## :material-shield-lock: Les 4 scenarios d'attaque

| # | Scenario | Technique | Impact | MITRE |
|---|----------|-----------|--------|-------|
| **0** | **Baseline** | Fonctionnement normal, dossier HL7 intact | :material-check-circle:{ style="color: #43a047" } Aucun | -- |
| **1** | **Poison Lent** | Injection indirecte via PACS : l'IA recommande 850g de tension (letale) | :material-alert:{ style="color: #d32f2f" } Critique | T1565.001 |
| **2** | **Ransomware** | Prise de controle directe : `freeze_instruments()` — bras bloques | :material-alert:{ style="color: #d32f2f" } Critique | T1486 |
| **3** | **Defense Aegis** | Second agent isole declenche un debat multi-rounds pour exposer la compromission | :material-shield-check:{ style="color: #00bcd4" } Protection | T1059.009 |

[:octicons-arrow-right-24: Details des scenarios](redteam-lab/scenarios.md)

---

## :material-layers: Framework formel delta-0 a delta-3

!!! danger "Decouverte D-001 — Triple Convergence"

    Quand **delta-0, delta-1 et delta-2** sont simultanement compromises, seule **delta-3** (validation formelle + RagSanitizer 15 detecteurs) survit. C'est la **contribution principale** de la these.

| Couche | Role | Techniques | Statut |
|--------|------|-----------|--------|
| **delta-0** :material-circle-slice-1: | Alignement RLHF/DPO | 4 | :material-close-circle:{ style="color: #d32f2f" } Effacable (GRP-Obliteration, P039) |
| **delta-1** :material-circle-slice-2: | Hierarchie d'instructions | 7 | :material-close-circle:{ style="color: #d32f2f" } Empoisonnable (P045) |
| **delta-2** :material-circle-slice-3: | Detection et filtrage | 27 | :material-close-circle:{ style="color: #d32f2f" } Contournable a 99% (P044, P049) |
| **delta-3** :material-circle-slice-8: | Validation formelle des sorties | 5 | :material-check-circle:{ style="color: #43a047" } **Seul survivant** |

---

## :material-sitemap: Architecture technique

```
+--------------------------------------------------+
|                RESEAU HOSPITALIER                |
|                                                  |
|  [Serveur PACS] --HL7--> [Da Vinci LLM] --> [Robot]
|                              |                   |
|                     +--------v--------+          |
|                     |  Aegis Cyber AI |          |
|                     |  (Supervision)  |          |
|                     +-----------------+          |
+--------------------------------------------------+
```

| Composant | Stack | Port |
|-----------|-------|------|
| **Frontend** | React 19, Vite, Tailwind v4, Three.js | `:5173` |
| **Backend** | FastAPI, AG2 (AutoGen), LangChain | `:8042` |
| **LLM** | Ollama + LLaMA 3.2 (local) | `:11434` |
| **RAG** | ChromaDB (4200 corpus + 4700 biblio) | `:8000` |
| **Wiki** | MkDocs Material (ce site) | `:8001` |

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; border-top: 1px solid rgba(255,255,255,0.1);" markdown>

*Projet de these doctorale — **Ecole Normale Superieure (2026)***

*Securite des LLM dans les systemes chirurgicaux robotiques*

[:fontawesome-brands-github: Github](https://github.com/pizzif/poc_medical){ .md-button }

</div>
