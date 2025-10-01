import { Card, Button } from 'antd'
import { OrderedListOutlined, CheckCircleOutlined, HistoryOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const cards = [
  { key: 'create', title: 'Create New Request', desc: 'Start a new load request', icon: <PlusCircleOutlined />, to: '/dashboard/lsr/create' },
  { key: 'pending', title: 'View Pending Requests', desc: 'Requests awaiting approval', icon: <OrderedListOutlined />, to: '/dashboard/lsr/pending' },
  { key: 'approved', title: 'View Approved Requests', desc: 'Approved requests list', icon: <CheckCircleOutlined />, to: '/dashboard/lsr/approved' },
  { key: 'history', title: 'Request History', desc: 'Approved/Rejected with status', icon: <HistoryOutlined />, to: '/dashboard/lsr/history' },
]

export default function LsrDashboard() {
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


