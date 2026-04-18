import { ShoppingCart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RatingStars from './RatingStars';
import PriceDisplay from './PriceDisplay';
import WishlistButton from './WishlistButton';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const { user } = useAuth();
    const { addToCart, openDrawer } = useCart();
    const navigate = useNavigate();

    const image = product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/400x400?text=No+Image';
    const isOutOfStock = product.stock === 0;

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        e.preventDefault();

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
        <div className="card overflow-hidden group h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Image and Wishlist Container */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
                <Link
                    to={`/products/${product.slug}`}
                    className="block w-full h-full hover:no-underline"
                >
                    <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />

                    {/* Top Overlay: Category Badge */}
                    {product.category && (
                        <div className="absolute top-4 left-4 badge badge-primary shadow-md backdrop-blur-sm bg-white/90">
                            {product.category.name}
                        </div>
                    )}

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
                            -{discountPercent}%
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Out of Stock</span>
                        </div>
                    )}

                    {/* Featured Badge */}
                    {product.isFeatured && (
                        <div className="absolute top-4 right-16 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                            ⭐ Featured
                        </div>
                    )}
                </Link>

                {/* Wishlist Button - Positioned Absolutely on Image */}
                <div className="absolute top-4 right-4 z-10">
                    <WishlistButton productId={product._id} size="sm" />
                </div>
            </div>

            {/* Content */}
            <div className="card-body flex flex-col flex-grow gap-3">
                {/* Product Name - Link */}
                <Link
                    to={`/products/${product.slug}`}
                    className="hover:no-underline"
                >
                    <h3 className="font-semibold text-gray-900 line-clamp-2 text-base leading-snug hover:text-indigo-600 transition">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="py-1">
                    <RatingStars rating={product.averageRating} numReviews={product.numReviews} size="sm" />
                </div>

                {/* Price - More prominent */}
                <div className="mt-auto pt-2 border-t border-gray-100">
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
                    className={`btn btn-sm w-full flex items-center justify-center gap-2 font-600 mt-3 transition-all ${isOutOfStock
                        ? 'btn-secondary opacity-50 cursor-not-allowed'
                        : 'btn-primary hover:shadow-lg'
                        }`}
                >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}
