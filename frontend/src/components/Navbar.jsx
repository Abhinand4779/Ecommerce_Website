import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { cartCount } = useCart();
    const { user } = useAuth();
    const { pathname } = useLocation();
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

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
                            <span className="text-3xl font-serif font-bold text-white tracking-tighter group-hover:glow-gold transition-all duration-300">
                                JEWEL<span className="gradient-text">LUXE</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-10">
                        {!showSearch && [
                            { name: 'Home', path: '/' },
                            { name: 'Shop', path: '/shop' },
                            { name: 'About', path: '/about' },
                            { name: 'Contact', path: '/contact' }
                        ].map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm tracking-widest uppercase transition-all duration-300 relative group ${pathname === link.path ? 'text-primary' : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-gradient-primary rounded-full transition-all duration-300 ${pathname === link.path ? 'w-4' : 'w-0 group-hover:w-4'
                                    }`}></span>
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
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                                <Link
                                    key={item}
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary-light hover:bg-white/10 transition-all duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

