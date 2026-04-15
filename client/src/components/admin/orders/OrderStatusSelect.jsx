import React, { useState } from 'react'
import axios from '../../../api/axios'
import { ChevronDown, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const OrderStatusSelect = ({ orderId, currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const validStatuses = {
    placed: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
    returned: []
  }

  const getNextStatuses = () => {
    return validStatuses[currentStatus] || []
  }

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true)
      setIsOpen(false)

      const response = await axios.put(`/api/admin/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status updated to ${newStatus}`
      })

      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`)
        onStatusChange(response.data.data)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  const nextStatuses = getNextStatuses()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={nextStatuses.length === 0 || loading}
        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span className="capitalize">{currentStatus}</span>
            {nextStatuses.length > 0 && <ChevronDown className="w-4 h-4" />}
          </>
        )}
      </button>

      {isOpen && nextStatuses.length > 0 && (
        <div className="absolute top-full mt-1 z-10 bg-white border border-gray-300 rounded-lg shadow-lg">
          {nextStatuses.map(status => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 capitalize text-sm first:rounded-t-lg last:rounded-b-lg"
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderStatusSelect
