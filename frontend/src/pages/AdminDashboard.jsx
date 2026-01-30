import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
    const { admin } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'dashboard';

    // Core Data
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [sliders, setSliders] = useState([]);
    const [pages, setPages] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // e.g., 'product', 'category'

    const fetchData = async () => {
        setLoading(true);
        try {
            const endpoints = [
                '/categories/', '/products/', '/orders/', '/colors/',
                '/sizes/', '/sliders/', '/pages/', '/countries/', '/states/'
            ];
            const responses = await Promise.all(endpoints.map(e => api.get(e)));

            setCategories(responses[0].data.results || responses[0].data);
            setProducts(responses[1].data.results || responses[1].data);
            setOrders(responses[2].data.results || responses[2].data);
            setColors(responses[3].data.results || responses[3].data);
            setSizes(responses[4].data.results || responses[4].data);
            setSliders(responses[5].data.results || responses[5].data);
            setPages(responses[6].data.results || responses[6].data);
            setCountries(responses[7].data.results || responses[7].data);
            setStates(responses[8].data.results || responses[8].data);

            // Fetch users (customers)
            api.get('/users/').then(res => setCustomers(res.data.results || res.data)).catch(() => { });
        } catch (err) {
            console.error("Data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (admin?.isAdmin) fetchData();
    }, [admin]);

    const handleAction = async (method, endpoint, data, successMsg) => {
        setLoading(true);
        try {
            const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
            await api[method](endpoint, data, config);
            setMessage(successMsg);
            fetchData();
        } catch (err) {
            setMessage('Error: ' + (err.response?.data?.detail || 'Operation failed'));
        } finally {
            setLoading(false);
        }
    };

    const renderTable = (headers, rows, renderRow) => (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#F8FAFC]">
                        <tr>
                            {headers.map((h, i) => <th key={i} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {rows.length > 0 ? rows.map((row, i) => renderRow(row, i)) : (
                            <tr><td colSpan={headers.length} className="px-6 py-10 text-center text-slate-300 italic">No entries found in this vault</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const handleExportCsv = (title, items) => {
        if (!items || items.length === 0) {
            setMessage("Nothing to export");
            return;
        }

        // Simple CSV generation
        const headers = Object.keys(items[0]).filter(k => typeof items[0][k] !== 'object').join(',');
        const rows = items.map(item => {
            return Object.keys(item)
                .filter(k => typeof item[k] !== 'object')
                .map(k => `"${String(item[k]).replace(/"/g, '""')}"`)
                .join(',');
        }).join('\n');

        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setMessage("Exported successfully!");
    };

    const renderDashboard = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', val: `₹ ${orders.reduce((a, o) => a + parseFloat(o.total_amount || 0), 0)}`, icon: '💰', color: 'bg-emerald-500' },
                    { label: 'Active Orders', val: orders.length, icon: '📦', color: 'bg-indigo-500' },
                    { label: 'Inventory', val: products.length, icon: '💎', color: 'bg-amber-500' },
                    { label: 'VIP Clientele', val: customers.length, icon: '👥', color: 'bg-rose-500' }
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className={`${s.color} w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-lg mb-4 text-white`}>{s.icon}</div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                        <h4 className="text-3xl font-serif font-black text-slate-800 tracking-tighter">{s.val}</h4>
                        <div className="absolute -bottom-2 -right-2 text-6xl opacity-[0.03] rotate-12">{s.icon}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <h3 className="text-lg font-serif font-bold text-slate-800 mb-6">Recent Transactions</h3>
                    <div className="space-y-4">
                        {orders.slice(0, 5).map(o => (
                            <div key={o.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-mono text-xs font-bold shadow-sm">#{o.id}</div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{o.user_email || 'Boutique Guest'}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{o.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900">₹{o.total_amount}</p>
                                    <p className="text-[10px] text-slate-400">{new Date(o.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-[#1E293B] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <h3 className="text-lg font-serif font-bold text-primary mb-2">Vault Activity</h3>
                    <p className="text-slate-400 text-xs mb-8 uppercase tracking-widest font-bold">System Health Monitoring</p>
                    <div className="space-y-6">
                        {[
                            { label: 'Database Backup', time: '2h ago', status: 'Secured', color: 'text-emerald-400' },
                            { label: 'New Collection Sync', time: '5h ago', status: 'Complete', color: 'text-emerald-400' },
                            { label: 'Payment Gateway', time: 'Live', status: 'Encrypted', color: 'text-primary' },
                            { label: 'API Endpoints', time: 'Active', status: 'Healthy', color: 'text-primary' }
                        ].map((a, i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-4">
                                <div><p className="text-white font-bold">{a.label}</p><p className="text-[10px] text-slate-500">{a.time}</p></div>
                                <span className={`${a.color} text-[10px] font-black uppercase tracking-tighter`}>{a.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGenericList = (title, items, headers, renderRow) => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-slate-800">{title}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleExportCsv(title, items)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-400 flex items-center gap-2 hover:bg-slate-50 transition-colors"
                    >
                        EXPORT <span className="text-[8px]">▼</span>
                    </button>
                    <button
                        onClick={() => {
                            setModalType(activeTab);
                            setIsModalOpen(true);
                        }}
                        className="bg-primary hover:glow-gold text-dark px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-lg"
                    >
                        + Add Item
                    </button>
                </div>
            </div>
            {renderTable(headers, items, renderRow)}
        </div>
    );

    return (
        <AdminLayout title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}>
            {activeTab === 'dashboard' && renderDashboard()}

            {activeTab === 'categories' && renderGenericList('Top Categories', categories.filter(c => !c.parent), ['Name', 'Slug', 'Image', 'Active', 'Action'], (c) => (
                <tr key={c.id}>
                    <td className="px-6 py-4 font-bold text-slate-700">{c.name}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{c.slug}</td>
                    <td className="px-6 py-4"><div className="w-12 h-10 bg-slate-50 rounded shadow-inner overflow-hidden">{c.image && <img src={c.image} className="w-full h-full object-cover" />}</div></td>
                    <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold">YES</span></td>
                    <td className="px-6 py-4 text-slate-300">✍️ 🗑️</td>
                </tr>
            ))}

            {activeTab === 'subcategories' && renderGenericList('Product Sub-Categories', categories.filter(c => c.parent), ['Sub-Category', 'Parent', 'Slug', 'Action'], (c) => (
                <tr key={c.id}>
                    <td className="px-6 py-4 font-bold text-slate-700">{c.name}</td>
                    <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold">
                            ROOT: {categories.find(p => p.id === (typeof c.parent === 'object' ? c.parent.id : c.parent))?.name || 'Unknown'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{c.slug}</td>
                    <td className="px-6 py-4 text-slate-300">✍️ 🗑️</td>
                </tr>
            ))}

            {activeTab === 'products' && renderGenericList('Product Inventory', products, ['Preview', 'Product', 'Category', 'Price', 'Stock', 'Status'], (p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4"><div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shadow-inner">{p.images?.[0] && <img src={p.images[0].image} className="w-full h-full object-cover" />}</div></td>
                    <td className="px-6 py-4"><div><p className="font-bold text-slate-800">{p.name}</p><p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">ID: #{p.id}</p></div></td>
                    <td className="px-6 py-4 text-slate-500">{p.category?.name}</td>
                    <td className="px-6 py-4 font-black">₹{p.price}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{p.stock} units</td>
                    <td className="px-6 py-4"><span className={`text-[10px] font-bold px-3 py-1 rounded-full ${p.is_available ? 'bg-primary/20 text-indigo-700' : 'bg-rose-100 text-rose-600'}`}>{p.is_available ? 'IN STOCK' : 'OUT'}</span></td>
                </tr>
            ))}

            {activeTab === 'colors' && renderGenericList('Color Variants', colors, ['Name', 'Preview', 'Hex Code', 'Items', 'Action'], (c) => (
                <tr key={c.id}>
                    <td className="px-6 py-4 font-bold text-slate-700">{c.name}</td>
                    <td className="px-6 py-4"><div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: c.hex_code }} /></td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{c.hex_code}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">Live Variant</td>
                    <td className="px-6 py-4 text-slate-300">✍️ 🗑️</td>
                </tr>
            ))}

            {activeTab === 'sizes' && renderGenericList('Sizing Map', sizes, ['Size Label', 'Type', 'Action'], (s) => (
                <tr key={s.id}>
                    <td className="px-6 py-4 font-black text-slate-800">{s.name}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase tracking-widest">Dimension Variant</td>
                    <td className="px-6 py-4 text-slate-300">✍️ 🗑️</td>
                </tr>
            ))}

            {activeTab === 'orders' && renderGenericList('Transaction Log', orders, ['ID', 'Customer', 'Date', 'Status', 'Grand Total'], (o) => (
                <tr key={o.id}>
                    <td className="px-6 py-4 font-mono font-bold text-primary">#{o.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{o.user_email || 'Boutique Client'}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-3 py-1 rounded-full">{o.status}</span></td>
                    <td className="px-6 py-4 font-black">₹{o.total_amount}</td>
                </tr>
            ))}

            {activeTab === 'customers' && renderGenericList('VIP Clientele', customers, ['User', 'Contact', 'Joined', 'Orders', 'Status'], (c) => (
                <tr key={c.id}>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                {c.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="font-bold">@{c.username || 'Anonymous'}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{c.email}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{new Date(c.date_joined).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">5 Orders</td>
                    <td className="px-6 py-4 text-emerald-500 text-[10px] font-black uppercase">Active</td>
                </tr>
            ))}

            {/* Modals */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-3xl font-serif font-black text-slate-800 mb-8 capitalize">Add New {modalType}</h2>

                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    let payload = {};
                                    let endpoint = '';

                                    if (modalType === 'products') {
                                        endpoint = '/products/';
                                        payload = formData; // Use formData for image upload
                                    } else if (modalType === 'categories' || modalType === 'subcategories') {
                                        endpoint = '/categories/';
                                        payload = Object.fromEntries(formData);
                                    } else if (modalType === 'colors') {
                                        endpoint = '/colors/';
                                        payload = Object.fromEntries(formData);
                                    } else if (modalType === 'sizes') {
                                        endpoint = '/sizes/';
                                        payload = Object.fromEntries(formData);
                                    }

                                    await handleAction(payload instanceof FormData ? 'post' : 'post', endpoint, payload, `${modalType} added successfully!`);
                                    setIsModalOpen(false);
                                }}
                                className="space-y-6"
                            >
                                {modalType === 'products' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Product Name</label>
                                                <input name="name" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 outline-none" placeholder="Masterpiece Ring" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Base Price (₹)</label>
                                                <input name="price" type="number" step="0.01" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 outline-none" placeholder="0.00" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category</label>
                                            <select name="category_id" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 outline-none">
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Description</label>
                                            <textarea name="description" required rows="3" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 outline-none" placeholder="Describe the craft..." />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Stock</label>
                                                <input name="stock" type="number" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 outline-none" placeholder="10" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Asset Image</label>
                                                <input name="uploaded_images" type="file" multiple className="w-full text-xs text-slate-400 mt-2" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {(modalType === 'categories' || modalType === 'subcategories') && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category Name</label>
                                            <input name="name" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 outline-none" placeholder="New Collection" />
                                        </div>
                                        {modalType === 'subcategories' && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Parent Root</label>
                                                <select name="parent" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 outline-none">
                                                    {categories.filter(c => !c.parent).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </>
                                )}

                                {modalType === 'colors' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Color Name</label>
                                            <input name="name" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 outline-none" placeholder="Rose Gold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Hex Chromatic Code</label>
                                            <input name="hex_code" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 outline-none" placeholder="#B76E79" />
                                        </div>
                                    </>
                                )}

                                {modalType === 'sizes' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Size Label</label>
                                        <input name="name" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 outline-none" placeholder="Medium (M)" />
                                    </div>
                                )}

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all hover:bg-slate-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:glow-gold transition-all"
                                    >
                                        Establish Entity
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Default for Slider/Pages/etc */}
            {!['dashboard', 'categories', 'subcategories', 'products', 'colors', 'sizes', 'orders', 'customers'].includes(activeTab) && (
                <div className="bg-white rounded-[2.5rem] p-24 text-center border border-slate-100 shadow-sm">
                    <div className="text-6xl mb-6 opacity-40">🛠️</div>
                    <h2 className="text-3xl font-serif font-black text-slate-800 mb-4">Under Construction</h2>
                    <p className="text-slate-400 max-w-md mx-auto">The {activeTab} orchestration logic is currently being calibrated in the management vault.</p>
                </div>
            )}

            {message && (
                <div className="fixed bottom-10 right-10 z-[100] bg-dark text-white p-6 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-4 animate-slide-in-up">
                    <span className="text-primary font-black uppercase text-[10px] tracking-widest border border-primary/20 px-2 py-0.5 rounded">SYSTEM NOTICE</span>
                    <span className="text-sm font-medium">{message}</span>
                    <button onClick={() => setMessage('')} className="ml-4 hover:text-primary transition-colors">✕</button>
                </div>
            )}
        </AdminLayout>
    );
}
