import Layout from '../components/Layout';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <Layout>
            <div className="bg-white min-h-screen py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl font-serif font-bold text-dark mb-8">About JewelLuxe</h1>
                        <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>

                        <div className="prose prose-lg mx-auto text-gray-500 space-y-8">
                            <p>
                                Welcome to <strong>JewelLuxe</strong>, where elegance meets craftsmanship.
                                Founded with a passion for exceptional artistry, we believe that jewelry is more
                                than just an accessory—it's a form of expression, a memory keeper, and a legacy.
                            </p>
                            <p>
                                Our collections are inspired by the timeless beauty of nature and the modern
                                spirit of sophistication. Each piece is meticulously crafted by skilled artisans
                                who pour their heart into ensuring every detail shines with perfection.
                            </p>
                            <p>
                                At JewelLuxe, we are committed to sustainability and ethical sourcing.
                                We work closely with suppliers to ensure that our materials are not only
                                beautiful but also responsibly obtained.
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-gray-50 rounded-lg">
                                <h3 className="font-serif text-xl font-bold mb-2">Authenticity</h3>
                                <p className="text-sm text-gray-500">Guaranteed genuine materials and gemstones.</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-lg">
                                <h3 className="font-serif text-xl font-bold mb-2">Craftsmanship</h3>
                                <p className="text-sm text-gray-500">Hand-finished with precision and care.</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-lg">
                                <h3 className="font-serif text-xl font-bold mb-2">Design</h3>
                                <p className="text-sm text-gray-500">Unique, contemporary, and timeless styles.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
