import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Package, Truck, MapPin, Check, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const ORDER_STATUSES = [
    { id: 'confirmed', icon: Check, label: 'orderConfirmed' },
    { id: 'processing', icon: Package, label: 'processing' },
    { id: 'shipped', icon: Truck, label: 'shipped' },
    { id: 'outForDelivery', icon: MapPin, label: 'outForDelivery' },
    { id: 'delivered', icon: Check, label: 'delivered' },
];

export default function OrderTrackingScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams();
    const { theme, isDark } = useTheme();
    const { t } = useLanguage();
    const { orderHistory } = useCart();

    const order = orderHistory.find((o: any) => o.id === orderId);

    // Simulate order progress (in real app, this would come from API)
    const [currentStep, setCurrentStep] = useState(2); // 0-indexed

    // Simulated delivery date
    const getEstimatedDelivery = () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!order) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.backButton, { backgroundColor: theme.card }]}
                    >
                        <ArrowLeft size={22} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        {t('orderTracking') || 'Order Tracking'}
                    </Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.notFoundContainer}>
                    <Text style={[styles.notFoundText, { color: theme.textSecondary }]}>
                        {t('orderNotFound') || 'Order not found'}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

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
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    {t('orderTracking') || 'Order Tracking'}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Order Info Card */}
                <LinearGradient
                    colors={[theme.gradientStart, theme.gradientEnd]}
                    style={styles.orderInfoCard}
                >
                    <View style={styles.orderInfoRow}>
                        <Text style={styles.orderInfoLabel}>{t('orderNumber') || 'Order Number'}</Text>
                        <Text style={styles.orderInfoValue}>#{order.id}</Text>
                    </View>
                    <View style={styles.orderInfoDivider} />
                    <View style={styles.orderInfoRow}>
                        <Text style={styles.orderInfoLabel}>{t('estimatedDelivery') || 'Est. Delivery'}</Text>
                        <Text style={styles.orderInfoValue}>{getEstimatedDelivery()}</Text>
                    </View>
                </LinearGradient>

                {/* Tracking Timeline */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    {t('trackingStatus') || 'TRACKING STATUS'}
                </Text>

                <View style={[styles.timelineContainer, { backgroundColor: theme.card }]}>
                    {ORDER_STATUSES.map((status, index) => {
                        const Icon = status.icon;
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <View key={status.id} style={styles.timelineItem}>
                                {/* Icon */}
                                <View style={[
                                    styles.timelineIcon,
                                    {
                                        backgroundColor: isCompleted ? theme.accent : theme.inputBackground,
                                    }
                                ]}>
                                    <Icon
                                        size={18}
                                        color={isCompleted ? '#FFFFFF' : theme.textTertiary}
                                    />
                                </View>

                                {/* Content */}
                                <View style={styles.timelineContent}>
                                    <Text style={[
                                        styles.timelineLabel,
                                        {
                                            color: isCompleted ? theme.text : theme.textTertiary,
                                            fontWeight: isCurrent ? '800' : '600',
                                        }
                                    ]}>
                                        {t(status.label) || status.label}
                                    </Text>
                                    {isCurrent && (
                                        <View style={[styles.currentBadge, { backgroundColor: theme.accentGlow }]}>
                                            <Clock size={12} color={theme.accent} />
                                            <Text style={[styles.currentText, { color: theme.accent }]}>
                                                {t('inProgress') || 'In Progress'}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Connector Line */}
                                {index < ORDER_STATUSES.length - 1 && (
                                    <View style={[
                                        styles.connector,
                                        {
                                            backgroundColor: index < currentStep
                                                ? theme.accent
                                                : theme.inputBackground
                                        }
                                    ]} />
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Order Items */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    {t('orderItems') || 'ORDER ITEMS'}
                </Text>

                <View style={[styles.itemsContainer, { backgroundColor: theme.card }]}>
                    {order.items.map((item: any, index: number) => (
                        <View
                            key={index}
                            style={[
                                styles.orderItem,
                                index < order.items.length - 1 && {
                                    borderBottomWidth: 1,
                                    borderBottomColor: theme.border
                                }
                            ]}
                        >
                            <View style={[styles.itemImage, { backgroundColor: theme.inputBackground }]}>
                                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                            </View>
                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={[styles.itemDetails, { color: theme.textSecondary }]}>
                                    {t('size')}: {item.size} • {t('qty')}: {item.quantity}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Delivery Address */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    {t('deliveryAddress') || 'DELIVERY ADDRESS'}
                </Text>

                <View style={[styles.addressCard, { backgroundColor: theme.card }]}>
                    <View style={[styles.addressIcon, { backgroundColor: theme.accentGlow }]}>
                        <MapPin size={20} color={theme.accent} />
                    </View>
                    <View>
                        <Text style={[styles.addressName, { color: theme.text }]}>
                            {order.shippingAddress?.name || 'John Doe'}
                        </Text>
                        <Text style={[styles.addressText, { color: theme.textSecondary }]}>
                            {order.shippingAddress?.street || '123 Main Street'}
                        </Text>
                        <Text style={[styles.addressText, { color: theme.textSecondary }]}>
                            {order.shippingAddress?.city || 'Almaty'}, {order.shippingAddress?.country || 'Kazakhstan'}
                        </Text>
                    </View>
                </View>

                {/* Contact Support */}
                <TouchableOpacity
                    onPress={() => router.push('/support')}
                    style={[styles.supportButton, { backgroundColor: theme.accentGlow }]}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.supportText, { color: theme.accent }]}>
                        {t('needHelp') || 'Need help with your order?'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
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
    headerTitle: { fontSize: 18, fontWeight: '800' },
    placeholder: { width: 44 },
    content: { padding: 20, paddingBottom: 40 },
    notFoundContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    notFoundText: { fontSize: 16 },
    orderInfoCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 28,
    },
    orderInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderInfoLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
    orderInfoValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    orderInfoDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 14,
    },
    timelineContainer: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 28,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        position: 'relative',
    },
    timelineIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    timelineContent: { flex: 1, paddingTop: 8 },
    timelineLabel: { fontSize: 15 },
    currentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        gap: 5,
        marginTop: 8,
    },
    currentText: { fontSize: 11, fontWeight: '700' },
    connector: {
        position: 'absolute',
        left: 19,
        top: 44,
        width: 2,
        height: 20,
        borderRadius: 1,
    },
    itemsContainer: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 28,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    itemEmoji: { fontSize: 24 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    itemDetails: { fontSize: 13 },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 20,
        padding: 18,
        marginBottom: 28,
    },
    addressIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    addressName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    addressText: { fontSize: 14, lineHeight: 20 },
    supportButton: {
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    supportText: { fontSize: 14, fontWeight: '700' },
});
