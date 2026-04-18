import React, { useState } from 'react'
import { Star, Send, Check } from 'lucide-react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

const RateProductCard = ({ product, onSuccess }) => {
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [hoveredRating, setHoveredRating] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmitReview = async () => {
        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }

        if (review.trim().length === 0) {
            toast.error('Please write a review')
            return
        }

        try {
            setSubmitting(true)
            const response = await axios.post(
                `/api/products/${product.slug}/reviews`,
                {
                    rating,
                    review: review.trim()
                }
            )

            if (response.data.success) {
                setSubmitted(true)
                toast.success('Review submitted successfully!')
                setTimeout(() => {
                    onSuccess?.()
                }, 1500)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review')
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-green-900">Review submitted!</p>
                    <p className="text-sm text-green-700">Thank you for your feedback</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">Rate and review this product</p>
                </div>
            </div>

            {/* Star Rating */}
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                    Your Rating
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 transition-colors ${star <= (hoveredRating || rating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Review Textarea */}
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                    Your Review ({review.length}/500)
                </label>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value.slice(0, 500))}
                    placeholder="Share your experience with this product..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                />
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmitReview}
                disabled={submitting || rating === 0 || review.trim().length === 0}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
            >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </div>
    )
}

export default RateProductCard
