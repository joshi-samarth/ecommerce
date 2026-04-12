import PropTypes from 'prop-types';
import { useState } from 'react';

export default function FilterSidebar({
    categories = [],
    priceRange = { minPrice: 0, maxPrice: 10000 },
    selectedCategory = null,
    selectedPriceRange = { min: 0, max: 10000 },
    onCategoryChange = null,
    onPriceChange = null,
    onReset = null,
}) {
    const [localPriceRange, setLocalPriceRange] = useState(selectedPriceRange);

    const handlePriceMinChange = (e) => {
        const newMin = parseInt(e.target.value, 10);
        if (newMin <= localPriceRange.max) {
            setLocalPriceRange({ ...localPriceRange, min: newMin });
        }
    };

    const handlePriceMaxChange = (e) => {
        const newMax = parseInt(e.target.value, 10);
        if (newMax >= localPriceRange.min) {
            setLocalPriceRange({ ...localPriceRange, max: newMax });
        }
    };

    const handleApplyPrice = () => {
        if (onPriceChange) {
            onPriceChange(localPriceRange);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-20">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

            {/* Reset Button */}
            <button
                onClick={onReset}
                className="w-full mb-6 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors font-semibold"
            >
                Reset Filters
            </button>

            {/* Categories */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Categories</h4>
                <div className="space-y-2">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="radio"
                            name="category"
                            value=""
                            checked={!selectedCategory}
                            onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
                            className="w-4 h-4"
                        />
                        <span className="ml-3 text-gray-700 group-hover:text-gray-900">All Categories</span>
                    </label>
                    {categories.map((category) => (
                        <label key={category._id} className="flex items-center cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                value={category.slug}
                                checked={selectedCategory === category.slug}
                                onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
                                className="w-4 h-4"
                            />
                            <span className="ml-3 text-gray-700 group-hover:text-gray-900">
                                {category.name}
                                {category.productCount && (
                                    <span className="text-gray-500 ml-1">({category.productCount})</span>
                                )}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Min: ₹{localPriceRange.min}</label>
                        <input
                            type="range"
                            min={priceRange.minPrice}
                            max={priceRange.maxPrice}
                            value={localPriceRange.min}
                            onChange={handlePriceMinChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Max: ₹{localPriceRange.max}</label>
                        <input
                            type="range"
                            min={priceRange.minPrice}
                            max={priceRange.maxPrice}
                            value={localPriceRange.max}
                            onChange={handlePriceMaxChange}
                            className="w-full"
                        />
                    </div>
                </div>
                <button
                    onClick={handleApplyPrice}
                    className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                >
                    Apply Price Filter
                </button>
            </div>

            {/* Stock Filter */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Availability</h4>
                <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="ml-3 text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="ml-3 text-gray-700">Out of Stock</span>
                    </label>
                </div>
            </div>

            {/* Rating Filter */}
            <div>
                <h4 className="font-semibold text-gray-800 mb-3">Rating</h4>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center cursor-pointer">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="ml-3 text-gray-700">
                                {'★'.repeat(rating)}
                                {'☆'.repeat(5 - rating)}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

FilterSidebar.propTypes = {
    categories: PropTypes.array,
    priceRange: PropTypes.shape({
        minPrice: PropTypes.number,
        maxPrice: PropTypes.number,
    }),
    selectedCategory: PropTypes.string,
    selectedPriceRange: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
    }),
    onCategoryChange: PropTypes.func,
    onPriceChange: PropTypes.func,
    onReset: PropTypes.func,
};
