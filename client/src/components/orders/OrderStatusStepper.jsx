import React from 'react'
import { Check, X, ArrowRight } from 'lucide-react'

const OrderStatusStepper = ({ currentStatus, statusHistory }) => {
  const statuses = [
    { key: 'placed', label: 'Placed', icon: '🛒' },
    { key: 'confirmed', label: 'Confirmed', icon: '✓' },
    { key: 'processing', label: 'Processing', icon: '📦' },
    { key: 'shipped', label: 'Shipped', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '🏠' }
  ]

  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-300 rounded-lg p-6 text-center">
        <X className="w-12 h-12 text-red-600 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-red-700">Order Cancelled</h3>
        <p className="text-red-600 mt-2">
          {statusHistory.find(s => s.status === 'cancelled')?.note || 'This order has been cancelled'}
        </p>
      </div>
    )
  }

  if (currentStatus === 'returned') {
    return (
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 text-center">
        <p className="text-lg font-bold text-yellow-700">Order Returned</p>
      </div>
    )
  }

  const currentIndex = statuses.findIndex(s => s.key === currentStatus)

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="font-semibold mb-6">Order Status</h3>

      <div className="flex items-center justify-between overflow-x-auto pb-4">
        {statuses.map((status, idx) => {
          const isCompleted = idx < currentIndex
          const isCurrent = idx === currentIndex

          return (
            <React.Fragment key={status.key}>
              {/* Status Step */}
              <div className="flex flex-col items-center min-w-fit">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : status.icon}
                </div>
                <p
                  className={`text-xs font-medium text-center ${isCurrent ? 'text-blue-600 font-bold' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}
                >
                  {status.label}
                </p>

                {/* Date if available */}
                {statusHistory.find(s => s.status === status.key) && (
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(
                      statusHistory.find(s => s.status === status.key)?.updatedAt
                    ).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>

              {/* Connecting Arrow */}
              {idx < statuses.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${idx < currentIndex ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Status History */}
      {statusHistory.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold mb-3">History</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {statusHistory.map((entry, idx) => (
              <div key={idx} className="text-sm flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium capitalize">{entry.status}</p>
                  {entry.note && <p className="text-gray-600 text-xs">{entry.note}</p>}
                  <p className="text-xs text-gray-500">
                    {new Date(entry.updatedAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderStatusStepper
