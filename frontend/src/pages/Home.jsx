import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

const heroImages = [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2070&auto=format&fit=crop'
];

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(4);

    // Update visible cards on resize
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
        api.get('/categories/')
            .then(response => {
                const data = response.data.results || response.data;
                setCategories(Array.isArray(data) ? data : []);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });

        // Fetch featured products
        api.get('/products/')
            .then(response => {
                const data = response.data.results || response.data;
                if (Array.isArray(data)) {
                    setFeaturedProducts(data.slice(0, 8)); // Get first 8 products
                }
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
    }, []);

    // Carousel auto-play
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Product carousel auto-play
    useEffect(() => {
        if (featuredProducts.length > 0) {
            const interval = setInterval(() => {
                setCurrentProductIndex((prevIndex) =>
                    prevIndex >= featuredProducts.length - visibleCards ? 0 : prevIndex + 1
                );
            }, 3000); // Change every 3 seconds

            return () => clearInterval(interval);
        }
    }, [featuredProducts, visibleCards]);

    return (
        <Layout>
            {/* Hero Section with Carousel */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Carousel Images */}
                    {heroImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <img
                                src={image}
                                alt={`Hero ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-black/70" />
                </div>

                {/* Carousel Navigation Dots */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                ? 'bg-primary w-8 glow-gold'
                                : 'bg-white/50 hover:bg-white/80'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight"
                    >
                        Timeless <span className="gradient-text">Elegance</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light leading-relaxed"
                    >
                        Discover our exclusive collection of handcrafted jewelry designed for the modern muse.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="animate-float-slow"
                    >
                        <Link
                            to="/shop"
                            className="inline-flex items-center px-10 py-4 bg-gradient-primary text-dark font-bold hover:glow-gold-strong transition-all duration-300 uppercase tracking-widest rounded-full hover:scale-105 shadow-xl hover-wiggle"
                        >
                            Shop Collection <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-24 px-4 max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-serif text-center mb-4"
                >
                    Shop by <span className="gradient-text">Category</span>
                </motion.h2>
                <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
                    Explore our curated collections of exquisite jewelry pieces
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.length > 0 ? (
                        categories.map((cat, index) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                                whileHover={{ y: -10 }}
                            >
                                <Link to={`/shop?category=${cat.id}`} className="group relative h-[450px] overflow-hidden cursor-pointer block rounded-2xl shadow-lg hover-lift">
                                    <img
                                        src={cat.image ? cat.image : 'https://placehold.co/600x400'}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-500" />
                                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 group-hover:translate-y-0">
                                        <h3 className="text-4xl text-white font-serif mb-2 group-hover:gradient-text transition-all duration-300 animate-slide-in-up">{cat.name}</h3>
                                        <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 animate-slide-in-up">
                                            Explore Collection →
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-center col-span-3 text-gray-500">Loading categories...</p>
                    )}
                </div>
            </section>

            {/* Featured Products Carousel - Colorful Section */}
            <section className="py-24 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4">
                            Featured <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Products</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Discover our handpicked selection of stunning jewelry pieces
                        </p>
                    </motion.div>

                    {featuredProducts.length > 0 ? (
                        <div className="relative">
                            {/* Products Carousel */}
                            <div className="overflow-hidden">
                                <motion.div
                                    className="flex gap-6"
                                    animate={{ x: `-${currentProductIndex * (100 / visibleCards)}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    {featuredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`group flex-shrink-0`}
                                            style={{ minWidth: `calc(${100 / visibleCards}% - ${(24 * (visibleCards - 1)) / visibleCards}px)` }}
                                        >
                                            <Link to={`/product/${product.id}`} className="block">
                                                <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                                    <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                                        <img
                                                            src={product.images && product.images.length > 0 ? product.images[0].image : 'https://placehold.co/400'}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                        {product.discount_price && (
                                                            <span className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-bounce">
                                                                SALE
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="p-6">
                                                        <p className="text-xs text-purple-600 font-semibold mb-2 uppercase tracking-wider">{product.category?.name}</p>
                                                        <h3 className="font-serif text-xl mb-3 text-gray-900 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                                            {product.name}
                                                        </h3>
                                                        <div className="flex items-center space-x-2">
                                                            {product.discount_price ? (
                                                                <>
                                                                    <span className="text-gray-400 line-through text-sm">${product.price}</span>
                                                                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold text-2xl">
                                                                        ${product.discount_price}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold text-2xl">
                                                                    ${product.price}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Navigation Dots */}
                            <div className="flex justify-center mt-12 space-x-2">
                                {[...Array(Math.max(1, featuredProducts.length - visibleCards + 1))].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentProductIndex(index)}
                                        className={`h-3 rounded-full transition-all duration-300 ${index === currentProductIndex
                                            ? 'w-12 bg-gradient-to-r from-pink-500 to-purple-500'
                                            : 'w-3 bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        aria-label={`Go to product set ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {/* View All Button */}
                            <div className="text-center mt-12">
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 uppercase tracking-wider"
                                >
                                    View All Products <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Loading products...</p>
                    )}
                </div>
            </section>

            {/* Featured Categories */}
        </Layout>
    );
}
