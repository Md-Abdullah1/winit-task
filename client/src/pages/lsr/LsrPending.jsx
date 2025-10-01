import { Table, Button, Tag } from 'antd'

export default function LsrPending() {
  const columns = [
    { title: 'Req ID', dataIndex: 'reqId' },
    { title: 'Route', dataIndex: 'route' },
    { title: 'Request Date', dataIndex: 'requestDate' },
    { title: 'Approval Date', dataIndex: 'approvalDate' },
    { title: 'Approved Load', dataIndex: 'approvedLoad' },
    { title: 'Truck', dataIndex: 'truck' },
    { title: 'Driver', dataIndex: 'driver' },
    { title: 'Status', dataIndex: 'status', render: (v) => <Tag color="orange">Pending</Tag> },
    { title: 'Actions', key: 'actions', render: () => (
      <div className="flex gap-2">
        <Button size="small">View</Button>
        <Button size="small" type="default">Download</Button>
      </div>
    ) },
  ]

  const data = [
    { key: 'p1', reqId: 'REQ-10030', route: 'R-22', requestDate: '2025-10-04', approvalDate: '-', approvedLoad: '-', truck: '-', driver: '-', status: 'pending' },
    { key: 'p2', reqId: 'REQ-10031', route: 'R-03', requestDate: '2025-10-05', approvalDate: '-', approvedLoad: '-', truck: '-', driver: '-', status: 'pending' },
  ]

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xl font-semibold text-slate-900">Pending Requests</div>
        <div className="text-slate-500">Requests submitted for approval and awaiting action.</div>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} className="bg-white" />
    </div>
  )
}


