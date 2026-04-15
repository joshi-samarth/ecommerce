import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const OrderSuccessPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`)
        if (response.data.success) {
          setOrder(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch order:', error)
        toast.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleCopyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber)
      setCopied(true)
      toast.success('Order number copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
            <Check className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your order. We'll notify you updates via email.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Order Number */}
          <div className="border-b mb-6 pb-6">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">Order Number</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-blue-600">{order.orderNumber}</p>
              <button
                onClick={handleCopyOrderNumber}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="Copy order number"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Items</p>
              <p className="text-2xl font-bold">{order.items.length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{order.total.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-6 pb-6 border-b">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-3">Estimated Delivery</p>
            <p className="text-lg font-semibold text-gray-900">
              Expected in 5–7 business days
            </p>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-3">Shipping Address</p>
            <div className="text-gray-900">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p className="text-sm">
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
              </p>
              <p className="text-sm">
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.pincode}
              </p>
              <p className="text-sm">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate(`/account/orders/${order._id}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
          >
            View Order Details
          </button>
          <button
            onClick={() => navigate('/products')}
            className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center"
          >
            Continue Shopping
          </button>
        </div>

        {/* Info Message */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
