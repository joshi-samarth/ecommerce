import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, ChevronRight, Trash2, Star, Package, Truck, Shield, Tag } from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import Breadcrumb from '../../components/shop/Breadcrumb';
import RatingStars from '../../components/shop/RatingStars';
import PriceDisplay from '../../components/shop/PriceDisplay';
import ProductGrid from '../../components/shop/ProductGrid';
import WishlistButton from '../../components/shop/WishlistButton';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart, openDrawer } = useCart();

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
                                relatedRes.data.data.filter((p) => p._id !== productData._id)
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

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Login to add items to cart');
            navigate('/login');
            return;
        }

        if (quantity < 1) {
            toast.error('Please select a valid quantity');
            return;
        }

        try {
            await addToCart(product._id, quantity);
            openDrawer();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
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
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="mb-8 inline-block p-4 bg-red-50 rounded-2xl">
                        <svg className="h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0a9 9 0 11-9-9m0 0a9 9 0 019 9" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-3">Product Not Found</h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-md">{error}</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        <ChevronLeft size={24} />
                        Back to Products
                    </button>
                </div>
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
            <Navbar showBackButton={true} title={product?.name} />
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbs} />

                {/* Main Product Section - Modern Design */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Image Gallery - Modern */}
                        <div className="space-y-5">
                            {/* Main Image */}
                            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl aspect-square overflow-hidden group">
                                <img src={mainImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {product.stock === 0 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails - Modern Styling */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setMainImage(img)}
                                            className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all duration-300 hover:shadow-lg ${mainImage === img ? 'border-indigo-600 shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info - Enhanced Typography */}
                        <div className="space-y-8 flex flex-col justify-center">
                            {/* Title - Prominent */}
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
                                <p className="text-lg text-gray-600">Premium Quality Product</p>
                            </div>

                            {/* Rating */}
                            <div className="bg-indigo-50 px-6 py-4 rounded-xl inline-w">
                                <RatingStars rating={product.averageRating} numReviews={product.numReviews} size="lg" />
                            </div>

                            {/* Price - Prominent Display */}
                            <div className="border-t border-b border-gray-200 py-6">
                                <PriceDisplay price={product.price} comparePrice={product.comparePrice} size="lg" />
                            </div>

                            {/* Stock Status - Color Coded */}
                            <div className={`px-6 py-4 rounded-xl font-semibold text-lg ${product.stock > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {product.stock > 0 ? (
                                    <>
                                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                        In Stock ({product.stock} available)
                                        {product.stock <= 5 && <span className="ml-3 text-orange-600 font-bold">Only {product.stock} left!</span>}
                                    </>
                                ) : (
                                    <>
                                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                        Out of Stock
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-indigo-600 pl-6 py-2">{product.description.substring(0, 200)}...</p>

                            {/* Quantity Selector - Modern */}
                            <div className="flex items-center gap-6">
                                <span className="text-gray-900 font-bold text-lg">Quantity:</span>
                                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={product.stock === 0}
                                        className="px-5 py-3 text-gray-600 hover:bg-gray-200 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="px-8 py-3 font-bold text-lg text-gray-900 border-l border-r border-gray-300">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        disabled={product.stock === 0}
                                        className="px-5 py-3 text-gray-600 hover:bg-gray-200 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons - Modern Styling */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${product.stock === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-lg hover:-translate-y-1 active:translate-y-0'
                                        }`}
                                >
                                    <ShoppingCart size={24} />
                                    Add to Cart
                                </button>
                                <button className="py-4 px-8 rounded-xl border-2 border-indigo-600 text-indigo-600 font-bold text-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                                    <WishlistButton productId={product._id} size="md" />
                                    <span>Wishlist</span>
                                </button>
                            </div>

                            {/* Product Meta - Modern */}
                            <div className="border-t border-gray-200 pt-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-semibold">Category:</span>
                                    <Link to={`/products?category=${product.category?.slug}`} className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                                        {product.category?.name}
                                    </Link>
                                </div>
                                {product.tags && product.tags.length > 0 && (
                                    <div>
                                        <span className="text-gray-600 font-semibold block mb-3">Tags:</span>
                                        <div className="flex gap-3 flex-wrap">
                                            {product.tags.map((tag) => (
                                                <Link
                                                    key={tag}
                                                    to={`/products?search=${tag}`}
                                                    className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-200 transition-colors"
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

                {/* Product Information Box - Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Free Shipping */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center">
                        <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                            <Truck className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
                        <p className="text-gray-600 text-sm">On orders above ₹500</p>
                    </div>

                    {/* Secure Payment */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center">
                        <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                            <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">100% Secure</h3>
                        <p className="text-gray-600 text-sm">SSL Encrypted Payments</p>
                    </div>

                    {/* Easy Returns */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center">
                        <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
                            <Package className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Easy Returns</h3>
                        <p className="text-gray-600 text-sm">30-day return policy</p>
                    </div>

                    {/* 24/7 Support */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center">
                        <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
                            <Star className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
                        <p className="text-gray-600 text-sm">Live chat & phone support</p>
                    </div>
                </div>

                {/* Product Specifications */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Product Specifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <p className="text-sm text-gray-600 font-semibold uppercase mb-1">SKU</p>
                                <p className="text-lg text-gray-900">{product.sku || 'SKU-' + product._id?.substring(0, 8)}</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <p className="text-sm text-gray-600 font-semibold uppercase mb-1">Category</p>
                                <p className="text-lg text-gray-900">{product.category?.name || 'Uncategorized'}</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <p className="text-sm text-gray-600 font-semibold uppercase mb-1">Availability</p>
                                <p className={`text-lg font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `In Stock (${product.stock} items)` : 'Out of Stock'}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <p className="text-sm text-gray-600 font-semibold uppercase mb-1">Discount</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-green-600">
                                        {product.comparePrice && product.comparePrice > product.price
                                            ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                                            : 0}%
                                    </span>
                                    {product.comparePrice && (
                                        <span className="text-gray-500 line-through">₹{product.comparePrice?.toLocaleString('en-IN')}</span>
                                    )}
                                </div>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <p className="text-sm text-gray-600 font-semibold uppercase mb-1">Price</p>
                                <p className="text-2xl font-bold text-indigo-600">₹{product.price?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <p className="text-sm text-gray-600 font-semibold uppercase mb-1">Average Rating</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-yellow-500">{product.averageRating?.toFixed(1) || '0'}</span>
                                    <span className="text-gray-600">({product.numReviews || 0} reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
                    {/* Tab Navigation */}
                    <div className="flex border-b-2 border-gray-200 bg-gray-50">
                        {['description', 'reviews', 'related'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-5 px-6 font-bold text-lg transition-all duration-300 relative ${activeTab === tab
                                    ? 'text-indigo-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab === 'description' && 'Description'}
                                {tab === 'reviews' && `Reviews (${product.numReviews})`}
                                {tab === 'related' && 'Related Products'}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-indigo-700"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {/* Description Tab */}
                        {activeTab === 'description' && (
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 whitespace-pre-line text-lg leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-10">
                                {/* Rating Summary - Modern */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Average Rating</h3>
                                        <div className="flex items-start gap-6">
                                            <div className="text-6xl font-bold text-indigo-600">{product.averageRating}</div>
                                            <div>
                                                <RatingStars rating={product.averageRating} numReviews={product.numReviews} size="lg" />
                                                <p className="text-lg text-gray-600 mt-4 font-semibold">Based on <span className="text-indigo-600">{product.numReviews}</span> reviews</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-8 rounded-2xl border border-gray-200">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Rating Breakdown</h3>
                                        <div className="space-y-4">
                                            {ratingBreakdown.map(({ rating, count }) => (
                                                <div key={rating} className="flex items-center gap-4">
                                                    <span className="text-lg font-bold text-gray-700 w-10">★ {rating}</span>
                                                    <div className="flex-1 h-3 bg-gray-300 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                                                            style={{
                                                                width: `${product.numReviews > 0 ? (count / product.numReviews) * 100 : 0}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-lg font-bold text-gray-700 w-8 text-right">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Write Review Form */}
                                {user ? (
                                    <div className="border-t-2 border-gray-200 pt-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-8">
                                            {userReview ? 'Your Review' : 'Write a Review'}
                                        </h3>
                                        {!userReview && (
                                            <form onSubmit={handleSubmitReview} className="space-y-6">
                                                <div>
                                                    <label className="block text-lg font-bold text-gray-900 mb-4">Rating</label>
                                                    <div className="flex gap-3">
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
