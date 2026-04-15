import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'
import { MapPin, Plus, Loader2 } from 'lucide-react'
import FormInput from '../user/FormInput'

const AddressStep = ({ selectedAddress, onSelect, onContinue }) => {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/user/addresses')
      if (response.data.success) {
        setAddresses(response.data.data)
        // Auto-select first address if none selected
        if (!selectedAddress && response.data.data.length > 0) {
          onSelect(response.data.data[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const response = await axios.post('/api/user/addresses', formData)
      if (response.data.success) {
        const newAddress = response.data.data
        setAddresses([...addresses, newAddress])
        onSelect(newAddress)
        setFormData({
          fullName: '',
          phone: '',
          line1: '',
          line2: '',
          city: '',
          state: '',
          pincode: ''
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to add address:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>
          <div className="grid gap-4">
            {addresses.map(address => (
              <div
                key={address._id}
                onClick={() => onSelect(address)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddress?._id === address._id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <p className="font-semibold">{address.fullName}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {address.line1}
                      {address.line2 && `, ${address.line2}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.pincode}
                    </p>
                    <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                  </div>
                  {selectedAddress?._id === address._id && (
                    <button
                      onClick={() => onContinue()}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Deliver Here
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Address Section */}
      <div className="border-t pt-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <Plus className="w-5 h-5" />
          Add New Address
        </button>

        {(showForm || addresses.length === 0) && (
          <form onSubmit={handleAddAddress} className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-4">Enter Delivery Address</h3>

            <FormInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Address Line 1"
              name="line1"
              value={formData.line1}
              onChange={handleInputChange}
              required
              placeholder="House no., street name"
            />

            <FormInput
              label="Address Line 2 (optional)"
              name="line2"
              value={formData.line2}
              onChange={handleInputChange}
              placeholder="Apt, suite, floor"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
              <FormInput
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>

            <FormInput
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {submitting ? 'Saving...' : 'Save Address & Continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AddressStep
