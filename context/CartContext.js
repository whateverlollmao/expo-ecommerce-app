import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();
const CART_STORAGE_KEY = '@cart_items';
const ORDERS_STORAGE_KEY = '@orders';
const WISHLIST_STORAGE_KEY = '@wishlist';
const RECENTLY_VIEWED_KEY = '@recently_viewed';

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [savedCart, savedOrders, savedWishlist, savedRecent] = await Promise.all([
                AsyncStorage.getItem(CART_STORAGE_KEY),
                AsyncStorage.getItem(ORDERS_STORAGE_KEY),
                AsyncStorage.getItem(WISHLIST_STORAGE_KEY),
                AsyncStorage.getItem(RECENTLY_VIEWED_KEY),
            ]);
            if (savedCart) setCartItems(JSON.parse(savedCart));
            if (savedOrders) setOrders(JSON.parse(savedOrders));
            if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
            if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
        } catch (e) {
            console.log('Error loading data:', e);
        }
        setIsLoaded(true);
    };

    const saveCart = async (items) => {
        try {
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.log('Error saving cart:', e);
        }
    };

    const saveOrders = async (orderList) => {
        try {
            await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orderList));
        } catch (e) {
            console.log('Error saving orders:', e);
        }
    };

    const saveWishlist = async (items) => {
        try {
            await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.log('Error saving wishlist:', e);
        }
    };

    const saveRecentlyViewed = async (items) => {
        try {
            await AsyncStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
        } catch (e) {
            console.log('Error saving recently viewed:', e);
        }
    };

    // Wishlist functions
    const toggleWishlist = useCallback((productId) => {
        setWishlist(prev => {
            const isInWishlist = prev.includes(productId);
            const newList = isInWishlist
                ? prev.filter(id => id !== productId)
                : [...prev, productId];
            saveWishlist(newList);
            return newList;
        });
    }, []);

    const isInWishlist = useCallback((productId) => {
        return wishlist.includes(productId);
    }, [wishlist]);

    // Recently viewed
    const addToRecentlyViewed = useCallback((productId) => {
        setRecentlyViewed(prev => {
            const filtered = prev.filter(id => id !== productId);
            const newList = [productId, ...filtered].slice(0, 10); // Keep last 10
            saveRecentlyViewed(newList);
            return newList;
        });
    }, []);

    const addToCart = useCallback((product, selectedSize, quantity = 1) => {
        setCartItems(prevItems => {
            const sizeStock = product.sizes?.find(s => s.size === selectedSize);
            if (sizeStock && sizeStock.stock < quantity) {
                return prevItems;
            }

            const cartItemId = `${product.id}_${selectedSize}`;
            const existingItem = prevItems.find(item => item.cartItemId === cartItemId);

            let newItems;
            if (existingItem) {
                newItems = prevItems.map(item =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newItems = [...prevItems, {
                    ...product,
                    cartItemId,
                    selectedSize,
                    quantity
                }];
            }
            saveCart(newItems);
            return newItems;
        });
    }, []);

    const removeFromCart = useCallback((cartItemId) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter(item => item.cartItemId !== cartItemId);
            saveCart(newItems);
            return newItems;
        });
    }, []);

    const updateQuantity = useCallback((cartItemId, change) => {
        setCartItems(prevItems => {
            const newItems = prevItems.map(item => {
                if (item.cartItemId === cartItemId) {
                    const newQuantity = item.quantity + change;
                    if (newQuantity <= 0) return null;
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(Boolean);
            saveCart(newItems);
            return newItems;
        });
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
        saveCart([]);
    }, []);

    const getCartTotal = useCallback(() => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [cartItems]);

    const getCartCount = useCallback(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    const placeOrder = useCallback(async (shippingAddress, paymentMethod) => {
        const order = {
            id: 'ORD' + Date.now(),
            items: [...cartItems],
            total: getCartTotal(),
            shippingAddress,
            paymentMethod: {
                last4: paymentMethod.cardNumber.slice(-4),
                brand: 'Visa',
            },
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        };

        const newOrders = [order, ...orders];
        setOrders(newOrders);
        await saveOrders(newOrders);
        clearCart();
        return order;
    }, [cartItems, orders, getCartTotal, clearCart]);

    if (!isLoaded) {
        return null;
    }

    return (
        <CartContext.Provider value={{
            cartItems,
            orders,
            orderHistory: orders, // Alias for backwards compatibility
            wishlist,
            recentlyViewed,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            placeOrder,
            toggleWishlist,
            isInWishlist,
            addToRecentlyViewed,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
