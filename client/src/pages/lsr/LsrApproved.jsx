import { Table, Button, Tag } from 'antd'

export default function LsrApproved() {
  const columns = [
    { title: 'Req ID', dataIndex: 'reqId' },
    { title: 'Route', dataIndex: 'route' },
    { title: 'Request Date', dataIndex: 'requestDate' },
    { title: 'Approval Date', dataIndex: 'approvalDate' },
    { title: 'Approved Load', dataIndex: 'approvedLoad' },
    { title: 'Truck', dataIndex: 'truck' },
    { title: 'Driver', dataIndex: 'driver' },
    { title: 'Status', dataIndex: 'status', render: (v) => {
      const map = {
        delivered: { color: 'green', text: 'Delivered' },
        in_transit: { color: 'blue', text: 'In Transit' },
        load_sheet_generated: { color: 'gold', text: 'Load Sheet Generated' },
      }
      const conf = map[v] || { color: 'default', text: v }
      return <Tag color={conf.color}>{conf.text}</Tag>
    } },
    { title: 'Actions', key: 'actions', render: () => (
      <div className="flex gap-2">
        <Button size="small">View</Button>
        <Button size="small" type="default">Download</Button>
      </div>
    ) },
  ]

  const data = [
    { key: '1', reqId: 'REQ-10021', route: 'R-12', requestDate: '2025-10-01', approvalDate: '2025-10-02', approvedLoad: '120 CASE', truck: 'TR-9082', driver: 'John D', status: 'delivered' },
    { key: '2', reqId: 'REQ-10022', route: 'R-18', requestDate: '2025-10-03', approvalDate: '2025-10-03', approvedLoad: '80 CASE', truck: 'TR-7765', driver: 'A. Khan', status: 'in_transit' },
    { key: '3', reqId: 'REQ-10023', route: 'R-05', requestDate: '2025-10-04', approvalDate: '2025-10-04', approvedLoad: '65 CASE', truck: 'TR-3344', driver: 'M. Chen', status: 'load_sheet_generated' },
  ]

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xl font-semibold text-slate-900">Approved Requests</div>
        <div className="text-slate-500">List of requests that have been approved and their delivery status.</div>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} className="bg-white" />
    </div>
  )
}


