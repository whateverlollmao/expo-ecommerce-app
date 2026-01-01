import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function TermsScreen() {
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('termsTitle')}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.date, { color: theme.textSecondary }]}>
                    Last updated: December 31, 2024
                </Text>

                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    {t('termsContent')}
                </Text>

                <Text style={[styles.heading, { color: theme.text }]}>1. Acceptance of Terms</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    By accessing and using this application, you accept and agree to be bound by the terms
                    and provision of this agreement.
                </Text>

                <Text style={[styles.heading, { color: theme.text }]}>2. Use License</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    Permission is granted to temporarily use this application for personal,
                    non-commercial transitory viewing only.
                </Text>

                <Text style={[styles.heading, { color: theme.text }]}>3. Disclaimer</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    The materials on LUXE are provided on an 'as is' basis. LUXE makes no warranties,
                    expressed or implied, and hereby disclaims and negates all other warranties.
                </Text>

                <Text style={[styles.heading, { color: theme.text }]}>4. Limitations</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    In no event shall LUXE or its suppliers be liable for any damages arising out of
                    the use or inability to use the materials on this application.
                </Text>

                <Text style={[styles.heading, { color: theme.text }]}>5. Governing Law</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                    These terms and conditions are governed by and construed in accordance with the
                    laws of Kazakhstan and you irrevocably submit to the exclusive jurisdiction of the courts.
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
