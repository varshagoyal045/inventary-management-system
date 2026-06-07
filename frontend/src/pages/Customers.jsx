import React, { useEffect, useState } from 'react'
import { Search, Plus, Mail, Phone, MapPin, MoreVertical, Users } from 'lucide-react'
import { getCustomers, createCustomer } from '../api'
import { Button, FormField, Modal, DataTable, Pagination, StatusBadge } from '../components/UI'
import { useToast } from '../App'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
  })
  const showToast = useToast()
  const perPage = 10

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const res = await getCustomers()
      console.log('First customer:', JSON.stringify(res.data?.[0], null, 2))
      setCustomers(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Failed to load customers:', err)
      showToast('Failed to load customers', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCustomers() }, [])

  const filtered = customers.filter((c) => {
    // safe: use full_name with fallback
    const name = c.full_name ?? c.name ?? ''
    const email = c.email ?? ''
    const searchMatch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    const statusMatch = filterStatus === 'all' || c.status === filterStatus
    return searchMatch && statusMatch
  })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const handleAddCustomer = async () => {
    if (!newCustomer.full_name || !newCustomer.email) {
      showToast('Please fill in required fields', 'error')
      return
    }
    setLoading(true)
    try {
      await createCustomer(newCustomer)
      await fetchCustomers()
      setNewCustomer({ full_name: '', email: '', phone: '', city: '' })
      setShowAddModal(false)
      showToast('Customer added successfully', 'success')
    } catch (err) {
      const detail = err.response?.data?.detail
      showToast(typeof detail === 'string' ? detail : 'Failed to add customer', 'error')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'full_name',
      label: 'Customer',
      width: '250px',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.full_name ?? row.name ?? '—'}
          </p>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Mail size={14} />
              {row.email ?? '—'}
            </span>
            {row.phone && (
              <span className="flex items-center gap-1">
                <Phone size={14} />
                {row.phone}
              </span>
            )}
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
          {row.city ?? '—'}
        </div>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      width: '80px',
      // orders count — backend may return this as orders array or a count field
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {Array.isArray(row.orders) ? row.orders.length : (row.orders ?? row.order_count ?? '—')}
        </span>
      ),
    },
    {
      key: 'total_spent',
      label: 'Total Spent',
      width: '120px',
      // safe: handle both totalSpent and total_spent, and undefined
      render: (row) => {
        const amount = row.total_spent ?? row.totalSpent ?? null
        return (
          <span className="font-medium text-gray-900 dark:text-white">
            {amount != null ? `$${Number(amount).toLocaleString()}` : '—'}
          </span>
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (row) => row.status ? <StatusBadge status={row.status} /> : <span className="text-gray-400">—</span>,
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
        <p className="page-subtitle">Manage customer relationships and information</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Customer
          </Button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {!loading && paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Users size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No customers found</p>
            <p className="text-sm mt-1">
              {search || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Click "Add Customer" to get started'}
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={paginated} loading={loading} />
        )}
        <div className="px-6 border-t border-gray-200 dark:border-gray-800">
          <Pagination page={page} total={filtered.length} perPage={perPage} onPageChange={setPage} />
        </div>
      </div>

      <Modal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setNewCustomer({ full_name: '', email: '', phone: '', city: '' }) }}
        title="Add New Customer"
        size="md"
      >
        <FormField
          label="Full Name"
          placeholder="e.g., John Smith"
          value={newCustomer.full_name}
          onChange={(e) => setNewCustomer({ ...newCustomer, full_name: e.target.value })}
          required
        />
        <FormField
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={newCustomer.email}
          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          required
        />
        <FormField
          label="Phone"
          placeholder="+91-9876543210"
          value={newCustomer.phone}
          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
        />
        <FormField
          label="City"
          placeholder="Delhi"
          value={newCustomer.city}
          onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
        />
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCustomer} className="flex-1">
            Add Customer
          </Button>
        </div>
      </Modal>
    </div>
  )
}