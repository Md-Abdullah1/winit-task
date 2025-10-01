import { Table, Tag, Progress, Button } from 'antd'
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons'

export default function AgentApproved() {
  const columns = [
    { title: 'Reqs ID', dataIndex: 'reqId' },
    { title: 'Route', dataIndex: 'route' },
    { title: 'Reqs By', dataIndex: 'requestedBy' },
    { title: 'Depot', dataIndex: 'depot' },
    { title: 'Approval Date', dataIndex: 'approvalDate' },
    { title: 'Load', dataIndex: 'load' },
    { title: 'Resource', dataIndex: 'resource' },
    { title: 'Status', dataIndex: 'status', render: v => {
      const map = { delivered: 'green', in_transit: 'blue', load_sheet_generated: 'gold' }
      return <Tag color={map[v] || 'default'}>{(v || '').replaceAll('_',' ')}</Tag>
    } },
    { title: 'Progress', dataIndex: 'progress', render: v => <Progress percent={v} size="small" /> },
    { title: 'Action', key: 'action', render: () => (
      <div className="flex gap-2">
        <Button size="small" icon={<EyeOutlined />}>View</Button>
        <Button size="small" icon={<DownloadOutlined />}>
          Download
        </Button>
      </div>
    ) },
  ]

  const data = [
    { key: 'a1', reqId: 'REQ-11001', route: 'R-12', requestedBy: 'LSR-12', depot: 'D01', approvalDate: '2025-10-03', load: '120 CASE', resource: 'TR-110', status: 'in_transit', progress: 45 },
    { key: 'a2', reqId: 'REQ-11002', route: 'R-08', requestedBy: 'LSR-03', depot: 'D02', approvalDate: '2025-10-04', load: '85 CASE', resource: 'TR-220', status: 'delivered', progress: 100 },
    { key: 'a3', reqId: 'REQ-11003', route: 'R-20', requestedBy: 'LSR-09', depot: 'D03', approvalDate: '2025-10-04', load: '60 CASE', resource: 'TR-305', status: 'load_sheet_generated', progress: 20 },
  ]

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xl font-semibold text-slate-900">Approved Requests</div>
        <div className="text-slate-500">Approved load requests and their fulfillment progress.</div>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} className="bg-white" />
    </div>
  )
}


