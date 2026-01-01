import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShoppingBag, CreditCard, Package, Truck, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/Button';

export default function HelpScreen() {
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const { t } = useLanguage();

    const STEPS = [
        {
            icon: ShoppingBag,
            titleKey: 'browseSelect',
            descKey: 'browseSelectDesc',
        },
        {
            icon: CheckCircle,
            titleKey: 'chooseSizeQty',
            descKey: 'chooseSizeQtyDesc',
        },
        {
            icon: CreditCard,
            titleKey: 'addToCart',
            descKey: 'addToCartDesc',
        },
        {
            icon: Truck,
            titleKey: 'checkoutPay',
            descKey: 'checkoutPayDesc',
        },
        {
            icon: Package,
            titleKey: 'trackOrder',
            descKey: 'trackOrderDesc',
        },
    ];

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
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('help')}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Hero */}
                <LinearGradient
                    colors={[theme.accent, theme.accentDark]}
                    style={styles.hero}
                >
                    <Text style={styles.heroEmoji}>📚</Text>
                    <Text style={styles.heroTitle}>{t('shoppingGuide')}</Text>
                    <Text style={styles.heroSubtitle}>{t('learnHowToPurchase')}</Text>
                </LinearGradient>

                {/* Steps */}
                {STEPS.map((step, index) => (
                    <View key={index} style={[styles.stepCard, { backgroundColor: theme.card }]}>
                        <View style={styles.stepHeader}>
                            <View style={[styles.stepNumber, { backgroundColor: theme.accentGlow }]}>
                                <Text style={[styles.stepNumberText, { color: theme.accent }]}>{index + 1}</Text>
                            </View>
                            <View style={[styles.stepIcon, { backgroundColor: theme.accentGlow }]}>
                                <step.icon size={24} color={theme.accent} />
                            </View>
                        </View>
                        <Text style={[styles.stepTitle, { color: theme.text }]}>{t(step.titleKey)}</Text>
                        <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>{t(step.descKey)}</Text>
                        {index < STEPS.length - 1 && (
                            <View style={[styles.connector, { backgroundColor: theme.border }]} />
                        )}
                    </View>
                ))}

                {/* Tips */}
                <View style={[styles.tipsCard, { backgroundColor: theme.accentGlow }]}>
                    <Text style={[styles.tipsTitle, { color: theme.accent }]}>{t('proTips')}</Text>
                    <Text style={[styles.tipItem, { color: theme.accent }]}>{t('tip1')}</Text>
                    <Text style={[styles.tipItem, { color: theme.accent }]}>{t('tip2')}</Text>
                    <Text style={[styles.tipItem, { color: theme.accent }]}>{t('tip3')}</Text>
                </View>

                {/* CTA Button */}
                <View style={styles.ctaSection}>
                    <Text style={[styles.ctaText, { color: theme.textSecondary }]}>
                        {t('readyToShop')}
                    </Text>
                    <Button
                        title={t('toCatalog')}
                        variant="primary"
                        size="large"
                        onPress={() => router.push('/(tabs)/home')}
                    />
                </View>
            </ScrollView>
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
    content: {
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    hero: {
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginBottom: 28,
    },
    heroEmoji: {
        fontSize: 56,
        marginBottom: 12,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    stepCard: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
        position: 'relative',
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        fontSize: 14,
        fontWeight: '900',
    },
    stepIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 8,
    },
    stepDesc: {
        fontSize: 14,
        lineHeight: 22,
    },
    connector: {
        position: 'absolute',
        bottom: -16,
        left: 35,
        width: 2,
        height: 16,
    },
    tipsCard: {
        padding: 20,
        borderRadius: 18,
        marginTop: 12,
        marginBottom: 32,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 12,
    },
    tipItem: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    ctaSection: {
        alignItems: 'center',
    },
    ctaText: {
        fontSize: 15,
        marginBottom: 16,
    },
});
