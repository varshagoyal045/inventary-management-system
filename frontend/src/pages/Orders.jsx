import React, { useEffect, useState } from 'react'
import { Search, Plus, Eye, EyeOff, Trash2, ShoppingCart } from 'lucide-react'
import { getOrders, deleteOrder, createOrder, getCustomers, getProducts } from '../api'
import { Button, DataTable, Pagination, StatusBadge } from '../components/UI'
import { useToast } from '../App'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const showToast = useToast()
  const perPage = 10

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await getOrders()
      console.log('Orders response:', res)
      setOrders(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Failed to load orders:', err)
      showToast('Failed to load orders', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const filtered = orders.filter((o) => {
    // customer is an object: { id, full_name, email, ... }
    const customerName = o.customer?.full_name ?? ''
    const searchMatch =
      String(o.id).toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase())
    const statusMatch = filterStatus === 'all' || o.status === filterStatus
    return searchMatch && statusMatch
  })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      await deleteOrder(id)
      await fetchOrders()
      showToast('Order cancelled', 'success')
    } catch {
      showToast('Failed to cancel order', 'error')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      width: '120px',
      render: (row) => (
        <span className="font-medium text-primary-600 dark:text-primary-400">
          #{row.id}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      width: '220px',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.customer?.full_name ?? '—'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {row.customer?.email ?? ''}
          </p>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      width: '80px',
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300">
          {row.items?.length ?? 0}
        </span>
      ),
    },
    {
      key: 'total_amount',
      label: 'Amount',
      width: '120px',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${(row.total_amount ?? 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      width: '120px',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      label: '',
      width: '120px',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => setExpandedOrder(expandedOrder === row.id ? null : row.id)}
            className="btn-ghost btn-sm"
          >
            {expandedOrder === row.id ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button onClick={() => handleDelete(row.id)} className="btn-danger btn-sm">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  const expandedOrderData = orders.find((o) => o.id === expandedOrder)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">Track and manage customer orders</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Order
          </Button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {!loading && paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <ShoppingCart size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              No orders found
            </p>
            <p className="text-sm mt-1">
              {search || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Click "New Order" to create your first order'}
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={paginated} loading={loading} />
        )}
        <div className="px-6 border-t border-gray-200 dark:border-gray-800">
          <Pagination
            page={page}
            total={filtered.length}
            perPage={perPage}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Expanded Order Details */}
      {expandedOrder && expandedOrderData && (
        <div className="mt-6 card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Order Details
          </h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                #{expandedOrderData.id}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {expandedOrderData.customer?.full_name ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                ${(expandedOrderData.total_amount ?? 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <div className="mt-1">
                <StatusBadge status={expandedOrderData.status} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-center">Quantity</th>
                  <th className="px-4 py-2 text-right">Unit Price</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {expandedOrderData.items?.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="px-4 py-2">{item.product?.name ?? '—'}</td>
                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">
                      ${(item.unit_price ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold">
                      ${((item.unit_price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <AddOrderModal
          onClose={() => setShowModal(false)}
          onCreated={() => { fetchOrders(); setShowModal(false) }}
          showToast={showToast}
        />
      )}
    </div>
  )
}

// ── Add Order Modal ──────────────────────────────────────────────
function AddOrderModal({ onClose, onCreated, showToast }) {
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([getCustomers(), getProducts()])
      .then(([c, p]) => {
        setCustomers(Array.isArray(c.data) ? c.data : [])
        setProducts(Array.isArray(p.data) ? p.data : [])
      })
      .catch(() => showToast('Failed to load form data', 'error'))
  }, [])

  const updateItem = (index, field, value) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const getProduct = (product_id) =>
    products.find((p) => String(p.id) === String(product_id))

  // preview total (backend will recalculate from product.price)
  const total = items.reduce((sum, i) => {
    const p = getProduct(i.product_id)
    return sum + (p ? p.price * Number(i.quantity) : 0)
  }, 0)

  const handleSubmit = async () => {
    if (!customerId) return showToast('Please select a customer', 'error')
    if (items.some((i) => !i.product_id))
      return showToast('Please select a product for each item', 'error')
    if (items.some((i) => Number(i.quantity) < 1))
      return showToast('Quantity must be at least 1', 'error')

    setSubmitting(true)
    try {
      await createOrder({
        customer_id: Number(customerId),
        items: items.map((i) => ({
          product_id: Number(i.product_id),
          quantity: Number(i.quantity),
        })),
      })
      showToast('Order created successfully', 'success')
      onCreated()
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
          ? detail.map((d) => d.msg).join(', ')
          : 'Failed to create order'
      showToast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Customer
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="input w-full"
            >
              <option value="">— select customer —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Order Items
            </label>
            <div className="space-y-2">
              {items.map((item, index) => {
                const prod = getProduct(item.product_id)
                return (
                  <div key={index} className="grid grid-cols-[1fr_80px_32px] gap-2 items-center">
                    <select
                      value={item.product_id}
                      onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                      className="input text-sm"
                    >
                      <option value="">— product —</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (${p.price} · stock: {p.quantity})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      max={prod?.quantity ?? 9999}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      className="input text-sm text-center"
                      placeholder="Qty"
                    />
                    <button
                      onClick={() => setItems(items.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-red-500 p-1"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => setItems([...items, { product_id: '', quantity: 1 }])}
              className="mt-2 w-full border border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              + Add item
            </button>
          </div>

          <div className="text-right text-sm text-gray-500 dark:text-gray-400 pt-1">
            Estimated total:{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Order'}
          </Button>
        </div>
      </div>
    </div>
  )
}