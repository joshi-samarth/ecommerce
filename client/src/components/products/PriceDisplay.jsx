import PropTypes from 'prop-types';

export default function PriceDisplay({ price, comparePrice, className = '' }) {
    const discountPercent = comparePrice && comparePrice > price
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="text-2xl font-bold text-blue-600">₹{price.toLocaleString('en-IN')}</span>
            {comparePrice && comparePrice > price && (
                <>
                    <span className="text-lg text-gray-500 line-through">₹{comparePrice.toLocaleString('en-IN')}</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
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
