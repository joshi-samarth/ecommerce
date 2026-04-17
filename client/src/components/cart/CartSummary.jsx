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
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{cart.subtotal?.toFixed(2) || '0.00'}</span>
                </div>

                {cart.discount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount {cart.coupon && `(${typeof cart.coupon === 'object' ? cart.coupon.code : 'Coupon'})`}</span>
                        <span className="font-medium text-emerald-600">-₹{cart.discount?.toFixed(2) || '0.00'}</span>
                    </div>
                )}

                <div className="divider"></div>

                <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-indigo-600">₹{cart.total?.toFixed(2) || '0.00'}</span>
                </div>

                <p className="text-xs text-gray-500 text-center">
                    {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in cart
                </p>
            </div>

            {/* Buttons */}
            {showCheckoutButton && (
                <div className="space-y-3 pt-4">
                    <button
                        onClick={handleCheckout}
                        disabled={!anyInStock}
                        className="btn btn-primary w-full"
                    >
                        Proceed to Checkout
                    </button>
                    <button
                        onClick={handleContinueShopping}
                        className="btn btn-secondary w-full"
                    >
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    );
}
