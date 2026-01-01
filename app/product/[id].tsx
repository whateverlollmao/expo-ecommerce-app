import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Animated,
    Platform,
    Dimensions,
    Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { X, Minus, Plus, Heart, Share, ShoppingBag, Maximize2, Star, Sparkles } from 'lucide-react-native';
import { getProductById, getStockStatus, products } from '../../data/dummyData';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useSmartSize } from '../../context/SmartSizeContext';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { Button, IconButton } from '../../components/Button';
import { SuccessCheck } from '../../components/ParticleEffects';

const { width, height } = Dimensions.get('window');

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { addToCart, isInWishlist, toggleWishlist } = useCart();
    const { theme, isDark } = useTheme();
    const { t } = useLanguage();
    const { formatPrice } = useCurrency();
    const { getRecommendation, recordSize } = useSmartSize();
    const { addToRecentlyViewed, getSimilarProducts } = useRecentlyViewed();

    const product = getProductById(id);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    // Get recommended size and similar products
    const recommendedSize = product ? getRecommendation(product.category) : null;
    const similarProducts = product ? getSimilarProducts(product, products) : [];

    // Add to recently viewed on mount
    useEffect(() => {
        if (product) {
            addToRecentlyViewed(product);
        }
    }, [product?.id]);

    // Animation values
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const heartScale = useRef(new Animated.Value(1)).current;
    const imageScale = useRef(new Animated.Value(1)).current;
    const heartSparkle = useRef(new Animated.Value(0)).current;

    // Double tap detection
    const lastTap = useRef(0);
    const DOUBLE_TAP_DELAY = 300;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, friction: 6, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
    }, []);

    const inWishlist = product ? isInWishlist(product.id) : false;

    if (!product) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>{t('productNotFound')}</Text>
            </SafeAreaView>
        );
    }

    const stockStatus = selectedSize ? getStockStatus(product, selectedSize) : null;
    const canAddToCart = selectedSize && stockStatus?.status !== 'out' && quantity > 0;

    const handleQuantityChange = (delta: number) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        const newQty = quantity + delta;
        if (newQty >= 1 && (!stockStatus || newQty <= stockStatus.stock)) {
            setQuantity(newQty);
        }
    };

    const handleSizeSelect = (size: string) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setSelectedSize(size);
    };

    const handleWishlist = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }

        // Delightful heart animation
        Animated.sequence([
            Animated.spring(heartScale, { toValue: 1.5, friction: 3, useNativeDriver: true }),
            Animated.spring(heartScale, { toValue: 1, friction: 4, useNativeDriver: true }),
        ]).start();

        if (!inWishlist) {
            // Sparkle burst animation
            Animated.sequence([
                Animated.timing(heartSparkle, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(heartSparkle, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start();
        }

        toggleWishlist(product.id);
    };

    // Proper double-tap zoom
    const handleImageTap = () => {
        const now = Date.now();

        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
            // Double tap detected - toggle zoom
            if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }

            const newZoomState = !isZoomed;
            setIsZoomed(newZoomState);

            Animated.spring(imageScale, {
                toValue: newZoomState ? 2 : 1,
                friction: 5,
                tension: 100,
                useNativeDriver: true,
            }).start();
        }

        lastTap.current = now;
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            Alert.alert(t('selectSizeFirst'), t('selectSizeMessage'));
            return;
        }

        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        addToCart(product, selectedSize, quantity);

        // Success animation
        setShowSuccess(true);

        Animated.sequence([
            Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true, friction: 5 }),
            Animated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true, friction: 3 }),
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 4 }),
        ]).start();

        setAddedToCart(true);
        setTimeout(() => router.back(), 1500);
    };

    const getStockLabel = (status: { status: string; stock: number }) => {
        if (status.status === 'out') return t('outOfStock');
        if (status.status === 'low') return t('onlyLeft', { count: status.stock });
        return t('inStock');
    };

    // Animated total price
    const totalPrice = product.price * quantity;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <SafeAreaView style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.headerBtn, { backgroundColor: theme.glassBg }]}
                >
                    <X size={22} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={[styles.headerBtn, { backgroundColor: theme.glassBg }]}>
                        <Share size={20} color={theme.text} />
                    </TouchableOpacity>
                    <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                        <TouchableOpacity
                            onPress={handleWishlist}
                            style={[
                                styles.headerBtn,
                                { backgroundColor: inWishlist ? theme.error : theme.glassBg }
                            ]}
                        >
                            <Heart
                                size={20}
                                color={inWishlist ? '#FFF' : theme.text}
                                fill={inWishlist ? '#FFF' : 'transparent'}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </SafeAreaView>

            <Animated.ScrollView
                style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Product Image - Double tap to zoom */}
                <TouchableOpacity activeOpacity={1} onPress={handleImageTap}>
                    <Animated.View style={{ transform: [{ scale: imageScale }] }}>
                        <LinearGradient
                            colors={isDark ? ['#1A1A1A', '#0D0D0D'] : ['#F5F3EF', '#E8E5E0']}
                            style={styles.imageContainer}
                        >
                            <Text style={styles.emoji}>{product.emoji}</Text>

                            {/* Zoom indicator */}
                            <View style={[styles.zoomHint, { backgroundColor: theme.glassBg }]}>
                                <Maximize2 size={14} color={theme.textSecondary} />
                                <Text style={[styles.zoomText, { color: theme.textSecondary }]}>
                                    {isZoomed ? '−' : '+'}
                                </Text>
                            </View>
                        </LinearGradient>
                    </Animated.View>
                </TouchableOpacity>

                {/* Product Info Card */}
                <View style={[styles.infoSection, { backgroundColor: theme.card }]}>
                    {/* Brand & Name */}
                    <Text style={[styles.brand, { color: theme.accent }]}>{product.brand}</Text>
                    <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>

                    {/* Price & Rating */}
                    <View style={styles.priceRating}>
                        <View style={styles.priceContainer}>
                            <Text style={[styles.price, { color: theme.text }]}>
                                {formatPrice(totalPrice)}
                            </Text>
                            {quantity > 1 && (
                                <Text style={[styles.pricePerUnit, { color: theme.textSecondary }]}>
                                    {formatPrice(product.price)} {t('priceEach')}
                                </Text>
                            )}
                        </View>
                        <View style={styles.rating}>
                            <Text style={[styles.stars, { color: theme.tertiary }]}>★★★★★</Text>
                            <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
                                4.8 (256 {t('reviews')})
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    {/* Size Selection - Visual grid */}
                    <View style={styles.sizeHeader}>
                        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                            {t('selectSize')}
                        </Text>
                        {/* Smart Size Recommendation */}
                        {recommendedSize && (
                            <View style={[styles.sizeRecommendation, { backgroundColor: theme.accentGlow }]}>
                                <Star size={12} color={theme.accent} />
                                <Text style={[styles.sizeRecText, { color: theme.accent }]}>
                                    {t('yourSize') || 'Your size'}: {recommendedSize}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.sizesGrid}>
                        {product.sizes.map((sizeData) => {
                            const isSelected = selectedSize === sizeData.size;
                            const isOutOfStock = sizeData.stock === 0;
                            const isLow = sizeData.stock > 0 && sizeData.stock <= 3;

                            return (
                                <TouchableOpacity
                                    key={sizeData.size}
                                    onPress={() => !isOutOfStock && handleSizeSelect(sizeData.size)}
                                    disabled={isOutOfStock}
                                    activeOpacity={0.8}
                                    style={{ width: '23%' }}
                                >
                                    <View style={[
                                        styles.sizeButton,
                                        { backgroundColor: isSelected ? theme.accent : theme.inputBackground },
                                        isOutOfStock && styles.sizeDisabled,
                                    ]}>
                                        <Text style={[
                                            styles.sizeText,
                                            { color: isSelected ? '#FFF' : isOutOfStock ? theme.textTertiary : theme.text },
                                            isOutOfStock && styles.strikethrough,
                                        ]}>
                                            {sizeData.size}
                                        </Text>
                                        {isLow && !isOutOfStock && (
                                            <View style={[styles.lowBadge, { backgroundColor: theme.warning }]}>
                                                <Text style={styles.lowText}>{sizeData.stock}</Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Stock Status */}
                    {stockStatus && (
                        <View style={[
                            styles.stockRow,
                            {
                                backgroundColor:
                                    stockStatus.status === 'out' ? theme.error + '12' :
                                        stockStatus.status === 'low' ? theme.warning + '12' : theme.accent + '12'
                            }
                        ]}>
                            <View style={[
                                styles.stockDot,
                                {
                                    backgroundColor:
                                        stockStatus.status === 'out' ? theme.error :
                                            stockStatus.status === 'low' ? theme.warning : theme.success
                                }
                            ]} />
                            <Text style={[
                                styles.stockText,
                                {
                                    color:
                                        stockStatus.status === 'out' ? theme.error :
                                            stockStatus.status === 'low' ? theme.warning : theme.success
                                }
                            ]}>
                                {getStockLabel(stockStatus)}
                            </Text>
                        </View>
                    )}

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    {/* Quantity - Clean inline design */}
                    <View style={styles.quantitySection}>
                        <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginBottom: 0 }]}>
                            {t('quantity')}
                        </Text>
                        <View style={[styles.quantityControl, { backgroundColor: theme.inputBackground }]}>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => handleQuantityChange(-1)}
                                disabled={quantity === 1}
                            >
                                <Minus size={18} color={quantity === 1 ? theme.textTertiary : theme.text} />
                            </TouchableOpacity>
                            <Text style={[styles.qtyText, { color: theme.text }]}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => handleQuantityChange(1)}
                            >
                                <Plus size={18} color={theme.accent} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    {/* Description */}
                    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                        {t('description')}
                    </Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>
                        {product.description}
                    </Text>

                    {/* Colors */}
                    {product.colors && (
                        <>
                            <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: 24 }]}>
                                {t('availableColors')}
                            </Text>
                            <View style={styles.colorsRow}>
                                {product.colors.map((color, i) => {
                                    const isSelected = selectedColor === color;
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => {
                                                setSelectedColor(color);
                                                if (Platform.OS === 'ios') {
                                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                }
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <View
                                                style={[
                                                    styles.colorChip,
                                                    {
                                                        backgroundColor: isSelected ? theme.accent : theme.inputBackground,
                                                        borderWidth: isSelected ? 0 : 1,
                                                        borderColor: theme.border,
                                                    }
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.colorText,
                                                    { color: isSelected ? '#FFF' : theme.text }
                                                ]}>
                                                    {color}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </>
                    )}

                    {/* Similar Products Section */}
                    {similarProducts.length > 0 && (
                        <>
                            <View style={[styles.divider, { backgroundColor: theme.border, marginTop: 24 }]} />
                            <View style={styles.similarSection}>
                                <View style={styles.similarHeader}>
                                    <Sparkles size={16} color={theme.accent} />
                                    <Text style={[styles.similarTitle, { color: theme.text }]}>
                                        {t('youMightLike') || 'You might also like'}
                                    </Text>
                                </View>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.similarScroll}
                                >
                                    {similarProducts.map((similar: any) => (
                                        <TouchableOpacity
                                            key={similar.id}
                                            style={[styles.similarCard, { backgroundColor: theme.card }]}
                                            onPress={() => router.push(`/product/${similar.id}`)}
                                            activeOpacity={0.9}
                                        >
                                            {similar.image ? (
                                                <Image
                                                    source={{ uri: similar.image }}
                                                    style={styles.similarImage}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View style={[styles.similarEmoji, { backgroundColor: theme.inputBackground }]}>
                                                    <Text style={{ fontSize: 32 }}>{similar.emoji}</Text>
                                                </View>
                                            )}
                                            <Text style={[styles.similarName, { color: theme.text }]} numberOfLines={1}>
                                                {similar.name}
                                            </Text>
                                            <Text style={[styles.similarPrice, { color: theme.accent }]}>
                                                {formatPrice(similar.price)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </>
                    )}
                </View>
            </Animated.ScrollView>

            {/* Footer */}
            <SafeAreaView style={[styles.footer, { backgroundColor: theme.card }]} edges={['bottom']}>
                {showSuccess ? (
                    <View style={styles.successRow}>
                        <SuccessCheck visible={true} size={44} />
                        <Text style={[styles.successText, { color: theme.accent }]}>{t('addedToBag')}</Text>
                    </View>
                ) : (
                    <Animated.View style={[styles.footerContent, { transform: [{ scale: scaleAnim }] }]}>
                        <View style={styles.footerPrice}>
                            <Text style={[styles.footerLabel, { color: theme.textSecondary }]}>{t('total')}</Text>
                            <Text style={[styles.footerTotal, { color: theme.text }]}>{formatPrice(totalPrice)}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleAddToCart}
                            disabled={!canAddToCart || addedToCart}
                            activeOpacity={0.9}
                            style={{ flex: 1 }}
                        >
                            <LinearGradient
                                colors={canAddToCart ? [theme.gradientStart, theme.gradientEnd] : [theme.border, theme.border]}
                                style={[styles.addButton, !canAddToCart && { opacity: 0.5 }]}
                            >
                                <ShoppingBag size={20} color="#FFF" />
                                <Text style={styles.addButtonText}>{t('addToBag')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    headerBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 10,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingBottom: 160,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 120,
    },
    zoomHint: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    zoomText: {
        fontSize: 14,
        fontWeight: '700',
    },
    infoSection: {
        padding: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -24,
    },
    brand: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2.5,
        marginBottom: 6,
    },
    name: {
        fontSize: 26,
        fontWeight: '900',
        marginBottom: 16,
    },
    priceRating: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    priceContainer: {},
    price: {
        fontSize: 28,
        fontWeight: '900',
    },
    pricePerUnit: {
        fontSize: 13,
        marginTop: 2,
    },
    rating: {
        alignItems: 'flex-end',
    },
    stars: {
        fontSize: 14,
        marginBottom: 2,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginVertical: 22,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 14,
    },
    sizesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    sizeButton: {
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    sizeDisabled: {
        opacity: 0.4,
    },
    sizeText: {
        fontSize: 15,
        fontWeight: '700',
    },
    strikethrough: {
        textDecorationLine: 'line-through',
    },
    lowBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lowText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        padding: 14,
        borderRadius: 12,
    },
    stockDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 10,
    },
    stockText: {
        fontSize: 13,
        fontWeight: '700',
    },
    quantitySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        paddingHorizontal: 4,
    },
    qtyBtn: {
        padding: 12,
    },
    qtyText: {
        fontSize: 18,
        fontWeight: '800',
        minWidth: 40,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        lineHeight: 26,
    },
    colorsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    colorChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    colorText: {
        fontSize: 13,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 15,
    },
    footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    footerPrice: {},
    footerLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    footerTotal: {
        fontSize: 24,
        fontWeight: '900',
    },
    addButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    successRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
    },
    successText: {
        fontSize: 20,
        fontWeight: '800',
    },
    // Smart Size Recommendation styles
    sizeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    sizeRecommendation: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    sizeRecText: {
        fontSize: 12,
        fontWeight: '700',
    },
    // Similar Products styles
    similarSection: {
        marginTop: 20,
        marginBottom: 100,
    },
    similarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    similarTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    similarScroll: {
        paddingRight: 20,
        gap: 12,
    },
    similarCard: {
        width: 130,
        borderRadius: 16,
        overflow: 'hidden',
    },
    similarImage: {
        width: 130,
        height: 130,
        borderRadius: 12,
    },
    similarEmoji: {
        width: 130,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    similarName: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 8,
        paddingHorizontal: 4,
    },
    similarPrice: {
        fontSize: 14,
        fontWeight: '800',
        marginTop: 4,
        paddingHorizontal: 4,
        paddingBottom: 8,
    },
});
