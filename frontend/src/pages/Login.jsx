import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [guestInfo, setGuestInfo] = useState('');
    const { login, loginAsGuest } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid credentials. (Try admin/admin)');
        }
    };

    const handleGuestSubmit = (e) => {
        e.preventDefault();
        if (!guestInfo.trim()) {
            setError('Please enter an email or phone number for guest checkout');
            return;
        }
        loginAsGuest(guestInfo);
        navigate('/');
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100"
                >
                    <div className="text-center">
                        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-500">
                            Sign in to your luxury account
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary outline-none transition-all shadow-inner"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary outline-none transition-all shadow-inner"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && !guestInfo && (
                            <div className="text-rose-500 text-sm text-center bg-rose-50 p-3 rounded-xl border border-rose-100 font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                type="submit"
                                className="w-full py-4 bg-dark text-white rounded-2xl font-bold hover:bg-black transition-all hover:glow-gold"
                            >
                                Sign In
                            </button>

                            <div className="text-center">
                                <p className="text-gray-500 text-sm">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-primary font-bold hover:underline">
                                        Register
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <div className="relative flex py-4 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Or shop as</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1 text-center block">Email or Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary outline-none transition-all shadow-inner text-center"
                                    placeholder="guest@example.com"
                                    value={guestInfo}
                                    onChange={(e) => setGuestInfo(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleGuestSubmit}
                                className="w-full py-4 border-2 border-gray-200 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Continue as Guest
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </Layout>
    );
}
