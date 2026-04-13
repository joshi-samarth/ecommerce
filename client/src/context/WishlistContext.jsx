import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch wishlist
    const fetchWishlist = useCallback(async () => {
        if (!user) {
            // Reset wishlist when not logged in
            setWishlistItems([]);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('/api/wishlist');
            if (response.data.success) {
                // Store only product IDs for quick lookup
                const ids = response.data.data.map((item) => item._id);
                setWishlistItems(ids);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Toggle wishlist
    const toggleWishlist = useCallback(
        async (productId) => {
            try {
                if (!productId) {
                    throw new Error('Product ID is required');
                }

                // Optimistic update
                setWishlistItems((prev) => {
                    if (prev.includes(productId)) {
                        return prev.filter((id) => id !== productId);
                    } else {
                        return [...prev, productId];
                    }
                });

                const response = await axios.post('/api/wishlist/toggle', { productId });
                if (response.data.success) {
                    // Verify optimistic update by checking response
                    const ids = response.data.data.wishlist.map((item) =>
                        typeof item === 'string' ? item : item._id
                    );
                    setWishlistItems(ids);

                    if (response.data.data.isWishlisted) {
                        toast.success('Added to wishlist');
                    } else {
                        toast.success('Removed from wishlist');
                    }
                    return response.data.data;
                } else {
                    // If success is false, revert and show error
                    await fetchWishlist();
                    const errorMsg = response.data.message || 'Failed to update wishlist';
                    toast.error(errorMsg);
                    throw new Error(errorMsg);
                }
            } catch (error) {
                // Revert optimistic update
                await fetchWishlist();
                const message = error.response?.data?.message || error.message || 'Failed to update wishlist';
                console.error('Wishlist toggle error:', message);
                toast.error(message);
                throw error;
            }
        },
        [fetchWishlist]
    );

    // Check if product is wishlisted
    const isWishlisted = useCallback((productId) => {
        return wishlistItems.includes(productId);
    }, [wishlistItems]);

    // Clear wishlist
    const clearWishlist = useCallback(async () => {
        try {
            const response = await axios.delete('/api/wishlist/clear');
            if (response.data.success) {
                setWishlistItems([]);
                toast.success('Wishlist cleared');
                return response.data.data;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to clear wishlist';
            toast.error(message);
            throw error;
        }
    }, []);

    // Fetch wishlist on mount
    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const value = {
        wishlistItems,
        loading,
        fetchWishlist,
        toggleWishlist,
        isWishlisted,
        clearWishlist,
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const context = React.useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
}
