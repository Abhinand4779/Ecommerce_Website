import { useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, LogOut, ShoppingBag, ArrowRight, UserPlus } from 'lucide-react';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            // Fetch user orders
            api.get('/orders/')
                .then(res => {
                    setOrders(res.data.results || res.data);
                })
                .catch(err => console.error("Failed to load orders", err))
                .finally(() => setLoading(false));
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 px-4">
                <div className="max-w-5xl mx-auto">

                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
                    >
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-gray-900">Your <span className="gradient-text">Profile</span></h1>
                            <p className="text-gray-500 mt-2">Manage your luxury account and track your boutique orders</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Order History */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                                <h2 className="text-2xl font-serif font-bold mb-8 flex items-center space-x-3 text-gray-800">
                                    <ShoppingBag className="h-6 w-6 text-primary" />
                                    <span>Order History</span>
                                </h2>

                                {loading ? (
                                    <div className="py-12 text-center text-gray-400">Loading your history...</div>
                                ) : orders.length > 0 ? (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div key={order.id} className="p-6 rounded-2xl border-2 border-gray-50 hover:border-primary/20 transition-all bg-gray-50/30">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID: #{order.id}</p>
                                                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                                'bg-primary/20 text-primary'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div className="flex -space-x-2">
                                                        {order.items?.slice(0, 3).map((item, idx) => (
                                                            <div key={idx} className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                                                                {item.quantity}x
                                                            </div>
                                                        ))}
                                                        {order.items?.length > 3 && (
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 text-[10px] font-bold text-gray-400 flex items-center justify-center border border-white">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Total Amount</p>
                                                        <p className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                                                            ${order.total_amount}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <p className="text-gray-400 mb-6">No orders found in your history.</p>
                                        <Link to="/shop" className="text-primary font-bold hover:underline">Start Shopping →</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Sidebar / Profile Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {/* Membership Card */}
                            <div className="bg-dark p-8 rounded-3xl shadow-xl text-white relative overflow-hidden group hover:glow-gold transition-all duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/40 transition-all"></div>
                                <Shield className="h-10 w-10 text-primary mb-6" />
                                <h3 className="text-2xl font-serif font-bold mb-2">Member Status</h3>
                                <p className="text-white/60 text-sm mb-6">You're currently a <span className="text-primary font-bold">{user.isGuest ? 'Guest' : 'VIP Member'}</span></p>

                                {user.isGuest && (
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center space-x-2 text-primary font-bold hover:text-white transition-colors text-sm"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        <span>Upgrade to Member</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </div>

                            {/* Account Details */}
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                                <h3 className="font-serif font-bold text-gray-800 mb-6 flex items-center space-x-2">
                                    <User className="h-5 w-5 text-primary" />
                                    <span>Account Details</span>
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Username</p>
                                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</p>
                                        <p className="text-sm font-medium text-gray-900">{user.email || 'Not provided'}</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-50">
                                        <Link to="/cart" className="text-sm text-gray-500 hover:text-primary flex justify-between items-center transition-colors">
                                            <span>Quick Access: Cart</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
