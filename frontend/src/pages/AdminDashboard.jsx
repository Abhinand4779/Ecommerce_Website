import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const { admin, logoutAdmin } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        category_id: '',
    });
    const [images, setImages] = useState([]); // Array of files
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (admin?.isAdmin) {
            // Fetch categories for dropdown
            api.get('/categories/')
                .then(res => setCategories(res.data))
                .catch(err => console.error("Failed to load categories", err));

            // Fetch all orders
            api.get('/orders/')
                .then(res => setOrders(res.data.results || res.data))
                .catch(err => console.error("Failed to load orders", err));
        }
    }, [admin]);

    // Authenticated check
    if (!admin || !admin.isAdmin) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-red-600">Access Restricted</h2>
                        <p className="mb-6 text-gray-600">You do not have permission to view this page. This area is for administrators only.</p>
                        <button onClick={() => navigate('/admin-login')} className="bg-dark text-white px-6 py-2 rounded hover:bg-black transition-colors">
                            Go to Admin Login
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            slug: name === 'name' ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-') : prev.slug
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('slug', formData.slug);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category_id', formData.category_id);
        images.forEach(img => {
            data.append('uploaded_images', img);
        });

        try {
            await api.post('/products/', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage('Product created successfully!');
            setFormData({ name: '', slug: '', description: '', price: '', category_id: '' });
            setImages([]);
        } catch (error) {
            console.error('Create product failed', error);
            setMessage('Error creating product: ' + (error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/`, { status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Tabs */}
                    <div className="flex space-x-4 mb-8">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'products' ? 'bg-primary text-dark shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                        >
                            Products Management
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-primary text-dark shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                        >
                            Orders Management
                        </button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                    >
                        <div className="bg-dark px-8 py-6 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-serif font-bold text-white">
                                    {activeTab === 'products' ? 'Add New Product' : 'All Customer Orders'}
                                </h1>
                                <button
                                    onClick={() => { logoutAdmin(); navigate('/admin-login'); }}
                                    className="text-[10px] text-gray-500 hover:text-red-400 uppercase tracking-widest font-bold border border-gray-800 px-3 py-1 rounded-full transition-all"
                                >
                                    Logout Admin
                                </button>
                            </div>
                            <span className="text-primary text-xs uppercase tracking-[0.2em] font-bold">Admin Portal</span>
                        </div>

                        <div className="p-8">
                            {activeTab === 'products' ? (
                                <>
                                    {message && (
                                        <div className={`p-4 mb-8 rounded-2xl ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                            {message}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Product Name</label>
                                                <input
                                                    required
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    placeholder="e.g. Diamond Eternity Ring"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Slug (URL)</label>
                                                <input
                                                    required
                                                    name="slug"
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                    className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Price ($)</label>
                                                <input
                                                    required
                                                    type="number"
                                                    name="price"
                                                    step="0.01"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Category</label>
                                                <select
                                                    required
                                                    name="category_id"
                                                    value={formData.category_id}
                                                    onChange={handleChange}
                                                    className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white"
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Description</label>
                                            <textarea
                                                required
                                                name="description"
                                                rows={4}
                                                value={formData.description}
                                                onChange={handleChange}
                                                className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="Describe the exquisite details..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Product Gallery (Multiple Angles)</label>

                                            {/* Preview Grid */}
                                            {images.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                    {images.map((img, idx) => (
                                                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group">
                                                            <img
                                                                src={URL.createObjectURL(img)}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                                onLoad={() => URL.revokeObjectURL(img)}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(idx)}
                                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="relative border-4 border-dashed border-gray-100 rounded-3xl p-12 text-center hover:border-primary/30 transition-all group bg-gray-50/50">
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={handleImageChange}
                                                />
                                                <div className="space-y-2">
                                                    <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="12 4v16m8-8H4" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-lg font-medium text-gray-600">
                                                        <span>Drop images here or <span className="text-primary">browse</span></span>
                                                    </p>
                                                    <p className="text-sm text-gray-400">Select multiple photos for different product sides</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-10 py-4 bg-gradient-primary text-dark font-bold rounded-2xl shadow-xl hover:glow-gold-strong transition-all uppercase tracking-widest disabled:opacity-50"
                                            >
                                                {loading ? 'Processing...' : 'Add to Collection'}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left border-b border-gray-100">
                                                <th className="pb-4 font-serif text-gray-400 font-medium">Order ID</th>
                                                <th className="pb-4 font-serif text-gray-400 font-medium">Customer</th>
                                                <th className="pb-4 font-serif text-gray-400 font-medium">Date</th>
                                                <th className="pb-4 font-serif text-gray-400 font-medium">Total</th>
                                                <th className="pb-4 font-serif text-gray-400 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {orders.map((order) => (
                                                <tr key={order.id} className="group">
                                                    <td className="py-6 font-bold text-gray-900">#{order.id}</td>
                                                    <td className="py-6">
                                                        <div className="text-sm font-medium text-gray-900">{order.user_email || 'Customer'}</div>
                                                        <div className="text-xs text-gray-400">{order.shipping_address?.substring(0, 30)}...</div>
                                                    </td>
                                                    <td className="py-6 text-sm text-gray-500">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-6 font-bold text-primary">${order.total_amount}</td>
                                                    <td className="py-6">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                            className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 outline-none transition-all ${order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                                                order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                    'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                                }`}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {orders.length === 0 && (
                                        <div className="text-center py-20 grayscale opacity-50">
                                            <p className="text-gray-400">No orders placed yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
