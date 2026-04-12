import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import { useWishlist } from '../../hooks/useWishlist';
import axios from '../../api/axios';
import ProductCard from '../../components/shop/ProductCard';
import toast from 'react-hot-toast';

export default function WishlistPage() {
    const navigate = useNavigate();
    const { clearWishlist, wishlistItems, loading } = useWishlist();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isClearing, setIsClearing] = useState(false);

    // Fetch full wishlist with product details
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/wishlist');
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                toast.error('Failed to load wishlist');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleClearWishlist = async () => {
        if (!window.confirm('Are you sure you want to clear your entire wishlist?')) {
            return;
        }

        setIsClearing(true);
        try {
            await clearWishlist();
            setProducts([]);
            toast.success('Wishlist cleared');
        } finally {
            setIsClearing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar showBackButton={true} title="My Wishlist" />

            {/* Wishlist Info */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        {products.length} {products.length === 1 ? 'item' : 'items'}
                    </p>
                    {products.length > 0 && (
                        <button
                            onClick={handleClearWishlist}
                            disabled={isClearing}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50"
                        >
                            <Trash2 size={18} />
                            Clear Wishlist
                        </button>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-6xl mb-4">💝</div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Start adding products to your wishlist to save them for later.
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Discover Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
