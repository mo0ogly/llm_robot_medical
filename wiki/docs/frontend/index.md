# Frontend — React 19 + Vite + Tailwind v4

## Vue d'ensemble

| Metrique | Valeur |
|----------|--------|
| Fichiers source | 93 (.jsx/.js) |
| Composants root | 24 (dashboard chirurgical) |
| Composants Red Team | 51 (lab adversarial) |
| Hooks custom | 5 |
| Langues i18n | 3 (FR, EN, BR) |
| Taille i18n | 277 KB |

## Stack technique

| Librairie | Version | Usage |
|-----------|---------|-------|
| React | 19.2 | Framework UI |
| React Router | 7.13 | Routing SPA |
| Three.js | 0.183 | Rendu 3D (bras robotiques) |
| React Three Fiber | 9.5 | Binding React pour Three.js |
| i18next | 25.8 | Internationalisation |
| Tailwind CSS | 4 | Styles utilitaires |
| Lucide React | -- | Icones |
| Vitest | -- | Tests unitaires |

## Routing

| Route | Composant | Lazy |
|-------|-----------|------|
| `/` | App (dashboard chirurgical) | Non |
| `/redteam` | RedTeamLayout | Non |
| `/redteam/rag` | RagView | Oui |
| `/redteam/exercise` | ExerciseView | Oui |
| `/redteam/defense` | DefenseView | Oui |
| `/redteam/analysis` | AnalysisView | Oui |
| `/redteam/prompt-forge` | PromptForge | Oui |
| `/redteam/campaign` | CampaignView | Oui |
| `/redteam/results` | ResultExplorer | Oui |
| `/redteam/logs` | LogsView | Non |
| `/redteam/catalog` | CatalogView | Non |
| `/redteam/studio` | StudioView | Non |
| `/redteam/playground` | PlaygroundView | Non |
| `/redteam/timeline` | TimelineView | Non |
| `/redteam/scenarios` | ScenariosView | Non |
| `/redteam/history` | HistoryView | Non |

---

## Dashboard chirurgical (24 composants)

### Moniteur patient

| Composant | Taille | Description |
|-----------|--------|-------------|
| VitalsMonitor.jsx | 18 KB | Monitoring des constantes vitales |
| EcgCanvas.jsx | 8 KB | Canvas de tracage ECG en temps reel |
| PatientRecord.jsx | 23 KB | Affichage des donnees patient (HL7) |
| CameraHUD.jsx | 5 KB | Overlay HUD sur le flux camera endoscopique |

### Interface operatoire

| Composant | Taille | Description |
|-----------|--------|-------------|
| RobotArmsView.jsx | 10 KB | Visualisation 3D des 4 bras (Three.js, lazy-loaded) |
| KillSwitch.jsx | 2 KB | Bouton d'isolation mecanique |
| ActionTimeline.jsx | 5 KB | Journal temps reel des evenements |
| ProtocolView.jsx | 3 KB | Visualisation du protocole chirurgical |

### Communication IA

| Composant | Taille | Description |
|-----------|--------|-------------|
| AIAssistantChat.jsx | 31 KB | Interface chat avec l'IA chirurgicale |
| EscalationPanel.jsx | 5 KB | Panneau d'escalade des alertes |
| SecOpsTerminal.jsx | 3 KB | Terminal d'operations de securite |
| TelemetryConsole.jsx | 16 KB | Console de telemetrie des agents |

### Visualisation des menaces

| Composant | Taille | Description |
|-----------|--------|-------------|
| ThreatMap.jsx | 9 KB | Carte du reseau hospitalier avec vecteurs d'attaque |
| RansomwareScreen.jsx | 7 KB | Ecran de simulation ransomware |
| ExplanationModal.jsx | 56 KB | Modal explicative detaillee |

---

## Red Team Lab (51 composants)

### Vues principales (12 fichiers dans `views/`)

| Vue | Taille | Description |
|-----|--------|-------------|
| AnalysisView | 26 KB | Analyse detaillee des resultats d'attaque |
| CatalogView | 13 KB | Navigateur du catalogue d'attaques |
| DefenseView | 14 KB | Vue des mecanismes de defense |
| ExerciseView | 13 KB | Exercices d'entrainement |
| LogsView | 13 KB | Affichage des logs |
| PlaygroundView | 1 KB | Wrapper playground |
| RagView | 22 KB | Interface RAG (upload, query, seed) |
| ResultExplorer | 18 KB | Exploration des resultats experimentaux |

### Panneaux (5 fichiers dans `panels/`)

| Panneau | Taille | Description |
|---------|--------|-------------|
| ForgePanel | 42 KB | Forge de prompts adversariaux |
| InjectionLabPanel | 14 KB | Laboratoire d'injection |
| MetricsPanel | 17 KB | Metriques et analytics |
| SessionPanel | 9 KB | Gestion de session |
| SystemPromptPanel | 5 KB | Editeur de system prompts |

### Composants centraux (21 fichiers)

| Composant | Taille | Description |
|-----------|--------|-------------|
| AdversarialStudio | 38 KB | Studio adversarial principal |
| CampaignTab | 36 KB | Gestion et execution de campagnes |
| ScenarioTab | 67 KB | Templates d'attaque et scenarios |
| ScenarioHelpModal | 200 KB | Modals d'aide (98 templates documentes) |
| CatalogTab | 20 KB | Navigateur de catalogue |
| PlaygroundTab | 17 KB | Playground de test rapide |
| PromptForgeMultiLLM | 20 KB | Forge multi-LLM |
| GeneticProgressView | 14 KB | Suivi de l'optimiseur genetique |
| HistoryTab | 12 KB | Historique des sessions |
| DigitalTwin | 5 KB | Simulation physique du jumeau numerique |
| TestSuitePanel | 12 KB | Execution de suites de tests |

### Composants partages (9 fichiers dans `shared/`)

| Composant | Description |
|-----------|-------------|
| DefenseTaxonomyCard | Carte taxonomie defensive |
| GuardrailBenchmarkTable | Tableau benchmark guardrails |
| LiuBenchmarkCard | Metriques Liu et al. |
| TaxonomyCoverageCard | Couverture taxonomique |
| PayloadEditModal | Editeur de payload |
| CatalogCrudTab | Operations CRUD catalogue |
| ViewHelpModal | Modal d'aide generique |

---

## Hooks custom (5)

| Hook | Description |
|------|-------------|
| `useRobotSimulation` | Simulation de comportement robotique (10 Hz) |
| `useSessionRecorder` | Enregistrement de session dans localStorage |
| `useSessionPlayer` | Lecture/replay de session |
| `useAudioEffects` | Effets sonores et alarmes |
| `useTTS` | Text-to-Speech (voix distinctes par agent) |

## Gestion d'etat

- **Pas de Redux/Context global** : etat local via `useState` hooks
- **Event bus** : `robotEventBus.js` pour communication inter-composants
- **Session storage** : `localStorage` via hooks custom
- **Router state** : React Router v7

## Code splitting

7 vues heavy sont lazy-loaded (`React.lazy`), 7 vues legeres sont importees statiquement. Le ScenarioHelpModal (200 KB) est le plus gros composant du projet.
