import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingBag, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    const { addToCart } = useCart();

    useEffect(() => {
        api.get(`/products/${id}/`)
            .then(res => {
                const data = res.data;
                setProduct(data);
                if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
                if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product", err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        const item = {
            ...product,
            selectedColor,
            selectedSize
        };
        addToCart(item, quantity);
        alert(`${product.name} added to your collection.`);
    };

    if (loading) return <Layout><div className="flex items-center justify-center min-h-screen"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div></Layout>;
    if (!product) return <Layout><div className="text-center py-40 font-serif text-3xl">This masterpiece is currently unavailable.</div></Layout>;

    return (
        <Layout>
            <div className="bg-white min-h-screen pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-12">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/shop" className="hover:text-primary transition-colors">Collection</Link>
                        <span>/</span>
                        <span className="text-slate-800">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* Gallery Section */}
                        <div className="space-y-6">
                            <div className="aspect-[4/5] bg-slate-50 rounded-[3rem] overflow-hidden relative group border border-slate-100 shadow-sm">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImage}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        src={product.images?.[selectedImage]?.image || 'https://placehold.co/800x1000'}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                                <div className="absolute top-8 right-8 flex flex-col gap-4">
                                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all text-slate-400 hover:text-rose-500"><Heart className="w-5 h-5" /></button>
                                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all text-slate-400 hover:text-primary"><Share2 className="w-5 h-5" /></button>
                                </div>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                {product.images?.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-28 h-28 flex-shrink-0 rounded-3xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-primary p-1' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img.image} className="w-full h-full object-cover rounded-[1.2rem]" alt="" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Information */}
                        <div className="flex flex-col">
                            <h4 className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-4">{product.category?.name}</h4>
                            <h1 className="text-5xl md:text-6xl font-serif font-black text-slate-900 mb-8 leading-tight">{product.name}</h1>

                            <div className="flex items-center gap-6 mb-10">
                                {product.discount_price ? (
                                    <>
                                        <span className="text-4xl font-black text-slate-900">₹{product.discount_price}</span>
                                        <span className="text-2xl text-slate-300 line-through italic">₹{product.price}</span>
                                        <span className="bg-rose-50 text-rose-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">Limited Offer</span>
                                    </>
                                ) : (
                                    <span className="text-4xl font-black text-slate-900">₹{product.price}</span>
                                )}
                            </div>

                            <p className="text-slate-500 text-lg leading-relaxed mb-12 border-l-4 border-slate-100 pl-8">{product.description}</p>

                            {/* Options: Color & Size */}
                            <div className="space-y-10 mb-12">
                                {product.colors?.length > 0 && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 block">Select Finish / Color</label>
                                        <div className="flex flex-wrap gap-3">
                                            {product.colors.map(color => (
                                                <button
                                                    key={color.id}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`group p-1 rounded-full border-2 transition-all ${selectedColor?.id === color.id ? 'border-primary' : 'border-transparent'}`}
                                                >
                                                    <div className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: color.hex_code }} title={color.name} />
                                                </button>
                                            ))}
                                            <span className="ml-2 flex items-center text-xs font-bold text-slate-400">{selectedColor?.name}</span>
                                        </div>
                                    </div>
                                )}

                                {product.sizes?.length > 0 && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 block">Select Size / Fit</label>
                                        <div className="flex flex-wrap gap-3">
                                            {product.sizes.map(size => (
                                                <button
                                                    key={size.id}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-6 py-3 rounded-2xl border-2 text-xs font-bold transition-all ${selectedSize?.id === size.id ? 'border-primary bg-primary/5 text-slate-900' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}
                                                >
                                                    {size.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Purchase Section */}
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex items-center h-16 bg-slate-50 rounded-2xl px-2 border border-slate-100">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"><Minus className="w-4 h-4" /></button>
                                    <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"><Plus className="w-4 h-4" /></button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-16 bg-dark text-white rounded-2xl flex items-center justify-center gap-4 font-black uppercase tracking-widest text-sm hover:glow-gold hover:-translate-y-1 transition-all"
                                >
                                    <ShoppingBag className="w-5 h-5" /> Add to Boutique Cart
                                </button>
                            </div>

                            {/* Features */}
                            <div className="mt-16 pt-16 border-t border-slate-100 grid grid-cols-2 gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Lifetime Warranty</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><Gift className="w-5 h-5 text-primary" /></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Premium Packaging</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
