import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export default function EmptyCart() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything yet.</p>
            <button
                onClick={() => navigate('/products')}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Start Shopping
            </button>
        </div>
    );
}
