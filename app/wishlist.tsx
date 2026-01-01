import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { products } from '../data/dummyData';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';

export default function WishlistScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const { wishlist, addToRecentlyViewed } = useCart();

    const wishlistProducts = wishlist
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);

    const handleProductPress = (productId) => {
        addToRecentlyViewed(productId);
        router.push(`/product/${productId}`);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: theme.card }]}
                >
                    <ArrowLeft size={22} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('wishlist')}</Text>
                <View style={styles.placeholder} />
            </View>

            {wishlistProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={[styles.emptyIconContainer, { backgroundColor: theme.error + '15' }]}>
                        <Heart size={56} color={theme.error} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('wishlistEmpty')}</Text>
                    <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                        {t('wishlistEmptySubtitle')}
                    </Text>
                    <Button
                        title={t('startShopping')}
                        variant="primary"
                        icon={<Sparkles size={18} color="#FFF" />}
                        onPress={() => router.push('/(tabs)/home')}
                        style={styles.shopButton}
                    />
                </View>
            ) : (
                <FlatList
                    data={wishlistProducts}
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            onPress={() => handleProductPress(item.id)}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <View style={styles.listHeader}>
                            <Text style={[styles.listTitle, { color: theme.text }]}>{t('yourWishlist')}</Text>
                            <View style={[styles.countBadge, { backgroundColor: theme.error + '20' }]}>
                                <Text style={[styles.countText, { color: theme.error }]}>
                                    {wishlistProducts.length} {wishlistProducts.length === 1 ? t('item') : t('items')}
                                </Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    placeholder: {
        width: 44,
    },
    list: {
        padding: 10,
        paddingBottom: 40,
    },
    listHeader: {
        paddingHorizontal: 6,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    listTitle: {
        fontSize: 24,
        fontWeight: '900',
    },
    countBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    countText: {
        fontSize: 13,
        fontWeight: '700',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyIconContainer: {
        width: 130,
        height: 130,
        borderRadius: 65,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
    },
    emptyTitle: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    shopButton: {
        minWidth: 220,
    },
});
