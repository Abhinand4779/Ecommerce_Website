import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <Layout>
                <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h2 className="text-5xl font-serif mb-4">Your Cart is <span className="gradient-text">Empty</span></h2>
                        <p className="text-gray-500 mb-10 text-lg">Looks like you haven't found the perfect piece yet.</p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center px-10 py-4 bg-gradient-primary text-dark font-bold hover:glow-gold-strong transition-all duration-300 uppercase tracking-widest rounded-full shadow-xl hover:scale-105"
                        >
                            Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl md:text-6xl font-serif mb-3">Shopping <span className="gradient-text">Cart</span></h1>
                    <p className="text-gray-500 mb-12">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    key={item.id}
                                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-6 group"
                                >
                                    <div className="relative overflow-hidden rounded-xl">
                                        <img
                                            src={item.images && item.images.length > 0 ? item.images[0].image : 'https://placehold.co/200'}
                                            alt={item.name}
                                            className="w-28 h-28 object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-serif font-semibold mb-1">{item.name}</h3>
                                        <p className="text-gray-400 text-sm mb-3 uppercase tracking-wide">{item.category?.name}</p>
                                        <div className="gradient-text font-bold text-xl">
                                            ${item.discount_price ? item.discount_price : item.price}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2.5 text-gray-600 hover:bg-gray-100 hover:text-primary transition-all disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-12 text-center text-sm font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2.5 text-gray-600 hover:bg-gray-100 hover:text-primary transition-all"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 p-2.5 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="glass-dark p-8 rounded-3xl shadow-2xl sticky top-24 border border-white/20">
                                <h2 className="text-2xl font-serif font-bold mb-8 text-white">Order Summary</h2>

                                <div className="space-y-5 mb-8">
                                    <div className="flex justify-between text-white/80 text-lg">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-white/80 text-lg">
                                        <span>Shipping</span>
                                        <span className="font-semibold text-primary-light">Free</span>
                                    </div>
                                    <div className="border-t border-white/20 pt-5 flex justify-between font-bold text-2xl text-white">
                                        <span>Total</span>
                                        <span className="gradient-text">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(user ? "/checkout" : "/login")}
                                    className="w-full flex items-center justify-center bg-gradient-primary text-dark py-4 rounded-full font-bold hover:glow-gold-strong transition-all duration-300 uppercase tracking-widest shadow-xl hover:scale-105"
                                >
                                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
