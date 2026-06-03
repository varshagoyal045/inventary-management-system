import React, { useEffect, useState } from 'react'
import { Search, Plus, Eye, EyeOff, Trash2 } from 'lucide-react'
import { getOrders } from '../api'
import {
  Button,
  DataTable,
  Pagination,
  StatusBadge,
} from '../components/UI'
import { useToast } from '../App'

const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'Acme Corporation',
    email: 'contact@acme.com',
    amount: 2450.0,
    items: 5,
    status: 'completed',
    date: '2024-06-01',
  },
  {
    id: 'ORD-002',
    customer: 'TechStart Inc',
    email: 'sales@techstart.com',
    amount: 1890.0,
    items: 3,
    status: 'in_progress',
    date: '2024-06-02',
  },
  {
    id: 'ORD-003',
    customer: 'Global Tech Ltd',
    email: 'info@globaltech.com',
    amount: 3200.0,
    items: 8,
    status: 'completed',
    date: '2024-06-03',
  },
  {
    id: 'ORD-004',
    customer: 'Smart Solutions',
    email: 'contact@smart-sol.com',
    amount: 890.5,
    items: 2,
    status: 'pending',
    date: '2024-06-04',
  },
]

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const showToast = useToast()
  const perPage = 10

  const filtered = orders.filter((o) => {
    const searchMatch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
    const statusMatch = filterStatus === 'all' || o.status === filterStatus
    return searchMatch && statusMatch
  })

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  )

  const handleDelete = (id) => {
    setOrders(orders.filter((o) => o.id !== id))
    showToast('Order cancelled', 'success')
  }

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      width: '120px',
      render: (row) => (
        <span className="font-medium text-primary-600 dark:text-primary-400">
          {row.id}
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
            {row.customer}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {row.email}
          </p>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      width: '80px',
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300">{row.items}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '120px',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      width: '120px',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {new Date(row.date).toLocaleDateString()}
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
            onClick={() =>
              setExpandedOrder(
                expandedOrder === row.id ? null : row.id
              )
            }
            className="btn-ghost btn-sm"
          >
            {expandedOrder === row.id ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="btn-danger btn-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">
          Track and manage customer orders
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search orders by ID or customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setPage(1)
            }}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <Button
            variant="primary"
            onClick={() => showToast('Feature coming soon', 'info')}
          >
            <Plus size={18} />
            New Order
          </Button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable
          columns={columns}
          data={paginated}
          loading={loading}
        />
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
      {expandedOrder && (
        <div className="mt-6 card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Order Details
          </h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order ID
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {expandedOrder}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Amount
              </p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                ${
                  orders
                    .find((o) => o.id === expandedOrder)
                    ?.amount.toFixed(2) || '0.00'
                }
              </p>
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
                <tr className="table-row">
                  <td className="px-4 py-2">Product Name</td>
                  <td className="px-4 py-2 text-center">2</td>
                  <td className="px-4 py-2 text-right">$100.00</td>
                  <td className="px-4 py-2 text-right font-semibold">
                    $200.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}