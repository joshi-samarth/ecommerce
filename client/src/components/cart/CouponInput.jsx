import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Gift, ChevronDown, ChevronUp } from 'lucide-react';

export default function CouponInput() {
    const { cart, applyCoupon, removeCoupon, loading } = useCart();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [showCoupons, setShowCoupons] = useState(false);
    const [loadingCoupons, setLoadingCoupons] = useState(false);

    const couponApplied = cart.coupon;

    // Fetch available coupons
    useEffect(() => {
        const fetchAvailableCoupons = async () => {
            try {
                setLoadingCoupons(true);
                const response = await axios.get('/api/cart/coupons/available');
                if (response.data.success) {
                    setAvailableCoupons(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching coupons:', error);
            } finally {
                setLoadingCoupons(false);
            }
        };
        fetchAvailableCoupons();
    }, []);

    const handleApply = async () => {
        if (!code.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        setIsLoading(true);
        try {
            await applyCoupon(code);
            setCode('');
            setShowCoupons(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyFromList = async (couponCode) => {
        setCode(couponCode);
        setIsLoading(true);
        try {
            await applyCoupon(couponCode);
            setCode('');
            setShowCoupons(false);
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
                <>
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

                    {/* Show available coupons banner */}
                    {availableCoupons.length > 0 && (
                        <div className="space-y-2">
                            <button
                                onClick={() => setShowCoupons(!showCoupons)}
                                className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between hover:bg-amber-100 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Gift className="w-4 h-4 text-amber-600" />
                                    <span className="text-sm font-semibold text-amber-900">
                                        {availableCoupons.length} coupon{availableCoupons.length > 1 ? 's' : ''} available - Save now!
                                    </span>
                                </div>
                                {showCoupons ? (
                                    <ChevronUp className="w-4 h-4 text-amber-600" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-amber-600" />
                                )}
                            </button>

                            {/* Available coupons list */}
                            {showCoupons && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                                    {availableCoupons.map((coupon) => {
                                        const usesLeft = coupon.usageLimit > 0 ? coupon.usageLimit - coupon.usedCount : null;
                                        const isLimited = usesLeft !== null && usesLeft <= 5;

                                        return (
                                            <div
                                                key={coupon._id}
                                                className="flex items-center justify-between p-2 bg-white border border-amber-100 rounded gap-2"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-mono font-bold text-amber-900 truncate">{coupon.code}</p>
                                                        {isLimited && (
                                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded whitespace-nowrap">
                                                                {usesLeft} left
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-amber-700">
                                                        {coupon.type === 'percent' ? `${coupon.value}% off` : `₹${coupon.value} off`}
                                                        {coupon.minOrderValue > 0 && ` - Min ₹${coupon.minOrderValue}`}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleApplyFromList(coupon.code)}
                                                    disabled={isLoading}
                                                    className="btn btn-sm btn-warning text-xs whitespace-nowrap"
                                                >
                                                    Use
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </>
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
