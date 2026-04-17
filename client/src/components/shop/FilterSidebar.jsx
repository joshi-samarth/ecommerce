import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FilterSidebar({
    filters = {},
    onFilterChange = () => { },
    categories = [],
    priceRange = { min: 0, max: 10000 },
    isOpen = true,
    onClose = () => { },
}) {
    const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice || priceRange.min);
    const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || priceRange.max);
    const [selectedRating, setSelectedRating] = useState(filters.minRating || 0);

    useEffect(() => {
        setLocalMinPrice(filters.minPrice || priceRange.min);
        setLocalMaxPrice(filters.maxPrice || priceRange.max);
    }, [filters, priceRange]);

    const handleCategoryChange = (categorySlug) => {
        const selectedCategories = (filters.category || '').split(',').filter(Boolean);
        const newCategories = selectedCategories.includes(categorySlug)
            ? selectedCategories.filter((c) => c !== categorySlug)
            : [...selectedCategories, categorySlug];

        onFilterChange('category', newCategories.join(','));
    };

    const handlePriceRangeChange = () => {
        onFilterChange('minPrice', localMinPrice);
        onFilterChange('maxPrice', localMaxPrice);
    };

    const handleAvailabilityChange = () => {
        onFilterChange('inStock', filters.inStock ? '' : 'true');
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
        onFilterChange('minRating', rating);
    };

    const handleClearAllFilters = () => {
        setLocalMinPrice(priceRange.min);
        setLocalMaxPrice(priceRange.max);
        setSelectedRating(0);
        onFilterChange('clearAll', true);
    };

    const selectedCategories = (filters.category || '').split(',').filter(Boolean);

    const desktopClass = 'hidden lg:block w-64 pr-6 border-r border-gray-200';
    const mobileClass = isOpen
        ? 'fixed inset-0 z-40 bg-black/50 lg:hidden'
        : 'hidden lg:hidden';

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}

            {/* Filter Panel */}
            <div
                className={`${isOpen ? 'fixed right-0 top-0 z-40 h-full w-80 bg-white shadow-lg lg:sticky' : 'hidden'} lg:block lg:relative lg:w-auto lg:h-auto lg:shadow-none left-0 top-0`}
            >
                {/* Header - Mobile Only */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                <div className="p-4 lg:p-0 lg:pt-6 overflow-y-auto h-[calc(100vh-120px)] lg:h-auto">
                    {/* Clear All Button */}
                    <button
                        onClick={handleClearAllFilters}
                        className="w-full mb-8 px-3 py-2 text-left text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-300"
                    >
                        Clear All Filters
                    </button>

                    {/* Categories */}
                    <div className="mb-8 pb-8 border-b border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Categories</h3>
                        <div className="space-y-3">
                            {categories.map((cat) => (
                                <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.slug)}
                                        onChange={() => handleCategoryChange(cat.slug)}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer transition-all"
                                    />
                                    <span className="text-sm text-gray-700 flex-1 group-hover:text-gray-900 group-hover:font-medium transition-all">{cat.name}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded group-hover:bg-indigo-50 transition-colors">({cat.productCount})</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-8 pb-8 border-b border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Price Range (₹)</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="label text-xs font-semibold text-gray-700 mb-2">Min Price</label>
                                <input
                                    type="number"
                                    value={localMinPrice}
                                    onChange={(e) => setLocalMinPrice(Number(e.target.value))}
                                    onBlur={handlePriceRangeChange}
                                    className="input text-sm"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                />
                            </div>
                            <div>
                                <label className="label text-xs font-semibold text-gray-700 mb-2">Max Price</label>
                                <input
                                    type="number"
                                    value={localMaxPrice}
                                    onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
                                    onBlur={handlePriceRangeChange}
                                    className="input text-sm"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                />
                            </div>
                            <input
                                type="range"
                                min={priceRange.min}
                                max={priceRange.max}
                                value={localMaxPrice}
                                onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
                                onMouseUp={handlePriceRangeChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all"
                            />
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="mb-8 pb-8 border-b border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Availability</h3>
                        <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-indigo-50 transition-all">
                            <input
                                type="checkbox"
                                checked={filters.inStock === 'true'}
                                onChange={handleAvailabilityChange}
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer transition-all"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 group-hover:font-medium transition-all">In Stock Only</span>
                        </label>
                    </div>

                    {/* Rating */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Rating</h3>
                        <div className="space-y-3">
                            {[4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingChange(rating)}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${selectedRating === rating
                                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                                        }`}
                                >
                                    <span className="text-lg">★</span> {rating} & Up
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
