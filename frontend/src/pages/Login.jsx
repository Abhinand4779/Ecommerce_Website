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
            <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-24 px-4">
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dark via-[#1a1a1a] to-dark z-0" />
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-float-slow z-0" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-float z-0" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full relative z-10"
                >
                    <div className="glass-dark p-10 md:p-14 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-4">
                                Welcome <span className="gradient-text">Back</span>
                            </h2>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">
                                Sign in to your high-jewelry boutique
                            </p>
                        </div>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Master Username</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary outline-none transition-all text-white placeholder-white/20"
                                        placeholder="Enter your boutique username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Secure Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary outline-none transition-all text-white placeholder-white/20"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && !guestInfo && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-primary-light text-[10px] font-black uppercase tracking-widest text-center bg-primary/10 p-4 rounded-xl border border-primary/20"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-6">
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-gradient-primary text-dark rounded-2xl font-black uppercase tracking-widest text-sm hover:glow-gold transition-all shadow-xl hover:-translate-y-1"
                                >
                                    Login to Boutique
                                </button>

                                <div className="text-center">
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                        Don't have an elite account?{' '}
                                        <Link to="/register" className="text-primary font-black hover:text-primary-light transition-colors">
                                            Register Now
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                <div className="relative flex justify-center"><span className="bg-dark px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Guest Experience</span></div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4 text-center block">Contact Information</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary outline-none transition-all text-white placeholder-white/20 text-center"
                                        placeholder="Email or phone for guest checkout"
                                        value={guestInfo}
                                        onChange={(e) => setGuestInfo(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGuestSubmit}
                                    className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                >
                                    Continue as Guest
                                </button>
                                <p className="text-[10px] text-white/20 text-center italic">Guest checkout available for curated selections.</p>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
