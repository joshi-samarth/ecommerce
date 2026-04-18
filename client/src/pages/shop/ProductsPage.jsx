import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import SearchBar from '../../components/shop/SearchBar';
import FilterSidebar from '../../components/shop/FilterSidebar';
import ProductGrid from '../../components/shop/ProductGrid';
import Pagination from '../../components/shop/Pagination';
import { useProducts } from '../../hooks/useProducts';
import axios from '../../api/axios';

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 10000 });

    // Get initial filters from URL params
    // Clean up single-character search terms that shouldn't be in URL (like 't')
    let initialSearch = searchParams.get('search') || '';
    if (initialSearch && initialSearch.length <= 1) {
        initialSearch = '';
    }

    const initialFilters = {
        search: initialSearch,
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        minRating: searchParams.get('minRating') || '',
        minDiscount: searchParams.get('minDiscount') || '',
        inStock: searchParams.get('inStock') || '',
        sort: searchParams.get('sort') || 'newest',
        page: parseInt(searchParams.get('page')) || 1,
    };

    const {
        products,
        isLoading,
        error,
        pagination,
        handleSearch,
        handleCategoryChange,
        handlePriceChange,
        handleSort,
        handlePageChange,
        resetFilters,
        filters,
        updateFilters,
        updateFilter,
        changePage,
    } = useProducts(initialFilters);

    // Fetch categories and price range
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch categories
                const categoriesRes = await axios.get('/api/categories');
                if (categoriesRes.data.success) {
                    setCategories(categoriesRes.data.data);
                }

                // Fetch price range
                const priceRes = await axios.get('/api/products/price-range');
                if (priceRes.data.success) {
                    setPriceRange(priceRes.data.data);
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
            }
        };

        fetchInitialData();
    }, []);

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        // Only add search if it's more than 1 character (prevents 't' or single chars)
        if (filters.search && filters.search.length > 1) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.minRating) params.append('minRating', filters.minRating);
        if (filters.minDiscount) params.append('minDiscount', filters.minDiscount);
        if (filters.inStock) params.append('inStock', filters.inStock);
        if (filters.page > 1) params.append('page', filters.page);

        setSearchParams(params, { replace: true });
    }, [filters, setSearchParams]);

    const handleFilterChange = (key, value) => {
        if (key === 'clearAll') {
            resetFilters();
        } else if (key === 'category') {
            handleCategoryChange(value);
        } else if (key === 'minPrice' || key === 'maxPrice') {
            updateFilters({ [key]: value > 0 ? value : '' });
        } else if (key === 'inStock') {
            updateFilters({ inStock: value ? 'true' : '' });
        } else if (key === 'minRating') {
            updateFilters({ minRating: value });
        } else {
            updateFilters({ [key]: value });
        }
    };

    // Active filters for display
    const activeFilters = [];
    if (filters.search) activeFilters.push({ type: 'search', label: `"${filters.search}"` });
    if (filters.category) activeFilters.push({ type: 'category', label: `Category: ${filters.category}` });
    if (filters.minPrice) activeFilters.push({ type: 'minPrice', label: `Min: ₹${filters.minPrice}` });
    if (filters.maxPrice) activeFilters.push({ type: 'maxPrice', label: `Max: ₹${filters.maxPrice}` });
    if (filters.minRating) activeFilters.push({ type: 'minRating', label: `${filters.minRating}★ & up` });
    if (filters.minDiscount) activeFilters.push({ type: 'minDiscount', label: `${filters.minDiscount}% off` });
    if (filters.inStock === 'true') activeFilters.push({ type: 'inStock', label: 'In Stock' });

    const removeFilter = (type, value) => {
        if (type === 'search') {
            handleFilterChange('search', '');
        } else if (type === 'category') {
            handleFilterChange('category', '');
        } else if (type === 'minPrice') {
            handleFilterChange('minPrice', '');
        } else if (type === 'maxPrice') {
            handleFilterChange('maxPrice', '');
        } else if (type === 'minRating') {
            handleFilterChange('minRating', '');
        } else if (type === 'minDiscount') {
            handleFilterChange('minDiscount', '');
        } else if (type === 'inStock') {
            handleFilterChange('inStock', '');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="page-container py-10">
                {/* Header Section */}
                <div className="mb-10">
                    <div className="mb-8">
                        <h1 className="text-5xl font-bold text-gray-900 mb-2">Shop Products</h1>
                        <p className="text-lg text-gray-600">Browse our curated collection</p>
                    </div>

                    {/* Search and Sort Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        <div className="flex-1 min-w-0">
                            <SearchBar
                                value={filters.search}
                                onChange={(value) => updateFilters({ search: value })}
                                onSearch={(value) => handleFilterChange('search', value)}
                                placeholder="Search products, brands, categories..."
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={filters.sort}
                            onChange={(e) => handleSort(e.target.value)}
                            className="input px-4 py-2.5 font-medium text-gray-700 bg-white"
                        >
                            <option value="">Relevance</option>
                            <option value="newest">Newest</option>
                            <option value="popular">Popularity</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>

                        {/* Filter Button (Mobile) */}
                        <button
                            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                            className="lg:hidden btn btn-secondary relative"
                        >
                            <Filter size={18} />
                            <span>Filters</span>
                            {activeFilters.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                                    {activeFilters.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Active Filters Display */}
                    {activeFilters.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-3 items-center pb-6 border-b border-gray-200">
                            {activeFilters.map((filter, index) => (
                                <div
                                    key={index}
                                    className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-200/60"
                                >
                                    <span>{filter.label}</span>
                                    <button
                                        onClick={() => removeFilter(filter.type, filter.label)}
                                        className="ml-1 hover:text-indigo-900 transition-colors p-1 rounded-full hover:bg-indigo-200"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    resetFilters();
                                    setSearchParams('');
                                }}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold hover:underline transition-colors"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex gap-8">
                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="card sticky top-24">
                            <div className="card-header">
                                <h2 className="font-bold text-gray-900">Filters</h2>
                            </div>
                            <div className="card-body">
                                <FilterSidebar
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    categories={categories}
                                    priceRange={{ min: priceRange.minPrice || 0, max: priceRange.maxPrice || 10000 }}
                                    isOpen={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Mobile */}
                    {filterPanelOpen && (
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            categories={categories}
                            priceRange={{ min: priceRange.minPrice || 0, max: priceRange.maxPrice || 10000 }}
                            isOpen={filterPanelOpen}
                            onClose={() => setFilterPanelOpen(false)}
                        />
                    )}

                    {/* Products Section */}
                    <div className="flex-1 min-w-0">
                        {/* Results Count - Enhanced Typography */}
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                {!isLoading && products.length > 0 && (
                                    <p className="text-base font-semibold text-gray-900">
                                        Showing <span className="text-indigo-600">{products.length}</span> of <span className="text-indigo-600">{pagination.totalProducts}</span>
                                        <span className="text-gray-600"> products</span>
                                    </p>
                                )}
                                {!isLoading && products.length === 0 && !error && (
                                    <p className="text-base text-gray-500">No products found</p>
                                )}
                            </div>
                        </div>

                        {/* Error Message - Modern Styling */}
                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 shadow-sm">
                                <div className="flex-shrink-0 mt-0.5">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-red-800">Error loading products</p>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Product Grid */}
                        <ProductGrid
                            products={products}
                            loading={isLoading}
                            emptyMessage="No products found matching your criteria"
                        />

                        {/* Pagination - Modern Spacing */}
                        {!isLoading && products.length > 0 && pagination.totalPages > 1 && (
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <Pagination
                                    page={pagination.currentPage}
                                    pages={pagination.totalPages}
                                    onPageChange={changePage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
