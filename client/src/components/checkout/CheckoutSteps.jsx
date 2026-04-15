import React from 'react'
import { Check } from 'lucide-react'

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { step: 1, label: 'Address' },
    { step: 2, label: 'Review' },
    { step: 3, label: 'Payment' }
  ]

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center">
        {steps.map((stepItem, idx) => (
          <React.Fragment key={stepItem.step}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${stepItem.step < currentStep
                    ? 'bg-green-500 text-white'
                    : stepItem.step === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {stepItem.step < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  stepItem.step
                )}
              </div>
              <p
                className={`mt-2 text-sm font-medium ${stepItem.step === currentStep
                    ? 'text-blue-600 font-bold'
                    : stepItem.step < currentStep
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
              >
                {stepItem.label}
              </p>
            </div>

            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div
                className={`h-1 w-16 mx-2 transition-all ${stepItem.step < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default CheckoutSteps
