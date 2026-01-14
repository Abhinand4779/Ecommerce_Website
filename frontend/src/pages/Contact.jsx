import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
    return (
        <Layout>
            <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-dark mb-4">Contact <span className="gradient-text">Us</span></h1>
                        <p className="text-gray-500 text-lg">We'd love to hear from you. Send us a message or visit our showroom.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-dark p-10 rounded-3xl shadow-2xl border border-white/20"
                        >
                            <h2 className="text-3xl font-serif font-bold mb-10 text-white">Get in Touch</h2>

                            <div className="space-y-8">
                                <div className="flex items-start space-x-5 group">
                                    <div className="bg-gradient-primary p-4 rounded-2xl shadow-lg group-hover:glow-gold transition-all duration-300">
                                        <MapPin className="h-6 w-6 text-dark" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg mb-1">Visit Us</h3>
                                        <p className="text-white/70 mt-1">123 Luxury Avenue<br />New York, NY 10012</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-5 group">
                                    <div className="bg-gradient-primary p-4 rounded-2xl shadow-lg group-hover:glow-gold transition-all duration-300">
                                        <Phone className="h-6 w-6 text-dark" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg mb-1">Call Us</h3>
                                        <p className="text-white/70 mt-1">+1 (555) 123-4567</p>
                                        <p className="text-xs text-white/50 mt-1">Mon-Fri: 9am - 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-5 group">
                                    <div className="bg-gradient-primary p-4 rounded-2xl shadow-lg group-hover:glow-gold transition-all duration-300">
                                        <Mail className="h-6 w-6 text-dark" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg mb-1">Email Us</h3>
                                        <p className="text-white/70 mt-1">support@jewelluxe.com</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-10 rounded-3xl shadow-2xl"
                        >
                            <h2 className="text-3xl font-serif font-bold mb-8">Send a Message</h2>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                    <textarea
                                        rows={5}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                                        placeholder="How can we help?"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-primary text-dark font-bold py-4 rounded-full hover:glow-gold-strong transition-all duration-300 flex items-center justify-center uppercase tracking-wider shadow-xl hover:scale-105"
                                >
                                    <Send className="w-5 h-5 mr-2" /> Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
