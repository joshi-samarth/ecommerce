import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RatingStars from './RatingStars';
import PriceDisplay from './PriceDisplay';
import WishlistButton from './WishlistButton';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart, openDrawer } = useCart();
    const image = product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/400x400?text=No+Image';
    const isOutOfStock = product.stock === 0;

    const handleCardClick = () => {
        navigate(`/products/${product.slug}`);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();

        if (!user) {
            toast.error('Login to add items to cart');
            navigate('/login');
            return;
        }

        try {
            await addToCart(product._id, 1);
            openDrawer();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const discountPercent = product.comparePrice && product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    return (
        <div
            onClick={handleCardClick}
            className="card hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100 aspect-square">
                <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Top Overlay: Category Badge */}
                {product.category && (
                    <div className="absolute top-3 left-3 badge badge-primary shadow-sm">
                        {product.category.name}
                    </div>
                )}

                {/* Top Right: Wishlist Button */}
                <div className="absolute top-3 right-3">
                    <WishlistButton productId={product._id} size="sm" />
                </div>

                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <div className="absolute bottom-3 right-3 badge badge-success">
                        -{discountPercent}%
                    </div>
                )}

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="card-body flex flex-col flex-grow">
                {/* Product Name */}
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 text-sm">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="mb-3">
                    <RatingStars rating={product.averageRating} numReviews={product.numReviews} size="sm" />
                </div>

                {/* Price */}
                <div className="mb-4 mt-auto">
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
                    className={`btn btn-sm w-full flex items-center justify-center gap-2 ${isOutOfStock
                            ? 'btn-secondary opacity-50 cursor-not-allowed'
                            : 'btn-primary'
                        }`}
                >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}
