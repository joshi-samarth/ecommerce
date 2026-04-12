import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import SearchBar from '../components/products/SearchBar';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/products/Pagination';
import Breadcrumb from '../components/products/Breadcrumb';

export default function ProductsPage() {
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const {
        products,
        categories,
        isLoading,
        pagination,
        priceRange,
        filters,
        handleSearch,
        handleCategoryChange,
        handlePriceChange,
        handleSort,
        handlePageChange,
        resetFilters,
    } = useProducts();

    // Find category name for breadcrumb
    const breadcrumbCategory = categories.find((cat) => cat.slug === filters.category);

    const breadcrumbItems = [];
    if (filters.search) {
        breadcrumbItems.push({ label: `Search: "${filters.search}"` });
    } else if (filters.category) {
        breadcrumbItems.push({ label: breadcrumbCategory?.name || 'Category' });
    } else {
        breadcrumbItems.push({ label: 'All Products' });
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop</h1>
                    <div className="w-full md:w-1/2">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        <FilterSidebar
                            categories={categories}
                            priceRange={priceRange}
                            selectedCategory={filters.category}
                            selectedPriceRange={{
                                min: filters.minPrice,
                                max: filters.maxPrice,
                            }}
                            onCategoryChange={handleCategoryChange}
                            onPriceChange={handlePriceChange}
                            onReset={resetFilters}
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* Mobile Filter Button */}
                        <div className="lg:hidden mb-6">
                            <button
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L13 9.414V16a1 1 0 01-1.447.894l-4-2A1 1 0 017 13.618V9.414L3.293 5.707A1 1 0 013 5V3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Filters
                            </button>

                            {/* Mobile Filter Panel */}
                            {isMobileFilterOpen && (
                                <div className="mt-4 bg-white rounded-lg shadow p-6">
                                    <FilterSidebar
                                        categories={categories}
                                        priceRange={priceRange}
                                        selectedCategory={filters.category}
                                        selectedPriceRange={{
                                            min: filters.minPrice,
                                            max: filters.maxPrice,
                                        }}
                                        onCategoryChange={handleCategoryChange}
                                        onPriceChange={handlePriceChange}
                                        onReset={resetFilters}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Sort and Results Info */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-gray-600">
                                <span className="font-semibold">{pagination.totalProducts}</span> products found
                            </div>
                            <select
                                value={filters.sort}
                                onChange={(e) => handleSort(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="sold">Best Sellers</option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        <ProductGrid products={products} isLoading={isLoading} />

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <Pagination
                                totalPages={pagination.totalPages}
                                currentPage={pagination.currentPage}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
