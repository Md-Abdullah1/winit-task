import { Table, Tag, Button } from 'antd'

export default function LsrHistory() {
  const columns = [
    { title: 'Movement Code', dataIndex: 'movementCode' },
    { title: 'Route', dataIndex: 'route' },
    { title: 'Load Type', dataIndex: 'loadType' },
    { title: 'Submitted', dataIndex: 'submitted' },
    { title: 'Required', dataIndex: 'required' },
    { title: 'Items Qty', dataIndex: 'itemsQty' },
    { title: 'Status', dataIndex: 'status', render: (v) => {
      const isApproved = v?.state === 'approved'
      return (
        <div className="flex items-center gap-2">
          <Tag color={isApproved ? 'green' : 'red'}>{isApproved ? 'Approved' : 'Rejected'}</Tag>
          <span className="text-slate-600 text-xs">by {v?.by || '—'}</span>
        </div>
      )
    } },
    { title: 'Action', key: 'action', render: () => <Button size="small">View</Button> },
  ]

  const data = [
    { key: 'h1', movementCode: 'MV-201', route: 'R-12', loadType: 'Commercial', submitted: '2025-09-30', required: '2025-10-02', itemsQty: 120, status: { state: 'approved', by: 'A. Khan' } },
    { key: 'h2', movementCode: 'MV-202', route: 'R-05', loadType: 'POSM', submitted: '2025-09-28', required: '2025-10-01', itemsQty: 45, status: { state: 'rejected', by: 'M. Chen' } },
  ]

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xl font-semibold text-slate-900">Request History</div>
        <div className="text-slate-500">Previously submitted requests with approval outcome and reviewer.</div>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} className="bg-white" />
    </div>
  )
}


