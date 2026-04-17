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
        <div className="space-y-3">
            {!couponApplied ? (
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        disabled={isLoading}
                        className="input flex-1 text-sm"
                    />
                    <button
                        onClick={handleApply}
                        disabled={isLoading || !code.trim()}
                        className="btn btn-primary btn-sm"
                    >
                        Apply
                    </button>
                </div>
            ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-emerald-700">
                                ✓ Coupon Applied: <span className="font-bold">{typeof couponApplied === 'object' ? couponApplied.code : 'Coupon'}</span>
                            </p>
                            <p className="text-xs text-emerald-600 mt-1">
                                You saved ₹{cart.discount?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                        <button
                            onClick={handleRemove}
                            disabled={isLoading}
                            className="btn btn-sm btn-danger text-xs"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
