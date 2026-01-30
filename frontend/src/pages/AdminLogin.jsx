import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginAdmin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await loginAdmin(username, password);
        if (success) {
            navigate('/admin-dashboard');
        } else {
            setError('Invalid Admin Credentials or Unauthorized Access');
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full z-10"
            >
                <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent mb-6 shadow-2xl shadow-primary/20 rotate-12">
                            <span className="text-3xl text-dark font-serif font-black -rotate-12">A</span>
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-white mb-2">Admin Portal</h2>
                        <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">High-End Security Clearance Required</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Admin ID</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                placeholder="Enter Admin Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Secure Key</label>
                            <input
                                required
                                type="password"
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-rose-400 text-xs text-center font-bold bg-rose-500/10 py-3 rounded-xl border border-rose-500/20"
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-5 bg-gradient-to-r from-primary to-accent text-dark font-black rounded-2xl shadow-xl shadow-primary/10 hover:glow-gold transition-all uppercase tracking-[0.2em] text-sm"
                        >
                            Authorize Entry
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-slate-500 text-xs font-bold hover:text-white transition-colors uppercase tracking-widest"
                    >
                        ← Back to Boutique
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
