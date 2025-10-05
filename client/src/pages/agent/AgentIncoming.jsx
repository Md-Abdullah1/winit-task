import { Button, Tag, Table, Segmented } from 'antd'
import { PlusOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import api from '../../lib/api.js'

export default function AgentIncoming() {
  const [status, setStatus] = useState('pending')
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])

  const columns = useMemo(() => [
    { title: '', dataIndex: 'select', width: 40, render: () => <input type="checkbox" /> },
    { title: 'Movement', dataIndex: 'movement' },
    { title: 'Route', dataIndex: 'route' },
    { title: 'Salesman', dataIndex: 'salesman' },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Status', dataIndex: 'status', render: (v) => {
      const map = {
        pending: { color: 'orange', text: 'Pending' },
        logistics: { color: 'blue', text: 'Logistics' },
        forklift: { color: 'geekblue', text: 'Forklift' },
        rejected: { color: 'red', text: 'Rejected' },
        shipped: { color: 'green', text: 'Shipped' },
      }
      const conf = map[v] || { color: 'default', text: v }
      return <Tag color={conf.color}>{conf.text}</Tag>
    } },
    { title: 'Submitted', dataIndex: 'submitted' },
    { title: 'Action', key: 'action', render: () => <Button size="small">View</Button> },
  ], [])

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        const res = await api.get('/agent/requests/pending', { params: { status: status === 'all' ? undefined : status } })
        if (!ignore) setRows((res.data || []).map((r, idx) => ({ key: r.id || String(idx), movement: r.movementCode || 'not specified', route: r.route || 'not specified', salesman: r.salesmanName || 'not specified', type: r.type || 'not specified', status: r.status, submitted: r.submittedAt?.slice(0,10) })))
      } catch {
        // fallback demo data
        const demo = [
          { key: 'i1', movement: 'MV-3301', route: 'R-07', salesman: 'S. Iqbal', type: 'Commercial', status: 'pending', submitted: '2025-10-05' },
          { key: 'i2', movement: 'MV-3302', route: 'R-11', salesman: 'D. Singh', type: 'POSM', status: 'logistics', submitted: '2025-10-05' },
          { key: 'i3', movement: 'MV-3303', route: 'R-02', salesman: 'P. Rao', type: 'Commercial', status: 'forklift', submitted: '2025-10-04' },
          { key: 'i4', movement: 'MV-3304', route: 'R-22', salesman: 'Y. Lee', type: 'Commercial', status: 'shipped', submitted: '2025-10-03' },
        ]
        if (!ignore) setRows(demo)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [status])

  const data = rows

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-slate-900">Manual Load Requests</div>
          <div className="text-slate-500">New and incoming requests awaiting triage</div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="default"><PlusOutlined /> New Request</Button>
          <Button type="default"><ReloadOutlined /> Refresh</Button>
          <Button type="default"><FilterOutlined /> Filter</Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Segmented
          value={status}
          onChange={setStatus}
          options={[
            { label: <>Pending <span className="text-xs">(12)</span></>, value: 'pending' },
            { label: <>Logistics <span className="text-xs">(5)</span></>, value: 'logistics' },
            { label: <>Forklift <span className="text-xs">(3)</span></>, value: 'forklift' },
            { label: <>Rejected <span className="text-xs">(4)</span></>, value: 'rejected' },
            { label: <>Shipped <span className="text-xs">(9)</span></>, value: 'shipped' },
            { label: <>All</>, value: 'all' },
          ]}
        />
      </div>

      <Table columns={columns} dataSource={data} loading={loading} pagination={false} className="bg-white" />
    </div>
  )
}


