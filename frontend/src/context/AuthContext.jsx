import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load customer session
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }

        // Load admin session
        const savedAdmin = localStorage.getItem('admin_user');
        const adminToken = localStorage.getItem('admin_token');
        if (savedAdmin && adminToken) {
            setAdmin(JSON.parse(savedAdmin));
        }

        setLoading(false);
    }, []);

    const login = async (username, password) => {
        // Mock customer login
        if (username !== 'admin') {
            const mockUser = { username, email: `${username}@example.com`, isAdmin: false };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('token', 'customer-token');
            return true;
        }
        return false;
    };

    const loginAdmin = async (username, password) => {
        // Strictly for admin access
        if (username === 'admin' && password === 'admin') {
            const adminUser = { username: 'admin', email: 'admin@boutique.com', isAdmin: true };
            setAdmin(adminUser);
            localStorage.setItem('admin_user', JSON.stringify(adminUser));
            localStorage.setItem('admin_token', 'admin-token');

            // For API requests using basic auth
            const authHeader = btoa(`${username}:${password}`);
            localStorage.setItem('basicAuth', authHeader);
            return true;
        }
        return false;
    };

    const loginAsGuest = (emailOrPhone) => {
        const guestUser = {
            username: 'Guest',
            email: emailOrPhone.includes('@') ? emailOrPhone : '',
            phone: !emailOrPhone.includes('@') ? emailOrPhone : '',
            isGuest: true
        };
        setUser(guestUser);
        localStorage.setItem('user', JSON.stringify(guestUser));
        localStorage.setItem('token', 'guest-token');
        return true;
    };

    const register = async (userData) => {
        const newUser = {
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            isAdmin: false
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', 'register-token');
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const logoutAdmin = () => {
        setAdmin(null);
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('basicAuth');
    };

    return (
        <AuthContext.Provider value={{
            user,
            admin,
            login,
            loginAdmin,
            logout,
            logoutAdmin,
            loginAsGuest,
            register,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}
