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
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
