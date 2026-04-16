import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import CartDrawer from './components/cart/CartDrawer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import UserLoginPage from './pages/UserLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import UserRegisterPage from './pages/UserRegisterPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminOrdersPage from './pages/admin/orders/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/orders/AdminOrderDetailPage';
import UserLayout from './layouts/UserLayout';
import AccountPage from './pages/user/AccountPage';
import ProfileTab from './pages/user/ProfileTab';
import AddressTab from './pages/user/AddressTab';
import OrdersTab from './pages/user/OrdersTab';
import SecurityTab from './pages/user/SecurityTab';
import ProductsPage from './pages/shop/ProductsPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import WishlistPage from './pages/shop/WishlistPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import OrderSuccessPage from './pages/shop/OrderSuccessPage';
import OrderDetailPage from './pages/shop/OrderDetailPage';
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<UserLoginPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/register" element={<UserRegisterPage />} />

                {/* Private Routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<HomePage />} />

                    {/* Products Routes */}
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:slug" element={<ProductDetailPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />

                    {/* Checkout Routes */}
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                    <Route path="/account/orders/:orderId" element={<OrderDetailPage />} />

                    {/* User Account Routes */}
                    <Route path="/account" element={<UserLayout />}>
                        <Route index element={<Navigate to="/account/profile" replace />} />
                        <Route path="profile" element={<ProfileTab />} />
                        <Route path="addresses" element={<AddressTab />} />
                        <Route path="orders" element={<OrdersTab />} />
                        <Route path="security" element={<SecurityTab />} />
                    </Route>
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="products/new" element={<AdminProductFormPage />} />
                        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
                        <Route path="categories" element={<AdminCategoriesPage />} />
                        <Route path="coupons" element={<AdminCouponsPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                    </Route>
                </Route>

                {/* Not Found Route */}
                <Route path="/404" element={<NotFoundPage />} />

                {/* Catch-all redirect */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

            {/* Cart Drawer - must be inside Router for useNavigate() */}
            <CartDrawer />
        </Router>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <App />
                </WishlistProvider>
            </CartProvider>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#111827',
                        color: '#F9FAFB',
                        borderRadius: '12px',
                        fontSize: '14px',
                        padding: '12px 16px',
                    },
                    success: {
                        iconTheme: { primary: '#10B981', secondary: '#F9FAFB' }
                    },
                    error: {
                        iconTheme: { primary: '#EF4444', secondary: '#F9FAFB' }
                    }
                }}
            />
        </AuthProvider>
    </React.StrictMode>,
);
