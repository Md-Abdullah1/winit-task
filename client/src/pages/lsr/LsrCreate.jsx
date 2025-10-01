import { useEffect, useMemo, useState } from 'react'
import { DatePicker, Segmented, Table, Button, Modal, Input, message } from 'antd'
import { ShoppingCartOutlined, AppstoreOutlined, CloseOutlined, ExclamationCircleFilled, ScheduleOutlined } from '@ant-design/icons'
import api from '../../lib/api.js'

const initialRows = [
  { key: '1', sku: 'COLA-330', name: 'Cola 330ml', defaultUom: 'CASE', recommended: 10, preOrder: 0, buffer: 2 },
  { key: '2', sku: 'ORNG-500', name: 'Orange 500ml', defaultUom: 'CASE', recommended: 6, preOrder: 0, buffer: 1 },
]

export default function LsrCreate() {
  const [date, setDate] = useState()
  const [tab, setTab] = useState('Commercial Items')
  const [rows, setRows] = useState(initialRows)
  const [posmRows, setPosmRows] = useState([
    { key: 'p1', sku: 'STND-POST', name: 'Standard Poster', defaultUom: 'PCS', recommended: 20, preOrder: 0, buffer: 5 },
    { key: 'p2', sku: 'CT-STD', name: 'Counter Tent', defaultUom: 'PCS', recommended: 10, preOrder: 0, buffer: 2 },
  ])
  const [showCommercialModal, setShowCommercialModal] = useState(false)
  const [showPosmModal, setShowPosmModal] = useState(false)
  const [showPriorityModal, setShowPriorityModal] = useState(false)
  const [requestId, setRequestId] = useState(null)

  const columns = useMemo(() => [
    { title: 'SKU', dataIndex: 'sku' },
    { title: 'Product Name', dataIndex: 'name' },
    { title: 'UOM', dataIndex: 'defaultUom' },
    { title: 'Recommended', dataIndex: 'recommended' },
    { title: 'Pre-Order', dataIndex: 'preOrder', render: (_, r, i) => (
      <Input
        size="small"
        type="number"
        value={r.preOrder}
        onChange={(e) => updateRow(i, { preOrder: Number(e.target.value || 0) })}
        className="w-20"
      />
    ) },
    { title: 'Buffer', dataIndex: 'buffer', render: (_, r, i) => (
      <Input
        size="small"
        type="number"
        value={r.buffer}
        onChange={(e) => updateRow(i, { buffer: Number(e.target.value || 0) })}
        className="w-20"
      />
    ) },
    { title: 'Total Qty', dataIndex: 'total', render: (_, r) => r.recommended + r.preOrder + r.buffer },
  ], [rows])

  function updateRow(index, changes) {
    if (tab === 'POSM') {
      setPosmRows(prev => prev.map((r, i) => i === index ? { ...r, ...changes } : r))
    } else {
      setRows(prev => prev.map((r, i) => i === index ? { ...r, ...changes } : r))
    }
  }

  // create draft request on mount
  useEffect(() => {
    let ignore = false
    async function ensureDraft() {
      try {
        const res = await api.post('/lsr/requests')
        if (!ignore) setRequestId(res.data?._id)
      } catch {}
    }
    ensureDraft()
    return () => { ignore = true }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-slate-900 font-medium">Create Load Request</div>
          <div className="text-slate-500 text-sm">Select date, add Commercial/POSM items</div>
        </div>
        <DatePicker value={date} onChange={setDate} />
      </div>

      <div className="flex items-center gap-3">
        <Segmented
          options={[{ label: 'Commercial Items', value: 'Commercial Items', icon: <ShoppingCartOutlined /> }, { label: 'POSM', value: 'POSM', icon: <AppstoreOutlined /> }]}
          value={tab}
          onChange={setTab}
        />
      </div>

      <Table columns={columns} dataSource={tab === 'POSM' ? posmRows : rows} pagination={false} size="small" className="bg-white" />

      {tab === 'POSM' ? (
        <div className="flex items-center gap-2">
          <Button type="default" onClick={() => setShowPosmModal(true)} className="bg-black text-white border-black">Add POSM Item</Button>
          <Button type="primary" onClick={() => setShowPriorityModal(true)} disabled={!requestId}>Create Order</Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button type="default" onClick={() => setShowCommercialModal(true)} className="bg-black text-white border-black">Add Commercial Item</Button>
          <Button type="default" onClick={() => setTab('POSM')}>Next POSM Item</Button>
        </div>
      )}

      <AddCommercialModal requestId={requestId} open={showCommercialModal} onClose={() => setShowCommercialModal(false)} />
      <AddPosmModal requestId={requestId} open={showPosmModal} onClose={() => setShowPosmModal(false)} onAdded={() => { setShowPosmModal(false); setShowPriorityModal(true) }} />
      <PriorityModal requestId={requestId} onClose={() => setShowPriorityModal(false)} onSubmitted={() => { setShowPriorityModal(false); message.success('Request submitted'); }} open={showPriorityModal} />
    </div>
  )
}

function AddCommercialModal({ open, onClose, requestId }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [search, setSearch] = useState('')
  const columns = [
    { title: 'SKU Code', dataIndex: 'sku' },
    { title: 'Product Name', dataIndex: 'name' },
    { title: 'Category', dataIndex: 'category' },
    { title: 'Brand', dataIndex: 'brand' },
    { title: 'UOM', dataIndex: 'uom' },
    { title: 'Pack Size', dataIndex: 'pack' },
    { title: 'MRP', dataIndex: 'mrp' },
    { title: 'Stock', dataIndex: 'stock' },
    { title: 'Reserved', dataIndex: 'reserved' },
    { title: 'Available', dataIndex: 'available' },
    { title: 'Avg Sales/Day', dataIndex: 'avg' },
    { title: 'Order Qty', dataIndex: 'qty', render: () => <Input size="small" type="number" className="w-20" /> },
  ]

  const data = useMemo(() => [
    { key: '1', sku: 'COLA-330', name: 'Cola 330ml', category: 'Beverage', brand: 'Brand A', uom: 'CASE', pack: '24x330', mrp: 480, stock: 50, reserved: 5, available: 45, avg: 12 },
    { key: '2', sku: 'ORNG-500', name: 'Orange 500ml', category: 'Beverage', brand: 'Brand B', uom: 'CASE', pack: '12x500', mrp: 360, stock: 20, reserved: 2, available: 18, avg: 7 },
  ].filter(r => !search || r.sku.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase())), [search])

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="90%"
      styles={{ body: { padding: 0 } }}
      closeIcon={<CloseOutlined />}
      title={null}
    >
      <div className="p-4">
        <div className="mb-2">
          <div className="text-lg font-medium">Add Commercial Product</div>
          <div className="text-slate-500 text-sm">Search and select products to add to the load request</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <Input placeholder="Search by SKU or Product Name" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Table
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          columns={columns}
          dataSource={data}
          size="small"
          scroll={{ x: true }}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-600">Items selected: {selectedRowKeys.length} | Quantity: - | Amount: -</div>
          <div className="flex items-center gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="default"
              className="bg-black text-white border-black"
              onClick={async () => {
                try {
                  if (!requestId) return;
                  // Demo: push selected items as commercial
                  await Promise.all(selectedRowKeys.map((key) => api.post(`/lsr/requests/${requestId}/items`, { type: 'commercial', name: key, quantity: 1 })))
                  onClose()
                } catch {}
              }}
            >
              Add to Load Request
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

function AddPosmModal({ open, onClose, onAdded, requestId }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [search, setSearch] = useState('')
  const columns = [
    { title: 'SKU Code', dataIndex: 'sku' },
    { title: 'Product Name', dataIndex: 'name' },
    { title: 'Category', dataIndex: 'category' },
    { title: 'Brand', dataIndex: 'brand' },
    { title: 'UOM', dataIndex: 'uom' },
    { title: 'Pack Size', dataIndex: 'pack' },
    { title: 'MRP', dataIndex: 'mrp' },
    { title: 'Stock', dataIndex: 'stock' },
    { title: 'Reserved', dataIndex: 'reserved' },
    { title: 'Available', dataIndex: 'available' },
    { title: 'Avg Sales/Day', dataIndex: 'avg' },
    { title: 'Order Qty', dataIndex: 'qty', render: () => <Input size="small" type="number" className="w-20" /> },
  ]

  const data = useMemo(() => [
    { key: '1', sku: 'STND-POST', name: 'Standard Poster', category: 'POSM', brand: 'Brand X', uom: 'PCS', pack: '-', mrp: '-', stock: 200, reserved: 20, available: 180, avg: 30 },
    { key: '2', sku: 'CT-STD', name: 'Counter Tent', category: 'POSM', brand: 'Brand Y', uom: 'PCS', pack: '-', mrp: '-', stock: 40, reserved: 5, available: 35, avg: 6 },
  ].filter(r => !search || r.sku.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase())), [search])

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="90%"
      styles={{ body: { padding: 0 } }}
      closeIcon={<CloseOutlined />}
      title={null}
    >
      <div className="p-4">
        <div className="mb-2">
          <div className="text-lg font-medium">Add POSM Products</div>
          <div className="text-slate-500 text-sm">Search and select POSM items to add to the load request</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <Input placeholder="Search by SKU or Product Name" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Table
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          columns={columns}
          dataSource={data}
          size="small"
          scroll={{ x: true }}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-600">Items selected: {selectedRowKeys.length} | Quantity: - | Amount: -</div>
          <div className="flex items-center gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="default"
              className="bg-black text-white border-black"
              onClick={async () => {
                try {
                  if (!requestId) return;
                  await Promise.all(selectedRowKeys.map((key) => api.post(`/lsr/requests/${requestId}/items`, { type: 'posm', name: key, quantity: 1 })))
                } catch {}
                onAdded()
              }}
            >
              Add to Load Request
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

function PriorityModal({ open, onClose, requestId, onSubmitted }) {
  const [priority, setPriority] = useState('normal')
  function Option({ value, title, desc, icon, highlight }) {
    const active = priority === value
    return (
      <div
        onClick={() => setPriority(value)}
        className={`border rounded-md p-3 cursor-pointer ${active ? (highlight || 'border-blue-500 bg-blue-50') : 'border-slate-200 bg-white'}`}
      >
        <div className="flex items-start gap-3">
          <div className={`text-xl ${value === 'emergency' ? 'text-red-500' : 'text-slate-700'}`}>{icon}</div>
          <div>
            <div className="font-medium text-slate-900">{title}</div>
            <div className="text-slate-500 text-sm">{desc}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={700} title={null}>
      <div className="space-y-3">
        <div>
          <div className="text-lg font-medium">Select Priority</div>
          <div className="text-slate-500 text-sm">Choose priority for this load request</div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Option value="emergency" title="Emergency" desc="High priority, urgent delivery required" icon={<ExclamationCircleFilled />} highlight="border-red-500 bg-red-50" />
          <Option value="normal" title="Normal" desc="Standard priority, regular delivery schedule" icon={<ScheduleOutlined />} />
        </div>
        <div className="flex gap-3 mt-2">
          <Button onClick={onClose} className="w-1/2 bg-white text-black border-black">Cancel</Button>
          <Button
            type="primary"
            className="w-1/2"
            onClick={async () => {
              try {
                if (!requestId) return;
                await api.post(`/lsr/requests/${requestId}/submit`, { priority })
                onSubmitted?.()
              } catch {}
            }}
          >
            Submit Order
          </Button>
        </div>
      </div>
    </Modal>
  )
}


