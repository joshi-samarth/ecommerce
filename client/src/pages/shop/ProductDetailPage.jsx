import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import Breadcrumb from '../../components/shop/Breadcrumb';
import RatingStars from '../../components/shop/RatingStars';
import PriceDisplay from '../../components/shop/PriceDisplay';
import ProductGrid from '../../components/shop/ProductGrid';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, review: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/products/${slug}`);
                if (response.data.success) {
                    const productData = response.data.data;
                    setProduct(productData);
                    setMainImage(
                        productData.images && productData.images.length > 0
                            ? productData.images[0]
                            : 'https://via.placeholder.com/400x400?text=No+Image'
                    );

                    // Fetch related products
                    if (productData.category) {
                        const relatedRes = await axios.get(
                            `/api/products?category=${productData.category.slug}&limit=4`
                        );
                        if (relatedRes.data.success) {
                            setRelatedProducts(
                                relatedRes.data.data.products.filter((p) => p._id !== productData._id)
                            );
                        }
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Product not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const handleAddToCart = () => {
        // TODO: Wire to CartContext in Module 5
        console.log('Add to cart:', product._id, quantity);
    };

    const handleAddToWishlist = () => {
        // TODO: Wire to WishlistContext in Module 5
        console.log('Add to wishlist:', product._id);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setSubmittingReview(true);
        try {
            const response = await axios.post(`/api/products/${slug}/reviews`, {
                rating: reviewForm.rating,
                review: reviewForm.review,
            });

            if (response.data.success) {
                setProduct(response.data.data);
                setReviewForm({ rating: 5, review: '' });
                alert('Review submitted successfully');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            const response = await axios.delete(`/api/products/${slug}/reviews/${reviewId}`);
            if (response.data.success) {
                setProduct(response.data.data);
                alert('Review deleted successfully');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete review');
        }
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 404 state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                <p className="text-gray-600 mb-8">{error}</p>
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <ChevronLeft size={20} />
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) return null;

    const breadcrumbs = [
        { label: product.category?.name || 'Products', href: `/products?category=${product.category?.slug}` },
        { label: product.name, href: '#' },
    ];

    const userReview = product.ratings?.find((r) => r.user?._id === user?._id);
    const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: product.ratings?.filter((r) => r.rating === rating).length || 0,
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbs} />

                {/* Main Product Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative bg-gray-100 rounded-lg aspect-square overflow-hidden">
                                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                                {product.stock === 0 && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setMainImage(img)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${mainImage === img ? 'border-primary' : 'border-gray-300'
                                                }`}
                                        >
                                            <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                            {/* Rating */}
                            <RatingStars rating={product.averageRating} numReviews={product.numReviews} size="lg" />

                            {/* Price */}
                            <PriceDisplay price={product.price} comparePrice={product.comparePrice} size="lg" />

                            {/* Stock Status */}
                            <div className={`text-base font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                                {product.stock > 0 && product.stock <= 5 && (
                                    <span className="ml-2 text-orange-600">Only {product.stock} left!</span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-gray-700">{product.description.substring(0, 200)}...</p>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700 font-semibold">Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={product.stock === 0}
                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        −
                                    </button>
                                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        disabled={product.stock === 0}
                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${product.stock === 0
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                        }`}
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleAddToWishlist}
                                    className="py-3 px-6 rounded-lg border border-gray-300 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Heart size={20} />
                                    Wishlist
                                </button>
                            </div>

                            {/* Product Meta */}
                            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Category:</span>
                                    <Link to={`/products?category=${product.category?.slug}`} className="text-primary hover:underline">
                                        {product.category?.name}
                                    </Link>
                                </div>
                                {product.tags && product.tags.length > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tags:</span>
                                        <div className="flex gap-2 flex-wrap justify-end">
                                            {product.tags.map((tag) => (
                                                <Link
                                                    key={tag}
                                                    to={`/products?search=${tag}`}
                                                    className="bg-gray-100 px-2 py-1 rounded text-xs hover:bg-gray-200"
                                                >
                                                    {tag}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200">
                        {['description', 'reviews', 'related'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 font-semibold transition-colors ${activeTab === tab
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab === 'description' && 'Description'}
                                {tab === 'reviews' && `Reviews (${product.numReviews})`}
                                {tab === 'related' && 'Related Products'}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Description Tab */}
                        {activeTab === 'description' && (
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-8">
                                {/* Rating Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Average Rating</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="text-5xl font-bold text-primary">{product.averageRating}</div>
                                            <div>
                                                <RatingStars rating={product.averageRating} numReviews={product.numReviews} size="lg" />
                                                <p className="text-sm text-gray-600 mt-2">Based on {product.numReviews} reviews</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
                                        <div className="space-y-2">
                                            {ratingBreakdown.map(({ rating, count }) => (
                                                <div key={rating} className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold w-8">{rating}★</span>
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all"
                                                            style={{
                                                                width: `${product.numReviews > 0 ? (count / product.numReviews) * 100 : 0}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600 w-8">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Write Review Form */}
                                {user ? (
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold mb-4">
                                            {userReview ? 'Your Review' : 'Write a Review'}
                                        </h3>
                                        {!userReview && (
                                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2">Rating</label>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                                className={`text-3xl transition-colors ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                                                                    }`}
                                                            >
                                                                ★
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold mb-2">Review</label>
                                                    <textarea
                                                        value={reviewForm.review}
                                                        onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                                                        placeholder="Share your experience with this product..."
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                                                        required
                                                    ></textarea>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={submittingReview}
                                                    className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                                                >
                                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                ) : (
                                    <div className="border-t border-gray-200 pt-6 text-center">
                                        <p className="text-gray-600 mb-4">Please login to write a review</p>
                                        <Link to="/login" className="text-primary hover:underline font-semibold">
                                            Login to continue
                                        </Link>
                                    </div>
                                )}

                                {/* Reviews List */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                                    <div className="space-y-4">
                                        {product.ratings && product.ratings.length > 0 ? (
                                            product.ratings.map((review) => (
                                                <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="font-semibold">{review.user?.name}</span>
                                                                <RatingStars rating={review.rating} size="sm" />
                                                            </div>
                                                            <p className="text-sm text-gray-500 mb-2">
                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                            </p>
                                                            <p className="text-gray-700">{review.comment}</p>
                                                        </div>

                                                        {user?._id === review.user?._id && (
                                                            <button
                                                                onClick={() => handleDeleteReview(review._id)}
                                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                                aria-label="Delete review"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Related Products Tab */}
                        {activeTab === 'related' && (
                            <ProductGrid products={relatedProducts} emptyMessage="No related products found" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
