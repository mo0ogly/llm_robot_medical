import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.jsx'

// Red Team Laboratory Views
import RedTeamLayout from './components/redteam/RedTeamLayout.jsx'
import RagView from './components/redteam/views/RagView.jsx'
import AttackView from './components/redteam/views/AttackView.jsx'
import ExerciseView from './components/redteam/views/ExerciseView.jsx'
import DefenseView from './components/redteam/views/DefenseView.jsx'
import LogsView from './components/redteam/views/LogsView.jsx'
import AnalysisView from './components/redteam/views/AnalysisView.jsx'
import ResultExplorer from './components/redteam/views/ResultExplorer.jsx'

// import.meta.env.BASE_URL = "/llm_robot_medical/" (from vite.config.js)
// BrowserRouter basename strips this prefix before matching routes
// So route "/" matches /llm_robot_medical/, "/redteam/rag" matches /llm_robot_medical/redteam/rag
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/redteam" element={<RedTeamLayout />}>
          <Route index element={<Navigate to="rag" replace />} />
          <Route path="rag" element={<RagView />} />
          <Route path="attack" element={<AttackView />} />
          <Route path="exercise" element={<ExerciseView />} />
          <Route path="defense" element={<DefenseView />} />
          <Route path="logs" element={<LogsView />} />
          <Route path="analysis" element={<AnalysisView />} />
          <Route path="results" element={<ResultExplorer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
