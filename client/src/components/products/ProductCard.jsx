import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import PriceDisplay from './PriceDisplay';

export default function ProductCard({ product, onAddToCart }) {
    const handleAddToCart = (e) => {
        e.preventDefault();
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    return (
        <Link to={`/products/${product.slug}`} className="block">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
                {/* Image Container */}
                <div className="relative bg-gray-100 overflow-hidden h-48">
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                        }}
                    />
                    {product.isFeatured && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
                            Featured
                        </div>
                    )}
                    {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Out of Stock</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Category */}
                    {product.category && (
                        <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            {product.category.name}
                        </span>
                    )}

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="mb-3">
                        <RatingStars rating={product.averageRating} numReviews={product.numReviews} />
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                        <PriceDisplay price={product.price} comparePrice={product.comparePrice} />
                    </div>

                    {/* Stock Info */}
                    {product.stock > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                {product.stock > 10
                                    ? `Only ${product.stock} left in stock`
                                    : product.stock === 1
                                        ? 'Only 1 item left!'
                                        : `Hurry! Only ${product.stock} items left`}
                            </p>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={`w-full py-2 rounded font-semibold transition-colors mt-auto ${product.stock <= 0
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </Link>
    );
}

ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        comparePrice: PropTypes.number,
        images: PropTypes.array,
        category: PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string,
        }),
        averageRating: PropTypes.number,
        numReviews: PropTypes.number,
        stock: PropTypes.number.isRequired,
        isFeatured: PropTypes.bool,
    }).isRequired,
    onAddToCart: PropTypes.func,
};
