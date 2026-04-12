import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState({
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        itemCount: 0,
        coupon: null,
    });
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Fetch cart from backend
    const fetchCart = useCallback(async () => {
        if (!user) {
            // Reset cart when not logged in
            setCart({
                items: [],
                subtotal: 0,
                discount: 0,
                total: 0,
                itemCount: 0,
                coupon: null,
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('/api/cart');
            if (response.data.success) {
                setCart(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Add to cart
    const addToCart = useCallback(
        async (productId, quantity = 1) => {
            try {
                // Optimistic update
                setCart((prev) => ({
                    ...prev,
                    itemCount: prev.itemCount + quantity,
                }));

                const response = await axios.post('/api/cart/add', { productId, quantity });
                if (response.data.success) {
                    setCart(response.data.data);
                    toast.success('Added to cart!');
                    return response.data.data;
                }
            } catch (error) {
                // Revert optimistic update
                await fetchCart();
                const message = error.response?.data?.message || 'Failed to add to cart';
                toast.error(message);
                throw error;
            }
        },
        [fetchCart]
    );

    // Update cart item
    const updateItem = useCallback(async (productId, quantity) => {
        try {
            const response = await axios.put('/api/cart/update', { productId, quantity });
            if (response.data.success) {
                setCart(response.data.data);
                return response.data.data;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update cart';
            toast.error(message);
            throw error;
        }
    }, []);

    // Remove from cart
    const removeItem = useCallback(async (productId) => {
        try {
            const response = await axios.delete(`/api/cart/remove/${productId}`);
            if (response.data.success) {
                setCart(response.data.data);
                toast.success('Removed from cart');
                return response.data.data;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to remove item';
            toast.error(message);
            throw error;
        }
    }, []);

    // Clear cart
    const clearCart = useCallback(async () => {
        try {
            const response = await axios.delete('/api/cart/clear');
            if (response.data.success) {
                setCart(response.data.data);
                toast.success('Cart cleared');
                return response.data.data;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to clear cart';
            toast.error(message);
            throw error;
        }
    }, []);

    // Apply coupon
    const applyCoupon = useCallback(async (code) => {
        try {
            const response = await axios.post('/api/cart/coupon', { code });
            if (response.data.success) {
                setCart(response.data.data.cart);
                toast.success(`Coupon applied! You saved ₹${response.data.data.discount.toFixed(2)}`);
                return response.data.data;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to apply coupon';
            toast.error(message);
            throw error;
        }
    }, []);

    // Remove coupon
    const removeCoupon = useCallback(async () => {
        try {
            const response = await axios.delete('/api/cart/coupon');
            if (response.data.success) {
                setCart(response.data.data);
                toast.success('Coupon removed');
                return response.data.data;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to remove coupon';
            toast.error(message);
            throw error;
        }
    }, []);

    const openDrawer = useCallback(() => {
        setDrawerOpen(true);
    }, []);

    const closeDrawer = useCallback(() => {
        setDrawerOpen(false);
    }, []);

    // Fetch cart on mount if user is logged in
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const value = {
        cart,
        loading,
        drawerOpen,
        fetchCart,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        openDrawer,
        closeDrawer,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = React.useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}
