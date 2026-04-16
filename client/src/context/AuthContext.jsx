import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await api.get('/api/auth/me');
                if (response.data.success) {
                    setUser(response.data.data);
                }
            } catch (error) {
                console.log('No active session');
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    // ========== USER REGISTRATION WITH OTP ==========
    const registerUserWithOTP = async (email, name, password) => {
        try {
            const response = await api.post('/api/auth/register/send-otp', {
                email,
                name,
                password,
            });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    email: response.data.data.email
                };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || 'Failed to send OTP. Please try again.';
            return { success: false, message };
        }
    };

    const verifyRegistrationOTP = async (email, otp) => {
        try {
            const response = await api.post('/api/auth/register/verify-otp', {
                email,
                otp,
            });
            if (response.data.success) {
                setUser(response.data.data);
                return { success: true, data: response.data.data };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || 'OTP verification failed. Please try again.';
            return { success: false, message };
        }
    };

    // ========== USER LOGIN ==========
    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', { email, password });
            if (response.data.success) {
                setUser(response.data.data);
                return { success: true, data: response.data.data };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || 'Login failed. Please try again.';
            return { success: false, message };
        }
    };

    // ========== ADMIN LOGIN WITH OTP ==========
    const adminLoginSendOTP = async (email, password) => {
        try {
            const response = await api.post('/api/auth/admin/login', { email, password });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    email: response.data.data.email,
                    otpExpiry: response.data.data.otpExpiry
                };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || 'Admin login failed. Please try again.';
            return { success: false, message };
        }
    };

    const adminLoginVerifyOTP = async (email, otp) => {
        try {
            const response = await api.post('/api/auth/admin/verify-otp', { email, otp });
            if (response.data.success) {
                setUser(response.data.data);
                return { success: true, data: response.data.data };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || 'OTP verification failed. Please try again.';
            return { success: false, message };
        }
    };

    // ========== RESEND OTP ==========
    const resendOTP = async (email, type) => {
        try {
            const response = await api.post('/api/auth/resend-otp', { email, type });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message
                };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || 'Failed to resend OTP. Please try again.';
            return { success: false, message };
        }
    };

    // ========== ADMIN CREATION WITH OTP ==========
    const createAdminWithOTP = async (name, email, password) => {
        try {
            const response = await api.post('/api/admin/create-admin/send-otp', {
                name,
                email,
                password,
            });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    email: response.data.data.email
                };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || 'Failed to send OTP. Please try again.';
            return { success: false, message };
        }
    };

    const verifyAdminCreationOTP = async (email, otp) => {
        try {
            const response = await api.post('/api/admin/create-admin/verify-otp', {
                email,
                otp,
            });
            if (response.data.success) {
                return { success: true, data: response.data.data };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || 'OTP verification failed. Please try again.';
            return { success: false, message };
        }
    };

    // ========== OLD METHODS (KEPT FOR BACKWARD COMPATIBILITY) ==========
    const register = async (name, email, password) => {
        try {
            const response = await api.post('/api/auth/register', {
                name,
                email,
                password,
            });
            if (response.data.success) {
                setUser(response.data.data);
                return { success: true, data: response.data.data };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || 'Registration failed. Please try again.';
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');
            setUser(null);
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Logout failed.' };
        }
    };

    const value = {
        user,
        loading,
        // User Registration with OTP
        registerUserWithOTP,
        verifyRegistrationOTP,
        // User Login
        login,
        // Admin Login with OTP
        adminLoginSendOTP,
        adminLoginVerifyOTP,
        // Admin Creation with OTP
        createAdminWithOTP,
        verifyAdminCreationOTP,
        // Resend OTP
        resendOTP,
        // Old methods
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

