import React from 'react'
import { ChevronRight } from 'lucide-react'

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

const OrderCard = ({ order, onClick }) => {
  const itemCount = order.items ? order.items.length : 0
  const firstItemName = order.items && order.items[0] ? order.items[0].name : 'N/A'

  return (
    <div
      onClick={onClick}
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-lg">{order.orderNumber}</p>
          <p className="text-sm text-gray-600">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {/* Status Badges */}
        <div className="flex gap-2 flex-wrap">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getPaymentColor(
              order.paymentStatus
            )}`}
          >
            {order.paymentStatus}
          </span>
        </div>

        {/* Items Info */}
        <div className="text-sm text-gray-600">
          <p>
            {itemCount} item{itemCount !== 1 ? 's' : ''} • {firstItemName}
            {itemCount > 1 && ` +${itemCount - 1} more`}
          </p>
        </div>

        {/* Total and Button */}
        <div className="flex items-center justify-between pt-2 border-t">
          <p className="font-bold text-lg">
            ₹{order.total.toLocaleString('en-IN')}
          </p>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderCard
