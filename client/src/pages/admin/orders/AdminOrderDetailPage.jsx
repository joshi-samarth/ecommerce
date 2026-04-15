import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../../api/axios'
import { Loader2, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import OrderStatusStepper from '../../../components/orders/OrderStatusStepper'
import OrderItemsList from '../../../components/orders/OrderItemsList'
import OrderStatusSelect from '../../../components/admin/orders/OrderStatusSelect'

const AdminOrderDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/admin/orders/${id}`)
      if (response.data.success) {
        setOrder(response.data.data)
        setNotes(response.data.data.notes || '')
      }
    } catch (error) {
      toast.error('Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true)
      const response = await axios.put(`/api/admin/orders/${id}/note`, {
        note: notes
      })
      if (response.data.success) {
        setOrder(response.data.data)
        toast.success('Notes saved')
      }
    } catch (error) {
      toast.error('Failed to save notes')
    } finally {
      setSavingNotes(false)
    }
  }

  const handleStatusChange = () => {
    fetchOrder()
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
          <p className="text-gray-600">
            {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
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

          {/* Status History Timeline */}
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="font-semibold text-lg mb-4">Status History</h3>
            <div className="space-y-4">
              {order.statusHistory.map((entry, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    {idx < order.statusHistory.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300 mt-2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold capitalize">{entry.status}</p>
                    {entry.note && <p className="text-gray-600 text-sm">{entry.note}</p>}
                    {entry.updatedBy && (
                      <p className="text-xs text-gray-500 mt-1">
                        by {entry.updatedBy.name}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(entry.updatedAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                  <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                  <span>−₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}
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
          {/* Customer Info */}
          <div className="bg-white rounded-lg p-6 border">
            <h4 className="font-semibold mb-3">Customer</h4>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.user?.name}</p>
              <p className="text-gray-600">{order.user?.email}</p>
              {order.user?.phone && (
                <p className="text-gray-600">{order.user.phone}</p>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg p-6 border">
            <h4 className="font-semibold mb-4">Payment Info</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Method</p>
                <p className="font-medium capitalize">
                  {order.paymentMethod === 'cod'
                    ? 'Cash on Delivery'
                    : order.paymentMethod}
                </p>
              </div>
              <div className="border-t pt-3">
                <p className="text-gray-600 mb-1">Status</p>
                <select
                  value={order.paymentStatus}
                  onChange={e =>
                    axios.put(`/api/admin/orders/${id}/payment`, {
                      paymentStatus: e.target.value
                    })
                      .then(() => {
                        toast.success('Payment status updated')
                        fetchOrder()
                      })
                      .catch(err => toast.error('Failed to update'))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Order Status Update */}
          <div className="bg-white rounded-lg p-6 border">
            <h4 className="font-semibold mb-3">Update Status</h4>
            <OrderStatusSelect
              orderId={id}
              currentStatus={order.orderStatus}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-lg p-6 border">
            <h4 className="font-semibold mb-3">Admin Notes</h4>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add internal notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              rows="4"
            />
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderDetailPage
