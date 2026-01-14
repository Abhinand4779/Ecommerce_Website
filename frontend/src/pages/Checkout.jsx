import { useState } from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, login, loginAsGuest } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [isLoginView, setIsLoginView] = useState(!user);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const success = await login(loginData.username, loginData.password);
        if (success) {
            setIsLoginView(false);
        } else {
            alert("Invalid credentials. Try admin/admin");
        }
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login first");
            return;
        }

        const orderData = {
            total_amount: cartTotal,
            shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
            items: cartItems.map(item => ({
                product: item.id,
                quantity: item.quantity,
                price: item.discount_price || item.price
            }))
        };

        try {
            await api.post('/orders/', orderData);
            clearCart();
            alert("Order verified and placed successfully!");
            navigate('/');
        } catch (error) {
            console.error("Order failed", error);
            alert("Failed to place order. " + (error.response?.data?.detail || ""));
        }
    };

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen py-10">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-3xl font-serif mb-8 text-center">Checkout</h1>

                    {isLoginView ? (
                        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                            <h2 className="text-xl font-bold mb-4">Login to Checkout</h2>
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={loginData.username}
                                        onChange={handleLoginChange}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-primary text-white py-2 rounded">Login</button>
                                <div className="text-center my-2 text-sm text-gray-400">Or</div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        loginAsGuest();
                                        setIsLoginView(false);
                                    }}
                                    className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50"
                                >
                                    Continue as Guest
                                </button>
                                <p className="text-sm text-gray-400 text-center mt-4">Use admin / admin</p>
                            </form>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Shipping Form */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
                                <form onSubmit={handleSubmitOrder} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-600">Full Address</label>
                                        <input
                                            required
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full border p-2 rounded mt-1"
                                            placeholder="123 Jewelry Lane"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-600">City</label>
                                            <input
                                                required
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full border p-2 rounded mt-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">Postal Code</label>
                                            <input
                                                required
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                className="w-full border p-2 rounded mt-1"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600">Country</label>
                                        <input
                                            required
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full border p-2 rounded mt-1"
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <h3 className="font-bold mb-2">Payment</h3>
                                        <div className="border p-4 rounded bg-gray-50 text-sm text-gray-500">
                                            Cash on Delivery (Standard for Demo)
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-dark text-white py-3 rounded hover:bg-black transition-colors">
                                        Place Order (${cartTotal.toFixed(2)})
                                    </button>
                                </form>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-100 p-6 rounded-lg h-fit">
                                <h2 className="text-xl font-bold mb-4">Your Order</h2>
                                <div className="space-y-4 max-h-96 overflow-auto">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>${(item.discount_price || item.price) * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
