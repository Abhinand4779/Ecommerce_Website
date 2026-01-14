import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addToCart } = useCart();

    useEffect(() => {
        api.get(`/products/${id}/`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product", err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        // Optional: Add toast notification here
        alert("Added to cart!");
    };

    if (loading) return <Layout><div className="text-center py-20">Loading...</div></Layout>;
    if (!product) return <Layout><div className="text-center py-20">Product not found</div></Layout>;

    return (
        <Layout>
            <div className="bg-gradient-to-br from-white via-gray-50 to-white min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 mb-10 hover:text-primary transition-all duration-200 font-medium group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Shop
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* Image Gallery */}
                        <div className="space-y-6">
                            <div className="relative group">
                                <motion.div
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="aspect-square w-full overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-2xl border-8 border-white"
                                >
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[selectedImage].image : 'https://placehold.co/800'}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                    />
                                </motion.div>

                                {/* Image Navigation Overlay (Mobile) */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 md:hidden">
                                    {product.images?.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${selectedImage === idx ? 'w-6 bg-white shadow-lg' : 'w-1.5 bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
                                {product.images && product.images.length > 0 && product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        onMouseEnter={() => setSelectedImage(idx)}
                                        className={`flex-shrink-0 w-24 aspect-square overflow-hidden rounded-2xl transition-all duration-300 border-2 ${selectedImage === idx
                                            ? 'border-primary shadow-xl scale-105'
                                            : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                                            }`}
                                    >
                                        <img src={img.image} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <p className="text-sm text-gray-400 uppercase tracking-widest mb-3 font-medium">{product.category?.name}</p>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">{product.name}</h1>
                            <div className="flex items-end space-x-4 mb-8">
                                {product.discount_price ? (
                                    <>
                                        <p className="text-4xl gradient-text font-bold">${product.discount_price}</p>
                                        <p className="text-2xl text-gray-400 line-through mb-1">${product.price}</p>
                                        <span className="bg-gradient-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-2">SAVE ${(product.price - product.discount_price).toFixed(2)}</span>
                                    </>
                                ) : (
                                    <p className="text-4xl gradient-text font-bold">${product.price}</p>
                                )}
                            </div>

                            <div className="prose prose-lg text-gray-600 mb-10 leading-relaxed">
                                <p>{product.description}</p>
                            </div>

                            <div className="border-t border-b border-gray-200 py-8 mb-10">
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-3 text-gray-600 hover:bg-gray-100 hover:text-primary transition-all"
                                        >
                                            <Minus className="h-5 w-5" />
                                        </button>
                                        <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-3 text-gray-600 hover:bg-gray-100 hover:text-primary transition-all"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-gradient-primary text-dark px-10 py-4 rounded-full hover:glow-gold-strong transition-all duration-300 flex items-center justify-center font-bold uppercase tracking-wider text-lg shadow-xl hover:scale-105 hover-wiggle"
                                    >
                                        <ShoppingBag className="mr-3 h-6 w-6" /> Add to Cart
                                    </button>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-4 text-sm text-gray-600 bg-gray-50 p-6 rounded-2xl"
                            >
                                <div className="flex items-center space-x-3 hover:translate-x-2 transition-transform duration-200">
                                    <span className="text-primary text-xl animate-bounce">✓</span>
                                    <p>Free shipping on all orders over $100</p>
                                </div>
                                <div className="flex items-center space-x-3 hover:translate-x-2 transition-transform duration-200">
                                    <span className="text-primary text-xl animate-bounce stagger-1">✓</span>
                                    <p>30-day return policy</p>
                                </div>
                                <div className="flex items-center space-x-3 hover:translate-x-2 transition-transform duration-200">
                                    <span className="text-primary text-xl animate-bounce stagger-2">✓</span>
                                    <p>Authenticity guaranteed</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
