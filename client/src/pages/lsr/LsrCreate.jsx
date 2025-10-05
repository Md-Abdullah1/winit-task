import { useEffect, useMemo, useState } from 'react'
import { DatePicker, Segmented, Table, Button, Modal, Input, message, Form } from 'antd'
import { ShoppingCartOutlined, AppstoreOutlined, CloseOutlined, ExclamationCircleFilled, ScheduleOutlined } from '@ant-design/icons'
import api from '../../lib/api.js'

export default function LsrCreate() {
  const [date, setDate] = useState()
  const [tab, setTab] = useState('Commercial Items')
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [showCommercialModal, setShowCommercialModal] = useState(false)
  const [showPosmModal, setShowPosmModal] = useState(false)
  const [showPriorityModal, setShowPriorityModal] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [requestId, setRequestId] = useState(null)

  const productColumns = useMemo(() => [
    { title: 'SKU', dataIndex: 'sku' },
    { title: 'Product Name', dataIndex: 'name' },
    { title: 'UOM', dataIndex: 'uom' },
    { title: 'Pack', dataIndex: 'pack' },
    { title: 'MRP', dataIndex: 'mrp' },
    { title: 'Stock', dataIndex: 'stock' },
    { title: 'Reserved', dataIndex: 'reserved' },
    { title: 'Available', dataIndex: 'available' },
    { title: 'Avg Sales/Day', dataIndex: 'avg' },
  ], [])

  async function loadProducts() {
    try {
      setLoadingProducts(true)
      const res = await api.get('/products')
      const list = (res.data || []).map((p, idx) => ({
        key: p._id || String(idx),
        sku: p.sku,
        name: p.name,
        category: p.category,
        brand: p.brand,
        uom: p.uom,
        pack: p.pack,
        mrp: p.mrp,
        stock: p.stock,
        reserved: p.reserved,
        available: p.available,
        avg: p.avg,
      }))
      setProducts(list)
    } finally {
      setLoadingProducts(false)
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

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div className="space-y-4 lsr-table-container">
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
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={() => setShowAddProduct(true)}>Add Product</Button>
        </div>
      </div>

      {products?.length ? (
        <div className="overflow-x-auto">
          <Table columns={productColumns} loading={loadingProducts} dataSource={products} pagination={false} size="small" className="bg-white" />
        </div>
      ) : (
        <div className="bg-white border rounded p-4 text-center">
          <div className="text-slate-600 mb-2">No products found</div>
          <Button type="primary" onClick={() => setShowAddProduct(true)}>Add Product</Button>
        </div>
      )}

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

      <AddCommercialModal products={products} requestId={requestId} open={showCommercialModal} onClose={() => setShowCommercialModal(false)} />
      <AddPosmModal products={products} requestId={requestId} open={showPosmModal} onClose={() => setShowPosmModal(false)} onAdded={() => { setShowPosmModal(false); setShowPriorityModal(true) }} />
      <PriorityModal requestId={requestId} onClose={() => setShowPriorityModal(false)} onSubmitted={() => { setShowPriorityModal(false); message.success('Request submitted'); }} open={showPriorityModal} />
      <AddProductModal open={showAddProduct} onClose={() => setShowAddProduct(false)} onCreated={async () => { await loadProducts(); setShowAddProduct(false) }} />
    </div>
  )
}

function AddCommercialModal({ open, onClose, requestId, products }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [search, setSearch] = useState('')
  const [customer, setCustomer] = useState('')
  const [qtyByKey, setQtyByKey] = useState({})
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
    { title: 'Order Qty', dataIndex: 'qty', render: (_, r) => (
      <Input
        size="small"
        type="number"
        className="w-20"
        value={qtyByKey[r.key] ?? 1}
        onChange={(e) => setQtyByKey(prev => ({ ...prev, [r.key]: Number(e.target.value || 1) }))}
      />
    ) },
  ]

  const dataPosm = useMemo(() => (products || []).filter(r => !search || (r.sku || '').toLowerCase().includes(search.toLowerCase()) || (r.name || '').toLowerCase().includes(search.toLowerCase())), [products, search])

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
          <Input placeholder="Customer (optional)" value={customer} onChange={e => setCustomer(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <Table
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            columns={columns}
            dataSource={dataPosm}
            size="small"
            scroll={{ x: true }}
          />
        </div>
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
                  const selected = dataPosm.filter(d => selectedRowKeys.includes(d.key))
                  await Promise.all(selected.map((row) => api.post(`/lsr/requests/${requestId}/items`, {
                    type: 'commercial',
                    sku: row.sku,
                    name: row.name,
                    category: row.category,
                    brand: row.brand,
                    uom: row.uom,
                    pack: row.pack,
                    mrp: row.mrp,
                    stock: row.stock,
                    reserved: row.reserved,
                    available: row.available,
                    avg: row.avg,
                    orderQty: qtyByKey[row.key] ?? 1,
                    customer: customer || undefined,
                  })))
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

function AddPosmModal({ open, onClose, onAdded, requestId, products }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [search, setSearch] = useState('')
  const [customer, setCustomer] = useState('')
  const [qtyByKey, setQtyByKey] = useState({})
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
    { title: 'Order Qty', dataIndex: 'qty', render: (_, r) => (
      <Input
        size="small"
        type="number"
        className="w-20"
        value={qtyByKey[r.key] ?? 1}
        onChange={(e) => setQtyByKey(prev => ({ ...prev, [r.key]: Number(e.target.value || 1) }))}
      />
    ) },
  ]

  const data = useMemo(() => (products || []).filter(r => !search || (r.sku || '').toLowerCase().includes(search.toLowerCase()) || (r.name || '').toLowerCase().includes(search.toLowerCase())), [products, search])

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
          <Input placeholder="Customer (optional)" value={customer} onChange={e => setCustomer(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <Table
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            columns={columns}
            dataSource={data}
            size="small"
            scroll={{ x: true }}
          />
        </div>
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
                  const selected = data.filter(d => selectedRowKeys.includes(d.key))
                  await Promise.all(selected.map((row) => api.post(`/lsr/requests/${requestId}/items`, {
                    type: 'posm',
                    sku: row.sku,
                    name: row.name,
                    category: row.category,
                    brand: row.brand,
                    uom: row.uom,
                    pack: row.pack,
                    mrp: row.mrp,
                    stock: row.stock,
                    reserved: row.reserved,
                    available: row.available,
                    avg: row.avg,
                    orderQty: qtyByKey[row.key] ?? 1,
                    customer: customer || undefined,
                  })))
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


function AddProductModal({ open, onClose, onCreated }) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  async function handleSubmit() {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      await api.post('/products', values)
      message.success('Product created')
      onCreated?.()
    } catch {
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <Modal open={open} onCancel={onClose} onOk={handleSubmit} okButtonProps={{ loading: submitting }} title="Add Product">
      <Form form={form} layout="vertical">
        <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>
          <Form.Item name="brand" label="Brand">
            <Input />
          </Form.Item>
          <Form.Item name="uom" label="UOM">
            <Input />
          </Form.Item>
          <Form.Item name="pack" label="Pack">
            <Input />
          </Form.Item>
          <Form.Item name="mrp" label="MRP">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="stock" label="Stock">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="reserved" label="Reserved">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="available" label="Available">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="avg" label="Avg Sales/Day">
            <Input type="number" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

