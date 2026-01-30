import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const success = await register(formData);
        if (success) {
            navigate('/');
        } else {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <Layout>
            <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-24 px-4">
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dark via-[#1a1a1a] to-dark z-0" />
                <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-float-slow z-0" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-float z-0" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full relative z-10"
                >
                    <div className="glass-dark p-10 md:p-14 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-4">
                                Join <span className="gradient-text">Jewelluxe</span>
                            </h2>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">
                                Create your elite artisan account
                            </p>
                        </div>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Full Identity</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="fullName"
                                            type="text"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary outline-none transition-all text-white placeholder-white/20 shadow-inner"
                                            placeholder="Enter your full name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Unique Username</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="username"
                                            type="text"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary outline-none transition-all text-white placeholder-white/20 shadow-inner"
                                            placeholder="Choose a signature name"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary outline-none transition-all text-white placeholder-white/20 shadow-inner"
                                            placeholder="boutique@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Contact Phone</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="phone"
                                            type="tel"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary outline-none transition-all text-white placeholder-white/20 shadow-inner"
                                            placeholder="+91 00000 00000"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Secure Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary outline-none transition-all text-white placeholder-white/20 shadow-inner"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Verify Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary outline-none transition-all text-white placeholder-white/20 shadow-inner"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-primary-light text-[10px] font-black uppercase tracking-widest text-center bg-primary/10 p-4 rounded-xl border border-primary/20"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-6">
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-gradient-primary text-dark rounded-2xl font-black uppercase tracking-widest text-sm hover:glow-gold transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    <span>Establish Account</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>

                                <div className="text-center">
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                        Already an elite member?{' '}
                                        <Link to="/login" className="text-primary font-black hover:text-primary-light transition-colors">
                                            Return to Login
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
