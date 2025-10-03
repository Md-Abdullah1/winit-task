import { Table, Tag, Progress, Button } from 'antd'
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import api from '../../lib/api.js'

export default function AgentApproved() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        const res = await api.get('/agent/requests/approved')
        if (!ignore) {
          const mapped = (res.data || []).map((r, idx) => ({
            key: r._id || String(idx),
            reqId: r._id,
            route: r.route || '-',
            requestedBy: r.createdBy?.name || '-',
            depot: r.depot || '-',
            approvalDate: r.updatedAt?.slice(0,10),
            load: `${(r.items || []).reduce((a,i)=>a + (i.quantity||0),0)} ITEM`,
            resource: r.truck || '-',
            status: r.fulfillmentStatus === 'shipped' ? 'delivered' : (r.fulfillmentStatus || 'load_sheet_generated'),
            progress: r.fulfillmentStatus === 'shipped' ? 100 : (r.fulfillmentStatus === 'logistics' ? 30 : 60),
          }))
          setRows(mapped)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xl font-semibold text-slate-900">Approved Requests</div>
        <div className="text-slate-500">Approved load requests and their fulfillment progress.</div>
      </div>
      <Table loading={loading} columns={columns} dataSource={rows} pagination={false} className="bg-white" />
    </div>
  )
}


