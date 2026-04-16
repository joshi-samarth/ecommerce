import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import ProductGrid from '../components/shop/ProductGrid';
import axios from '../api/axios';

const HomePage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch categories
                const catResponse = await axios.get('/api/categories');
                if (catResponse.data.success) {
                    setCategories(catResponse.data.data);
                }

                // Fetch featured products
                const prodResponse = await axios.get('/api/products?featured=true&limit=8');
                if (prodResponse.data.success) {
                    setFeaturedProducts(prodResponse.data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main>
                {/* HERO SECTION */}
                <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                                Shop Everything You Love
                            </h1>
                            <p className="text-lg md:text-xl text-indigo-100 mb-8">
                                Discover amazing products at unbeatable prices with fast shipping and easy returns.
                            </p>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="mb-8">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for products..."
                                        className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-base"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 p-3 rounded-full transition"
                                    >
                                        <Search size={20} className="text-white" />
                                    </button>
                                </div>
                            </form>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/products')}
                                    className="btn btn-lg bg-white text-indigo-600 hover:bg-gray-50"
                                >
                                    Shop Now
                                </button>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="btn btn-lg bg-indigo-500 hover:bg-indigo-400 text-white border border-white"
                                >
                                    View Categories
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CATEGORIES SECTION */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="section-title text-center mb-12">Shop by Category</h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                            {loading ? (
                                Array(4)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div key={i} className="skeleton h-32 rounded-2xl" />
                                    ))
                            ) : categories.length > 0 ? (
                                categories.slice(0, 8).map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => navigate(`/products?category=${cat.slug}`)}
                                        className="card p-6 text-center hover:shadow-lg transition group cursor-pointer"
                                    >
                                        <div className="text-4xl mb-3 group-hover:scale-110 transition transform">
                                            {cat.icon || '🏷️'}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                                        <p className="text-sm text-gray-500">{cat.productCount || 0} items</p>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500">
                                    No categories available
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* FEATURED PRODUCTS SECTION */}
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="section-title">Featured Products</h2>
                            <button
                                onClick={() => navigate('/products')}
                                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition"
                            >
                                View All →
                            </button>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {Array(4)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div key={i} className="card skeleton h-64" />
                                    ))}
                            </div>
                        ) : (
                            <ProductGrid products={featuredProducts} />
                        )}
                    </div>
                </section>

                {/* PROMO BANNER */}
                <section className="py-16 px-4 bg-gradient-to-r from-emerald-50 to-emerald-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="card bg-white border-emerald-200 p-8 md:p-12">
                            <div className="flex items-center gap-6">
                                <div className="flex-shrink-0">
                                    <Truck className="text-emerald-600" size={48} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Free Shipping on orders above ₹500
                                    </h3>
                                    <p className="text-gray-600">
                                        Get your items delivered quickly and securely. No extra charges!
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="btn btn-primary flex-shrink-0"
                                >
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TRUST BADGES */}
                <section className="py-20 px-4 bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <Truck className="text-indigo-600" size={40} />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Fast Shipping</h3>
                                <p className="text-gray-600 text-sm">
                                    Get your order delivered in 3-5 business days
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <ShieldCheck className="text-emerald-600" size={40} />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
                                <p className="text-gray-600 text-sm">
                                    Your payment information is protected
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <RotateCcw className="text-purple-600" size={40} />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
                                <p className="text-gray-600 text-sm">
                                    30-day return policy on all products
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
