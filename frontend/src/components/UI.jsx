import React from 'react'
import {
  X,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null

  const sizeClass = {
    sm: 'w-96',
    md: 'w-[600px]',
    lg: 'w-[800px]',
  }[size]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`card max-h-[90vh] overflow-auto ${sizeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function FormField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  children,
  ...props
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          className="input"
          value={value}
          onChange={onChange}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      )}
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  ...props
}) {
  const sizeClass = {
    sm: 'btn-sm',
    md: 'btn',
    lg: 'btn-lg',
  }[size]

  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant]

  return (
    <button
      className={`${sizeClass} ${variantClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? '⏳ ' : ''}
      {children}
    </button>
  )
}

export function Badge({ children, variant = 'info' }) {
  const variantClass = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
  }[variant]

  return <span className={`badge ${variantClass}`}>{children}</span>
}

export function StatusBadge({ status }) {
  const map = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'danger', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    completed: { variant: 'success', label: 'Completed' },
    in_progress: { variant: 'info', label: 'In Progress' },
    low_stock: { variant: 'danger', label: 'Low Stock' },
  }

  const config = map[status] || { variant: 'info', label: status }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function Pagination({ page, total, perPage, onPageChange }) {
  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="flex items-center justify-between py-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Page {page} of {totalPages} • {total} total results
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="btn-secondary btn-sm disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          const pageNum = Math.max(1, page - 2) + i
          if (pageNum > totalPages) return null
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`btn btn-sm ${
                pageNum === page
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {pageNum}
            </button>
          )
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="btn-secondary btn-sm disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export function DataTable({ columns, data, loading, onRowClick }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400">
          Loading data...
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className="table-row"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function KPICard({ icon: Icon, label, value, change, trend }) {
  const isPositive = trend === 'up'

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {label}
          </p>
          <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <p
              className={`text-sm mt-2 flex items-center gap-1 ${
                isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isPositive ? '↑' : '↓'} {change}% from last period
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
          <Icon size={24} className="text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>
      {action && action}
    </div>
  )
}
