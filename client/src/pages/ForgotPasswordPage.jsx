import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, KeyRound, Eye, EyeOff, ChevronLeft, Clock } from 'lucide-react'
import axios from '../api/axios'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState('email') // 'email', 'otp', 'reset'
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [showPasswords, setShowPasswords] = useState({
        new: false,
        confirm: false,
    })
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({})
    const [timer, setTimer] = useState(0)

    // OTP Timer Effect
    React.useEffect(() => {
        if (timer <= 0) return
        const interval = setInterval(() => {
            setTimer(prev => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [timer])

    const handleSendOTP = async (e) => {
        e.preventDefault()

        if (!email) {
            setErrors({ email: 'Email is required' })
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setErrors({ email: 'Please enter a valid email address' })
            return
        }

        setLoading(true)
        try {
            const response = await axios.post('/api/auth/forget-password/send-otp', { email })
            if (response.data.success) {
                toast.success('OTP sent to your email!')
                setStep('otp')
                setErrors({})
                setTimer(300) // 5 minutes
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = (e) => {
        e.preventDefault()

        if (!otp || otp.length !== 6) {
            setErrors({ otp: 'Please enter a valid 6-digit OTP' })
            return
        }

        setStep('reset')
        setErrors({})
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required'
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters'
        } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain lowercase letters'
        } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain uppercase letters'
        } else if (!/(?=.*\d)/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain numbers'
        } else if (!/(?=.*[@$!%*?&])/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain special characters (@$!%*?&)'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            const response = await axios.post('/api/auth/forget-password/reset', {
                email,
                otp,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            })

            if (response.data.success) {
                toast.success('Password reset successfully!')
                setTimeout(() => {
                    navigate('/login')
                }, 1500)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <Link
                    to="/login"
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 font-medium"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Login
                </Link>

                {/* Card */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <KeyRound className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                            <p className="text-gray-600 text-sm">Recover your account access</p>
                        </div>
                    </div>

                    {/* Step 1: Email */}
                    {step === 'email' && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (errors.email) setErrors({})
                                    }}
                                    placeholder="Enter your email address"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP to Email'}
                            </button>

                            <p className="text-center text-sm text-gray-600">
                                Remember your password?{' '}
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                                    Sign In
                                </Link>
                            </p>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    ✓ OTP sent to <span className="font-semibold">{email}</span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Enter OTP (6 digits)
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value.slice(0, 6))
                                        if (errors.otp) setErrors({})
                                    }}
                                    placeholder="000000"
                                    maxLength="6"
                                    className={`w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.otp ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.otp && (
                                    <p className="text-red-600 text-sm mt-1">{errors.otp}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                {timer > 0 ? (
                                    <span>
                                        OTP expires in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                    </span>
                                ) : (
                                    <span className="text-red-600">OTP expired</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !otp}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
                            >
                                Verify OTP
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep('email')
                                    setOtp('')
                                }}
                                className="w-full text-indigo-600 hover:text-indigo-700 font-semibold py-2"
                            >
                                Change Email
                            </button>
                        </form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 'reset' && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800">✓ OTP verified successfully!</p>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        placeholder="Enter new password"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPasswords.new ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm new password"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPasswords.confirm ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
                            >
                                {loading ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Need help?{' '}
                    <a href="mailto:support@shophub.com" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                        Contact Support
                    </a>
                </p>
            </div>
        </div>
    )
}

export default ForgotPasswordPage
