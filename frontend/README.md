# Aegis Frontend - Surgical Console & Red Team Lab

This is the React-based frontend for the Aegis Medical AI Simulator. It provides a realistic surgical dashboard and a comprehensive Red Team Lab for security research.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## 🛠️ Features

### Surgical Dashboard
- **Vitals Monitor**: Real-time simulation of patient heart rate, SpO2, and blood pressure.
- **AI Assistant Chat**: Natural language interface for the Da Vinci surgical robot.
- **Telemetry Console**: System logs and intrusion detection events.
- **Analysis Panel**: Real-time multi-agent debate (Da Vinci vs Aegis).

### Aegis Lab (Red Team)
- **Shortcut**: `Ctrl+Shift+R` to toggle.
- **Campaigns**: Automated security audits with SSE streaming.
- **Playground**: Manual prompt injection and system prompt editing.
- **Configuration**: Independent difficulty levels (Easy/Normal/Hard) for agents.

## 🧬 Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Visualization**: Recharts (Graphs), Three.js (3D Arms view - *Roadmap*)
- **Icons**: Lucide React
- **Communications**: Server-Sent Events (SSE) for AI streaming.
