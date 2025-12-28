import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

interface AuthContextType {
    user: any;
    loading: boolean;
    error: string | null;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await apiService.getMe();
                    setUser(userData);
                } catch (err: any) {
                    console.error('Failed to load user', err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (credentials: any) => {
        setLoading(true);
        setError(null);
        try {
            await apiService.login(credentials);
            const userData = await apiService.getMe();
            setUser(userData);
        } catch (err: any) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: any) => {
        setLoading(true);
        setError(null);
        try {
            await apiService.register(userData);
            const userResult = await apiService.getMe();
            setUser(userResult);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        apiService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
