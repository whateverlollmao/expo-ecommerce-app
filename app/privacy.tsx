import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useLanguage();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.closeButton, { backgroundColor: theme.card }]}
                >
                    <X size={22} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('privacyPolicyTitle')}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.date, { color: theme.textSecondary }]}>
                    Last updated: December 31, 2024
                </Text>

                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    {t('privacyPolicyContent')}
                </Text>

                <Text style={[styles.heading, { color: theme.text }]}>1. Information We Collect</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    We collect information you provide directly to us, such as when you create an account,
                    make a purchase, or contact us for support.
                </Text>

                <Text style={[styles.heading, { color: theme.text }]}>2. How We Use Your Information</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    We use the information we collect to process transactions, send you order confirmations,
                    respond to your requests, and improve our services.
                </Text>

                <Text style={[styles.heading, { color: theme.text }]}>3. Information Sharing</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    We do not sell, trade, or otherwise transfer your personally identifiable information
                    to outside parties except to trusted third parties who assist us in operating our app.
                </Text>

                <Text style={[styles.heading, { color: theme.text }]}>4. Data Security</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    We implement a variety of security measures to maintain the safety of your personal
                    information when you place an order or enter your personal information.
                </Text>

                <Text style={[styles.heading, { color: theme.text }]}>5. Contact Us</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    If you have any questions about this Privacy Policy, please contact us at support@luxe-app.kz
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
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
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
        padding: 24,
        paddingBottom: 60,
    },
    date: {
        fontSize: 12,
        marginBottom: 24,
    },
    heading: {
        fontSize: 18,
        fontWeight: '800',
        marginTop: 24,
        marginBottom: 12,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 26,
    },
});
