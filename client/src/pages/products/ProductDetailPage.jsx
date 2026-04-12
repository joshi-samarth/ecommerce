import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import RatingStars from '../components/products/RatingStars';
import PriceDisplay from '../components/products/PriceDisplay';
import Breadcrumb from '../components/products/Breadcrumb';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [userReview, setUserReview] = useState(null);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [reviewFormData, setReviewFormData] = useState({
        rating: 5,
        title: '',
        comment: '',
    });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Fetch product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/products/${slug}`);
                if (response.data.success) {
                    setProduct(response.data.data);

                    // Check if user has already reviewed this product
                    if (user && response.data.data.ratings) {
                        const userReviewData = response.data.data.ratings.find(
                            (review) => review.user._id === user._id
                        );
                        setUserReview(userReviewData);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load product');
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug, user]);

    // Handle add to cart (placeholder)
    const handleAddToCart = () => {
        console.log('Add to cart:', { productId: product._id, quantity });
        alert(`Added ${quantity} item(s) to cart`);
    };

    // Handle review submission
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to submit a review');
            return;
        }

        setIsSubmittingReview(true);
        try {
            const response = await axios.post(
                `/api/products/${product._id}/reviews`,
                reviewFormData,
                { withCredentials: true }
            );

            if (response.data.success) {
                setProduct(response.data.data);
                setReviewFormData({ rating: 5, title: '', comment: '' });
                setIsReviewFormOpen(false);

                // Update user review
                const updatedUserReview = response.data.data.ratings.find(
                    (review) => review.user._id === user._id
                );
                setUserReview(updatedUserReview);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Handle review deletion
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            const response = await axios.delete(
                `/api/products/${product._id}/reviews/${reviewId}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setProduct(response.data.data);
                setUserReview(null);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete review');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-600 text-center">
                    <p className="text-lg font-semibold">Product not found</p>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'Products', link: '/products' },
        ...(product.category ? [{ label: product.category.name, link: `/products?category=${product.category.slug}` }] : []),
        { label: product.name },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow p-8 mb-8">
                    {/* Images */}
                    <div>
                        <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center">
                            <img
                                src={product.images?.[selectedImage] || 'https://via.placeholder.com/500x500?text=No+Image'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                                }}
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded border-2 overflow-hidden transition-colors ${selectedImage === index
                                            ? 'border-blue-600'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Product ${index}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                        {/* Rating */}
                        <div className="mb-6">
                            <RatingStars
                                rating={product.averageRating}
                                numReviews={product.numReviews}
                            />
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <PriceDisplay
                                price={product.price}
                                comparePrice={product.comparePrice}
                                className="!text-3xl"
                            />
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 mb-6 text-lg">{product.description}</p>

                        {/* Stock */}
                        <div className="mb-6 flex items-center gap-2">
                            <span className="text-gray-700 font-semibold">Availability:</span>
                            {product.stock > 0 ? (
                                <span className="text-green-600 font-semibold">
                                    In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="text-red-600 font-semibold">Out of Stock</span>
                            )}
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="mb-6">
                                <p className="text-gray-700 font-semibold mb-2">Tags:</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity and Add to Cart */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            Math.min(
                                                product.stock,
                                                Math.max(1, parseInt(e.target.value) || 1)
                                            )
                                        )
                                    }
                                    className="w-12 text-center border-none outline-none"
                                />
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${product.stock <= 0
                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>

                        {/* Share */}
                        <button className="text-blue-600 hover:text-blue-700 font-semibold">
                            ↗ Share Product
                        </button>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-lg shadow p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

                    {/* Review Form */}
                    {user ? (
                        userReview ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                                <p className="text-blue-700 font-semibold mb-3">Your Review</p>
                                <div className="bg-white rounded p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <RatingStars rating={userReview.rating} />
                                            {userReview.title && (
                                                <p className="font-semibold text-gray-900 mt-1">{userReview.title}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteReview(userReview._id)}
                                            className="text-red-600 hover:text-red-700 text-sm font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    {userReview.comment && (
                                        <p className="text-gray-700">{userReview.comment}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-8">
                                <button
                                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                                >
                                    {isReviewFormOpen ? 'Cancel' : 'Write a Review'}
                                </button>

                                {isReviewFormOpen && (
                                    <form
                                        onSubmit={handleReviewSubmit}
                                        className="mt-4 bg-gray-50 rounded-lg p-6"
                                    >
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Rating
                                            </label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() =>
                                                            setReviewFormData({
                                                                ...reviewFormData,
                                                                rating: star,
                                                            })
                                                        }
                                                        className="transition-colors"
                                                    >
                                                        {star <= reviewFormData.rating ? (
                                                            <svg
                                                                className="w-8 h-8 text-yellow-400 fill-current"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className="w-8 h-8 text-gray-300 fill-current"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={reviewFormData.title}
                                                onChange={(e) =>
                                                    setReviewFormData({
                                                        ...reviewFormData,
                                                        title: e.target.value,
                                                    })
                                                }
                                                placeholder="e.g., Great product!"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Comment
                                            </label>
                                            <textarea
                                                value={reviewFormData.comment}
                                                onChange={(e) =>
                                                    setReviewFormData({
                                                        ...reviewFormData,
                                                        comment: e.target.value,
                                                    })
                                                }
                                                placeholder="Share your experience with this product..."
                                                rows="4"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmittingReview}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                                        >
                                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                            <p className="text-yellow-700">
                                <a href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                                    Login
                                </a>{' '}
                                to write a review
                            </p>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Customer Reviews ({product.numReviews})
                        </h3>
                        {product.ratings && product.ratings.length > 0 ? (
                            <div className="space-y-4">
                                {product.ratings.map((review) => (
                                    <div key={review._id} className="border-t pt-4 first:border-t-0">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {review.user?.name || 'Anonymous'}
                                                        </p>
                                                        <RatingStars rating={review.rating} />
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {review.title && (
                                                    <p className="font-semibold text-gray-800 mt-2">
                                                        {review.title}
                                                    </p>
                                                )}
                                                {review.comment && (
                                                    <p className="text-gray-700 mt-2">{review.comment}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
