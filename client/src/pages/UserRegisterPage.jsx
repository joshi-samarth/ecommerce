import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const UserRegisterPage = () => {
    const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify & Complete
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    const { sendRegistrationOTP, verifyRegistrationOTP, resendOTP } = useAuth();

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
    const handleStep1Submit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);

        const result = await sendRegistrationOTP(email);

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

    // ===== STEP 2: Verify OTP & Register =====
    const handleStep2Submit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Validation
        if (!otp.trim()) {
            setError('Please enter OTP');
            return;
        }

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        const result = await verifyRegistrationOTP(email, otp, name, password);

        if (result.success) {
            setMessage('✅ Registration successful! Redirecting...');
            setTimeout(() => navigate('/'), 2000);
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

        const result = await resendOTP(email, 'registration');

        if (result.success) {
            setMessage('✅ OTP resent! Check your email');
            setOtpTimer(600);
        } else {
            setError('❌ ' + result.message);
            setCanResend(true);
        }

        setLoading(false);
    };

    // ===== STEP 1: EMAIL INPUT =====
    if (step === 1) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                    <div className="text-center mb-6">
                        <Logo />
                        <h2 className="text-xl font-semibold text-gray-700 mt-2">Create Account</h2>
                        <p className="text-gray-500 text-sm mt-1">Step 1 of 2: Verify your email</p>
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

                    <form onSubmit={handleStep1Submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📧 Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                We'll send a verification code to this email
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Sending OTP...' : 'Send Verification Code'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    // ===== STEP 2: OTP & REGISTRATION FORM =====
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                <div className="text-center mb-6">
                    <Logo />
                    <h2 className="text-xl font-semibold text-gray-700 mt-2">Complete Registration</h2>
                    <p className="text-gray-500 text-sm mt-1">Step 2 of 2: Enter OTP & details</p>
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

                <form onSubmit={handleStep2Submit} className="space-y-4">
                    {/* OTP Section */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🔐 Verification Code
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength="6"
                                className="flex-1 px-4 py-3 text-center text-2xl tracking-widest font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={loading}
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs">
                            <span className="text-gray-600">
                                OTP expires in: <strong>{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</strong>
                            </span>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={!canResend || loading}
                                className="text-blue-600 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            👤 Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🔒 Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">Min 8 characters</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🔒 Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => {
                        setStep(1);
                        setError('');
                        setMessage('');
                    }}
                    className="w-full mt-3 text-gray-600 font-semibold hover:text-gray-800 transition"
                >
                    ← Back to Email
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default UserRegisterPage;
