import { Card, Button } from 'antd'
import { InboxOutlined, ClockCircleOutlined, CheckCircleOutlined, HistoryOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const cards = [
  { key: 'incoming', title: 'Incoming Requests', desc: 'New requests awaiting triage', icon: <InboxOutlined />, to: '/dashboard/agent/incoming' },
  { key: 'pending', title: 'Pending Requests', desc: 'Awaiting processing', icon: <ClockCircleOutlined />, to: '/dashboard/agent/pending' },
  { key: 'approved', title: 'Approved Requests', desc: 'Approved and moving', icon: <CheckCircleOutlined />, to: '/dashboard/agent/approved' },
  { key: 'history', title: 'Request History', desc: 'All actions and outcomes', icon: <HistoryOutlined />, to: '/dashboard/agent/history' },
]

export default function AgentDashboard() {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(c => (
        <Card key={c.key} className="border-slate-300" styles={{ body: { padding: 16 } }}>
          <div className="flex items-start gap-3">
            <div className="text-2xl">{c.icon}</div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">{c.title}</div>
              <div className="text-slate-500 text-sm">{c.desc}</div>
            </div>
            <Button type="default" onClick={() => navigate(c.to)}>View</Button>
          </div>
        </Card>
      ))}
    </div>
  )
}


