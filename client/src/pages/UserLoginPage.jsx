import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            if (result.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            // Show error message
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full mb-4">
                        <span className="text-white font-bold text-2xl">S</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">ShopHub</h1>
                    <p className="text-gray-600 text-sm">Welcome back to your favorite store</p>
                </div>

                {/* Login Card */}
                <div className="card">
                    <div className="card-body space-y-6">
                        {error ? (
                            // Error Card
                            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                <p className="font-medium">✕ {error}</p>
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div className="form-group">
                                <label className="label flex items-center gap-2">
                                    <Mail size={16} className="text-indigo-600" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input"
                                    placeholder="your@email.com"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="form-group">
                                <label className="label flex items-center gap-2">
                                    <Lock size={16} className="text-indigo-600" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full flex items-center justify-center gap-2 mt-6"
                            >
                                <LogIn size={18} />
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>

                            {/* Forgot Password Link */}
                            <div className="text-center mt-3">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-gray-600 hover:text-indigo-600 transition font-medium"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </form>

                        {/* Register Link */}
                        <div className="divider"></div>

                        <p className="text-center text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                                Sign up here
                            </Link>
                        </p>

                        {/* Admin Login Link */}
                        <Link
                            to="/admin-login"
                            className="block text-center text-purple-600 text-sm font-medium hover:text-purple-700 transition"
                        >
                            Admin Login →
                        </Link>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl mb-2">🔒</div>
                        <p className="text-xs text-gray-600">Secure</p>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">⚡</div>
                        <p className="text-xs text-gray-600">Fast</p>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">✨</div>
                        <p className="text-xs text-gray-600">Easy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLoginPage;
