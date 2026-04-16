import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const UserRegisterPage = () => {
    const [step, setStep] = useState(1); // Step 1: Form, Step 2: OTP Verification
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
    });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    const { registerUserWithOTP, verifyRegistrationOTP, resendOTP } = useAuth();

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

    // Validate password strength
    const isPasswordStrong = (pwd) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);
    };

    // ===== STEP 1: REGISTRATION FORM SUBMISSION =====
    const handleStep1Submit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Validation
        if (!formData.email.trim()) {
            setError('Please enter your email');
            return;
        }

        if (!formData.name.trim()) {
            setError('Please enter your full name');
            return;
        }

        if (!isPasswordStrong(formData.password)) {
            setError('Password must be min 8 characters with uppercase, lowercase, numbers & special chars (@$!%*?&)');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        // Send OTP
        const result = await registerUserWithOTP(
            formData.email,
            formData.name,
            formData.password
        );

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

    // ===== STEP 2: OTP VERIFICATION =====
    const handleStep2Submit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!otp.trim()) {
            setError('Please enter OTP');
            return;
        }

        setLoading(true);

        const result = await verifyRegistrationOTP(
            formData.email,
            otp
        );

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

        const result = await resendOTP(formData.email, 'registration');

        if (result.success) {
            setMessage('✅ OTP resent! Check your email');
            setOtpTimer(600);
        } else {
            setError('❌ ' + result.message);
            setCanResend(true);
        }

        setLoading(false);
    };

    // ===== STEP 1: TRADITIONAL REGISTRATION FORM =====
    if (step === 1) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                    <div className="text-center mb-6">
                        <Logo />
                        <h2 className="text-2xl font-bold text-gray-800 mt-3">Create Account</h2>
                        <p className="text-gray-600 text-sm mt-2">Join ShopHub today!</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleStep1Submit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📧 Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                👤 Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🔒 Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                disabled={loading}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Min 8 chars • Uppercase • Lowercase • Numbers • Special (@$!%*?&)
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🔒 Confirm Password
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Sending Verification Code...' : 'Register & Send OTP'}
                        </button>
                    </form>

                    {/* Login Link */}
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

    // ===== STEP 2: OTP VERIFICATION PAGE =====
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Verify Email</h2>
                    <p className="text-gray-600 text-sm mt-2">
                        We sent a verification code to<br />
                        <strong>{formData.email}</strong>
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        ❌ {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                        ✅ {message}
                    </div>
                )}

                <form onSubmit={handleStep2Submit} className="space-y-4">
                    {/* OTP Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                            Enter 6-Digit Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength="6"
                            placeholder="000000"
                            className="w-full px-4 py-4 text-center text-3xl tracking-[0.5rem] font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    {/* Timer & Resend */}
                    <div className="flex justify-between items-center text-xs text-gray-600 px-2">
                        <span>
                            OTP expires in: <strong className="text-red-600">{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</strong>
                        </span>
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={!canResend || loading}
                            className="text-blue-600 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            Resend
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2"
                    >
                        {loading ? 'Verifying...' : 'Verify & Create Account'}
                    </button>
                </form>

                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => {
                        setStep(1);
                        setOtp('');
                        setError('');
                        setMessage('');
                    }}
                    className="w-full text-gray-600 font-semibold hover:text-gray-800 transition py-2 mt-3"
                >
                    ← Use Different Email
                </button>
            </div>
        </div>
    );
};

export default UserRegisterPage;
