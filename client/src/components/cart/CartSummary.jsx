import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import CouponInput from './CouponInput';

export default function CartSummary({ showCheckoutButton = false }) {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();

    const hasItems = cart.items && cart.items.length > 0;
    const anyInStock = hasItems && cart.items.some((item) => item.product.stock > 0);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/products');
    };

    return (
        <div className="space-y-4">
            {/* Coupon Input */}
            <CouponInput />

            {/* Summary */}
            <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{cart.subtotal?.toFixed(2) || '0.00'}</span>
                </div>

                {cart.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Discount {cart.coupon && `(${typeof cart.coupon === 'object' ? cart.coupon.code : 'Coupon'})`}</span>
                        <span className="font-medium">-₹{cart.discount?.toFixed(2) || '0.00'}</span>
                    </div>
                )}

                <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-blue-600">₹{cart.total?.toFixed(2) || '0.00'}</span>
                </div>

                <p className="text-xs text-gray-500 pt-2">
                    {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in cart
                </p>
            </div>

            {/* Buttons */}
            {showCheckoutButton && (
                <div className="space-y-2 pt-4">
                    <button
                        onClick={handleCheckout}
                        disabled={!anyInStock}
                        className="w-full py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        Proceed to Checkout
                    </button>
                    <button
                        onClick={handleContinueShopping}
                        className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50"
                    >
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    );
}
