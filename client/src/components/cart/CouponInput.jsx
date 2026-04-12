import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

export default function CouponInput() {
    const { cart, applyCoupon, removeCoupon, loading } = useCart();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const couponApplied = cart.coupon;

    const handleApply = async () => {
        if (!code.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        setIsLoading(true);
        try {
            await applyCoupon(code);
            setCode('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async () => {
        setIsLoading(true);
        try {
            await removeCoupon();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-4 border-t">
            {!couponApplied ? (
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 border rounded text-sm disabled:bg-gray-100"
                    />
                    <button
                        onClick={handleApply}
                        disabled={isLoading || !code.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        Apply
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded border border-green-200">
                    <div>
                        <p className="text-sm font-medium text-green-700">
                            Coupon applied: <span className="font-bold">{typeof couponApplied === 'object' ? couponApplied.code : 'Coupon'}</span>
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                            You saved ₹{cart.discount?.toFixed(2) || '0.00'}
                        </p>
                    </div>
                    <button
                        onClick={handleRemove}
                        disabled={isLoading}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 disabled:opacity-50"
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
}
