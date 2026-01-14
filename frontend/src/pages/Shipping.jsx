import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Truck, Globe, Clock, CreditCard, CheckCircle } from 'lucide-react';

export default function Shipping() {
    const methods = [
        {
            title: "Standard Shipping",
            price: "$9.99 (Free on orders over $500)",
            time: "5-7 Business Days",
            icon: <Truck className="h-6 w-6 text-primary" />
        },
        {
            title: "Express Shipping",
            price: "$24.99",
            time: "2-3 Business Days",
            icon: <Clock className="h-6 w-6 text-primary" />
        },
        {
            title: "International Luxury",
            price: "$49.99",
            time: "7-14 Business Days",
            icon: <Globe className="h-6 w-6 text-primary" />
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Shipping <span className="gradient-text">Information</span></h1>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            We ensure that every JewelLuxe piece reaches you with the utmost care and in perfect condition.
                        </p>
                    </motion.div>

                    {/* Shipping Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {methods.map((method, index) => (
                            <motion.div
                                key={method.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 text-center flex flex-col items-center"
                            >
                                <div className="p-4 bg-gray-50 rounded-2xl mb-6">
                                    {method.icon}
                                </div>
                                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{method.title}</h3>
                                <p className="text-primary font-bold text-sm mb-1">{method.price}</p>
                                <p className="text-gray-400 text-xs uppercase tracking-widest">{method.time}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* More Info */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
                        >
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <CreditCard className="h-6 w-6 text-primary" />
                                <span>Order Processing</span>
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                Every piece is inspected by our quality assurance team before shipping. Orders placed before 2:00 PM EST are typically processed within 24-48 business hours. You will receive a tracking number via email as soon as your order has been dispatched.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
                        >
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-primary" />
                                <span>Luxury Packaging</span>
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                All our jewelry arrives in our signature JewelLuxe heritage box, featuring a velvet-lined interior and a certificate of authenticity. We use discreet outer packaging for security during transit.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 p-8 bg-dark rounded-3xl text-white text-center"
                    >
                        <h3 className="text-2xl font-serif font-bold mb-4">Need it faster?</h3>
                        <p className="text-white/60 mb-6">Contact our concierge for special delivery requests, including same-day courier services in select cities.</p>
                        <button className="px-8 py-3 bg-gradient-primary text-dark font-bold rounded-xl hover:scale-105 transition-transform">
                            Contact Concierge
                        </button>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
