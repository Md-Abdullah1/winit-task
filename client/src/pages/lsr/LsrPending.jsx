import { Table, Button, Tag } from 'antd'
import { useEffect, useState } from 'react'
import api from '../../lib/api.js'

export default function LsrPending() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        const res = await api.get('/lsr/requests', { params: { status: 'submitted' } })
        if (!ignore) {
          const mapped = (res.data || []).map((r, idx) => ({
            key: r._id || String(idx),
            reqId: r._id,
            route: r.route || '-',
            requestDate: r.createdAt?.slice(0,10),
            approvalDate: '-',
            approvedLoad: '-',
            truck: '-',
            driver: '-',
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

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xl font-semibold text-slate-900">Pending Requests</div>
        <div className="text-slate-500">Requests submitted for approval and awaiting action.</div>
      </div>
      <Table loading={loading} columns={columns} dataSource={rows} pagination={false} className="bg-white" />
    </div>
  )
}


