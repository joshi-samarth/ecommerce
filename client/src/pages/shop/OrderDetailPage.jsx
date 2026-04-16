import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { AlertCircle, Loader2, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../../components/shared/Navbar'
import OrderStatusStepper from '../../components/orders/OrderStatusStepper'
import OrderItemsList from '../../components/orders/OrderItemsList'

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel, showReasonInput }) => {
  const [reason, setReason] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-2">Cancel Order?</h3>
        <p className="text-gray-600 mb-4">{message}</p>

        {showReasonInput && (
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason for cancellation (optional)"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm"
            rows="3"
          />
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            No, Keep It
          </button>
          <button
            onClick={() => onConfirm(reason)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const OrderDetailPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`)
        if (response.data.success) {
          setOrder(response.data.data)
        }
      } catch (error) {
        toast.error('Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleCancelOrder = async (reason) => {
    try {
      setCancelling(true)
      const response = await axios.put(`/api/orders/${orderId}/cancel`, { reason })
      if (response.data.success) {
        setOrder(response.data.data)
        setShowCancelDialog(false)
        toast.success('Order cancelled successfully')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
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

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/account')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to My Orders
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <span>Order #{order.orderNumber}</span>
              <span>•</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Stepper */}
              <OrderStatusStepper
                currentStatus={order.orderStatus}
                statusHistory={order.statusHistory}
              />

              {/* Order Items */}
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                <OrderItemsList items={order.items} />
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="font-semibold text-lg mb-4">Price Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        Discount {order.couponCode && `(${order.couponCode})`}
                      </span>
                      <span>−₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {order.shippingCharge === 0
                        ? 'FREE'
                        : `₹${order.shippingCharge}`}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="font-semibold text-lg mb-4">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.pincode}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Payment Info */}
              <div className="bg-white rounded-lg p-6 border">
                <h4 className="font-semibold mb-4">Payment Info</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium capitalize">
                      {order.paymentMethod === 'cod'
                        ? 'Cash on Delivery'
                        : order.paymentMethod}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-gray-600">Payment Status</p>
                    <div
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg p-6 border">
                <h4 className="font-semibold mb-4">Order Summary</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Order Number</p>
                    <p className="font-medium">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Placed On</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  {order.deliveredAt && (
                    <div>
                      <p className="text-gray-600">Delivered On</p>
                      <p className="font-medium">
                        {new Date(order.deliveredAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cancel Order */}
              {order.canBeCancelled && order.canBeCancelled() && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="w-full px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-semibold transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showCancelDialog}
        message="This action cannot be undone. Your ordered items will be refunded if payment was made."
        onConfirm={handleCancelOrder}
        onCancel={() => setShowCancelDialog(false)}
        showReasonInput={true}
      />
    </div>
  )
}

export default OrderDetailPage
