import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter State
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('min_price') || '',
        max: searchParams.get('max_price') || ''
    });

    const categoryId = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        let url = '/products/';
        const params = new URLSearchParams();

        if (categoryId) params.append('category', categoryId);
        if (priceRange.min) params.append('min_price', priceRange.min);
        if (priceRange.max) params.append('max_price', priceRange.max);
        if (searchQuery) params.append('search', searchQuery);

        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        setLoading(true);
        api.get(url)
            .then(res => {
                const data = res.data.results || res.data;
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products", err);
                setLoading(false);
            });
    }, [categoryId, priceRange, searchQuery]); // Re-run when these change

    const handleApplyFilters = () => {
        // Update URL params for shareability (optional, but good UX)
        setSearchParams(prev => {
            if (priceRange.min) prev.set('min_price', priceRange.min);
            else prev.delete('min_price');

            if (priceRange.max) prev.set('max_price', priceRange.max);
            else prev.delete('max_price');

            return prev;
        });
        setShowFilters(false);
    };

    const clearFilters = () => {
        setPriceRange({ min: '', max: '' });
        setSearchParams(prev => {
            prev.delete('min_price');
            prev.delete('max_price');
            return prev;
        });
        setShowFilters(false);
    };

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen py-16"
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-serif mb-2">Our <span className="gradient-text">Collection</span></h1>
                            <p className="text-gray-500">Discover timeless pieces crafted with excellence</p>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white shadow-md hover:shadow-lg hover:glow-gold transition-all duration-300 text-dark font-medium"
                            >
                                <Filter className="h-5 w-5" />
                                <span>Filter</span>
                            </button>

                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-16 w-80 glass-dark p-6 rounded-2xl shadow-2xl z-20 border border-white/20"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-bold text-white text-lg">Filter by Price</h3>
                                            <button onClick={() => setShowFilters(false)} className="text-white/60 hover:text-white transition-colors">
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex space-x-3">
                                                <div className="flex-1">
                                                    <label className="text-xs text-white/80 mb-2 block">Min Price</label>
                                                    <input
                                                        type="number"
                                                        value={priceRange.min}
                                                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-white/80 mb-2 block">Max Price</label>
                                                    <input
                                                        type="number"
                                                        value={priceRange.max}
                                                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                        placeholder="5000"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex space-x-3 pt-4">
                                                <button
                                                    onClick={clearFilters}
                                                    className="flex-1 px-4 py-2.5 text-sm text-white/80 border border-white/20 rounded-lg hover:bg-white/10 transition-all font-medium"
                                                >
                                                    Clear
                                                </button>
                                                <button
                                                    onClick={handleApplyFilters}
                                                    className="flex-1 px-4 py-2.5 text-sm bg-gradient-primary text-dark rounded-lg hover:glow-gold-strong font-bold transition-all"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(priceRange.min || priceRange.max) && (
                        <div className="flex items-center space-x-2 mb-6 text-sm text-gray-500">
                            <span>Active filters:</span>
                            <span className="bg-white border border-gray-200 px-3 py-1 rounded-full flex items-center">
                                Price: {priceRange.min || '0'} - {priceRange.max || 'Any'}
                                <button onClick={clearFilters} className="ml-2 hover:text-red-500"><X className="h-3 w-3" /></button>
                            </span>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20">Loading products...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.length > 0 ? products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05, type: "spring" }}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    className="group"
                                >
                                    <Link to={`/product/${product.id}`} className="bg-white rounded-2xl overflow-hidden shadow-lg hover-lift block hover-wiggle">
                                        <div className="relative h-72 overflow-hidden">
                                            <img
                                                src={product.images && product.images.length > 0 ? product.images[0].image : 'https://placehold.co/400'}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            {product.discount_price && (
                                                <span className="absolute top-3 left-3 bg-gradient-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">SALE</span>
                                            )}
                                        </div>
                                        <div className="p-5 text-center">
                                            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">{product.category?.name}</p>
                                            <h3 className="font-serif text-xl mb-3 group-hover:gradient-text transition-all duration-300">{product.name}</h3>
                                            <div className="flex justify-center items-center space-x-2">
                                                {product.discount_price ? (
                                                    <>
                                                        <span className="text-gray-400 line-through text-sm">${product.price}</span>
                                                        <span className="gradient-text font-bold text-xl">${product.discount_price}</span>
                                                    </>
                                                ) : (
                                                    <span className="gradient-text font-bold text-xl">${product.price}</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )) : (
                                <div className="col-span-full text-center py-20 text-gray-500">
                                    No products found matching your filters.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </Layout>
    );
}
