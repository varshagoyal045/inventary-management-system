import React, { useEffect, useState } from 'react'
import { Search, Plus, Mail, Phone, MapPin, MoreVertical } from 'lucide-react'
import { getCustomers } from '../api'
import {
  Button,
  FormField,
  Modal,
  DataTable,
  Pagination,
  StatusBadge,
} from '../components/UI'
import { useToast } from '../App'

const mockCustomers = [
  {
    id: 1,
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1-555-0101',
    city: 'San Francisco',
    status: 'active',
    orders: 12,
    totalSpent: 45230,
  },
  {
    id: 2,
    name: 'TechStart Inc',
    email: 'sales@techstart.com',
    phone: '+1-555-0102',
    city: 'New York',
    status: 'active',
    orders: 8,
    totalSpent: 32450,
  },
  {
    id: 3,
    name: 'Global Tech Ltd',
    email: 'info@globaltech.com',
    phone: '+1-555-0103',
    city: 'London',
    status: 'active',
    orders: 15,
    totalSpent: 78900,
  },
  {
    id: 4,
    name: 'Smart Solutions',
    email: 'contact@smart-sol.com',
    phone: '+1-555-0104',
    city: 'Boston',
    status: 'inactive',
    orders: 3,
    totalSpent: 8920,
  },
]

export default function Customers() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
  })
  const showToast = useToast()
  const perPage = 10

  const filtered = customers.filter((c) => {
    const searchMatch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const statusMatch = filterStatus === 'all' || c.status === filterStatus
    return searchMatch && statusMatch
  })

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  )

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      showToast('Please fill in required fields', 'error')
      return
    }
    const customer = {
      id: Math.max(...customers.map((c) => c.id), 0) + 1,
      ...newCustomer,
      status: 'active',
      orders: 0,
      totalSpent: 0,
    }
    setCustomers([...customers, customer])
    setNewCustomer({ name: '', email: '', phone: '', city: '' })
    setShowAddModal(false)
    showToast('Customer added successfully', 'success')
  }

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      width: '250px',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.name}
          </p>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Mail size={14} />
              {row.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone size={14} />
              {row.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'city',
      label: 'Location',
      width: '120px',
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <MapPin size={16} />
          {row.city}
        </div>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      width: '80px',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.orders}
        </span>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      width: '120px',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          ${row.totalSpent.toLocaleString()}
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
      width: '50px',
      render: (row) => (
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <MoreVertical size={16} />
        </button>
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <p className="page-subtitle">
          Manage customer relationships and information
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
            placeholder="Search customers by name or email..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            Add Customer
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

      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setNewCustomer({ name: '', email: '', phone: '', city: '' })
        }}
        title="Add New Customer"
        size="md"
      >
        <FormField
          label="Company Name"
          placeholder="e.g., Acme Corporation"
          value={newCustomer.name}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, name: e.target.value })
          }
          required
        />
        <FormField
          label="Email"
          type="email"
          placeholder="contact@company.com"
          value={newCustomer.email}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, email: e.target.value })
          }
          required
        />
        <FormField
          label="Phone"
          placeholder="+1-555-0100"
          value={newCustomer.phone}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, phone: e.target.value })
          }
        />
        <FormField
          label="City"
          placeholder="San Francisco"
          value={newCustomer.city}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, city: e.target.value })
          }
        />
        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={() => setShowAddModal(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddCustomer}
            className="flex-1"
          >
            Add Customer
          </Button>
        </div>
      </Modal>
    </div>
  )
}