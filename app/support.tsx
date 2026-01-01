import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, Mail, Send, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import config from '../config/config';

// Get contact info from config
const { support } = config.business;

const SUPPORT_CHANNELS = [
    {
        id: 'whatsapp',
        nameKey: 'whatsapp',
        icon: '💬',
        value: support.phone,
        action: `https://wa.me/${support.whatsapp.replace(/[^0-9]/g, '')}`,
        color: '#25D366',
    },
    {
        id: 'email',
        nameKey: 'email',
        icon: '📧',
        value: support.email,
        action: `mailto:${support.email}`,
        color: '#EA4335',
    },
    {
        id: 'telegram',
        nameKey: 'telegramBot',
        icon: '🤖',
        value: support.telegram,
        action: `https://t.me/${support.telegram.replace('@', '')}`,
        color: '#0088CC',
    },
];

export default function SupportScreen() {
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const { t } = useLanguage();

    const handleContact = (action: string) => {
        Linking.openURL(action);
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('supportTitle')}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Hero Section */}
                <LinearGradient
                    colors={[theme.accent, theme.accentDark]}
                    style={styles.hero}
                >
                    <Text style={styles.heroEmoji}>🎧</Text>
                    <Text style={styles.heroTitle}>{t('howCanWeHelp')}</Text>
                    <Text style={styles.heroSubtitle}>{t('teamHereToAssist')}</Text>
                </LinearGradient>

                {/* Working Hours */}
                <View style={[styles.hoursCard, { backgroundColor: theme.card }]}>
                    <View style={[styles.hoursIcon, { backgroundColor: theme.accentGlow }]}>
                        <Clock size={24} color={theme.accent} />
                    </View>
                    <View>
                        <Text style={[styles.hoursLabel, { color: theme.textSecondary }]}>{t('workingHours')}</Text>
                        <Text style={[styles.hoursValue, { color: theme.text }]}>{t('workingHoursValue')}</Text>
                    </View>
                </View>

                {/* Contact Methods */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('contactUs')}</Text>

                {SUPPORT_CHANNELS.map(channel => (
                    <TouchableOpacity
                        key={channel.id}
                        style={[styles.contactCard, { backgroundColor: theme.card }]}
                        onPress={() => handleContact(channel.action)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.contactIcon, { backgroundColor: channel.color + '20' }]}>
                            <Text style={{ fontSize: 28 }}>{channel.icon}</Text>
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={[styles.contactName, { color: theme.text }]}>{t(channel.nameKey)}</Text>
                            <Text style={[styles.contactValue, { color: theme.accent }]}>{channel.value}</Text>
                            <View style={styles.hoursRow}>
                                <Clock size={12} color={theme.textTertiary} />
                                <Text style={[styles.contactHours, { color: theme.textTertiary }]}>
                                    {t('workingHoursValue')}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.contactArrow, { backgroundColor: theme.accentGlow }]}>
                            <Send size={18} color={theme.accent} />
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Note */}
                <View style={[styles.noteCard, { backgroundColor: theme.accentGlow }]}>
                    <Text style={[styles.noteText, { color: theme.accent }]}>
                        {t('fastestResponse')}
                    </Text>
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
        paddingBottom: 40,
    },
    hero: {
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginBottom: 24,
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
    hoursCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 18,
        marginBottom: 28,
    },
    hoursIcon: {
        width: 50,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    hoursLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    hoursValue: {
        fontSize: 15,
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 16,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 18,
        marginBottom: 14,
    },
    contactIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 4,
    },
    contactValue: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    hoursRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    contactHours: {
        fontSize: 11,
    },
    contactArrow: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noteCard: {
        padding: 18,
        borderRadius: 14,
        marginTop: 10,
    },
    noteText: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
});
