import { Table, Tag, Button } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

export default function AgentHistory() {
  const columns = [
    { title: 'Movement', dataIndex: 'movement' },
    { title: 'Salesman', dataIndex: 'salesman' },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Submitted', dataIndex: 'submitted' },
    { title: 'Processed', dataIndex: 'processed' },
    { title: 'Items', dataIndex: 'items' },
    { title: 'Requested', dataIndex: 'requested' },
    { title: 'Approved', dataIndex: 'approved' },
    { title: 'Status', dataIndex: 'status', render: v => <Tag color={v === 'approved' ? 'green' : 'red'}>{v === 'approved' ? 'Approved' : 'Rejected'}</Tag> },
    { title: 'Actions', key: 'action', render: () => <Button size="small" icon={<EyeOutlined />}>View</Button> },
  ]

  const data = [
    { key: 'h1', movement: 'MV-4401', salesman: 'S. Iqbal', type: 'Commercial', submitted: '2025-09-30', processed: '2025-10-01', items: 12, requested: 120, approved: 110, status: 'approved' },
    { key: 'h2', movement: 'MV-4402', salesman: 'D. Singh', type: 'POSM', submitted: '2025-09-29', processed: '2025-09-30', items: 6, requested: 42, approved: 0, status: 'rejected' },
  ]

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xl font-semibold text-slate-900">Requests History</div>
        <div className="text-slate-500">All processed requests with outcomes.</div>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} className="bg-white" />
    </div>
  )
}


