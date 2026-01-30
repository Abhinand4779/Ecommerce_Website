import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

export default function Navbar() {
    const { cartCount } = useCart();
    const { user } = useAuth();
    const { pathname } = useLocation();
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [expandedMobileCat, setExpandedMobileCat] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Fetch categories for mega menu
    useEffect(() => {
        api.get('/categories/')
            .then(res => {
                const data = res.data.results || res.data;
                // Only root categories for top level, others as children
                setCategories(Array.isArray(data) ? data.filter(c => !c.parent) : []);
            })
            .catch(err => console.error("Navbar category fetch error", err));
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setShowSearch(false);
            setSearchQuery('');
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const isHomePage = pathname === '/';

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 py-3 glass-dark shadow-2xl`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">

                    <div className="flex items-center">
                        <button
                            className="p-2 -ml-2 mr-2 md:hidden text-white"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                        <Link to="/" className="group flex items-center space-x-2">
                            <span className="text-4xl font-serif font-bold text-white tracking-tighter group-hover:glow-gold transition-all duration-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                JEWEL<span className="gradient-text">LUXE</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center ml-12 mr-12 space-x-8">
                        {/* Home Link */}
                        <Link
                            to="/"
                            className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 relative group ${pathname === '/' ? 'text-primary' : 'text-white/80 hover:text-white'}`}
                        >
                            Home
                            <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-gradient-primary rounded-full transition-all duration-300 ${pathname === '/' ? 'w-4' : 'w-0 group-hover:w-4'}`}></span>
                        </Link>

                        {/* Category Dropdowns */}
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="relative group py-2"
                                onMouseEnter={() => setActiveDropdown(cat.id)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    to={`/shop?category=${cat.id}`}
                                    className={`flex items-center space-x-1 text-xs tracking-[0.2em] uppercase transition-all duration-300 ${searchParams.get('category') === String(cat.id) ? 'text-primary' : 'text-white/80 hover:text-white'}`}
                                >
                                    <span>{cat.name}</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === cat.id ? 'rotate-180' : ''}`} />
                                </Link>

                                <AnimatePresence>
                                    {activeDropdown === cat.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 15 }}
                                            className="absolute left-1/2 -translate-x-1/2 top-full w-[600px] glass-dark shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-[2rem] p-8 border border-white/10 z-50 backdrop-blur-3xl flex"
                                        >
                                            {/* Left Side: Subcategories */}
                                            <div className="flex-1 grid grid-cols-2 gap-8 pr-8 border-r border-white/5">
                                                {cat.children && cat.children.length > 0 ? (
                                                    cat.children.map(sub => (
                                                        <div key={sub.id} className="space-y-4">
                                                            <Link
                                                                to={`/shop?category=${sub.id}`}
                                                                className="text-primary font-serif text-xl hover:glow-gold transition-all block border-b border-white/10 pb-2"
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                            <div className="space-y-2.5 pl-4">
                                                                {sub.children && sub.children.map(ssub => (
                                                                    <Link
                                                                        key={ssub.id}
                                                                        to={`/shop?category=${ssub.id}`}
                                                                        className="text-white/40 hover:text-white text-[11px] uppercase tracking-widest block transition-all hover:translate-x-1"
                                                                        onClick={() => setActiveDropdown(null)}
                                                                    >
                                                                        {ssub.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-span-2 text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold text-center py-12">Fine Jewelry Collection</div>
                                                )}
                                            </div>

                                            {/* Right Side: Featured Preview */}
                                            <div className="w-1/3 pl-8 flex flex-col justify-between">
                                                <div className="relative h-48 rounded-2xl overflow-hidden group/img shadow-2xl">
                                                    <img
                                                        src={cat.image || `https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=300&auto=format&fit=crop`}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-125"
                                                        alt="Featured"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
                                                    <div className="absolute bottom-4 left-4">
                                                        <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Editor's Pick</span>
                                                        <h4 className="text-white font-serif text-lg">Signature {cat.name}</h4>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/shop?category=${cat.id}`}
                                                    className="mt-6 block text-center py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl border border-white/10 transition-all hover:glow-gold"
                                                    onClick={() => setActiveDropdown(null)}
                                                >
                                                    View All {cat.name} Collection →
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        {/* Standard Links */}
                        {[
                            { name: 'About', path: '/about' },
                            { name: 'Contact', path: '/contact' }
                        ].map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 relative group ${pathname === link.path ? 'text-primary' : 'text-white/80 hover:text-white'}`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-gradient-primary rounded-full transition-all duration-300 ${pathname === link.path ? 'w-4' : 'w-0 group-hover:w-4'}`}></span>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="relative flex items-center">
                            <AnimatePresence>
                                {showSearch && (
                                    <motion.form
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? 160 : 240, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        onSubmit={handleSearchSubmit}
                                        className="relative"
                                    >
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search..."
                                            className="w-full bg-white/10 border border-white/20 rounded-full py-1.5 pl-4 pr-10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/20 transition-all"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSearch(false)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            {!showSearch && (
                                <button
                                    onClick={() => setShowSearch(true)}
                                    className="p-2 text-white/80 hover:text-white transition-all duration-200 hover:scale-110 hover-bounce"
                                    title="Search"
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        <Link
                            to={user ? "/profile" : "/login"}
                            className={`p-2 hover:scale-110 transition-all duration-200 ${user ? 'text-primary-light glow-gold' : 'text-white hover:text-primary-light'}`}
                            title={user ? "Profile" : "Login"}
                        >
                            <User className="h-5 w-5" />
                        </Link>

                        <Link to="/cart" className="p-2 text-white hover:text-primary-light hover:scale-110 transition-all duration-200 relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-dark transform translate-x-1/2 -translate-y-1/2 bg-gradient-primary rounded-full animate-heartbeat glow-gold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>

                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-dark border-t border-white/10 overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-4">
                            {/* Home Link */}
                            <Link
                                to="/"
                                className={`block px-3 py-2 text-lg font-serif ${pathname === '/' ? 'text-primary' : 'text-white'}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>

                            {/* Categories with Dropdowns */}
                            <div className="space-y-2">
                                <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-2">Jewelry Collections</p>
                                {categories.map((cat) => (
                                    <div key={cat.id} className="space-y-1">
                                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5">
                                            <Link
                                                to={`/shop?category=${cat.id}`}
                                                className={`text-sm tracking-widest uppercase ${searchParams.get('category') === String(cat.id) ? 'text-primary' : 'text-white/80'}`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {cat.name}
                                            </Link>
                                            {cat.children && cat.children.length > 0 && (
                                                <button
                                                    onClick={() => setExpandedMobileCat(expandedMobileCat === cat.id ? null : cat.id)}
                                                    className="p-1 text-white/40"
                                                >
                                                    <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expandedMobileCat === cat.id ? 'rotate-180 text-primary' : ''}`} />
                                                </button>
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {expandedMobileCat === cat.id && cat.children && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="pl-6 space-y-2 overflow-hidden"
                                                >
                                                    {cat.children.map(sub => (
                                                        <div key={sub.id} className="py-1">
                                                            <Link
                                                                to={`/shop?category=${sub.id}`}
                                                                className="text-primary-light text-sm font-serif block"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                            <div className="mt-1 space-y-1 pl-4 border-l border-white/10">
                                                                {sub.children && sub.children.map(ssub => (
                                                                    <Link
                                                                        key={ssub.id}
                                                                        to={`/shop?category=${ssub.id}`}
                                                                        className="text-white/40 text-[10px] uppercase tracking-widest block py-1"
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                    >
                                                                        • {ssub.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            {/* Other Links */}
                            <div className="pt-4 border-t border-white/5 space-y-2">
                                <Link
                                    to="/about"
                                    className={`block px-3 py-2 text-sm uppercase tracking-widest ${pathname === '/about' ? 'text-primary' : 'text-white/60'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    About
                                </Link>
                                <Link
                                    to="/contact"
                                    className={`block px-3 py-2 text-sm uppercase tracking-widest ${pathname === '/contact' ? 'text-primary' : 'text-white/60'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

