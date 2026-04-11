import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const AdminLoginPage = () => {
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
                setError('This account does not have admin privileges');
            }
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    const fillDemoAdmin = () => {
        setEmail('admin@example.com');
        setPassword('admin123');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <Logo />

                <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Admin Login</h2>
                <p className="text-center text-gray-500 mb-6 text-sm">Administrator Access Only</p>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        <p className="font-medium">❌ {error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Admin Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        {loading ? 'Signing in...' : 'Admin Sign In'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={fillDemoAdmin}
                        className="w-full bg-yellow-50 text-yellow-800 py-2 rounded-lg text-sm hover:bg-yellow-100 transition font-medium mb-3"
                    >
                        🔑 Demo Admin Credentials
                    </button>

                    <Link
                        to="/login"
                        className="block text-center text-blue-600 text-sm font-medium hover:underline"
                    >
                        ← Back to User Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
