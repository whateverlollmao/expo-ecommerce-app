import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

// Try to import Accelerometer, fallback gracefully
let Accelerometer = null;
try {
    const sensors = require('expo-sensors');
    Accelerometer = sensors.Accelerometer;
} catch (e) {
    // expo-sensors not installed, shadows will be static
}

const { width } = Dimensions.get('window');

// Smart Shadow that responds to device tilt
export function SmartShadowCard({ children, style, intensity = 1 }) {
    const { theme, isDark } = useTheme();
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const shadowX = useRef(new Animated.Value(0)).current;
    const shadowY = useRef(new Animated.Value(4)).current;

    useEffect(() => {
        let subscription;

        if (Accelerometer && (Platform.OS === 'ios' || Platform.OS === 'android')) {
            Accelerometer.setUpdateInterval(100);
            subscription = Accelerometer.addListener(({ x, y }) => {
                // Subtle shadow shift based on tilt (max 8px offset)
                const offsetX = Math.max(-8, Math.min(8, x * 8 * intensity));
                const offsetY = Math.max(2, Math.min(12, (1 - y) * 6 * intensity));

                Animated.spring(shadowX, { toValue: offsetX, friction: 10, useNativeDriver: false }).start();
                Animated.spring(shadowY, { toValue: offsetY, friction: 10, useNativeDriver: false }).start();
            });
        }

        return () => subscription?.remove();
    }, [intensity]);

    return (
        <Animated.View
            style={[
                styles.smartShadow,
                {
                    shadowColor: isDark ? '#000' : theme.accent,
                    shadowOffset: { width: shadowX, height: shadowY },
                    shadowOpacity: isDark ? 0.4 : 0.15,
                    shadowRadius: 16,
                    elevation: 8,
                },
                style,
            ]}
        >
            {children}
        </Animated.View>
    );
}

// Personal Shopping Insights - tracks user behavior
const INSIGHTS_KEY = '@shopping_insights';

export function useShoppingInsights() {
    const [insights, setInsights] = useState({
        totalOrders: 0,
        avgOrderValue: 0,
        favoriteCategory: null,
        favoriteBrand: null,
        preferredColors: [],
        shoppingDays: {},
        browsingTime: 0,
        wishlistConversion: 0,
    });

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = async () => {
        try {
            const data = await AsyncStorage.getItem(INSIGHTS_KEY);
            if (data) {
                setInsights(JSON.parse(data));
            }
        } catch (e) {
            console.log('Error loading insights');
        }
    };

    const saveInsights = async (newInsights) => {
        try {
            await AsyncStorage.setItem(INSIGHTS_KEY, JSON.stringify(newInsights));
            setInsights(newInsights);
        } catch (e) {
            console.log('Error saving insights');
        }
    };

    const trackView = (product) => {
        const updated = { ...insights };

        // Track category preference
        if (product.category) {
            updated.categoryViews = updated.categoryViews || {};
            updated.categoryViews[product.category] = (updated.categoryViews[product.category] || 0) + 1;

            // Find most viewed category
            const categories = Object.entries(updated.categoryViews || {});
            if (categories.length > 0) {
                updated.favoriteCategory = categories.sort((a, b) => b[1] - a[1])[0][0];
            }
        }

        // Track brand preference
        if (product.brand) {
            updated.brandViews = updated.brandViews || {};
            updated.brandViews[product.brand] = (updated.brandViews[product.brand] || 0) + 1;

            const brands = Object.entries(updated.brandViews || {});
            if (brands.length > 0) {
                updated.favoriteBrand = brands.sort((a, b) => b[1] - a[1])[0][0];
            }
        }

        // Track shopping day
        const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        updated.shoppingDays = updated.shoppingDays || {};
        updated.shoppingDays[day] = (updated.shoppingDays[day] || 0) + 1;

        saveInsights(updated);
    };

    const trackPurchase = (orderTotal, items) => {
        const updated = { ...insights };
        updated.totalOrders = (updated.totalOrders || 0) + 1;
        updated.totalSpent = (updated.totalSpent || 0) + orderTotal;
        updated.avgOrderValue = updated.totalSpent / updated.totalOrders;
        updated.avgItemsPerOrder = ((updated.avgItemsPerOrder || 0) * (updated.totalOrders - 1) + items.length) / updated.totalOrders;

        saveInsights(updated);
    };

    const getMostActiveDay = () => {
        const days = Object.entries(insights.shoppingDays || {});
        if (days.length === 0) return null;
        return days.sort((a, b) => b[1] - a[1])[0][0];
    };

    return {
        insights,
        trackView,
        trackPurchase,
        getMostActiveDay,
    };
}

// Personal Insights Display Component
export function InsightsCard({ insights, theme, t }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }, []);

    if (!insights.totalOrders && !insights.favoriteCategory) {
        return null; // Don't show if no data
    }

    const statCards = [];

    if (insights.totalOrders > 0) {
        statCards.push({
            emoji: '📦',
            label: 'Orders',
            value: insights.totalOrders,
        });
    }

    if (insights.avgOrderValue > 0) {
        statCards.push({
            emoji: '💰',
            label: 'Avg Order',
            value: `$${insights.avgOrderValue.toFixed(0)}`,
        });
    }

    if (insights.favoriteBrand) {
        statCards.push({
            emoji: '💎',
            label: 'Favorite',
            value: insights.favoriteBrand,
        });
    }

    if (statCards.length === 0) return null;

    return (
        <Animated.View style={[styles.insightsCard, { backgroundColor: theme.card, opacity: fadeAnim }]}>
            <Text style={[styles.insightsTitle, { color: theme.text }]}>Your Style Profile</Text>
            <View style={styles.insightsGrid}>
                {statCards.map((stat, i) => (
                    <View key={i} style={[styles.statItem, { backgroundColor: theme.inputBackground }]}>
                        <Text style={styles.statEmoji}>{stat.emoji}</Text>
                        <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
                    </View>
                ))}
            </View>
        </Animated.View>
    );
}

// Contextual Empty State - smart suggestions
export function SmartEmptyState({
    type, // 'cart', 'wishlist', 'orders', 'search'
    recentlyViewed = [],
    wishlist = [],
    newArrivals = [],
    onProductPress,
    onActionPress,
    theme,
    t,
}) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 6, useNativeDriver: true }),
        ]).start();
    }, []);

    const getContent = () => {
        switch (type) {
            case 'cart':
                // If has wishlist items, suggest those
                if (wishlist.length > 0) {
                    return {
                        emoji: '💕',
                        title: 'Your wishlist is waiting',
                        subtitle: `You have ${wishlist.length} saved item${wishlist.length > 1 ? 's' : ''} ready to add`,
                        products: wishlist.slice(0, 3),
                        action: { label: 'View Wishlist', key: 'wishlist' },
                    };
                }
                // If has recently viewed, show continue browsing
                if (recentlyViewed.length > 0) {
                    return {
                        emoji: '👀',
                        title: 'Continue where you left off',
                        subtitle: 'These caught your eye recently',
                        products: recentlyViewed.slice(0, 3),
                        action: { label: 'Keep Browsing', key: 'home' },
                    };
                }
                // Default - show new arrivals
                return {
                    emoji: '✨',
                    title: 'Discover new arrivals',
                    subtitle: 'Fresh styles just dropped',
                    products: newArrivals.slice(0, 3),
                    action: { label: 'Start Shopping', key: 'home' },
                };

            case 'wishlist':
                return {
                    emoji: '💝',
                    title: 'Save items you love',
                    subtitle: 'Tap the heart on any product to add it here',
                    products: newArrivals.slice(0, 3),
                    action: { label: 'Explore Collection', key: 'home' },
                };

            case 'orders':
                if (wishlist.length > 0) {
                    return {
                        emoji: '🛍️',
                        title: 'Ready to shop?',
                        subtitle: 'Turn your wishlist into your wardrobe',
                        products: wishlist.slice(0, 3),
                        action: { label: 'View Wishlist', key: 'wishlist' },
                    };
                }
                return {
                    emoji: '📦',
                    title: 'No orders yet',
                    subtitle: 'Your order history will appear here',
                    products: newArrivals.slice(0, 3),
                    action: { label: 'Start Shopping', key: 'home' },
                };

            case 'search':
                return {
                    emoji: '🔍',
                    title: 'No results found',
                    subtitle: 'Try a different search term',
                    products: newArrivals.slice(0, 3),
                    action: { label: 'Browse All', key: 'home' },
                };

            default:
                return {
                    emoji: '✨',
                    title: 'Nothing here yet',
                    subtitle: 'Start exploring our collection',
                    products: [],
                    action: { label: 'Start Shopping', key: 'home' },
                };
        }
    };

    const content = getContent();

    return (
        <Animated.View
            style={[
                styles.emptyContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                }
            ]}
        >
            <Text style={styles.emptyEmoji}>{content.emoji}</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>{content.title}</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>{content.subtitle}</Text>

            {/* Product suggestions */}
            {content.products.length > 0 && (
                <View style={styles.suggestionsRow}>
                    {content.products.map((product) => (
                        <SmartShadowCard
                            key={product.id}
                            style={[styles.suggestionCard, { backgroundColor: theme.card }]}
                        >
                            <View
                                style={[styles.suggestionEmoji, { backgroundColor: theme.inputBackground }]}
                            >
                                <Text style={{ fontSize: 32 }}>{product.emoji}</Text>
                            </View>
                            <Text style={[styles.suggestionName, { color: theme.text }]} numberOfLines={1}>
                                {product.name}
                            </Text>
                            <Text style={[styles.suggestionPrice, { color: theme.accent }]}>
                                ${product.price}
                            </Text>
                        </SmartShadowCard>
                    ))}
                </View>
            )}
        </Animated.View>
    );
}

// Smooth Scroll Physics - custom deceleration
export const SMOOTH_SCROLL_CONFIG = {
    decelerationRate: 0.994, // Silky smooth (default is 0.998)
    bounces: true,
    bouncesZoom: true,
    alwaysBounceVertical: true,
    showsVerticalScrollIndicator: false,
    scrollEventThrottle: 16,
};

// Scroll with momentum feel - heavier content scrolls slower
export function useWeightedScroll(itemCount, baseWeight = 1) {
    const weight = Math.min(1.5, baseWeight + (itemCount * 0.02));

    return {
        ...SMOOTH_SCROLL_CONFIG,
        decelerationRate: 0.994 + (weight * 0.002), // Heavier = more momentum
    };
}

const styles = StyleSheet.create({
    smartShadow: {
        backgroundColor: 'transparent',
    },
    insightsCard: {
        margin: 16,
        padding: 20,
        borderRadius: 20,
    },
    insightsTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 16,
    },
    insightsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statItem: {
        flex: 1,
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    statEmoji: {
        fontSize: 24,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 40,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    suggestionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    suggestionCard: {
        width: (width - 80) / 3,
        borderRadius: 16,
        overflow: 'hidden',
    },
    suggestionEmoji: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionName: {
        fontSize: 11,
        fontWeight: '600',
        paddingHorizontal: 10,
        paddingTop: 8,
    },
    suggestionPrice: {
        fontSize: 13,
        fontWeight: '800',
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingTop: 4,
    },
});
