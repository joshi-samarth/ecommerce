import React, { useContext } from 'react'
import { MapPin, CreditCard } from 'lucide-react'
import { CartContext } from '../../context/CartContext'
import OrderItemsList from '../orders/OrderItemsList'

const ReviewStep = ({ address, onBack, onPlaceOrder, loading }) => {
  const { cart } = useContext(CartContext)

  const subtotal = cart.items.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)

  const discount = cart.discount || 0
  const shippingCharge = subtotal > 500 ? 0 : 50
  const total = subtotal - discount + shippingCharge

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Items and Address */}
      <div className="lg:col-span-2 space-y-6">
        {/* Delivery Address */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Delivery Address</h3>
            </div>
            <button
              onClick={onBack}
              className="text-blue-600 hover:underline text-sm"
            >
              Change
            </button>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-medium">{address.fullName}</p>
            <p className="text-sm text-gray-600">
              {address.line1}
              {address.line2 && `, ${address.line2}`}
            </p>
            <p className="text-sm text-gray-600">
              {address.city}, {address.state} {address.pincode}
            </p>
            <p className="text-sm text-gray-600">Phone: {address.phone}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Order Items</h3>
          <OrderItemsList items={cart.items} />
        </div>

        {/* Payment Method */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Payment Method</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center p-3 border-2 border-blue-600 rounded-lg cursor-pointer bg-blue-50">
              <input
                type="radio"
                name="payment"
                value="cod"
                defaultChecked
                disabled
                className="w-4 h-4 text-blue-600"
              />
              <div className="ml-3">
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-gray-600">
                  Pay when the package arrives
                </p>
              </div>
            </label>
            <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-not-allowed opacity-50">
              <input
                type="radio"
                name="payment"
                value="online"
                disabled
                className="w-4 h-4 text-gray-400"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-500">Online Payment</p>
                <p className="text-sm text-gray-500">
                  Coming in Module 8
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Price Breakdown */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 border rounded-lg p-4 sticky top-4 space-y-4">
          <h3 className="font-semibold text-lg">Price Breakdown</h3>

          <div className="space-y-3 border-b pb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount {cart.coupon && `(${cart.coupon.code})`}</span>
                <span>−₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {shippingCharge === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `₹${shippingCharge}`
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-600">₹{total.toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={onPlaceOrder}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-bold text-lg"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewStep
