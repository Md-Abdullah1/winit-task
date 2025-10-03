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
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LsrLogin from './components/layouts/login/LsrLogin.jsx'
import AgentLogin from './components/layouts/login/AgentLogin.jsx'

function RequireAuth({ role, children }) {
  const { isAuthenticated, role: currentRole } = useAuth()
  if (!isAuthenticated) return <Navigate to={role === 'lsr' ? '/login/lsr' : '/login/agent'} replace />
  if (role && currentRole !== role) return <Navigate to={currentRole === 'lsr' ? '/dashboard/lsr' : '/dashboard/agent'} replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login/lsr" element={<LsrLogin />} />
          <Route path="/login/agent" element={<AgentLogin />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/lsr" element={<RequireAuth role="lsr"><LsrDashboard /></RequireAuth>} />
            <Route path="/dashboard/lsr/create" element={<RequireAuth role="lsr"><LsrCreate /></RequireAuth>} />
            <Route path="/dashboard/lsr/pending" element={<RequireAuth role="lsr"><LsrPending /></RequireAuth>} />
            <Route path="/dashboard/lsr/approved" element={<RequireAuth role="lsr"><LsrApproved /></RequireAuth>} />
            <Route path="/dashboard/lsr/history" element={<RequireAuth role="lsr"><LsrHistory /></RequireAuth>} />
            <Route path="/dashboard/agent" element={<RequireAuth role="agent"><AgentDashboard /></RequireAuth>} />
            <Route path="/dashboard/agent/incoming" element={<RequireAuth role="agent"><AgentIncoming /></RequireAuth>} />
            <Route path="/dashboard/agent/pending" element={<RequireAuth role="agent"><AgentPending /></RequireAuth>} />
            <Route path="/dashboard/agent/approved" element={<RequireAuth role="agent"><AgentApproved /></RequireAuth>} />
            <Route path="/dashboard/agent/history" element={<RequireAuth role="agent"><AgentHistory /></RequireAuth>} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
