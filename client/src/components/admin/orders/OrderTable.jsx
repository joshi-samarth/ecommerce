import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import OrderStatusSelect from './OrderStatusSelect'

const getStatusColor = (status) => {
  switch (status) {
    case 'placed':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-purple-100 text-purple-800'
    case 'shipped':
      return 'bg-cyan-100 text-cyan-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentColor = (status) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'refunded':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const OrderTable = ({ orders, onStatusChange, loading }) => {
  const navigate = useNavigate()

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No orders found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-3 text-left font-semibold">Order</th>
            <th className="px-4 py-3 text-left font-semibold">Customer</th>
            <th className="px-4 py-3 text-left font-semibold">Items</th>
            <th className="px-4 py-3 text-right font-semibold">Total</th>
            <th className="px-4 py-3 text-left font-semibold">Payment</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Date</th>
            <th className="px-4 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-bold text-blue-600">{order.orderNumber}</p>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{order.user?.name || 'N/A'}</p>
                <p className="text-xs text-gray-600">{order.user?.email || ''}</p>
              </td>
              <td className="px-4 py-3">
                <p>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                {order.items?.[0] && (
                  <p className="text-xs text-gray-600">{order.items[0].name}</p>
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold">
                ₹{order.total?.toLocaleString('en-IN') || 0}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPaymentColor(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus}
                </span>
              </td>
              <td className="px-4 py-3">
                <OrderStatusSelect
                  orderId={order._id}
                  currentStatus={order.orderStatus}
                  onStatusChange={() => onStatusChange(order._id)}
                />
              </td>
              <td className="px-4 py-3 text-xs text-gray-600">
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-xs font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderTable
