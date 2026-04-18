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
  const [formErrors, setFormErrors] = useState({})

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

    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

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
        setFormErrors({})
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

    // Input restrictions and validation
    let finalValue = value

    if (name === 'phone') {
      // Allow only digits, max 10
      finalValue = value.replace(/\D/g, '').slice(0, 10)
    } else if (name === 'pincode') {
      // Allow only digits, max 6
      finalValue = value.replace(/\D/g, '').slice(0, 6)
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }))
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required'
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required'
    } else if (formData.phone.length < 10) {
      errors.phone = 'Phone must be 10 digits'
    }
    if (!formData.line1.trim()) errors.line1 = 'Address is required'
    if (!formData.city.trim()) errors.city = 'City is required'
    if (!formData.state.trim()) errors.state = 'State is required'
    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required'
    } else if (formData.pincode.length < 6) {
      errors.pincode = 'Pincode must be 6 digits'
    }

    return errors
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
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
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-indigo-600" />
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
                      className="ml-4 btn btn-primary whitespace-nowrap"
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
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4"
        >
          <Plus className="w-5 h-5" />
          Add New Address
        </button>

        {(showForm || addresses.length === 0) && (
          <form onSubmit={handleAddAddress} className="card space-y-4 p-4 border-2 border-indigo-200">
            <h3 className="font-semibold mb-4">Enter Delivery Address</h3>

            <div>
              <FormInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
            </div>

            <div>
              <FormInput
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10 digit mobile number"
                required
              />
              {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
            </div>

            <div>
              <FormInput
                label="Address Line 1"
                name="line1"
                value={formData.line1}
                onChange={handleInputChange}
                required
                placeholder="House no., street name"
              />
              {formErrors.line1 && <p className="text-red-500 text-sm mt-1">{formErrors.line1}</p>}
            </div>

            <FormInput
              label="Address Line 2 (optional)"
              name="line2"
              value={formData.line2}
              onChange={handleInputChange}
              placeholder="Apt, suite, floor"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
              </div>
              <div>
                <FormInput
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
              </div>
            </div>

            <div>
              <FormInput
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="6 digit pincode"
                required
              />
              {formErrors.pincode && <p className="text-red-500 text-sm mt-1">{formErrors.pincode}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
