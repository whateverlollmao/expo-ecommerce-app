import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ShoppingBag, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

const { height } = Dimensions.get('window');

export function CartPreviewSheet({ visible, onClose }) {
    const { theme, isDark } = useTheme();
    const { cartItems, getCartTotal } = useCart();
    const { formatPrice } = useCurrency();
    const { t } = useLanguage();
    const router = useRouter();

    const slideAnim = useRef(new Animated.Value(height)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 65, useNativeDriver: true }),
                Animated.timing(backdropAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: height, duration: 250, useNativeDriver: true }),
                Animated.timing(backdropAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const handleCheckout = () => {
        onClose();
        setTimeout(() => router.push('/checkout'), 300);
    };

    const handleViewCart = () => {
        onClose();
        setTimeout(() => router.push('/(tabs)/cart'), 300);
    };

    // Don't render if not visible
    if (!visible) return null;

    const subtotal = getCartTotal();

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'box-none'}>
            {/* Backdrop */}
            <Animated.View
                style={[
                    styles.backdrop,
                    { opacity: backdropAnim }
                ]}
            >
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
            </Animated.View>

            {/* Sheet */}
            <Animated.View
                style={[
                    styles.sheet,
                    {
                        backgroundColor: theme.card,
                        transform: [{ translateY: slideAnim }],
                    }
                ]}
            >
                {/* Handle */}
                <View style={styles.handleContainer}>
                    <View style={[styles.handle, { backgroundColor: theme.border }]} />
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.accentGlow }]}>
                            <ShoppingBag size={20} color={theme.accent} />
                        </View>
                        <View>
                            <Text style={[styles.title, { color: theme.text }]}>{t('shoppingBag')}</Text>
                            <Text style={[styles.count, { color: theme.textSecondary }]}>
                                {cartItems.length} {cartItems.length === 1 ? t('item') : t('items')}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.closeButton, { backgroundColor: theme.inputBackground }]}
                    >
                        <X size={20} color={theme.text} />
                    </TouchableOpacity>
                </View>

                {/* Items Preview */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.itemsScroll}
                >
                    {cartItems.slice(0, 5).map((item, index) => (
                        <View
                            key={item.cartItemId}
                            style={[styles.itemCard, { backgroundColor: theme.inputBackground }]}
                        >
                            <View style={styles.itemEmoji}>
                                <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
                            </View>
                            <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text style={[styles.itemPrice, { color: theme.accent }]}>
                                {formatPrice(item.price)}
                            </Text>
                        </View>
                    ))}
                    {cartItems.length > 5 && (
                        <View style={[styles.moreCard, { backgroundColor: theme.accentGlow }]}>
                            <Text style={[styles.moreText, { color: theme.accent }]}>
                                +{cartItems.length - 5}
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>{t('subtotal')}</Text>
                        <Text style={[styles.totalValue, { color: theme.text }]}>{formatPrice(subtotal)}</Text>
                    </View>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.viewCartButton, { backgroundColor: theme.inputBackground }]}
                            onPress={handleViewCart}
                        >
                            <Text style={[styles.viewCartText, { color: theme.text }]}>{t('cart')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleCheckout} style={{ flex: 2 }}>
                            <LinearGradient
                                colors={[theme.gradientStart, theme.gradientEnd]}
                                style={styles.checkoutButton}
                            >
                                <Text style={styles.checkoutText}>{t('checkout')}</Text>
                                <ArrowRight size={18} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: 120, // Clearance for tab bar
        maxHeight: height * 0.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 20,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
    },
    count: {
        fontSize: 13,
        marginTop: 2,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemsScroll: {
        paddingHorizontal: 20,
        gap: 12,
    },
    itemCard: {
        width: 100,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
    },
    itemEmoji: {
        marginBottom: 8,
    },
    itemName: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '800',
    },
    moreCard: {
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
    },
    moreText: {
        fontSize: 18,
        fontWeight: '800',
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '900',
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
    },
    viewCartButton: {
        flex: 1,
        height: 54,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewCartText: {
        fontSize: 15,
        fontWeight: '700',
    },
    checkoutButton: {
        flexDirection: 'row',
        height: 54,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    checkoutText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },
});
