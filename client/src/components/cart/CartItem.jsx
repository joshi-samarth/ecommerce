import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useState } from 'react';

export default function CartItem({ item }) {
    const { updateItem, removeItem } = useCart();
    const [isUpdating, setIsUpdating] = useState(false);

    const product = item.product;
    const outOfStock = !product || product.stock === 0;

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1) {
            await handleRemove();
            return;
        }
        if (newQuantity > product.stock) return;

        setIsUpdating(true);
        try {
            await updateItem(product._id, newQuantity);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemove = async () => {
        setIsUpdating(true);
        try {
            await removeItem(product._id);
        } finally {
            setIsUpdating(false);
        }
    };

    const lineTotal = item.price * item.quantity;

    return (
        <div className="flex gap-4 py-4 px-4 border-b border-gray-200 hover:bg-gray-50 transition">
            {/* Product Image */}
            <Link
                to={`/products/${product.slug}`}
                className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100 hover:opacity-80 transition"
            >
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/80'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </Link>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <Link
                    to={`/products/${product.slug}`}
                    className="font-medium text-gray-900 hover:text-indigo-600 transition line-clamp-2"
                >
                    {product.name}
                </Link>

                {/* Category/Price */}
                <p className="text-xs text-gray-500 mt-1">{product.category?.name}</p>
                <p className="text-sm font-semibold text-indigo-600 mt-2">₹{item.price.toFixed(2)}</p>

                {outOfStock && (
                    <p className="text-xs text-red-600 font-medium mt-2">Out of stock</p>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center gap-2 mt-3">
                    <button
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={isUpdating || outOfStock}
                        className="p-1 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition"
                        title="Decrease quantity"
                    >
                        <Minus size={16} className="text-gray-600" />
                    </button>
                    <div className="w-10 text-center font-medium text-gray-900">{item.quantity}</div>
                    <button
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        disabled={isUpdating || item.quantity >= product.stock || outOfStock}
                        className="p-1 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition"
                        title="Increase quantity"
                    >
                        <Plus size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Line Total and Remove */}
            <div className="flex flex-col items-end justify-between">
                <p className="font-bold text-gray-900 text-lg">₹{lineTotal.toFixed(2)}</p>
                <button
                    onClick={handleRemove}
                    disabled={isUpdating}
                    className="btn-icon text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                    title="Remove from cart"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
