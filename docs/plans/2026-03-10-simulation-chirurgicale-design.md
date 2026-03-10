# Simulation Chirurgicale — Vue 3D Bras & Camera HUD : Design

**Date :** 2026-03-10
**Axe :** 1 (Simulation Chirurgicale)

## Objectif

Ajouter une vue 3D temps reel des bras robotiques Da Vinci et enrichir la camera endoscopique avec un overlay HUD dynamique. Les deux vues reagissent aux attaques Red Team en temps reel.

## Decisions de design

| Question | Decision | Justification |
|----------|----------|---------------|
| Panneau bras | Vue 3D Three.js procedurale (wireframe vert) | Coherent avec le theme hacker/terminal, leger, pas de dependance externe |
| Camera | Image statique + overlay HUD dynamique | Enrichit sans casser l'existant |
| Placement | Toggle [CAMERA] / [BRAS 3D] meme zone | Pas de compression du layout existant |
| Reactivite attaques | Autonome par defaut + pilote par Red Team | Spectaculaire pour la demo, deux modes complementaires |
| Modele 3D | Geometrie procedurale (cylindres/spheres) | Leger, animable, style technique coherent |
| Communication | EventEmitter global (decouple) | Pas de couplage direct entre ScenarioTab et simulation |
| Boutons aide | Fix overflow colonne gauche | Bug existant : boutons invisibles |

## Architecture

### 1. Vue 3D des Bras Robotiques

**Composant : `RobotArmsView.jsx`**

Rendu Three.js procedural — 4 bras en wireframe vert sur fond noir (`#0a0a0a`).

**Bras simules :**

| Bras | Role | Joints | Instrument |
|------|------|--------|------------|
| PSM1 | Outil principal (pince) | 7 DoF | Gripper (0-100%) |
| PSM2 | Outil secondaire (ciseaux) | 7 DoF | Gripper |
| ECM | Endoscope | 4 DoF (pan/tilt/zoom/focus) | Camera |
| AUX | Capteur de force | 3 DoF | Sonde pression |

**Donnees temps reel affichees :**
- Angles joints (deg) en overlay texte sur chaque segment
- Force appliquee (0-2000g) avec barre coloree (vert/jaune/orange/rouge)
- Tension clip vasculaire avec seuils visuels (vert < 400g, jaune 400-600, orange 600-800, rouge > 800)
- Etat : NOMINAL (vert) / WARNING (jaune) / FROZEN (rouge pulsant)

**Simulation autonome (mode par defaut) :**
- Micro-mouvements realistes (oscillation +/-0.5 deg par joint, 10Hz)
- Quand `robotStatus === 'FROZEN'` : bras figes, couleur rouge, vibration

**Pilote par Red Team (quand scenario en cours) :**
- `freeze_instruments` detecte → animation de verrouillage (bras passent au rouge, s'immobilisent)
- Tension 850g detectee → bras PSM1 clignote orange, valeur force en surbrillance
- Prompt leak → pas d'effet visuel (attaque non physique)

**HUD overlay :**
- Coin superieur : `PSM1: NOMINAL` / `PSM2: NOMINAL` / `ECM: ACTIVE`
- Coin inferieur : `FORCE: 245g` / `CLIP: 380g`

### 2. Camera Endoscopique Enrichie

Image statique `surgical_camera_view.png` avec overlay HUD dynamique.

**Overlay existant :** PORT 2 [LIVE], ZOOM: 2.1x, REC, T+ 46:12

**Nouveaux elements HUD :**
- Force en temps reel : barre horizontale `FORCE: ████░░ 245g`
- Tension clip : `CLIP: 380g / 400g MAX` avec couleur selon seuils biomecaniques
- Alerte contextuelle : flash rouge `⚠ TENSION OVERRIDE: 850g` lors d'attaque reussie

**Comportement selon etat :**
- ACTIVE : HUD vert, donnees stables
- FROZEN : image niveaux de gris (existant), HUD rouge, texte `SIGNAL LOST` clignotant
- Attaque tension reussie : flash overlay rouge semi-transparent + valeur dangereuse en gros

### 3. Toggle Camera / Bras 3D

Deux boutons `[CAMERA]` `[BRAS 3D]` en haut de la zone camera existante. Style coherent avec les onglets du drawer (font-mono, text-xs, border-b active).

### 4. State Management — Hook `useRobotSimulation`

**State partage :**
```
robotSim: {
  arms: {
    PSM1: { joints: [7 angles], position: [x,y,z], status: 'NOMINAL' },
    PSM2: { joints: [7 angles], position: [x,y,z], status: 'NOMINAL' },
    ECM:  { joints: [4 angles], zoom: 2.1, status: 'ACTIVE' },
    AUX:  { joints: [3 angles], status: 'NOMINAL' },
  },
  force: 245,        // grammes (0-2000)
  clipTension: 380,  // grammes
  gripperOpen: 65,   // % (0-100)
}
```

**Sources de mise a jour :**
1. Timer interne (10Hz) : micro-oscillations realistes quand ACTIVE
2. `robotStatus` change : FROZEN → tout passe en rouge, force/tension a 0, joints figes
3. Evenements Red Team : le hook ecoute un EventEmitter global

**Evenements Red Team :**
- `redteam:freeze` → bras figes, status FROZEN
- `redteam:tension_override` → clipTension force a la valeur attaquee
- `redteam:reset` → retour au nominal

**Pont Red Team <-> Simulation :**
- ScenarioTab emet des evenements quand un step_result arrive avec scores.injection_success ou scores.rule_bypass
- useRobotSimulation ecoute et reagit
- Pas de couplage direct entre composants

### 5. Fix Boutons d'Aide

Les boutons "Expliquer (Safe/Poison/Crypto)" et "En Scene" sont dans un `mt-auto` qui les pousse en bas de la colonne gauche. Si la colonne est trop courte ou overflow hidden, ils disparaissent.

Fix : s'assurer que la colonne gauche a `overflow-y-auto` et que les boutons restent visibles.

## Composants a creer/modifier

```
frontend/src/
├── hooks/
│   └── useRobotSimulation.js        (nouveau: state + simulation bras)
├── utils/
│   └── robotEventBus.js             (nouveau: EventEmitter global)
├── components/
│   ├── RobotArmsView.jsx            (nouveau: vue 3D Three.js)
│   ├── CameraHUD.jsx                (nouveau: overlay HUD dynamique)
│   └── App.jsx                      (modifie: toggle camera/bras, fix aide)
```

## Dependances

- `three` (Three.js) — rendu 3D
- `@react-three/fiber` — integration React/Three.js
- `@react-three/drei` — utilitaires (OrbitControls, Text, etc.)
