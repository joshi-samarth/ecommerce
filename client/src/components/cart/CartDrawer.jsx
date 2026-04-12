import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';

export default function CartDrawer() {
    const { cart, drawerOpen, closeDrawer } = useCart();

    const hasItems = cart.items && cart.items.length > 0;

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && drawerOpen) {
                closeDrawer();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [drawerOpen, closeDrawer]);

    // Lock body scroll when drawer open
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [drawerOpen]);

    if (!drawerOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={closeDrawer}
            />

            {/* Drawer */}
            <div
                className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 flex flex-col transition-transform duration-300 ease-out"
                style={{
                    transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">
                        Your Cart ({cart.itemCount || 0})
                    </h2>
                    <button
                        onClick={closeDrawer}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {hasItems ? (
                        <div className="p-4 space-y-2">
                            {cart.items.map((item) => (
                                <CartItem key={item.product._id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <EmptyCart />
                    )}
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50">
                    <CartSummary showCheckoutButton={true} />
                </div>
            </div>
        </>
    );
}
