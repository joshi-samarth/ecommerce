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
    const initialFilters = {
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
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
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sort !== 'newest') params.append('sort', filters.sort);
        if (filters.page > 1) params.append('page', filters.page);

        setSearchParams(params);
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
    if (filters.search) activeFilters.push({ type: 'search', label: filters.search });
    if (filters.category) activeFilters.push({ type: 'category', label: filters.category });
    if (filters.minPrice) activeFilters.push({ type: 'minPrice', label: `Min: ₹${filters.minPrice}` });
    if (filters.maxPrice) activeFilters.push({ type: 'maxPrice', label: `Max: ₹${filters.maxPrice}` });

    const removeFilter = (type, value) => {
        if (type === 'search') {
            handleFilterChange('search', '');
        } else if (type === 'category') {
            handleFilterChange('category', '');
        } else if (type === 'minPrice') {
            handleFilterChange('minPrice', '');
        } else if (type === 'maxPrice') {
            handleFilterChange('maxPrice', '');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar showBackButton={true} title="Products" />
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex flex-col gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600">Browse our collection of products</p>
                    </div>

                    {/* Search and Sort Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        <SearchBar
                            value={filters.search}
                            onChange={(value) => updateFilters({ search: value })}
                            onSearch={(value) => handleFilterChange('search', value)}
                            placeholder="Search products..."
                        />

                        {/* Sort Dropdown */}
                        <select
                            value={filters.sort}
                            onChange={(e) => handleSort(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="newest">Newest</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="popular">Most Popular</option>
                            <option value="rating">Highest Rated</option>
                        </select>

                        {/* Filter Button (Mobile) */}
                        <button
                            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
                        >
                            <Filter size={20} />
                            <span>Filters</span>
                            {activeFilters.length > 0 && (
                                <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {activeFilters.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Active Filters */}
                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {activeFilters.map((filter, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-sm"
                                >
                                    <span>{filter.label}</span>
                                    <button
                                        onClick={() => removeFilter(filter.type, filter.label)}
                                        className="hover:bg-primary-dark rounded-full p-0.5"
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
                                className="text-primary hover:underline text-sm font-semibold"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex gap-6">
                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:block w-64">
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            categories={categories}
                            priceRange={priceRange}
                            isOpen={true}
                        />
                    </div>

                    {/* Sidebar - Mobile */}
                    {filterPanelOpen && (
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            categories={categories}
                            priceRange={priceRange}
                            isOpen={filterPanelOpen}
                            onClose={() => setFilterPanelOpen(false)}
                        />
                    )}

                    {/* Products Section */}
                    <div className="flex-1">
                        {/* Results Count */}
                        <div className="mb-4 text-sm text-gray-600">
                            {!isLoading && products.length > 0 && (
                                <>
                                    Showing <span className="font-semibold">{products.length}</span> of{' '}
                                    <span className="font-semibold">{pagination.totalProducts}</span> products
                                </>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Product Grid */}
                        <ProductGrid
                            products={products}
                            loading={isLoading}
                            emptyMessage="No products found matching your criteria"
                        />

                        {/* Pagination */}
                        {!isLoading && products.length > 0 && pagination.totalPages > 1 && (
                            <Pagination
                                page={pagination.currentPage}
                                pages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
