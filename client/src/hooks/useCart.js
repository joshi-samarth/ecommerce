import { useCart as useCartContext } from '../context/CartContext';

export function useCart() {
    const context = useCartContext();

    const getItemQuantity = (productId) => {
        const item = context.cart.items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
    };

    return {
        ...context,
        getItemQuantity,
    };
}
