import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { KPICard, StatusBadge } from '../components/UI'
import { getDashboard } from '../api'

const mockOrderData = [
  { month: 'Jan', orders: 400, revenue: 2400 },
  { month: 'Feb', orders: 320, revenue: 2210 },
  { month: 'Mar', orders: 520, revenue: 2290 },
  { month: 'Apr', orders: 780, revenue: 3908 },
  { month: 'May', orders: 690, revenue: 4800 },
  { month: 'Jun', orders: 890, revenue: 3800 },
]

const mockInventoryData = [
  { product: 'Laptop', stock: 45, capacity: 100 },
  { product: 'Mouse', stock: 234, capacity: 500 },
  { product: 'Keyboard', stock: 89, capacity: 200 },
  { product: 'Monitor', stock: 12, capacity: 50 },
  { product: 'USB Cable', stock: 560, capacity: 1000 },
]

const mockLowStockProducts = [
  {
    id: 1,
    name: '27" Ultra HD Monitor',
    sku: 'MON-27-UHD',
    current: 12,
    threshold: 25,
  },
  {
    id: 2,
    name: 'Wireless Mouse Pro',
    sku: 'MOU-WIR-PRO',
    current: 8,
    threshold: 20,
  },
  {
    id: 3,
    name: 'USB-C Hub',
    sku: 'HUB-USB-C',
    current: 5,
    threshold: 15,
  },
]

const mockRecentOrders = [
  {
    id: 'ORD-001',
    customer: 'Acme Corporation',
    amount: '$2,450.00',
    status: 'completed',
    date: '2 hours ago',
  },
  {
    id: 'ORD-002',
    customer: 'TechStart Inc',
    amount: '$1,890.00',
    status: 'in_progress',
    date: '4 hours ago',
  },
  {
    id: 'ORD-003',
    customer: 'Global Tech Ltd',
    amount: '$3,200.00',
    status: 'completed',
    date: '1 day ago',
  },
  {
    id: 'ORD-004',
    customer: 'Smart Solutions',
    amount: '$890.50',
    status: 'pending',
    date: '2 days ago',
  },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then((r) => setData(r.data))
      .catch(() => {
        // Use mock data on error
        setData({
          total_products: 1247,
          total_customers: 346,
          total_orders: 5432,
          total_revenue: 125643,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          icon={Package}
          label="Total Products"
          value={data?.total_products || 1247}
          change={12}
          trend="up"
        />
        <KPICard
          icon={Users}
          label="Total Customers"
          value={data?.total_customers || 346}
          change={8}
          trend="up"
        />
        <KPICard
          icon={ShoppingCart}
          label="Total Orders"
          value={data?.total_orders || 5432}
          change={23}
          trend="up"
        />
        <KPICard
          icon={TrendingUp}
          label="Total Revenue"
          value={`$${(data?.total_revenue || 125643).toLocaleString()}`}
          change={15}
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Trends */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Order & Revenue Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockOrderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Orders"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Levels */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Top Products by Stock
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockInventoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="product" type="category" stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="stock" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" />
              Low Stock Alerts
            </h2>
            <a
              href="/products"
              className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </a>
          </div>
          <div className="space-y-4">
            {mockLowStockProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {product.sku}
                    </p>
                  </div>
                  <StatusBadge status="low_stock" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Current: {product.current} | Threshold: {product.threshold}
                  </span>
                  <div className="w-20 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${(product.current / product.threshold) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <a
              href="/orders"
              className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </a>
          </div>
          <div className="space-y-3">
            {mockRecentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {order.id}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {order.customer}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {order.amount}
                  </p>
                  <div className="flex items-center gap-2 mt-1 justify-end">
                    <StatusBadge status={order.status} />
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {order.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}