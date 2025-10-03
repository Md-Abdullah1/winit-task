import { Table, Tag, Button, Segmented } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import api from '../../lib/api.js'

export default function LsrHistory() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [typeFilter, setTypeFilter] = useState('All')
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

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        const res = await api.get('/lsr/requests/history')
        if (!ignore) {
          const mapped = (res.data || []).map((r, idx) => ({
            key: r._id || String(idx),
            movementCode: r.movementCode || r._id?.slice(-6),
            route: r.route || '-',
            loadType: (r.items || []).some(i => i.type === 'posm') ? 'POSM' : 'Commercial',
            submitted: r.createdAt?.slice(0,10),
            required: r.requiredBy?.slice(0,10) || '-',
            itemsQty: (r.items || []).reduce((a,i)=>a + (i.quantity||0),0),
            status: { state: r.status, by: r.approvedBy?.name || '-' },
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
    return (rows || []).filter(r => r.loadType?.toLowerCase() === (typeFilter === 'POSM' ? 'posm' : 'commercial'))
  }, [rows, typeFilter])

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xl font-semibold text-slate-900">Request History</div>
        <div className="text-slate-500">Previously submitted requests with approval outcome and reviewer.</div>
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


