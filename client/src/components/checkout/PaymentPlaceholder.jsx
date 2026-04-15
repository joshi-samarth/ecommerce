import React from 'react'
import { Lock } from 'lucide-react'

const PaymentPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-300">
      <Lock className="w-16 h-16 text-blue-600 mb-4" />
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Gateway</h3>
      <p className="text-gray-600 text-center max-w-md">
        Online payment integration is coming in Module 8.
      </p>
      <p className="text-sm text-gray-500 mt-4">
        For now, you can check out with Cash on Delivery (COD).
      </p>
    </div>
  )
}

export default PaymentPlaceholder
