import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageTransition } from '../../components/ui/PageTransition';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    return (
        <PageTransition className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-black/5 p-10 border border-gray-100">
                <div className="text-center mb-10">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white text-xl font-black mx-auto mb-4">B</div>
                    <h1 className="text-3xl font-black text-gray-900">Welcome back</h1>
                    <p className="text-gray-500 mt-2 font-medium">Continue your learning journey</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 italic">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-black focus:bg-white outline-none transition-all font-medium placeholder:text-gray-300"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-black focus:bg-white outline-none transition-all font-medium placeholder:text-gray-300"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-black text-white rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-10 text-gray-500 font-medium tracking-tight">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-black hover:underline">Sign up for free</Link>
                </p>
            </div>
        </PageTransition>
    );
};

export default Login;
