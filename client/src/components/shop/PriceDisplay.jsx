export default function PriceDisplay({ price, comparePrice, size = 'md' }) {
    const sizeMap = {
        sm: { price: 'text-lg', compare: 'text-sm', badge: 'text-xs px-2 py-0.5' },
        md: { price: 'text-2xl', compare: 'text-base', badge: 'text-sm px-2 py-1' },
        lg: { price: 'text-4xl', compare: 'text-xl', badge: 'text-base px-3 py-1' },
    };

    const { price: priceClass, compare: compareClass, badge: badgeClass } = sizeMap[size];

    const showDiscount = comparePrice && comparePrice > price;
    const discountPercent = showDiscount
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    return (
        <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
                <div className={`${priceClass} font-bold text-primary`}>
                    ₹{price.toLocaleString('en-IN')}
                </div>
                {showDiscount && (
                    <div className={`${compareClass} text-gray-400 line-through`}>
                        ₹{comparePrice.toLocaleString('en-IN')}
                    </div>
                )}
            </div>
            {showDiscount && (
                <div className={`${badgeClass} bg-green-100 text-green-800 rounded font-semibold`}>
                    {discountPercent}% OFF
                </div>
            )}
        </div>
    );
}
