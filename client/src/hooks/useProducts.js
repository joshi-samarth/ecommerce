import { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';

export function useProducts(initialFilters = {}) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        productsPerPage: 12,
    });
    const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 10000 });
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: 0,
        maxPrice: 10000,
        sort: 'newest',
        page: 1,
        limit: 12,
        ...initialFilters,
    });

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                if (response.data.success) {
                    setCategories(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch price range
    useEffect(() => {
        const fetchPriceRange = async () => {
            try {
                const response = await axios.get('/api/products/price-range');
                if (response.data.success) {
                    const range = response.data.data;
                    setPriceRange(range);
                    setFilters((prev) => ({
                        ...prev,
                        minPrice: prev.minPrice || range.minPrice,
                        maxPrice: prev.maxPrice || range.maxPrice,
                    }));
                }
            } catch (err) {
                console.error('Error fetching price range:', err);
            }
        };
        fetchPriceRange();
    }, []);

    // Fetch products
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.sort) params.append('sort', filters.sort);
            params.append('page', filters.page);
            params.append('limit', filters.limit);

            const response = await axios.get(`/api/products?${params.toString()}`);
            if (response.data.success) {
                setProducts(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            console.error('Error fetching products:', err);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
    }, [filters, fetchProducts]);

    // Update filters
    const updateFilters = useCallback((newFilters) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: 1, // Reset to first page when filters change
        }));
    }, []);

    // Search handler
    const handleSearch = useCallback((searchTerm) => {
        updateFilters({ search: searchTerm });
    }, [updateFilters]);

    // Category filter handler
    const handleCategoryChange = useCallback((category) => {
        updateFilters({ category });
    }, [updateFilters]);

    // Price filter handler
    const handlePriceChange = useCallback((priceFilters) => {
        updateFilters({
            minPrice: priceFilters.min,
            maxPrice: priceFilters.max,
        });
    }, [updateFilters]);

    // Sort handler
    const handleSort = useCallback((sort) => {
        updateFilters({ sort });
    }, [updateFilters]);

    // Page change handler
    const handlePageChange = useCallback((page) => {
        updateFilters({ page });
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [updateFilters]);

    // Reset filters
    const resetFilters = useCallback(() => {
        setFilters({
            search: '',
            category: '',
            minPrice: priceRange.minPrice || 0,
            maxPrice: priceRange.maxPrice || 10000,
            sort: 'newest',
            page: 1,
            limit: 12,
        });
    }, [priceRange]);

    return {
        products,
        categories,
        isLoading,
        error,
        pagination,
        priceRange,
        filters,
        handleSearch,
        handleCategoryChange,
        handlePriceChange,
        handleSort,
        handlePageChange,
        resetFilters,
        updateFilters,
    };
}
