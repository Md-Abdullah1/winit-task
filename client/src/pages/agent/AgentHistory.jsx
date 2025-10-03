import { Table, Tag, Button, Segmented } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import api from '../../lib/api.js'

export default function AgentHistory() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [typeFilter, setTypeFilter] = useState('All')
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

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        const res = await api.get('/agent/requests/history')
        if (!ignore) {
          const mapped = (res.data || []).map((r, idx) => ({
            key: r._id || String(idx),
            movement: r.movementCode || r._id?.slice(-6),
            salesman: r.createdBy?.name || '-',
            type: (r.items || []).some(i => i.type === 'posm') ? 'POSM' : 'Commercial',
            submitted: r.createdAt?.slice(0,10),
            processed: r.updatedAt?.slice(0,10),
            items: (r.items || []).length,
            requested: (r.items || []).reduce((a,i)=>a + (i.quantity||0),0),
            approved: r.status === 'approved' ? (r.items || []).reduce((a,i)=>a + (i.quantity||0),0) : 0,
            status: r.status,
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

  const filteredRows = useMemo(() => {
    if (typeFilter === 'All') return rows
    return (rows || []).filter(r => r.type?.toLowerCase() === (typeFilter === 'POSM' ? 'posm' : 'commercial'))
  }, [rows, typeFilter])

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xl font-semibold text-slate-900">Requests History</div>
        <div className="text-slate-500">All processed requests with outcomes.</div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-600 text-sm">Filter by type</div>
        <Segmented
          options={[ 'Commercial', 'POSM', 'All' ]}
          value={typeFilter}
          onChange={setTypeFilter}
        />
      </div>
      <Table loading={loading} columns={columns} dataSource={filteredRows} pagination={false} className="bg-white" />
    </div>
  )
}


