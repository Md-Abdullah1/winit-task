import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/layouts/DashboardLayout.jsx'
import DashboardHome from './pages/DashboardHome.jsx'
function Placeholder({ label }) { return <div className="text-slate-300">{label}</div> }
import LsrDashboard from './pages/lsr/LsrDashboard.jsx'
import LsrCreate from './pages/lsr/LsrCreate.jsx'
import LsrPending from './pages/lsr/LsrPending.jsx'
import LsrApproved from './pages/lsr/LsrApproved.jsx'
import LsrHistory from './pages/lsr/LsrHistory.jsx'
import AgentDashboard from './pages/agent/AgentDashboard.jsx'
import AgentIncoming from './pages/agent/AgentIncoming.jsx'
import AgentPending from './pages/agent/AgentPending.jsx'
import AgentApproved from './pages/agent/AgentApproved.jsx'
import AgentHistory from './pages/agent/AgentHistory.jsx'

export default function App() {
  // Assume admin is already authenticated; later replace with real auth guard
  const isAdmin = true

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAdmin ? <Navigate to="/dashboard" replace /> : <div>Login</div>} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/lsr" element={<LsrDashboard />} />
          <Route path="/dashboard/lsr/create" element={<LsrCreate />} />
          <Route path="/dashboard/lsr/pending" element={<LsrPending />} />
          <Route path="/dashboard/lsr/approved" element={<LsrApproved />} />
          <Route path="/dashboard/lsr/history" element={<LsrHistory />} />
          <Route path="/dashboard/agent" element={<AgentDashboard />} />
          <Route path="/dashboard/agent/incoming" element={<AgentIncoming />} />
          <Route path="/dashboard/agent/pending" element={<AgentPending />} />
          <Route path="/dashboard/agent/approved" element={<AgentApproved />} />
          <Route path="/dashboard/agent/history" element={<AgentHistory />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
