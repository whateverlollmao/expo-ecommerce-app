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
import { ArrowLeft, FileText, Shield, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function LegalScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useLanguage();

    const LEGAL_DOCS = [
        {
            id: 'privacy',
            icon: Shield,
            titleKey: 'privacyPolicy',
            descKey: 'privacyPolicyDesc',
            route: '/privacy',
        },
        {
            id: 'terms',
            icon: FileText,
            titleKey: 'termsOfUse',
            descKey: 'termsOfUseDesc',
            route: '/terms',
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('legalDocuments')}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Hero */}
                <LinearGradient
                    colors={[theme.secondary, theme.accent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hero}
                >
                    <Text style={styles.heroEmoji}>⚖️</Text>
                    <Text style={styles.heroTitle}>{t('legalPolicies')}</Text>
                    <Text style={styles.heroSubtitle}>{t('reviewPolicies')}</Text>
                </LinearGradient>

                {/* Documents */}
                {LEGAL_DOCS.map(doc => (
                    <TouchableOpacity
                        key={doc.id}
                        style={[styles.docCard, { backgroundColor: theme.card }]}
                        onPress={() => router.push(doc.route)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.docIcon, { backgroundColor: theme.accentGlow }]}>
                            <doc.icon size={24} color={theme.accent} />
                        </View>
                        <View style={styles.docInfo}>
                            <Text style={[styles.docTitle, { color: theme.text }]}>{t(doc.titleKey)}</Text>
                            <Text style={[styles.docDesc, { color: theme.textSecondary }]}>{t(doc.descKey)}</Text>
                        </View>
                        <ChevronRight size={20} color={theme.textTertiary} />
                    </TouchableOpacity>
                ))}

                {/* Copyright */}
                <View style={[styles.copyrightCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.copyrightTitle, { color: theme.text }]}>{t('copyrightNotice')}</Text>
                    <Text style={[styles.copyrightText, { color: theme.textSecondary }]}>
                        {t('copyrightText1')}
                    </Text>
                    <Text style={[styles.copyrightText, { color: theme.textSecondary }]}>
                        {t('copyrightText2')}
                    </Text>
                    <Text style={[styles.copyrightText, { color: theme.textSecondary, marginTop: 12 }]}>
                        {t('copyrightText3')}
                    </Text>
                </View>

                {/* Version */}
                <Text style={[styles.version, { color: theme.textTertiary }]}>
                    LUXE v1.0.0 • Build 2024.12.31
                </Text>
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
    },
    docCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 18,
        marginBottom: 14,
    },
    docIcon: {
        width: 50,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    docInfo: {
        flex: 1,
    },
    docTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 4,
    },
    docDesc: {
        fontSize: 13,
    },
    copyrightCard: {
        padding: 22,
        borderRadius: 18,
        marginTop: 10,
    },
    copyrightTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 12,
    },
    copyrightText: {
        fontSize: 13,
        lineHeight: 20,
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 24,
    },
});
