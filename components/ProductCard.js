import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Platform,
    Dimensions,
    Image,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// ═══════════════════════════════════════════════════════════════════════════
// LUXURY PRODUCT CARD - Editorial, minimal, elegant
// ═══════════════════════════════════════════════════════════════════════════

export function ProductCard({ product, onPress }) {
    const { theme, isDark } = useTheme();
    const { isInWishlist, toggleWishlist } = useCart();
    const { formatPrice } = useCurrency();
    const inWishlist = isInWishlist(product.id);

    // Subtle animation
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const heartScale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 0.98, duration: 150, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0.9, duration: 150, useNativeDriver: true }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 100, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
    };

    const handlePress = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
    };

    const handleWishlist = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        Animated.sequence([
            Animated.spring(heartScale, { toValue: 1.3, friction: 3, useNativeDriver: true }),
            Animated.spring(heartScale, { toValue: 1, friction: 5, useNativeDriver: true }),
        ]).start();

        toggleWishlist(product.id);
    };

    const isLowStock = product.sizes?.some(s => s.stock > 0 && s.stock <= 3);

    return (
        <Animated.View
            style={[
                styles.wrapper,
                { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
            ]}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
            >
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    {/* Product Image - Clean, minimal */}
                    <View style={[styles.imageContainer, { backgroundColor: isDark ? '#0F0F0E' : '#F7F5F2' }]}>
                        {product.localImage ? (
                            <Image
                                source={product.localImage}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        ) : product.image ? (
                            <Image
                                source={{ uri: product.image }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <Text style={styles.emoji}>{product.emoji}</Text>
                        )}

                        {/* Wishlist - Subtle, minimal */}
                        <TouchableOpacity
                            style={[styles.wishlistButton]}
                            onPress={handleWishlist}
                            activeOpacity={0.8}
                        >
                            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                                <Heart
                                    size={16}
                                    color={inWishlist ? theme.error : theme.textTertiary}
                                    fill={inWishlist ? theme.error : 'transparent'}
                                    strokeWidth={1.5}
                                />
                            </Animated.View>
                        </TouchableOpacity>

                        {/* Low stock - Elegant badge */}
                        {isLowStock && (
                            <View style={[styles.badge]}>
                                <Text style={[styles.badgeText, { color: theme.error }]}>LOW STOCK</Text>
                            </View>
                        )}
                    </View>

                    {/* Product Info - Editorial typography */}
                    <View style={styles.info}>
                        {/* Brand - Small, uppercase, spaced */}
                        <Text style={[styles.brand, { color: theme.textTertiary }]} numberOfLines={1}>
                            {product.brand.toUpperCase()}
                        </Text>

                        {/* Name - Elegant, medium weight */}
                        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
                            {product.name}
                        </Text>

                        {/* Price - Clean, prominent */}
                        <Text style={[styles.price, { color: theme.text }]}>
                            {formatPrice(product.price)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        margin: 8,
    },
    card: {
        borderRadius: 2, // Sharp, minimal corners
        overflow: 'hidden',
    },
    imageContainer: {
        aspectRatio: 0.85, // Taller, more editorial
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    emoji: {
        fontSize: 56,
    },
    wishlistButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        bottom: 16,
        left: 16,
    },
    badgeText: {
        fontSize: 9,
        fontWeight: '500',
        letterSpacing: 1.5,
    },
    info: {
        padding: 16,
        paddingTop: 14,
    },
    brand: {
        fontSize: 10,
        fontWeight: '400',
        letterSpacing: 2,
        marginBottom: 6,
    },
    name: {
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.3,
        marginBottom: 10,
        lineHeight: 20,
    },
    price: {
        fontSize: 15,
        fontWeight: '300',
        letterSpacing: 0.5,
    },
});
