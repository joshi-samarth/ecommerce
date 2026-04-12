import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RatingStars from './RatingStars';
import PriceDisplay from './PriceDisplay';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const image = product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/400x400?text=No+Image';
    const isOutOfStock = product.stock === 0;

    const handleCardClick = () => {
        navigate(`/products/${product.slug}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        // TODO: Wire to CartContext in Module 5
        console.log('Add to cart:', product._id);
    };

    const handleAddToWishlist = (e) => {
        e.stopPropagation();
        // TODO: Wire to WishlistContext in Module 5
        console.log('Add to wishlist:', product._id);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100 aspect-square">
                <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Category Badge */}
                {product.category && (
                    <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                        {product.category.name}
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleAddToWishlist}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Add to wishlist"
                >
                    <Heart size={18} className="text-gray-600" />
                </button>

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Product Name */}
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="mb-2">
                    <RatingStars rating={product.averageRating} numReviews={product.numReviews} size="sm" />
                </div>

                {/* Price */}
                <div className="mb-3">
                    <PriceDisplay
                        price={product.price}
                        comparePrice={product.comparePrice}
                        size="sm"
                    />
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${isOutOfStock
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}
