import { useState } from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, login, loginAsGuest } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [isLoginView, setIsLoginView] = useState(!user);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const success = await login(loginData.username, loginData.password);
        if (success) {
            setIsLoginView(false);
        } else {
            alert("Invalid credentials. Try admin/admin");
        }
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login first");
            return;
        }

        const orderData = {
            total_amount: cartTotal,
            shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
            items: cartItems.map(item => ({
                product: item.id,
                quantity: item.quantity,
                price: item.discount_price || item.price
            }))
        };

        try {
            await api.post('/orders/', orderData);
            clearCart();
            alert("Order verified and placed successfully!");
            navigate('/');
        } catch (error) {
            console.error("Order failed", error);
            alert("Failed to place order. " + (error.response?.data?.detail || ""));
        }
    };

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen py-20"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-serif mb-4">Complete Your <span className="gradient-text">Selection</span></h1>
                        <p className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold">Secure Checkout</p>
                    </div>

                    {isLoginView ? (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="max-w-md mx-auto"
                        >
                            <div className="glass-dark p-10 rounded-[2.5rem] shadow-2xl border border-white/20">
                                <h2 className="text-3xl font-serif text-white mb-8 text-center">Login to Continue</h2>
                                <form onSubmit={handleLoginSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={loginData.username}
                                            onChange={handleLoginChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary focus:bg-white/10 outline-none transition-all"
                                            placeholder="admin"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary focus:bg-white/10 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-gradient-primary text-dark py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:glow-gold transition-all shadow-xl">
                                        Sign In
                                    </button>

                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                        <div className="relative flex justify-center"><span className="bg-dark px-4 text-[10px] font-bold uppercase tracking-widest text-white/20">Or</span></div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            loginAsGuest();
                                            setIsLoginView(false);
                                        }}
                                        className="w-full bg-white/5 border border-white/10 text-white/80 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                    >
                                        Proceed as Guest
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            {/* Shipping Form */}
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="lg:col-span-7 bg-white p-10 md:p-14 rounded-[3rem] shadow-xl border border-gray-100"
                            >
                                <h2 className="text-3xl font-serif font-bold text-slate-800 mb-10">Shipping Details</h2>
                                <form onSubmit={handleSubmitOrder} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Residence Address</label>
                                        <input
                                            required
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 focus:border-primary focus:bg-white outline-none transition-all"
                                            placeholder="Enter your street address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">City / Region</label>
                                            <input
                                                required
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 focus:border-primary focus:bg-white outline-none transition-all"
                                                placeholder="e.g. Mumbai"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Postal Code</label>
                                            <input
                                                required
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 focus:border-primary focus:bg-white outline-none transition-all"
                                                placeholder="000 000"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Country</label>
                                        <input
                                            required
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 focus:border-primary focus:bg-white outline-none transition-all"
                                            placeholder="e.g. India"
                                        />
                                    </div>

                                    <div className="pt-6">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Select Payment Method</label>
                                        <div className="p-6 rounded-2xl bg-primary/5 border-2 border-primary/20 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-4 h-4 rounded-full border-4 border-primary"></div>
                                                <span className="font-bold text-slate-800">Premium Cash on Delivery</span>
                                            </div>
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Selected</span>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full h-20 bg-dark text-white rounded-2xl flex items-center justify-center gap-4 font-black uppercase tracking-widest text-sm hover:glow-gold hover:-translate-y-1 transition-all mt-10 shadow-2xl">
                                        Finalize Order (₹{cartTotal.toFixed(2)})
                                    </button>
                                </form>
                            </motion.div>

                            {/* Order Summary */}
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="lg:col-span-5 space-y-8 sticky top-24"
                            >
                                <div className="glass-dark p-10 rounded-[3rem] shadow-2xl border border-white/10 text-white">
                                    <h2 className="text-2xl font-serif font-bold mb-8">Order Summary</h2>
                                    <div className="space-y-6 max-h-[40vh] overflow-auto pr-4 custom-scrollbar mb-8">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex gap-4 items-center">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                                    <img src={item.images?.[0]?.image || 'https://placehold.co/100'} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.quantity} x ₹{item.discount_price || item.price}</p>
                                                </div>
                                                <div className="text-sm font-bold">₹{(item.discount_price || item.price) * item.quantity}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4 pt-8 border-t border-white/10">
                                        <div className="flex justify-between text-white/60 text-sm">
                                            <span>Boutique Subtotal</span>
                                            <span>₹{cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-white/60 text-sm">
                                            <span>Insured Shipping</span>
                                            <span className="text-primary-light">Complimentary</span>
                                        </div>
                                        <div className="flex justify-between text-2xl font-serif font-bold pt-4">
                                            <span>Grand Total</span>
                                            <span className="gradient-text">₹{cartTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                                    <p className="text-[10px] text-slate-400 leading-relaxed text-center italic font-medium">By completing this order, you agree to Jewelluxe's terms of service and our commitment to ethical artisan excellence.</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </motion.div>
        </Layout>
    );
}
