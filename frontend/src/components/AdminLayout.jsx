import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children, title }) {
    const { admin, logoutAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState(['categories', 'products']);

    const toggleMenu = (menu) => {
        setExpandedMenus(prev =>
            prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
        );
    };

    const sections = [
        {
            title: 'NAVIGATION',
            items: [
                { label: 'Dashboard', icon: '🏠', path: '/admin-dashboard?tab=dashboard', tab: 'dashboard' }
            ]
        },
        {
            title: 'MODULES',
            items: [
                {
                    label: 'Categories',
                    icon: '📁',
                    id: 'categories',
                    subItems: [
                        { label: 'Category', path: '/admin-dashboard?tab=categories' },
                        { label: 'Sub Category', path: '/admin-dashboard?tab=subcategories' }
                    ]
                },
                {
                    label: 'Products',
                    icon: '📦',
                    id: 'products',
                    subItems: [
                        { label: 'List', path: '/admin-dashboard?tab=products' },
                        { label: 'Size', path: '/admin-dashboard?tab=sizes' },
                        { label: 'Color', path: '/admin-dashboard?tab=colors' }
                    ]
                },
                { label: 'Customers', icon: '👥', path: '/admin-dashboard?tab=customers', tab: 'customers' },
                { label: 'Home Groups', icon: '🏠', path: '/admin-dashboard?tab=homegroups', tab: 'homegroups' },
                { label: 'Orders History', icon: '📜', path: '/admin-dashboard?tab=orders', tab: 'orders' },
                { label: 'Sliders', icon: '🖼️', path: '/admin-dashboard?tab=sliders', tab: 'sliders' }
            ]
        },
        {
            title: 'PAGES',
            items: [
                { label: 'Pages', icon: '📄', path: '/admin-dashboard?tab=pages', tab: 'pages' }
            ]
        },
        {
            title: 'LOCATIONS',
            items: [
                { label: 'Countries', icon: '🌍', path: '/admin-dashboard?tab=countries', tab: 'countries' },
                { label: 'States', icon: '📍', path: '/admin-dashboard?tab=states', tab: 'states' }
            ]
        }
    ];

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin-login');
    };

    if (!admin || !admin.isAdmin) return null;

    return (
        <div className="min-h-screen bg-[#F4F7F9] flex font-sans text-slate-900">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 0 }}
                className="bg-[#1E293B] text-white flex flex-col fixed h-full z-50 shadow-2xl overflow-hidden"
            >
                {/* Logo Section */}
                <div className="p-6 flex items-center justify-between border-b border-slate-700">
                    <motion.div
                        animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                        className="font-serif text-xl font-bold tracking-tight text-white whitespace-nowrap"
                    >
                        JEWEL<span className="text-primary">LUXE</span>
                    </motion.div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
                    {sections.map((section, idx) => (
                        <div key={idx} className="mb-4">
                            <div className="px-6 py-2 text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                                {section.title}
                            </div>
                            {section.items.map((item, itemIdx) => (
                                <div key={itemIdx}>
                                    {item.subItems ? (
                                        <>
                                            <button
                                                onClick={() => toggleMenu(item.id)}
                                                className="w-full flex items-center px-6 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-all group"
                                            >
                                                <span className="mr-3">{item.icon}</span>
                                                <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                                                <span className={`text-[10px] transition-transform ${expandedMenus.includes(item.id) ? 'rotate-90' : ''}`}>▶</span>
                                            </button>
                                            <AnimatePresence>
                                                {expandedMenus.includes(item.id) && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-[#161E2E]"
                                                    >
                                                        {item.subItems.map((sub, subIdx) => {
                                                            const isActive = location.search === sub.path.split('?')[1] || location.search.includes(sub.path.split('?')[1]);
                                                            return (
                                                                <Link
                                                                    key={subIdx}
                                                                    to={sub.path}
                                                                    className={`block pl-14 py-2.5 text-xs font-medium transition-all ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
                                                                >
                                                                    {sub.label}
                                                                    {sub.label === 'Color' && <span className="ml-2 bg-primary/20 text-primary text-[8px] px-1.5 py-0.5 rounded">New</span>}
                                                                </Link>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className={`flex items-center px-6 py-3 transition-all ${(location.search.includes(item.tab) || (item.tab === 'dashboard' && (location.search === '' || location.search === '?tab=dashboard')))
                                                    ? 'bg-slate-800 text-white'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                }`}
                                        >
                                            <span className="mr-3">{item.icon}</span>
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="px-6 mt-8">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center py-2 text-red-400 hover:text-red-300 transition-all text-sm font-medium"
                        >
                            <span className="mr-3">🚪</span> Logout
                        </button>
                    </div>
                </nav>

                <div className="p-6 border-t border-slate-700 text-[10px] text-slate-500">
                    2026 © vezgrow -
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main
                className="flex-1 transition-all duration-300 min-w-0"
                style={{ marginLeft: isSidebarOpen ? 260 : 0 }}
            >
                {/* Header */}
                <header className="sticky top-0 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-40">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="text-xl">☰</span>
                        </button>
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                🔍
                            </span>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-[#F3F6F9] border-none rounded-lg w-64 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            <button className="ml-2 px-4 py-2 bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold rounded-lg hover:bg-primary/20 transition-all">
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <button className="p-2 text-slate-400 hover:text-slate-600">
                                🔔
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                                Ad
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-bold text-slate-700">Admin</p>
                                <p className="text-[10px] text-slate-400">admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 overflow-x-auto">
                    {children}
                </div>

                <footer className="px-6 py-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-200 bg-white">
                    <div>2026 © vezgrow -</div>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-primary">About</a>
                        <a href="#" className="hover:text-primary">Support</a>
                        <a href="#" className="hover:text-primary">Contact Us</a>
                    </div>
                </footer>
            </main>
        </div>
    );
}
