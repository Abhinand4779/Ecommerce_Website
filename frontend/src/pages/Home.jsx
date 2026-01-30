import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Truck, Gift, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [sliders, setSliders] = useState([]);
    const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
    const [homeGroups, setHomeGroups] = useState([]);
    const [visibleCards, setVisibleCards] = useState(4);

    // Update visible cards on resize for product carousels
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setVisibleCards(1);
            else if (window.innerWidth < 1024) setVisibleCards(2);
            else setVisibleCards(4);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Fetch categories
        api.get('/categories/').then(res => setCategories(res.data.results || res.data)).catch(console.error);

        // Fetch sliders
        api.get('/sliders/').then(res => {
            const data = (res.data.results || res.data).filter(s => s.is_active);
            setSliders(data);
        }).catch(console.error);

        // Fetch Home Groups
        api.get('/home-groups/').then(res => {
            const data = (res.data.results || res.data).filter(g => g.is_active);
            setHomeGroups(data);
        }).catch(console.error);
    }, []);

    // Slider auto-play
    useEffect(() => {
        if (sliders.length > 1) {
            const interval = setInterval(() => {
                setCurrentSliderIndex(prev => (prev + 1) % sliders.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [sliders]);

    return (
        <Layout>
            {/* Dynamic Hero Sliders */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">
                <AnimatePresence mode="wait">
                    {sliders.length > 0 ? sliders.map((slider, index) => (
                        index === currentSliderIndex && (
                            <motion.div
                                key={slider.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0"
                            >
                                <img src={slider.image} alt={slider.title} className="w-full h-full object-cover opacity-60 scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                                    <motion.h4 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-primary font-bold uppercase tracking-[0.5em] text-sm mb-4">{slider.sub_title}</motion.h4>
                                    <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="text-5xl md:text-8xl font-serif font-black mb-8 max-w-5xl leading-tight">{slider.title}</motion.h1>
                                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
                                        <Link to={slider.link} className="bg-gradient-primary text-dark px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:glow-gold transition-all flex items-center gap-3">
                                            Discover Now <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )
                    )) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-4xl font-serif italic text-white/20">Loading Excellence...</h1>
                        </div>
                    )}
                </AnimatePresence>

                {/* Navigation Dots */}
                {sliders.length > 1 && (
                    <div className="absolute bottom-10 flex gap-3 z-20">
                        {sliders.map((_, i) => (
                            <button key={i} onClick={() => setCurrentSliderIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSliderIndex ? 'bg-primary w-8' : 'bg-white/30'}`} />
                        ))}
                    </div>
                )}
            </section>

            {/* Dynamic Home Groups (Collections) */}
            {homeGroups.map((group, gIdx) => (
                <section key={group.id} className={`py-24 px-4 ${gIdx % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`}>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-16">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-4">{group.title}</h2>
                                <p className="text-slate-500 max-w-xl">{group.subtitle}</p>
                            </div>
                            <Link to="/shop" className="hidden md:flex items-center text-primary font-bold tracking-widest uppercase text-sm group">
                                View Full Collection <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {group.products.slice(0, 4).map((product, pIdx) => (
                                <Link key={product.id} to={`/product/${product.id}`} className="group">
                                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                        <div className="aspect-[4/5] relative overflow-hidden">
                                            <img src={product.images?.[0]?.image || 'https://placehold.co/600x800'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                                            {product.discount_price && <span className="absolute top-6 left-6 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Special Offer</span>}
                                        </div>
                                        <div className="p-8">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">{product.category?.name}</p>
                                            <h3 className="text-xl font-serif font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors">{product.name}</h3>
                                            <div className="flex items-center gap-3">
                                                {product.discount_price ? (
                                                    <>
                                                        <span className="text-2xl font-black text-rose-500">₹{product.discount_price}</span>
                                                        <span className="text-slate-300 line-through text-lg italic">₹{product.price}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-2xl font-black text-[#1E293B]">₹{product.price}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* Heritage & Values Story */}
            <section className="py-24 bg-dark text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000" className="rounded-[3rem] shadow-2xl relative z-10" alt="Excellence" />
                        <div className="absolute -bottom-10 -right-10 bg-primary w-40 h-40 rounded-[2rem] flex flex-col items-center justify-center text-dark p-6 shadow-2xl z-20">
                            <span className="text-4xl font-black">25+</span>
                            <span className="text-[10px] font-bold uppercase text-center leading-tight mt-2">Years of Trusted Brilliance</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-primary font-bold uppercase tracking-[0.4em] text-sm mb-6">Unrivaled Heritage</h4>
                        <h2 className="text-5xl md:text-6xl font-serif font-black mb-10 leading-tight">Mastery in every <span className="gradient-text">Detail</span></h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-12">Established with a vision to redefine luxury jewelry, our atelier combines heritage techniques with modern precision. Every diamond is ethically sourced and every gold setting is handcrafted by master artisans with decades of experience.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-white/5 rounded-2xl"><Shield className="text-primary" /></div>
                                <div><h5 className="font-bold mb-1">GIA Certified</h5><p className="text-slate-500 text-sm">Authenticity in every stone.</p></div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-white/5 rounded-2xl"><Truck className="text-primary" /></div>
                                <div><h5 className="font-bold mb-1">Global Shipping</h5><p className="text-slate-500 text-sm">Secure, insured transit.</p></div>
                            </div>
                        </div>
                        <button className="border-b-2 border-primary text-primary font-black uppercase tracking-widest text-sm pb-2 hover:translate-x-4 transition-all">Learn more about our craft →</button>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
