import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react-native';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { CartItem } from '../../components/CartItem';
import { Button } from '../../components/Button';
import { products } from '../../data/dummyData';

function EmptyCart() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const { formatPrice } = useCurrency();
    const { wishlist, recentlyViewed } = useCart();

    // Get suggested products
    const wishlistProducts = wishlist.map((id: string) => products.find(p => p.id === id)).filter(Boolean);
    const recentProducts = recentlyViewed.map((id: string) => products.find(p => p.id === id)).filter(Boolean);
    const suggestedProducts = wishlistProducts.length > 0 ? wishlistProducts : recentProducts.length > 0 ? recentProducts : products.slice(0, 3);

    const getEmptyMessage = () => {
        if (wishlistProducts.length > 0) {
            return { emoji: '💕', title: t('yourWishlist'), subtitle: t('itemsFromWishlist') };
        }
        if (recentProducts.length > 0) {
            return { emoji: '👀', title: t('continueBrowsing'), subtitle: t('itemsViewedRecently') };
        }
        return { emoji: '🛍️', title: t('yourBagEmpty'), subtitle: t('emptyBagSubtitle') };
    };

    const message = getEmptyMessage();

    return (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.accentGlow }]}>
                <ShoppingBag size={56} color={theme.accent} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>{message.title}</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                {message.subtitle}
            </Text>

            {/* Suggested products */}
            {suggestedProducts.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    <View style={styles.suggestionsRow}>
                        {suggestedProducts.slice(0, 3).map((product: any) => (
                            <TouchableOpacity
                                key={product.id}
                                onPress={() => router.push(`/product/${product.id}`)}
                                style={[styles.suggestionCard, { backgroundColor: theme.card }]}
                            >
                                <View style={[styles.suggestionEmoji, { backgroundColor: theme.inputBackground }]}>
                                    <Text style={{ fontSize: 28 }}>{product.emoji}</Text>
                                </View>
                                <Text style={[styles.suggestionPrice, { color: theme.accent }]}>
                                    {formatPrice(product.price)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            <Button
                title={t('startShopping')}
                variant="primary"
                icon={<Sparkles size={18} color="#FFF" />}
                onPress={() => router.push('/(tabs)/home')}
                style={styles.shopButton}
            />
        </View>
    );
}

export default function CartScreen() {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const { theme, isDark } = useTheme();
    const { t } = useLanguage();
    const { formatPrice } = useCurrency();
    const router = useRouter();

    if (cartItems.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <EmptyCart />
            </View>
        );
    }

    const handleCheckout = () => {
        router.push('/checkout');
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + shipping;

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
            <FlatList
                data={cartItems}
                renderItem={({ item }) => (
                    <CartItem
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                    />
                )}
                keyExtractor={(item) => item.cartItemId}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <View style={styles.listHeader}>
                        <View style={styles.listTitleRow}>
                            <Text style={[styles.listTitle, { color: theme.text }]}>{t('shoppingBag')}</Text>
                            <View style={[styles.itemBadge, { backgroundColor: theme.accentGlow }]}>
                                <Text style={[styles.itemBadgeText, { color: theme.accent }]}>
                                    {cartItems.length}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.listSubtitle, { color: theme.textSecondary }]}>
                            {subtotal >= 100 ? t('freeShippingQualify') : t('moreForFreeShipping').replace('${amount}', (100 - subtotal).toFixed(0))}
                        </Text>
                    </View>
                )}
            />

            <LinearGradient
                colors={isDark ? ['transparent', theme.background] : ['transparent', theme.card]}
                style={styles.footerGradient}
            />

            <View style={[styles.footer, { backgroundColor: theme.card }]}>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>{t('subtotal')}</Text>
                    <Text style={[styles.summaryValue, { color: theme.text }]}>{formatPrice(subtotal)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>{t('shipping')}</Text>
                    <Text style={[
                        styles.summaryValue,
                        { color: shipping === 0 ? theme.accent : theme.text }
                    ]}>
                        {shipping === 0 ? t('free') : formatPrice(shipping)}
                    </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { color: theme.text }]}>{t('total')}</Text>
                    <Text style={[styles.totalValue, { color: theme.accent }]}>{formatPrice(total)}</Text>
                </View>
                <TouchableOpacity onPress={handleCheckout} activeOpacity={0.9}>
                    <LinearGradient
                        colors={[theme.gradientStart, theme.gradientEnd]}
                        style={styles.checkoutBtn}
                    >
                        <Text style={styles.checkoutText}>{t('checkout')}</Text>
                        <ArrowRight size={20} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 16,
        paddingBottom: 320, // Extra padding for footer
    },
    listHeader: {
        marginBottom: 20,
    },
    listTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    listTitle: {
        fontSize: 28,
        fontWeight: '900',
    },
    itemBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    itemBadgeText: {
        fontSize: 14,
        fontWeight: '800',
    },
    listSubtitle: {
        fontSize: 14,
        marginTop: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingBottom: 100, // Space for tab bar
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    suggestionsContainer: {
        marginBottom: 28,
    },
    suggestionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    suggestionCard: {
        width: 90,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    suggestionEmoji: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionPrice: {
        fontSize: 13,
        fontWeight: '800',
        textAlign: 'center',
        paddingVertical: 10,
    },
    shopButton: {
        minWidth: 200,
    },
    footerGradient: {
        position: 'absolute',
        bottom: 320, // Match footer height
        left: 0,
        right: 0,
        height: 60,
        pointerEvents: 'none',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 180, // More clearance for tab bar
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginVertical: 14,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '700',
    },
    totalValue: {
        fontSize: 28,
        fontWeight: '900',
    },
    checkoutBtn: {
        flexDirection: 'row',
        height: 58,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    checkoutText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '800',
    },
});
