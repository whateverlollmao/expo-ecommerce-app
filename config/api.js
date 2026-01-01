// API Service Layer
// Handles all backend communication with fallback to local data

import AsyncStorage from '@react-native-async-storage/async-storage';
import config, { isConfigured, getEndpoint } from './config';
import { products } from '../data/dummyData';

// HTTP Client
const httpClient = {
    async request(endpoint, options = {}) {
        if (!isConfigured('api')) {
            return null;
        }

        const url = getEndpoint(endpoint);
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                timeout: config.api.timeout,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error: ${endpoint}`, error.message);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },
};

// Product Service
export const ProductService = {
    async getAll() {
        const apiData = await httpClient.get('products');
        return apiData || products;
    },

    async getById(id) {
        const apiData = await httpClient.get(`products/${id}`);
        return apiData || products.find(p => p.id === id);
    },

    async getByCategory(category) {
        const apiData = await httpClient.get(`products?category=${category}`);
        return apiData || products.filter(p => p.category === category);
    },

    async getByGender(gender) {
        const apiData = await httpClient.get(`products?gender=${gender}`);
        return apiData || products.filter(p => p.gender === gender);
    },

    async search(query) {
        const apiData = await httpClient.get(`products/search?q=${encodeURIComponent(query)}`);
        if (apiData) return apiData;

        const q = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
        );
    },
};

// Order Service
const ORDERS_KEY = '@orders';

export const OrderService = {
    async create(orderData) {
        const apiData = await httpClient.post('orders', orderData);
        if (apiData) return apiData;

        const orders = await this.getAll();
        const newOrder = {
            id: `ORD-${Date.now()}`,
            ...orderData,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        };
        orders.push(newOrder);
        await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
        return newOrder;
    },

    async getAll() {
        const apiData = await httpClient.get('orders');
        if (apiData) return apiData;

        const data = await AsyncStorage.getItem(ORDERS_KEY);
        return data ? JSON.parse(data) : [];
    },

    async getById(id) {
        const apiData = await httpClient.get(`orders/${id}`);
        if (apiData) return apiData;

        const orders = await this.getAll();
        return orders.find(o => o.id === id);
    },
};

// User Service
const USER_KEY = '@user_profile';

export const UserService = {
    async getProfile() {
        const apiData = await httpClient.get('users/me');
        if (apiData) return apiData;

        const data = await AsyncStorage.getItem(USER_KEY);
        return data ? JSON.parse(data) : null;
    },

    async updateProfile(profileData) {
        const apiData = await httpClient.put('users/me', profileData);
        if (apiData) return apiData;

        await AsyncStorage.setItem(USER_KEY, JSON.stringify(profileData));
        return profileData;
    },
};

// Address Service
const ADDRESSES_KEY = '@saved_addresses';

export const AddressService = {
    async getAll() {
        const apiData = await httpClient.get('addresses');
        if (apiData) return apiData;

        const data = await AsyncStorage.getItem(ADDRESSES_KEY);
        return data ? JSON.parse(data) : [];
    },

    async add(addressData) {
        const apiData = await httpClient.post('addresses', addressData);
        if (apiData) return apiData;

        const addresses = await this.getAll();
        const newAddress = { id: `addr-${Date.now()}`, ...addressData };
        addresses.push(newAddress);
        await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
        return newAddress;
    },

    async update(id, addressData) {
        const apiData = await httpClient.put(`addresses/${id}`, addressData);
        if (apiData) return apiData;

        const addresses = await this.getAll();
        const index = addresses.findIndex(a => a.id === id);
        if (index !== -1) {
            addresses[index] = { ...addresses[index], ...addressData };
            await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
            return addresses[index];
        }
        return null;
    },

    async delete(id) {
        await httpClient.delete(`addresses/${id}`);
        const addresses = await this.getAll();
        const filtered = addresses.filter(a => a.id !== id);
        await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(filtered));
        return true;
    },
};

// Auth Service
export const AuthService = {
    async signIn(email, password) {
        if (isConfigured('api')) {
            const response = await httpClient.post('auth/login', { email, password });
            if (response?.token) {
                await AsyncStorage.setItem('@auth_token', response.token);
            }
            return response;
        }
        return { success: true, user: { email, name: 'Demo User' } };
    },

    async signUp(userData) {
        if (isConfigured('api')) {
            return await httpClient.post('auth/register', userData);
        }
        return { success: true, user: userData };
    },

    async signOut() {
        await AsyncStorage.removeItem('@auth_token');
        if (isConfigured('api')) {
            await httpClient.post('auth/logout');
        }
        return { success: true };
    },

    async isAuthenticated() {
        const token = await AsyncStorage.getItem('@auth_token');
        return !!token;
    },

    async signInWithGoogle() {
        if (!isConfigured('google')) {
            return { success: false, error: 'Google Sign-In not configured' };
        }
        // Implementation here
    },

    async signInWithApple() {
        if (!isConfigured('apple')) {
            return { success: false, error: 'Apple Sign-In not configured' };
        }
        // Implementation here
    },
};

// Payment Service
export const PaymentService = {
    async processStripePayment(paymentData) {
        if (!isConfigured('stripe')) {
            return { success: true, transactionId: `demo-${Date.now()}` };
        }
        // Stripe implementation here
    },

    async processPayPalPayment(paymentData) {
        if (!isConfigured('paypal')) {
            return { success: true, transactionId: `demo-${Date.now()}` };
        }
        // PayPal implementation here
    },

    async validatePromoCode(code) {
        if (isConfigured('api')) {
            return await httpClient.post('promo/validate', { code });
        }

        const promo = config.promoCodes[code.toUpperCase()];
        if (promo) {
            return { success: true, ...promo };
        }
        return { success: false, error: 'Invalid promo code' };
    },
};

export default {
    ProductService,
    OrderService,
    UserService,
    AddressService,
    AuthService,
    PaymentService,
    httpClient,
};
