import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Tag, X, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Valid promo codes
const PROMO_CODES = {
    'LUXE10': { discount: 0.10, description: '10% off your order' },
    'FIRST20': { discount: 0.20, description: '20% off first order' },
    'VIP50': { discount: 0.50, description: '50% VIP discount' },
    'FREESHIP': { discount: 0, freeShipping: true, description: 'Free shipping' },
    'NEWYEAR': { discount: 0.15, description: '15% New Year discount' },
};

export function PromoCodeInput({ onApplyCode, appliedCode, onRemoveCode }) {
    const { theme } = useTheme();
    const { t } = useLanguage();

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [shakeAnim] = useState(new Animated.Value(0));

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handleApply = () => {
        const upperCode = code.toUpperCase().trim();

        if (!upperCode) {
            setError(t('enterPromoCode') || 'Please enter a promo code');
            shake();
            return;
        }

        const promoData = PROMO_CODES[upperCode];

        if (promoData) {
            if (Platform.OS === 'ios') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            onApplyCode({
                code: upperCode,
                ...promoData,
            });
            setCode('');
            setError('');
        } else {
            if (Platform.OS === 'ios') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
            setError(t('invalidPromoCode') || 'Invalid promo code');
            shake();
        }
    };

    const handleRemove = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onRemoveCode();
    };

    // If code is already applied, show applied state
    if (appliedCode) {
        return (
            <View style={[styles.appliedContainer, { backgroundColor: theme.success + '15' }]}>
                <View style={styles.appliedLeft}>
                    <View style={[styles.tagIcon, { backgroundColor: theme.success + '30' }]}>
                        <Check size={16} color={theme.success} />
                    </View>
                    <View>
                        <Text style={[styles.appliedCode, { color: theme.success }]}>
                            {appliedCode.code}
                        </Text>
                        <Text style={[styles.appliedDesc, { color: theme.textSecondary }]}>
                            {appliedCode.description}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={handleRemove}
                    style={[styles.removeButton, { backgroundColor: theme.error + '20' }]}
                >
                    <X size={16} color={theme.error} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}>
            <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
                <View style={[styles.tagIcon, { backgroundColor: theme.accentGlow }]}>
                    <Tag size={18} color={theme.accent} />
                </View>
                <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder={t('promoCodePlaceholder') || 'Enter promo code'}
                    placeholderTextColor={theme.textTertiary}
                    value={code}
                    onChangeText={(text) => {
                        setCode(text.toUpperCase());
                        setError('');
                    }}
                    autoCapitalize="characters"
                    returnKeyType="done"
                    onSubmitEditing={handleApply}
                />
                <TouchableOpacity
                    onPress={handleApply}
                    style={[styles.applyButton, { backgroundColor: theme.accent }]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.applyButtonText}>
                        {t('apply') || 'Apply'}
                    </Text>
                </TouchableOpacity>
            </View>
            {error ? (
                <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            ) : null}
        </Animated.View>
    );
}

// Utility function to calculate discount
export function calculateDiscount(subtotal, promoCode) {
    if (!promoCode) return { discount: 0, freeShipping: false };

    const discountAmount = subtotal * (promoCode.discount || 0);
    return {
        discount: discountAmount,
        freeShipping: promoCode.freeShipping || false,
    };
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 6,
        paddingLeft: 14,
    },
    tagIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 1,
    },
    applyButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    errorText: {
        fontSize: 12,
        marginTop: 8,
        marginLeft: 14,
        fontWeight: '600',
    },
    appliedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    appliedLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appliedCode: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
    appliedDesc: {
        fontSize: 12,
        marginTop: 2,
    },
    removeButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
