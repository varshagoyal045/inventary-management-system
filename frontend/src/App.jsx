import React, { useState, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import ErrorBoundary from './components/ErrorBoundary'

// Toast context
export const ToastCtx = createContext(null)
export const useToast = () => useContext(ToastCtx)

function Toast({ msg, type, onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
        ? 'bg-red-500'
        : 'bg-blue-500'

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in`}
    >
      {msg}
    </div>
  )
}

const NAVIGATION = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
]

function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 z-40 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                Inventory
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pro</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {NAVIGATION.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Inventory Pro v1.0.0
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Enterprise Edition
          </div>
        </div>
      </aside>
    </>
  )
}

function Header({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Settings size={20} />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Admin User
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    admin@example.com
                  </p>
                </div>
                <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default function App() {
  const [toast, setToast] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const showToast = (msg, type = 'success') =>
    setToast({ msg, type })

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <ToastCtx.Provider value={showToast}>
      <BrowserRouter>
        <div className="flex bg-white dark:bg-gray-950">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="flex-1 lg:ml-64">
            <Header
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
            <main className="mt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/orders" element={<Orders />} />
                </Routes>
              </ErrorBoundary>
            </main>
          </div>
        </div>

        {toast && (
          <Toast
            msg={toast.msg}
            type={toast.type}
            onDone={() => setToast(null)}
          />
        )}
      </BrowserRouter>
    </ToastCtx.Provider>
  )
}