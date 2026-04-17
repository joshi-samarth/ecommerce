import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import Navbar from '../../components/shared/Navbar';
import RatingStars from '../../components/products/RatingStars';
import PriceDisplay from '../../components/products/PriceDisplay';
import Breadcrumb from '../../components/products/Breadcrumb';
import { useAuth } from '../../context/AuthContext';

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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="skeleton w-12 h-12 rounded-full"></div>
                    <p className="text-gray-600 font-medium">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="card max-w-md text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
                    <p className="text-gray-600 mb-6">{error || 'Unable to load this product'}</p>
                    <a href="/products" className="btn btn-primary">Back to Products</a>
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
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="page-container">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                {/* Product Details */}
                <div className="card grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Images */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center aspect-square hover:bg-gray-150 transition-colors">
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
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all border-2 ${selectedImage === index
                                            ? 'border-indigo-600 ring-2 ring-indigo-300'
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
                    <div className="flex flex-col gap-6">
                        {/* Category Badge */}
                        {product.category && (
                            <div>
                                <span className="badge badge-primary text-xs">
                                    {product.category.name}
                                </span>
                            </div>
                        )}

                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
                        </div>

                        {/* Rating */}
                        <div>
                            <RatingStars
                                rating={product.averageRating}
                                numReviews={product.numReviews}
                            />
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <PriceDisplay
                                price={product.price}
                                comparePrice={product.comparePrice}
                            />
                            {product.comparePrice && product.comparePrice > product.price && (
                                <span className="badge badge-success text-xs">
                                    Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>

                        <div className="divider" />

                        {/* Stock Status */}
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm ${product.stock > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                                {product.stock > 0
                                    ? `In Stock (${product.stock} available)`
                                    : 'Out of Stock'
                                }
                            </span>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-2.5 uppercase tracking-wide">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="badge badge-secondary text-xs"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="divider" />

                        {/* Quantity Selector & Add to Cart */}
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-white transition-colors font-semibold"
                                >
                                    −
                                </button>
                                <div className="px-6 py-3 border-l border-r border-gray-300">
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
                                        className="w-12 text-center font-semibold text-gray-900 outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                    className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-white transition-colors font-semibold"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="btn btn-primary flex-1"
                            >
                                {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>

                        {/* Wishlist Button */}
                        <button className="w-full py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
                            ♥ Add to Wishlist
                        </button>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="card">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                        <h2 className="section-title">Customer Reviews</h2>
                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                            {product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'}
                        </span>
                    </div>

                    {/* Review Form */}
                    {user ? (
                        userReview ? (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
                                <p className="text-indigo-900 font-semibold mb-4 flex items-center gap-2">
                                    <span className="text-lg">✓</span>
                                    Your Review
                                </p>
                                <div className="bg-white rounded-lg p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <RatingStars rating={userReview.rating} />
                                            {userReview.title && (
                                                <p className="font-semibold text-gray-900 mt-3 text-lg">{userReview.title}</p>
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
                                        <p className="text-gray-700 leading-relaxed">{userReview.comment}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-8">
                                <button
                                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                                    className="btn btn-primary mb-6"
                                >
                                    {isReviewFormOpen ? '✕ Cancel' : '✎ Write a Review'}
                                </button>

                                {isReviewFormOpen && (
                                    <form
                                        onSubmit={handleReviewSubmit}
                                        className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-200"
                                    >
                                        <div>
                                            <label className="label mb-3">Rating</label>
                                            <div className="flex gap-3">
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
                                                        className="transition-transform hover:scale-110"
                                                    >
                                                        {star <= reviewFormData.rating ? (
                                                            <svg
                                                                className="w-9 h-9 text-amber-400 fill-current"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className="w-9 h-9 text-gray-300 fill-current"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="label">Title</label>
                                            <input
                                                type="text"
                                                value={reviewFormData.title}
                                                onChange={(e) =>
                                                    setReviewFormData({
                                                        ...reviewFormData,
                                                        title: e.target.value,
                                                    })
                                                }
                                                placeholder="e.g., Excellent product!"
                                                className="input"
                                            />
                                        </div>

                                        <div>
                                            <label className="label">Comment</label>
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
                                                className="input resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmittingReview}
                                            className="btn btn-primary w-full"
                                        >
                                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )
                    ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-amber-900">
                            <p className="font-medium">
                                <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                                    Sign in
                                </a>{' '}
                                to share your review
                            </p>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {product.ratings && product.ratings.length > 0 ? (
                            product.ratings.map((review) => (
                                <div key={review._id} className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {review.user?.name || 'Anonymous'}
                                                    </p>
                                                    <RatingStars rating={review.rating} />
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            {review.title && (
                                                <p className="font-semibold text-gray-800 mt-2 text-base">
                                                    {review.title}
                                                </p>
                                            )}
                                            {review.comment && (
                                                <p className="text-gray-700 mt-2 leading-relaxed">{review.comment}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-gray-500">
                                <p className="text-lg">No reviews yet</p>
                                <p className="text-sm mt-1">Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
