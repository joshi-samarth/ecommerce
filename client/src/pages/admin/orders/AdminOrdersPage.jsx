import React, { useState, useEffect } from 'react'
import axios from '../../../api/axios'
import { Loader2, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import OrderTable from '../../../components/admin/orders/OrderTable'

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    status: '',
    payment: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 20
  })

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [])

  const fetchOrders = async (customFilters = {}) => {
    try {
      setLoading(true)
      const params = { ...filters, ...customFilters }

      const response = await axios.get('/api/admin/orders', { params })

      if (response.data.success) {
        setOrders(response.data.data)
        setPagination(response.data.pagination)
      } else {
        toast.error(response.data.message || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Fetch orders error:', error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/orders/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error.response?.data || error.message)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 }
    setFilters(newFilters)
    fetchOrders(newFilters)
  }

  const handleStatusChange = () => {
    fetchOrders()
    fetchStats()
  }

  const handleExportCSV = () => {
    if (!orders.length) {
      toast.error('No orders to export')
      return
    }

    const headers = ['Order Number', 'Customer', 'Email', 'Items', 'Subtotal', 'Discount', 'Shipping', 'Total', 'Status', 'Payment', 'Date']
    const rows = orders.map(order => [
      order.orderNumber,
      order.user?.name || '',
      order.user?.email || '',
      order.items?.length || 0,
      order.subtotal || 0,
      order.discount || 0,
      order.shippingCharge || 0,
      order.total || 0,
      order.orderStatus,
      order.paymentStatus,
      new Date(order.createdAt).toLocaleDateString('en-IN')
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    toast.success('Orders exported')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Order Management</h1>
          <p className="text-gray-600">Manage all customer orders</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 btn btn-primary"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-gray-600 text-sm">Today Orders</p>
            <p className="text-2xl font-bold">{stats.ordersToday}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-gray-600 text-sm">Today Revenue</p>
            <p className="text-2xl font-bold">₹{stats.revenueToday?.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-gray-600 text-sm">Avg Order Value</p>
            <p className="text-2xl font-bold">₹{stats.averageOrderValue?.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-gray-600 text-sm">Pending Orders</p>
            <p className="text-2xl font-bold">{stats.ordersByStatus?.pending || 0}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border space-y-4">
        <h3 className="font-semibold">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search order..."
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filters.status}
            onChange={e => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filters.payment}
            onChange={e => handleFilterChange('payment', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <input
            type="date"
            value={filters.dateFrom}
            onChange={e => handleFilterChange('dateFrom', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={filters.dateTo}
            onChange={e => handleFilterChange('dateTo', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        ) : (
          <>
            <OrderTable
              orders={orders}
              onStatusChange={handleStatusChange}
              loading={loading}
            />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t">
                <button
                  onClick={() => handleFilterChange('page', Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handleFilterChange('page', page)}
                    className={`px-3 py-2 rounded-lg ${pagination.page === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handleFilterChange('page', Math.min(pagination.pages, pagination.page + 1))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminOrdersPage
