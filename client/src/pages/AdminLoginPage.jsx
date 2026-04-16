import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const AdminLoginPage = () => {
    const [step, setStep] = useState(1); // Step 1: Email+Password, Step 2: OTP
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    const { adminLoginSendOTP, adminLoginVerifyOTP, resendOTP } = useAuth();

    // OTP Timer
    useEffect(() => {
        let interval;
        if (step === 2 && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, otpTimer]);

    // ===== STEP 1: Send OTP =====
    const handleStep1 = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!password.trim()) {
            setError('Password is required');
            return;
        }

        setLoading(true);

        const result = await adminLoginSendOTP(email, password);

        if (result.success) {
            setMessage('✅ ' + result.message);
            setStep(2);
            setOtpTimer(600); // 10 minutes
            setCanResend(false);
        } else {
            setError('❌ ' + result.message);
        }

        setLoading(false);
    };

    // ===== STEP 2: Verify OTP =====
    const handleStep2 = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!otp.trim()) {
            setError('Please enter OTP');
            return;
        }

        setLoading(true);

        const result = await adminLoginVerifyOTP(email, otp);

        if (result.success) {
            setMessage('✅ Admin login successful! Redirecting...');
            setTimeout(() => navigate('/admin'), 2000);
        } else {
            setError('❌ ' + result.message);
        }

        setLoading(false);
    };

    // ===== RESEND OTP =====
    const handleResendOTP = async () => {
        setError('');
        setMessage('');
        setLoading(true);
        setCanResend(false);

        const result = await resendOTP(email, 'admin-login');

        if (result.success) {
            setMessage('✅ OTP resent! Check your email');
            setOtpTimer(600);
        } else {
            setError('❌ ' + result.message);
            setCanResend(true);
        }

        setLoading(false);
    };

    // ===== STEP 1: CREDENTIALS =====
    if (step === 1) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-purple-100">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">ShopHub</h1>
                        <h2 className="text-xl font-semibold text-gray-700 mt-2">Admin Login</h2>
                        <p className="text-gray-500 text-sm mt-1">Step 1 of 2: Enter your credentials</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleStep1} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📧 Admin Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🔒 Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Verifying...' : 'Send Verification Code →'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
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
    }

    // ===== STEP 2: OTP VERIFICATION =====
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-purple-100">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">ShopHub</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mt-2">Verify Identity</h2>
                    <p className="text-gray-500 text-sm mt-1">Step 2 of 2: Enter OTP from your email</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleStep2} className="space-y-4">
                    {/* OTP Section */}
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🔐 6-Digit Verification Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            maxLength="6"
                            className="w-full px-4 py-4 text-center text-3xl tracking-widest font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            disabled={loading}
                            autoFocus
                        />
                        <p className="text-xs text-gray-600 mt-2">
                            Check your email for the verification code. It expires in{' '}
                            <strong>
                                {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}
                            </strong>
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? 'Verifying...' : '✓ Verify & Login'}
                    </button>

                    {/* Resend */}
                    <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>Didn't receive the code?</span>
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={!canResend || loading}
                            className="text-blue-600 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            Resend OTP
                        </button>
                    </div>

                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => {
                            setStep(1);
                            setError('');
                            setMessage('');
                            setOtp('');
                        }}
                        className="w-full text-gray-600 font-semibold hover:text-gray-800 transition"
                    >
                        ← Back to Credentials
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
