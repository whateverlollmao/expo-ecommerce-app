import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

export function CartItem({ item, onUpdateQuantity, onRemove }) {
    const { theme, isDark } = useTheme();
    const { formatPrice } = useCurrency();
    const scaleValue = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;

    const handleQuantityChange = (delta) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Bounce animation
        Animated.sequence([
            Animated.spring(scaleValue, { toValue: 1.02, useNativeDriver: true, friction: 5 }),
            Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, friction: 4 }),
        ]).start();

        onUpdateQuantity(item.cartItemId, delta);
    };

    const handleRemove = () => {
        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        // Swipe out animation
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: -400,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 0.8,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onRemove(item.cartItemId);
        });
    };

    return (
        <Animated.View style={[
            styles.container,
            {
                backgroundColor: theme.card,
                transform: [
                    { scale: scaleValue },
                    { translateX },
                ],
                opacity: scaleValue,
            }
        ]}>
            <LinearGradient
                colors={isDark ? ['#2A2A2A', '#1F1F1F'] : ['#F5F3EF', '#E8E5E0']}
                style={styles.emojiContainer}
            >
                <Text style={styles.emoji}>{item.emoji}</Text>
            </LinearGradient>

            <View style={styles.details}>
                <Text style={[styles.brand, { color: theme.accent }]}>{item.brand}</Text>
                <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                <View style={styles.meta}>
                    <View style={[styles.sizeBadge, { backgroundColor: theme.accentGlow }]}>
                        <Text style={[styles.sizeText, { color: theme.accent }]}>Size {item.selectedSize}</Text>
                    </View>
                    <Text style={[styles.price, { color: theme.text }]}>
                        {formatPrice(item.price * item.quantity)}
                    </Text>
                </View>
            </View>

            <View style={styles.actions}>
                {/* Quantity Controls */}
                <View style={[styles.quantityContainer, { backgroundColor: theme.inputBackground }]}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(-1)}
                    >
                        <Minus size={16} color={item.quantity === 1 ? theme.textTertiary : theme.text} strokeWidth={2.5} />
                    </TouchableOpacity>

                    <Text style={[styles.quantity, { color: theme.text }]}>{item.quantity}</Text>

                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(1)}
                    >
                        <Plus size={16} color={theme.accent} strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>

                {/* Remove Button */}
                <TouchableOpacity
                    style={[styles.removeButton, { backgroundColor: theme.error + '20' }]}
                    onPress={handleRemove}
                >
                    <Trash2 size={16} color={theme.error} strokeWidth={2.5} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 14,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 6,
    },
    emojiContainer: {
        width: 80,
        height: 80,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 40,
    },
    details: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    brand: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        marginVertical: 4,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sizeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    sizeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    price: {
        fontSize: 16,
        fontWeight: '800',
    },
    actions: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 4,
    },
    quantityButton: {
        padding: 10,
    },
    quantity: {
        fontSize: 16,
        fontWeight: '800',
        minWidth: 28,
        textAlign: 'center',
    },
    removeButton: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
