import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block group">
                            <span className="text-3xl font-serif font-bold tracking-tighter group-hover:glow-gold transition-all duration-300">
                                JEWEL<span className="gradient-text">LUXE</span>
                            </span>
                        </Link>
                        <p className="text-white/60 leading-relaxed max-w-xs">
                            Crafting timeless elegance and sophisticated beauty for the modern muse. Discover our exclusive collection of handcrafted jewelry.
                        </p>
                        <div className="flex space-x-5">
                            <motion.a
                                href="#"
                                whileHover={{ y: -5, scale: 1.1 }}
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gradient-primary hover:text-dark transition-all duration-300 shadow-lg"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ y: -5, scale: 1.1 }}
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gradient-primary hover:text-dark transition-all duration-300 shadow-lg"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </motion.a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-sm uppercase tracking-[0.2em] font-bold mb-8 text-primary">Collections</h3>
                        <ul className="space-y-4">
                            {['All Jewelry', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to="/shop"
                                        className="text-white/60 hover:text-white transition-colors duration-300 block hover:translate-x-2 transform transition-transform"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Information Links */}
                    <div>
                        <h3 className="text-sm uppercase tracking-[0.2em] font-bold mb-8 text-primary">Information</h3>
                        <ul className="space-y-4">
                            {['About Us', 'Contact Us', 'FAQs', 'Shipping & Returns', 'Privacy Policy'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={
                                            item === 'About Us' ? '/about' :
                                                item === 'Contact Us' ? '/contact' :
                                                    item === 'Shipping & Returns' ? '/shipping' :
                                                        item === 'Privacy Policy' ? '/privacy-policy' :
                                                            '#'
                                        }
                                        className="text-white/60 hover:text-white transition-colors duration-300 block hover:translate-x-2 transform transition-transform"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-sm uppercase tracking-[0.2em] font-bold mb-8 text-primary">Contact Us</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start space-x-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 mt-1">
                                    <Phone className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Phone</p>
                                    <a href="tel:+1234567890" className="text-white/80 hover:text-primary transition-colors">+1 (234) 567-890</a>
                                </div>
                            </li>
                            <li className="flex items-start space-x-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 mt-1">
                                    <Mail className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Email</p>
                                    <a href="mailto:info@jewelluxe.com" className="text-white/80 hover:text-primary transition-colors">info@jewelluxe.com</a>
                                </div>
                            </li>
                            <li className="flex items-start space-x-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 mt-1">
                                    <MapPin className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Boutique</p>
                                    <p className="text-white/80">123 Luxury Lane, Jewelry District</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-white/40">
                    <p>© 2026 JewelLuxe. All rights reserved.</p>
                    <div className="flex space-x-8">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
