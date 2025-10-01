import { Card } from 'antd'
import { TeamOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export default function DashboardHome() {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card hoverable onClick={() => navigate('/dashboard/lsr')} className="bg-slate-800 border-slate-700">
        <div className="flex items-center gap-3">
          <UserSwitchOutlined className="text-2xl" />
          <div>
            <div className="text-slate-100 font-medium">LSR Dashboard</div>
            <div className="text-slate-400 text-sm">Create and submit requests</div>
          </div>
        </div>
      </Card>
      <Card hoverable onClick={() => navigate('/dashboard/agent')} className="bg-slate-800 border-slate-700">
        <div className="flex items-center gap-3">
          <TeamOutlined className="text-2xl" />
          <div>
            <div className="text-slate-100 font-medium">Agent Dashboard</div>
            <div className="text-slate-400 text-sm">Approve or reject requests</div>
          </div>
        </div>
      </Card>
    </div>
  )
}


