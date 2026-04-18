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

    useEffect(() => {
        setLocalMinPrice(filters.minPrice || priceRange.min);
        setLocalMaxPrice(filters.maxPrice || priceRange.max);
    }, [filters, priceRange]);

    const handleCategoryChange = (categorySlug) => {
        // Single-select radio behavior: if clicked category equals current, deselect; otherwise select it
        const newCategory = filters.category === categorySlug ? '' : categorySlug;
        onFilterChange('category', newCategory);
    };

    const handlePriceRangeChange = () => {
        onFilterChange('minPrice', localMinPrice);
        onFilterChange('maxPrice', localMaxPrice);
    };

    const handleAvailabilityChange = () => {
        onFilterChange('inStock', filters.inStock ? '' : 'true');
    };

    const handleRatingChange = (rating) => {
        // Toggle behavior: if already selected, clear it
        const newRating = Number(filters.minRating) === rating ? '' : rating;
        onFilterChange('minRating', newRating);
    };

    const handleDiscountChange = (discount) => {
        // Toggle behavior: if already selected, clear it
        const newDiscount = Number(filters.minDiscount) === discount ? '' : discount;
        onFilterChange('minDiscount', newDiscount);
    };

    const handleClearAllFilters = () => {
        setLocalMinPrice(priceRange.min);
        setLocalMaxPrice(priceRange.max);
        onFilterChange('clearAll', true);
    };

    // Single category selection with radio behavior
    const selectedCategory = filters.category || '';

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
                            {/* All Categories - Radio Option */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="category-filter"
                                    checked={selectedCategory === ''}
                                    onChange={() => handleCategoryChange('')}
                                    className="w-4 h-4 rounded-full border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer transition-all"
                                />
                                <span className="text-sm font-medium text-gray-700 flex-1 group-hover:text-gray-900 transition-all">All Categories</span>
                            </label>

                            {/* Individual Categories - Radio Options */}
                            {categories.map((cat) => (
                                <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category-filter"
                                        checked={selectedCategory === cat.slug}
                                        onChange={() => handleCategoryChange(cat.slug)}
                                        className="w-4 h-4 rounded-full border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer transition-all"
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
                    <div className="mb-8 pb-8 border-b border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Rating</h3>
                        <div className="space-y-3">
                            {[4, 3, 2].map((rating) => (
                                <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="minRating"
                                        value={rating}
                                        checked={Number(filters.minRating) === rating}
                                        onChange={() => handleRatingChange(rating)}
                                        className="w-4 h-4 rounded-full border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer transition-all"
                                    />
                                    <span className="text-sm text-gray-700 flex-1 group-hover:text-gray-900 transition-all">
                                        <span className="text-lg">★</span> {rating}★ & above
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Discount */}
                    <div className="mb-8 pb-8 border-b border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Discount</h3>
                        <div className="space-y-3">
                            {[10, 20, 30, 40, 50].map((discount) => (
                                <label key={discount} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="minDiscount"
                                        value={discount}
                                        checked={Number(filters.minDiscount) === discount}
                                        onChange={() => handleDiscountChange(discount)}
                                        className="w-4 h-4 rounded-full border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer transition-all"
                                    />
                                    <span className="text-sm text-gray-700 flex-1 group-hover:text-gray-900 transition-all">
                                        {discount}% or more
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
