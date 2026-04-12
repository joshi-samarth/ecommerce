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
        <div className="flex gap-4 py-4 border-b">
            {/* Product Image */}
            <Link
                to={`/products/${product.slug}`}
                className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded overflow-hidden"
            >
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/80'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </Link>

            {/* Product Details */}
            <div className="flex-1">
                <Link
                    to={`/products/${product.slug}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                >
                    {product.name}
                </Link>

                {/* Price */}
                <p className="text-sm text-gray-600 mt-1">₹{item.price.toFixed(2)} each</p>

                {outOfStock && (
                    <p className="text-xs text-red-600 font-medium mt-1">Out of stock</p>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center gap-2 mt-3">
                    <button
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={isUpdating || outOfStock}
                        className="p-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                    >
                        <Minus size={16} />
                    </button>
                    <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="w-12 text-center border rounded py-1"
                    />
                    <button
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        disabled={isUpdating || item.quantity >= product.stock || outOfStock}
                        className="p-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Line Total and Remove */}
            <div className="flex flex-col items-end justify-between">
                <p className="font-semibold text-gray-900">₹{lineTotal.toFixed(2)}</p>
                <button
                    onClick={handleRemove}
                    disabled={isUpdating}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
