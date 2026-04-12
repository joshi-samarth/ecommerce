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
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import UserLayout from './layouts/UserLayout';
import AccountPage from './pages/user/AccountPage';
import ProfileTab from './pages/user/ProfileTab';
import AddressTab from './pages/user/AddressTab';
import OrdersTab from './pages/user/OrdersTab';
import SecurityTab from './pages/user/SecurityTab';
import ProductsPage from './pages/shop/ProductsPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import WishlistPage from './pages/shop/WishlistPage';
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
                    </Route>
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
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
            <Toaster position="bottom-right" />
        </AuthProvider>
    </React.StrictMode>,
);
