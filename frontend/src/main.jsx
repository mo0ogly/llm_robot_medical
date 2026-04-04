import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.jsx'

// Red Team Laboratory Views
import RedTeamLayout from './components/redteam/RedTeamLayout.jsx'

// Static imports — lightweight views, always visible or frequently visited
import StudioView from './components/redteam/views/StudioView.jsx'
import PlaygroundView from './components/redteam/views/PlaygroundView.jsx'
import CatalogView from './components/redteam/views/CatalogView.jsx'
import ScenariosView from './components/redteam/views/ScenariosView.jsx'
import LogsView from './components/redteam/views/LogsView.jsx'
import HistoryView from './components/redteam/views/HistoryView.jsx'
import TimelineView from './components/redteam/views/TimelineView.jsx'

// Lazy imports — heavy views, code-split into separate chunks
var RagView = lazy(function() { return import('./components/redteam/views/RagView.jsx'); });
var ExerciseView = lazy(function() { return import('./components/redteam/views/ExerciseView.jsx'); });
var DefenseView = lazy(function() { return import('./components/redteam/views/DefenseView.jsx'); });
var AnalysisView = lazy(function() { return import('./components/redteam/views/AnalysisView.jsx'); });
var ResultExplorer = lazy(function() { return import('./components/redteam/views/ResultExplorer.jsx'); });
var CampaignView = lazy(function() { return import('./components/redteam/views/CampaignView.jsx'); });
var PromptForgeMultiLLM = lazy(function() { return import('./components/redteam/PromptForgeMultiLLM.jsx'); });

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
          <Route path="rag" element={<Suspense fallback={<div className="p-8 text-neutral-500">Loading...</div>}><RagView /></Suspense>} />
          <Route path="attack" element={<Navigate to="/llm_robot_medical/redteam/studio" replace />} />
          <Route path="exercise" element={<Suspense fallback={<div className="p-8 text-neutral-500">Loading...</div>}><ExerciseView /></Suspense>} />
          <Route path="defense" element={<Suspense fallback={<div className="p-8 text-neutral-500">Loading...</div>}><DefenseView /></Suspense>} />
          <Route path="logs" element={<LogsView />} />
          <Route path="analysis" element={<Suspense fallback={<div className="p-8 text-neutral-500">Loading...</div>}><AnalysisView /></Suspense>} />
          <Route path="catalog" element={<CatalogView />} />
          <Route path="studio" element={<StudioView />} />
          <Route path="playground" element={<PlaygroundView />} />
          <Route path="prompt-forge" element={<Suspense fallback={<div className="p-8 text-neutral-500">Loading PromptForge...</div>}><PromptForgeMultiLLM /></Suspense>} />
          <Route path="timeline" element={<TimelineView />} />
          <Route path="scenarios" element={<ScenariosView />} />
          <Route path="campaign" element={<Suspense fallback={<div className="p-8 text-neutral-500">Loading...</div>}><CampaignView /></Suspense>} />
          <Route path="history" element={<HistoryView />} />
          <Route path="results" element={<Suspense fallback={<div className="p-8 text-neutral-500">Loading...</div>}><ResultExplorer /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
