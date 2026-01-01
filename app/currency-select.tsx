import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useCurrency, currencies } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

export default function CurrencySelectScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { currency, changeCurrency } = useCurrency();
    const { t } = useLanguage();

    const handleSelect = (code) => {
        changeCurrency(code);
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: theme.card }]}
                >
                    <ArrowLeft size={20} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('currency') || 'Currency'}</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Currency List */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    {t('selectCurrency') || 'SELECT CURRENCY'}
                </Text>

                {Object.values(currencies).map((curr) => (
                    <TouchableOpacity
                        key={curr.code}
                        style={[
                            styles.currencyItem,
                            { backgroundColor: theme.card },
                            currency === curr.code && { borderColor: theme.accent, borderWidth: 1 }
                        ]}
                        onPress={() => handleSelect(curr.code)}
                    >
                        <View style={styles.currencyLeft}>
                            <Text style={styles.flag}>{curr.flag}</Text>
                            <View style={styles.currencyInfo}>
                                <Text style={[styles.currencyCode, { color: theme.text }]}>
                                    {curr.code}
                                </Text>
                                <Text style={[styles.currencyName, { color: theme.textSecondary }]}>
                                    {curr.name}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.currencyRight}>
                            <Text style={[styles.currencySymbol, { color: theme.accent }]}>
                                {curr.symbol}
                            </Text>
                            {currency === curr.code && (
                                <View style={[styles.checkCircle, { backgroundColor: theme.accent }]}>
                                    <Check size={14} color="#FFF" strokeWidth={3} />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}

                <Text style={[styles.note, { color: theme.textTertiary }]}>
                    {t('currencyNote') || 'Exchange rates are approximate and updated periodically.'}
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
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 1.5,
        marginBottom: 16,
        marginTop: 8,
    },
    currencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    currencyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    flag: {
        fontSize: 28,
    },
    currencyInfo: {
        gap: 2,
    },
    currencyCode: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    currencyName: {
        fontSize: 13,
    },
    currencyRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    currencySymbol: {
        fontSize: 18,
        fontWeight: '500',
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    note: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 40,
        lineHeight: 18,
    },
});
