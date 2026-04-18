import { Heart } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function WishlistButton({ productId, size = 'md' }) {
    const { isWishlisted, toggleWishlist, loading } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();

    const wishlisted = isWishlisted(productId);

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    };

    const handleClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!user) {
            toast.error('Login to save items');
            navigate('/login');
            return;
        }

        if (!productId) {
            toast.error('Product information not available');
            console.warn('WishlistButton: productId is missing or invalid');
            return;
        }

        try {
            await toggleWishlist(productId);
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`${sizeClasses[size]} transition-transform duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 flex items-center justify-center`}
        >
            {wishlisted ? (
                <Heart className={`${sizeClasses[size]} fill-red-500 text-red-500`} />
            ) : (
                <Heart className={`${sizeClasses[size]} text-gray-400`} />
            )}
        </button>
    );
}
