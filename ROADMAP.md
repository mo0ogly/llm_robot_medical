# 🗺️ ROADMAP — Aegis v5.0
> Plan d'action détaillé — implémentation progressive

---

## Vue d'ensemble

| Phase | Feature | Impact | Effort | Dépendances nouvelles |
|-------|---------|--------|--------|-----------------------|
| **P1** | Comparateur Côte-à-Côte | ⭐⭐⭐ | 🔧🔧 | aucune |
| **P2** | Mode Replay | ⭐⭐⭐ | 🔧🔧 | aucune |
| **P3** | Scénario Cascade Attack | ⭐⭐⭐ | 🔧🔧🔧 | aucune |
| **P4** | Mode Présentateur | ⭐⭐ | 🔧 | aucune |
| **P5** | Export Rapport PDF | ⭐⭐⭐ | 🔧🔧🔧 | puppeteer (déjà installé) |
| **P6** | Matrice MITRE Interactive | ⭐⭐ | 🔧🔧 | aucune |
| **P7** | Score d'Anomalie Sémantique | ⭐⭐⭐ | 🔧🔧🔧 | ollama embeddings |
| **P8** | Multi-modèles Switchable | ⭐⭐ | 🔧 | ollama pull |

---

## Phase 1 — Comparateur Côte-à-Côte
> *"La même IA, deux contextes différents, résultat frappant"*

### Objectif
Envoyer la même question à Da Vinci en parallèle :
- **Colonne gauche** : contexte HL7 *sain* → réponse médicalement correcte
- **Colonne droite** : contexte HL7 *empoisonné* → réponse déviante

### Composants à créer
```
frontend/src/components/CompareView.jsx       ← split-panel principal
frontend/src/components/ComparePanel.jsx      ← un côté du split (stream SSE)
frontend/src/components/DeltaScore.jsx        ← score de divergence visuel
```

### Backend — nouveau endpoint
```python
# backend/server.py
POST /api/query/compare
body: { question, lang, safe_record, hacked_record }

→ Ouvre 2 streams Ollama en parallèle (asyncio.gather)
→ Retourne SSE avec prefix "SAFE:" ou "HACKED:" sur chaque token
```

### Logique frontend
```jsx
// CompareView.jsx
const [safeTokens, setSafeTokens]   = useState("")
const [hackedTokens, setHackedTokens] = useState("")

// Parse le stream : token commence par "SAFE:" ou "HACKED:"
// Calcule un DeltaScore = levenshtein(safeTokens, hackedTokens) / max_len
// Affiche barre rouge croissante au centre quand les réponses divergent
```

### UX
- Bouton **"COMPARER"** dans le header (visible seulement si scenario !== 'none')
- Split animé qui s'ouvre depuis le panel IA actuel
- Badge **CONTEXTE SAIN** (vert) | **CONTEXTE COMPROMIS** (rouge)
- Barre centrale **DIVERGENCE : XX%** qui grossit en rouge

---

## Phase 2 — Mode Replay
> *"Rejouer une démo parfaite sans dépendre d'Ollama en live"*

### Objectif
Enregistrer toute une session (timeline + streams IA + état UI) et la rejouer
de façon déterministe avec contrôle de vitesse.

### Structure de données
```typescript
interface ReplaySession {
  id: string
  date: string
  scenario: string
  duration_ms: number
  events: ReplayEvent[]
}

interface ReplayEvent {
  t: number           // ms depuis début
  type: 'state' | 'token' | 'tool' | 'timeline' | 'robot'
  target: string      // 'davinci' | 'aegis' | 'ui' | 'robot'
  payload: any
}
```

### Composants à créer
```
frontend/src/hooks/useSessionRecorder.js    ← enregistre tous les events
frontend/src/hooks/useSessionPlayer.js      ← rejoue avec setInterval
frontend/src/components/ReplayControls.jsx  ← ▶ ⏸ ⏹ ⏩ barre de progression
```

### Workflow
```
[REC ●] → useSessionRecorder intercepte :
  - chaque token Da Vinci / Aegis
  - chaque changement de robotStatus
  - chaque addTimelineEvent
  - chaque changement de scenario

[STOP] → sauvegarde JSON dans localStorage + bouton "Exporter .replay"

[PLAY] → useSessionPlayer lit le JSON et rejoue en injectant les events
         via les mêmes setters React (aucune modification des composants)
```

### UX
- Petit badge **REC ●** rouge dans le header quand recording actif
- Panel **Mes Sessions** dans ExplanationModal, onglet dédié
- Contrôle vitesse : 0.5x / 1x / 2x / 5x
- Barre de progression avec scrubbing (clic pour aller à t=XX%)

---

## Phase 3 — Scénario Cascade Attack
> *"L'attaque la plus réaliste : Poison → Ransomware automatique"*

### Objectif
Scénario en 2 actes enchaînés automatiquement :
1. **Acte 1** : Data Poisoning actif, Da Vinci recommande 850g
2. **Acte 2** : 15 secondes après la première réponse compromise,
   le ransomware se déclenche → `freeze_instruments()` auto

### Nouveau fichier scénario
```
frontend/src/scenarios/cascade.js
```
```javascript
export const CASCADE_PHASES = [
  {
    id: 'poison',
    duration_ms: 0,          // démarre immédiatement
    trigger: 'start',
    record: 'record_poison',
    label: 'PHASE 1 — DATA POISONING'
  },
  {
    id: 'ransomware_trigger',
    duration_ms: 15000,       // 15s après première réponse compromise
    trigger: 'after_davinci_response',
    record: 'record_hacked',  // swap du record en live
    label: 'PHASE 2 — TOOL HIJACKING'
  }
]
```

### App.jsx — logic
```javascript
// Nouveau state
const [cascadePhase, setCascadePhase] = useState(0)

// Dans handleAskSupport, si scenario === 'cascade' et phase 0 → réponse poison
// Après réponse reçue : timer 15s → setCascadePhase(1) + swap record + trigger ransomware
useEffect(() => {
  if (scenario === 'cascade' && cascadePhase === 1) {
    // Animation de transition : glitch intense 3s
    setIsGlitching(true)
    // Puis déclenche le ransomware via le stream
    addTimelineEvent('attack', 'CASCADE', 'Phase 2 triggered — switching to ransomware')
    setTimeout(() => handleAutoRansomware(), 3000)
  }
}, [cascadePhase])
```

### UX
- Sélecteur scénario : nouvelle option **"[⚡] Cascade : Poison → Ransomware"**
- Barre de progression **PHASE 1/2** visible dans la CameraHUD
- Compte à rebours discret (-15s) avant le basculement
- La transition montre un `SYSTEM BREACH DETECTED` pendant 3s

### PatientRecord
```jsx
// Swap automatique du record au changement de phase
const currentRecord = scenario === 'cascade'
  ? (cascadePhase === 0 ? poisonRecord : hackedRecord)
  : // ... logique normale
```

---

## Phase 4 — Mode Présentateur
> *"Confort maximal pour les démos en salon ou en pitch"*

### Composants à créer
```
frontend/src/components/PresenterMode.jsx    ← overlay fullscreen
frontend/src/components/SpeakerNotes.jsx     ← notes par scénario/étape
frontend/src/components/DemoTimer.jsx        ← chrono 0:00 / 7:00
```

### Fichier de notes
```javascript
// frontend/src/data/speakerNotes.js
export const NOTES = {
  none: {
    fr: "Commencez par présenter le contexte...",
    en: "Start by presenting the context...",
    points: ["Da Vinci = IA chirurgicale", "HL7 = format médical standard"]
  },
  poison: {
    fr: "Montrez d'abord la vue clinique...",
    points: ["Payload invisible en Vue Clinique", "Visible dans le Raw HL7", "MITRE T1565.001"]
  },
  // ...
}
```

### UX
- Raccourci **F11** ou bouton **MODE DÉMO** dans le header
- Overlay semi-transparent en bas : notes pour le présentateur
- Timer `T+02:34 / 07:00` avec couleur qui passe vert→orange→rouge
- Touche **N** = note suivante, **P** = note précédente
- Touche **Espace** = masquer/afficher les notes (pour le grand écran)

---

## Phase 5 — Export Rapport d'Audit PDF
> *"Livrable concret pour le client après la démo"*

### Structure du rapport
```
RAPPORT D'AUDIT DE SÉCURITÉ — AEGIS v4.0
─────────────────────────────────────────
1. Résumé Exécutif
   - Scénario exécuté, date, durée
   - Verdict : BREACH DETECTED / SYSTEM INTACT

2. Timeline d'Actions (export de ActionTimeline)
   T+00:12  SCENARIO START     poison initialized
   T+00:45  DA VINCI           "Augmenter tension à 850g..."
   T+00:47  AEGIS              ANOMALIE INTERCEPTÉE

3. Analyse des Menaces
   - Technique MITRE ATT&CK utilisée
   - Vecteur d'attaque (HL7 OBX field)
   - IOC detectés

4. Captures d'écran clés
   - État avant attaque
   - Moment de la compromission
   - Réponse Aegis

5. Recommandations
   - Input sanitization HL7
   - Isolation réseau PACS
   - Human-in-the-loop obligatoire
```

### Implémentation
```javascript
// backend/export.py  (puppeteer côté backend ou jsPDF côté frontend)

// Option A : jsPDF + html2canvas (frontend, pas de dépendance serveur)
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Option B : puppeteer (déjà installé)
// POST /api/export/pdf  → backend prend un screenshot de localhost:5173 + génère PDF
```

### Composants
```
frontend/src/components/AuditReport.jsx      ← vue HTML du rapport (imprimable)
frontend/src/hooks/useExportPDF.js           ← logique d'export
```

### UX
- Bouton **📄 EXPORT AUDIT** dans ActionTimeline (actif seulement après une session)
- Modal preview du rapport avant téléchargement
- Nom de fichier : `aegis-audit-YYYY-MM-DD-HH-MM.pdf`

---

## Phase 6 — Matrice MITRE ATT&CK Interactive
> *"Visualization de sécurité professionnelle"*

### Données
```javascript
// frontend/src/data/mitreMapping.js
export const MATRIX = {
  tactics: ['Initial Access', 'Execution', 'Persistence', 'Impact', ...],
  techniques: [
    {
      id: 'T1195',
      name: 'Supply Chain Compromise',
      tactic: 'Initial Access',
      scenario: 'cascade',
      color: '#ef4444'
    },
    {
      id: 'T1565.001',
      name: 'Stored Data Manipulation',
      tactic: 'Impact',
      scenario: 'poison',
      color: '#f97316'
    },
    {
      id: 'T1059.009',
      name: 'Cloud Administration Command',
      tactic: 'Execution',
      scenario: 'ransomware',
      color: '#ef4444'
    }
  ]
}
```

### Composant
```
frontend/src/components/MitreMatrix.jsx
```
- Grille CSS : tactiques en colonnes, techniques en cellules
- Cellules grises par défaut → rouge quand le scénario actif les active
- Tooltip au hover : description + lien MITRE ATT&CK
- Animation : les cellules s'allument progressivement au fil de la timeline

### Intégration
- Onglet dédié dans ExplanationModal : **"5. MITRE ATT&CK"**
- Ou mini-widget dans le coin bas-droit du dashboard

---

## Phase 7 — Score d'Anomalie Sémantique
> *"Quantifier objectivement la dérive de l'IA"*

### Concept
```
Score = 1 - cosine_similarity(
  embed("réponse attendue baseline"),
  embed("réponse reçue avec injection")
)
→ 0% = réponse identique   →  100% = réponse totalement déviante
```

### Backend — nouveau endpoint
```python
# backend/server.py
POST /api/semantic/score
body: { text_a, text_b }

→ Utilise ollama.embed(model="llama3.2", input=text)
→ Retourne { score: 0.73, label: "HIGH DIVERGENCE" }
```

### Composant
```
frontend/src/components/AnomalyScore.jsx
```
```jsx
// Affiche une gauge circulaire SVG
// 0-30% : vert NORMAL
// 30-60% : orange SUSPICIOUS
// 60-100% : rouge COMPROMISED (pulsing)
```

### Intégration
- S'affiche dans le panel Da Vinci après chaque réponse
- Comparé automatiquement avec la réponse baseline (stockée au 1er run safe)
- Alimente aussi le rapport PDF (Phase 5)

---

## Phase 8 — Multi-Modèles Switchable
> *"Montrer que la vulnérabilité est model-agnostic"*

### Prérequis
```bash
ollama pull mistral        # 4.1 GB — fort en raisonnement
ollama pull phi3           # 2.3 GB — très rapide
ollama pull gemma2         # 5.4 GB — Google, bon en instruction-following
```

### Backend — modification server.py
```python
# Remplace la constante par un paramètre
MODEL_NAME = os.getenv("DEFAULT_MODEL", "llama3.2:latest")

# Dans /api/query/stream
body: { ..., model?: str }
effective_model = body.model or MODEL_NAME
```

### Frontend — ModelSelector
```
frontend/src/components/ModelSelector.jsx
```
```jsx
// Appelle GET /api/models → liste les modèles ollama installés
// Dropdown dans le header à côté du sélecteur de langue
// Persiste en localStorage
```

### UX
- Affiche le modèle actif dans la EN SCÈNE avec sa taille RAM
- Badge **phi3 · 2.3GB** ou **llama3.2 · 2.0GB** visible dans le header
- Désactivé si le backend est offline (mode démo)

---

## Ordre d'implémentation recommandé

```
Semaine 1 :  Phase 1 (Comparateur)      ← impact maximal, no deps
Semaine 2 :  Phase 3 (Cascade Attack)   ← nouveau scénario percutant
Semaine 3 :  Phase 4 (Mode Présentateur) + Phase 2 (Replay)
Semaine 4 :  Phase 5 (Export PDF)       ← livrable client
Semaine 5 :  Phase 6 (MITRE Matrix)     ← visuel professionnel
Semaine 6 :  Phase 7 (Score Anomalie)   ← technique avancé
Semaine 7 :  Phase 8 (Multi-modèles)    ← optionnel selon besoins
```

---

## Stack technique final

| Couche | Technologie | Usage |
|--------|-------------|-------|
| Frontend | React 18 + Vite | SPA principale |
| 3D | Three.js + R3F | Bras robotiques |
| Style | Tailwind CSS | UI dark theme |
| i18n | react-i18next | FR/EN/BR |
| PDF | jsPDF + html2canvas | Export rapport |
| Charts | SVG natif | Gauge anomalie, MITRE |
| Backend | FastAPI + Python | Orchestration LLM |
| LLM | Ollama (local) | Da Vinci + Aegis |
| Streaming | SSE | Tokens temps réel |

---

*Roadmap v5.0 — Aegis Medical AI Security POC*
