import React, { useEffect, useState } from 'react'
import {
  Search,
  Plus,
  Download,
  Filter,
  Image as ImageIcon,
  MoreVertical,
  Edit,
  Trash2,
  X,
} from 'lucide-react'
import { getProducts, createProduct, deleteProduct } from '../api'
import {
  Button,
  FormField,
  Modal,
  DataTable,
  Pagination,
  StatusBadge,
  Badge,
  EmptyState,
} from '../components/UI'
import { useToast } from '../App'

// products are loaded from backend

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: '',
  })
  const showToast = useToast()
  const perPage = 10

  useEffect(() => {
    let mounted = true
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await getProducts()
        console.log('Products response:', res)
        if (mounted) setProducts(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error('Failed to load products:', err)
        showToast('Failed to load products', 'error')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchProducts()
    return () => {
      mounted = false
    }
  }, [])

  // Filter and search products
  const filtered = products.filter((p) => {
    const searchMatch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const statusMatch = filterStatus === 'all' || p.status === filterStatus
    const categoryMatch =
      filterCategory === 'all' || p.category === filterCategory
    return searchMatch && statusMatch && categoryMatch
  })

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  )

  const categories = ['Electronics', 'Accessories', 'Storage']

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === paginated.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(paginated.map((p) => p.id))
    }
  }

  const handleAddProduct = () => {
    console.log('handleAddProduct called', newProduct)
    if (!newProduct.name || !newProduct.sku) {
      showToast('Please fill in all required fields', 'error')
      return
    }
    ;(async () => {
      setLoading(true)
      try {
        const payload = {
          ...newProduct,
          price: parseFloat(newProduct.price || 0),
          quantity: parseInt(newProduct.quantity || 0, 10),
        }
        await createProduct(payload)
        const res = await getProducts()
        setProducts(Array.isArray(res.data) ? res.data : [])
        setNewProduct({ name: '', sku: '', category: '', price: '', quantity: '' })
        setShowAddModal(false)
        showToast('Product added successfully', 'success')
      } catch (err) {
        showToast('Failed to add product', 'error')
      } finally {
        setLoading(false)
      }
    })()
  }

  const handleDeleteSelected = () => {
    ;(async () => {
      setLoading(true)
      try {
        await Promise.all(selectedProducts.map((id) => deleteProduct(id)))
        const res = await getProducts()
        setProducts(Array.isArray(res.data) ? res.data : [])
        setSelectedProducts([])
        showToast(`${selectedProducts.length} products deleted`, 'success')
      } catch (err) {
        showToast('Failed to delete products', 'error')
      } finally {
        setLoading(false)
      }
    })()
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status']
    const csv = [
      headers.join(','),
      ...filtered.map((p) =>
        [
          p.id,
          `"${p.name}"`,
          p.sku,
          p.category,
          p.price,
          p.quantity,
          p.status,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    showToast('CSV exported successfully', 'success')
  }

  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={selectedProducts.length === paginated.length && paginated.length > 0}
          onChange={handleSelectAll}
          className="rounded border-gray-300"
        />
      ),
      width: '50px',
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(row.id)}
          onChange={() => handleSelectProduct(row.id)}
          className="rounded border-gray-300"
        />
      ),
    },
    {
      key: 'product',
      label: 'Product',
      width: '300px',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={row.image}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {row.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {row.sku}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      width: '120px',
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300">{row.category}</span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      width: '100px',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          ${row.price.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'quantity',
      label: 'Stock',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {row.quantity}
          </span>
          {row.quantity < 20 && row.quantity > 0 && (
            <Badge variant="warning">Low</Badge>
          )}
          {row.quantity === 0 && (
            <Badge variant="danger">Out</Badge>
          )}
        </div>
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
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">
          Manage your inventory and product catalog
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleExportCSV}
            >
              <Download size={18} />
              Export
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} />
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setPage(1)
            }}
            className="input sm:w-40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="low_stock">Low Stock</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value)
              setPage(1)
            }}
            className="input sm:w-40"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              {selectedProducts.length} selected
            </span>
            <button
              onClick={handleDeleteSelected}
              className="btn-danger btn-sm"
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Table */}
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

      {/* Add Product Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setNewProduct({ name: '', sku: '', category: '', price: '', quantity: '' })
        }}
        title="Add New Product"
        size="md"
      >
        <FormField
          label="Product Name"
          placeholder='e.g., 27" Ultra HD Monitor'
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          required
        />
        <FormField
          label="SKU"
          placeholder="e.g., MON-27-UHD"
          value={newProduct.sku}
          onChange={(e) =>
            setNewProduct({ ...newProduct, sku: e.target.value })
          }
          required
        />
        <FormField
          label="Category"
          type="select"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Price"
            type="number"
            placeholder="0.00"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            required
          />
          <FormField
            label="Stock"
            type="number"
            placeholder="0"
            value={newProduct.quantity}
            onChange={(e) =>
              setNewProduct({ ...newProduct, quantity: e.target.value })
            }
            required
          />
        </div>
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
            onClick={handleAddProduct}
            className="flex-1"
          >
            Add Product
          </Button>
        </div>
      </Modal>
    </div>
  )
}