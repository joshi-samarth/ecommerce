import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useOrders from '../../hooks/useOrders'
import OrderCard from '../../components/orders/OrderCard'
import { Loader2 } from 'lucide-react'

const OrdersTab = () => {
  const navigate = useNavigate()
  const {
    orders,
    pagination,
    loading,
    filters,
    fetchOrders,
    updateFilter,
    changePage
  } = useOrders()

  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const statusFilter = activeFilter === 'all' ? '' : activeFilter
    fetchOrders({
      status: statusFilter === 'all' ? '' : statusFilter,
      page: 1
    })
  }, [])

  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter)
    const statusFilter = newFilter === 'all' ? '' : newFilter
    updateFilter('status', statusFilter)
    fetchOrders({ status: statusFilter, page: 1 })
  }

  const getEmptyMessage = () => {
    switch (activeFilter) {
      case 'placed':
      case 'confirmed':
      case 'processing':
      case 'shipped':
        return 'No active orders'
      case 'delivered':
        return 'No delivered orders yet'
      case 'cancelled':
        return 'No cancelled orders'
      default:
        return 'No orders yet. Start shopping!'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b">
        {[
          { key: 'all', label: 'All' },
          { key: 'placed', label: 'Active' },
          { key: 'delivered', label: 'Delivered' },
          { key: 'cancelled', label: 'Cancelled' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
            className={`px-4 py-2 font-medium whitespace-nowrap border-b-2 transition-colors ${activeFilter === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="space-y-4 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      )}

      {/* Orders List */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard
              key={order._id}
              order={order}
              onClick={() => navigate(`/account/orders/${order._id}`)}
            />
          ))}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => changePage(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`px-3 py-2 rounded-lg ${pagination.page === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => changePage(Math.min(pagination.pages, pagination.page + 1))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">{getEmptyMessage()}</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  )
}

export default OrdersTab
