import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Package, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { Button } from '../components/Button';

export default function OrderHistoryScreen() {
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const { t } = useLanguage();
    const { formatPrice } = useCurrency();
    const { orderHistory } = useCart();

    const getStatusStyle = (status) => {
        switch (status) {
            case 'processing':
                return { color: theme.warning, bg: theme.warning + '20', label: t('processing') };
            case 'shipped':
                return { color: theme.accent, bg: theme.accentGlow, label: t('shipped') };
            case 'delivered':
                return { color: theme.success, bg: theme.success + '20', label: t('delivered') };
            default:
                return { color: theme.textSecondary, bg: theme.inputBackground, label: status };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderOrder = ({ item }) => {
        const statusStyle = getStatusStyle(item.status);

        return (
            <View style={[styles.orderCard, { backgroundColor: theme.card }]}>
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={[styles.orderNumber, { color: theme.accent }]}>
                            {t('orderNumber')}{item.id.slice(-8).toUpperCase()}
                        </Text>
                        <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
                            {t('orderPlaced')}: {formatDate(item.date)}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>
                            {statusStyle.label}
                        </Text>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                <View style={styles.itemsRow}>
                    {item.items.slice(0, 4).map((orderItem, index) => (
                        <View
                            key={index}
                            style={[styles.itemEmoji, { backgroundColor: theme.inputBackground }]}
                        >
                            <Text style={{ fontSize: 24 }}>{orderItem.emoji}</Text>
                        </View>
                    ))}
                    {item.items.length > 4 && (
                        <View style={[styles.moreItems, { backgroundColor: theme.inputBackground }]}>
                            <Text style={[styles.moreText, { color: theme.textSecondary }]}>
                                +{item.items.length - 4}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.orderFooter}>
                    <Text style={[styles.itemCount, { color: theme.textSecondary }]}>
                        {item.items.length} {item.items.length === 1 ? t('item') : t('items')}
                    </Text>
                    <Text style={[styles.orderTotal, { color: theme.text }]}>
                        {t('total')}: {formatPrice(item.total)}
                    </Text>
                </View>
            </View>
        );
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('orderHistory')}</Text>
                <View style={styles.placeholder} />
            </View>

            {orderHistory.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={[styles.emptyIconContainer, { backgroundColor: theme.accentGlow }]}>
                        <Package size={56} color={theme.accent} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('noOrders')}</Text>
                    <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                        {t('noOrdersSubtitle')}
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
                    data={orderHistory}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
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
        padding: 16,
        paddingBottom: 40,
    },
    orderCard: {
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    orderNumber: {
        fontSize: 14,
        fontWeight: '800',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        marginVertical: 16,
    },
    itemsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    itemEmoji: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreItems: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreText: {
        fontSize: 12,
        fontWeight: '700',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemCount: {
        fontSize: 13,
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: '800',
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
