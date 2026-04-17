import PropTypes from 'prop-types';

export default function PriceDisplay({ price, comparePrice, className = '' }) {
    const discountPercent = comparePrice && comparePrice > price
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <span className="text-3xl font-bold text-indigo-600">₹{price.toLocaleString('en-IN')}</span>
            {comparePrice && comparePrice > price && (
                <>
                    <span className="text-xl text-gray-500 line-through">₹{comparePrice.toLocaleString('en-IN')}</span>
                    <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-bold rounded-lg">
                        {discountPercent}% OFF
                    </span>
                </>
            )}
        </div>
    );
}

PriceDisplay.propTypes = {
    price: PropTypes.number.isRequired,
    comparePrice: PropTypes.number,
    className: PropTypes.string,
};
