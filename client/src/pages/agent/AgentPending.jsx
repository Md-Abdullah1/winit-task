import { useEffect, useMemo, useState } from 'react'
import { Button, DatePicker, Input, Segmented, Table, Tag, Modal } from 'antd'
import api from '../../lib/api.js'

export default function AgentPending() {
  const [productType, setProductType] = useState('Commercial Products')
  const [date, setDate] = useState()
  const [search, setSearch] = useState('')

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        const res = await api.get('/agent/requests/items', { params: { status: 'pending' } })
        if (!ignore) setRows(res.data || [])
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  const data = useMemo(() => (rows || []).filter(r => !search || (r.sku || 'NA').toLowerCase().includes(search.toLowerCase()) || (r.name || 'NA').toLowerCase().includes(search.toLowerCase())), [rows, search])

  const totals = useMemo(() => data.reduce((acc, r) => {
    acc.items += 1
    acc.requested += r.requested
    acc.approved += r.approved
    return acc
  }, { items: 0, requested: 0, approved: 0 }), [data])

  const [details, setDetails] = useState({ open: false, record: null })

  const columns = [
    { title: 'SKU', dataIndex: 'sku' },
    { title: 'Product Name', dataIndex: 'name' },
    { title: 'LSR', dataIndex: 'lsr' },
    { title: 'Requested', dataIndex: 'requested' },
    { title: 'Stock', dataIndex: 'stock' },
    { title: 'Approved', dataIndex: 'approved' },
    { title: 'Priority', dataIndex: 'priority', render: v => v === 'emergency' ? <Tag color="red">Emergency</Tag> : <Tag>Normal</Tag> },
    { title: 'Customer', dataIndex: 'customer' },
    { title: 'Action', key: 'action', render: (_, record) => <Button size="small" onClick={() => setDetails({ open: true, record })}>Details</Button> },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-slate-900">Pending Requests</div>
          <div className="text-slate-500">Review and approve items in pending requests</div>
        </div>
        <div className="flex items-center gap-3">
          <Stat label="Items" value={totals.items} />
          <Stat label="Requested" value={totals.requested} />
          <Stat label="Approved" value={totals.approved} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Segmented value={productType} onChange={setProductType} options={[ 'Commercial Products', 'POSM' ]} />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-900">Journey Date</div>
        <DatePicker value={date} onChange={setDate} />
      </div>

      <div className="flex items-center gap-2">
        <Input placeholder="Search by SKU or Product Name" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="ml-auto flex items-center gap-2">
          <Button type="default">Add Item</Button>
          <Button type="primary">Process Batch</Button>
        </div>
      </div>

      <div>
        <div className="font-medium text-slate-900">Pending Approval</div>
        <div className="text-slate-500 text-sm">Items awaiting your decision</div>
      </div>

      <div className="overflow-x-auto">
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          className="bg-white"
          summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={9}>
              <div className="flex items-center gap-6 justify-end text-sm">
                <div className="flex items-center gap-2"><span className="text-slate-500">Total Items:</span><span className="font-semibold">{totals.items}</span></div>
                <div className="flex items-center gap-2"><span className="text-slate-500">Requested:</span><span className="font-semibold">{totals.requested}</span></div>
                <div className="flex items-center gap-2"><span className="text-slate-500">Approved:</span><span className="font-semibold">{totals.approved}</span></div>
              </div>
            </Table.Summary.Cell>
          </Table.Summary.Row>
          )}
        />
      </div>

      <DetailsModal
        open={details.open}
        record={details.record}
        onClose={() => setDetails({ open: false, record: null })}
        onSuccess={async () => {
          // reload table after action
          try {
            setLoading(true)
            const res = await api.get('/agent/requests/items', { params: { status: 'pending' } })
            setRows(res.data || [])
          } finally {
            setLoading(false)
          }
        }}
      />
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900">
      <div className="text-[11px] uppercase text-slate-500">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  )
}

function DetailsModal({ open, record, onClose, onSuccess }) {
  if (!record) return null
  const requestId = record.requestId
  async function doApprove() {
    await api.post(`/agent/requests/${requestId}/approve`)
    onSuccess?.(); onClose()
  }
  async function doReject() {
    await api.post(`/agent/requests/${requestId}/reject`, { reason: 'Rejected by agent' })
    onSuccess?.(); onClose()
  }
  async function doTransit() {
    await api.post(`/agent/requests/${requestId}/in-transit`)
    onSuccess?.(); onClose()
  }
  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Request Actions">
      <div className="space-y-2">
        <div className="text-slate-700 text-sm">SKU: {record.sku}</div>
        <div className="text-slate-700 text-sm">Product: {record.name}</div>
        <div className="text-slate-700 text-sm">Requested: {record.requested}</div>
        <div className="text-slate-700 text-sm">Customer: {record.customer || '-'}</div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button type="primary" onClick={doApprove}>Approve</Button>
        <Button danger onClick={doReject}>Reject</Button>
        <Button onClick={doTransit}>In Transit</Button>
      </div>
    </Modal>
  )
}


