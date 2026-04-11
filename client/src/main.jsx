import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import UserLoginPage from './pages/UserLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import UserRegisterPage from './pages/UserRegisterPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import './index.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<UserLoginPage />} />
                    <Route path="/admin-login" element={<AdminLoginPage />} />
                    <Route path="/register" element={<UserRegisterPage />} />

                    {/* Private Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route
                            path="/"
                            element={
                                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <div className="text-center">
                                        <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to ShopHub</h1>
                                        <p className="text-xl text-gray-600 mb-8">Your favorite e-commerce destination</p>
                                        <div className="bg-white p-8 rounded-lg shadow-md">
                                            <p className="text-gray-700">🛍️ Coming Soon: Product Catalog, Shopping Cart & Checkout</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
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
            </AuthProvider>
        </Router>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
