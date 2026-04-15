import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { CartContext } from '../../context/CartContext'
import CheckoutSteps from '../../components/checkout/CheckoutSteps'
import AddressStep from '../../components/checkout/AddressStep'
import ReviewStep from '../../components/checkout/ReviewStep'
import Navbar from '../../components/shared/Navbar'
import { ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cart, clearCart } = useContext(CartContext)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [loading, setLoading] = useState(false)

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty')
      navigate('/cart')
    }
  }, [cart.items.length, navigate])

  const handleContinueAddress = () => {
    if (!selectedAddress) {
      toast.error('Please select an address')
      return
    }
    setCurrentStep(2)
  }

  const handlePlaceOrder = async () => {
    try {
      setLoading(true)

      const response = await axios.post('/api/orders', {
        shippingAddress: selectedAddress,
        paymentMethod: 'cod'
      })

      if (response.data.success) {
        clearCart()
        toast.success('Order placed successfully!')
        navigate(`/order-success/${response.data.data.order}`)
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to place order'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Cart
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">{cart.items.length} items in your order</p>
          </div>

          {/* Steps */}
          <CheckoutSteps currentStep={currentStep} />

          {/* Content */}
          <div className="bg-white rounded-lg p-6 sm:p-8 mt-8">
            {currentStep === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-6">Select Delivery Address</h2>
                <AddressStep
                  selectedAddress={selectedAddress}
                  onSelect={setSelectedAddress}
                  onContinue={handleContinueAddress}
                />
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => navigate('/cart')}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Back to Cart
                  </button>
                  <button
                    onClick={handleContinueAddress}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Continue to Review
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && selectedAddress && (
              <>
                <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
                <ReviewStep
                  address={selectedAddress}
                  onBack={() => setCurrentStep(1)}
                  onPlaceOrder={handlePlaceOrder}
                  loading={loading}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
