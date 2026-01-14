import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
    const sections = [
        {
            title: "Data Collection",
            icon: <Eye className="h-6 w-6 text-primary" />,
            content: "We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email address, phone number, and payment information."
        },
        {
            title: "How We Use Information",
            icon: <FileText className="h-6 w-6 text-primary" />,
            content: "We use the information we collect to process your orders, provide customer support, personalizing your shopping experience, and send you marketing communications (if you opt-in)."
        },
        {
            title: "Data Protection",
            icon: <Lock className="h-6 w-6 text-primary" />,
            content: "We implement a variety of security measures to maintain the safety of your personal information. Your sensitive data is encrypted via Secure Socket Layer (SSL) technology."
        },
        {
            title: "Third-Party Sharing",
            icon: <Shield className="h-6 w-6 text-primary" />,
            content: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except for trusted third parties who assist us in operating our website and servicing you."
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
                        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Privacy <span className="gradient-text">Policy</span></h1>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            At JewelLuxe, we are committed to protecting your privacy and ensuring the security of your personal information.
                        </p>
                    </motion.div>

                    <div className="space-y-8">
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex gap-6"
                            >
                                <div className="flex-shrink-0">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        {section.icon}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">{section.title}</h2>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {section.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 p-8 bg-dark rounded-3xl text-white text-center"
                    >
                        <h3 className="text-2xl font-serif font-bold mb-4">Questions?</h3>
                        <p className="text-white/60 mb-6">If you have any questions about our privacy practices, please contact our support team.</p>
                        <a href="mailto:privacy@jewelluxe.com" className="inline-block px-8 py-3 bg-gradient-primary text-dark font-bold rounded-xl hover:scale-105 transition-transform">
                            Contact Support
                        </a>
                    </motion.div>

                    <p className="text-center text-gray-400 text-xs mt-12 italic">
                        Last Updated: January 13, 2026
                    </p>
                </div>
            </div>
        </Layout>
    );
}
