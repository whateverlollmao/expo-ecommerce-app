import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    Animated,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    RefreshControl,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, X, Heart, Sparkles, ShoppingBag, SlidersHorizontal } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ProductCard } from '../../components/ProductCard';
import { ProductSkeleton } from '../../components/Animations';
import { CartPreviewSheet } from '../../components/CartPreview';
import { products, getProductById } from '../../data/dummyData';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function HomeScreen() {
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const { recentlyViewed, wishlist, addToRecentlyViewed, cartItems } = useCart();
    const { t } = useLanguage();
    const { formatPrice } = useCurrency();
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerAnim = useRef(new Animated.Value(0)).current;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGender, setSelectedGender] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showCartPreview, setShowCartPreview] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [sortBy, setSortBy] = useState('default');

    const GENDER_TABS = [
        { key: 'all', label: t('all') },
        { key: 'men', label: t('men') },
        { key: 'women', label: t('women') },
    ];

    const MEN_CATEGORIES = [
        { key: 'all', label: t('all') },
        { key: 'shirts', label: t('shirts') },
        { key: 'jackets', label: t('jackets') },
        { key: 'shoes', label: t('shoes') },
        { key: 'accessories', label: t('accessories') },
    ];

    const WOMEN_CATEGORIES = [
        { key: 'all', label: t('all') },
        { key: 'dresses', label: t('dresses') },
        { key: 'bags', label: t('bags') },
        { key: 'shoes', label: t('shoes') },
        { key: 'jewelry', label: t('jewelry') },
    ];

    const ALL_CATEGORIES = [
        { key: 'all', label: t('all') },
        { key: 'tops', label: t('tops') },
        { key: 'shoes', label: t('shoes') },
        { key: 'accessories', label: t('accessories') },
        { key: 'bags', label: t('bags') },
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 800);

        Animated.spring(headerAnim, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
        }).start();
    }, []);

    const onRefresh = useCallback(() => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setRefreshing(true);
        setLoading(true);
        setTimeout(() => {
            setRefreshing(false);
            setLoading(false);
        }, 1500);
    }, []);

    const handleProductPress = (productId: string) => {
        if (Platform.OS === 'ios') {
            Haptics.selectionAsync();
        }
        addToRecentlyViewed(productId);
        router.push(`/product/${productId}`);
    };

    const handleGenderChange = (gender: string) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setSelectedGender(gender);
        setSelectedCategory('all');
    };

    const handleCategoryPress = (cat: string) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setSelectedCategory(cat);
    };

    const getCategories = () => {
        if (selectedGender === 'men') return MEN_CATEGORIES;
        if (selectedGender === 'women') return WOMEN_CATEGORIES;
        return ALL_CATEGORIES;
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesGender = true;
        if (selectedGender === 'men') matchesGender = product.category === 'men';
        if (selectedGender === 'women') matchesGender = product.category === 'women';

        let matchesCategory = true;
        if (selectedCategory !== 'all') {
            if (selectedCategory === 'shirts') matchesCategory = ['👕', '👔'].includes(product.emoji);
            if (selectedCategory === 'jackets') matchesCategory = product.emoji === '🧥';
            if (selectedCategory === 'shoes') matchesCategory = ['👟', '👠'].includes(product.emoji);
            if (selectedCategory === 'accessories') matchesCategory = ['🧣', '🧢', '📿'].includes(product.emoji);
            if (selectedCategory === 'dresses') matchesCategory = ['👗', '👙'].includes(product.emoji);
            if (selectedCategory === 'bags') matchesCategory = product.emoji === '👜';
            if (selectedCategory === 'jewelry') matchesCategory = product.emoji === '📿';
            if (selectedCategory === 'tops') matchesCategory = ['👕', '👔', '🧶'].includes(product.emoji);
        }

        return matchesSearch && matchesGender && matchesCategory;
    });

    // Apply sorting
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'priceLow':
                return a.price - b.price;
            case 'priceHigh':
                return b.price - a.price;
            case 'newest':
                return (b.id || '').localeCompare(a.id || '');
            default:
                return 0;
        }
    });

    // Search suggestions
    const searchSuggestions = searchQuery.length > 0
        ? products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 4)
        : [];

    const recentProducts = recentlyViewed
        .map((id: string) => getProductById(id))
        .filter(Boolean)
        .slice(0, 5);

    const wishlistProducts = wishlist
        .map((id: string) => products.find((p: any) => p.id === id))
        .filter(Boolean);

    const renderProduct = ({ item, index }: { item: any; index: number }) => {
        if (loading) {
            return <ProductSkeleton />;
        }
        return (
            <ProductCard
                product={item}
                onPress={() => handleProductPress(item.id)}
            />
        );
    };

    const ListHeader = () => (
        <View style={styles.headerSection}>
            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={[
                    styles.searchBar,
                    {
                        backgroundColor: theme.card,
                        borderWidth: searchFocused ? 2 : 0,
                        borderColor: theme.accent,
                    }
                ]}>
                    <Search size={20} color={searchFocused ? theme.accent : theme.textTertiary} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder={t('searchPlaceholder')}
                        placeholderTextColor={theme.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={18} color={theme.textTertiary} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Search Suggestions */}
                {searchFocused && searchSuggestions.length > 0 && (
                    <View style={[styles.suggestions, { backgroundColor: theme.card }]}>
                        {searchSuggestions.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.suggestionItem}
                                onPress={() => {
                                    setSearchQuery('');
                                    setSearchFocused(false);
                                    handleProductPress(item.id);
                                }}
                            >
                                <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                                <View style={styles.suggestionInfo}>
                                    <Text style={[styles.suggestionName, { color: theme.text }]}>{item.name}</Text>
                                    <Text style={[styles.suggestionBrand, { color: theme.textSecondary }]}>{item.brand}</Text>
                                </View>
                                <Text style={[styles.suggestionPrice, { color: theme.accent }]}>{formatPrice(item.price)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {/* Gender Tabs */}
            <View style={styles.genderTabs}>
                {GENDER_TABS.map(gender => (
                    <TouchableOpacity
                        key={gender.key}
                        onPress={() => handleGenderChange(gender.key)}
                        activeOpacity={0.8}
                        style={{ flex: 1 }}
                    >
                        {selectedGender === gender.key ? (
                            <LinearGradient
                                colors={[theme.gradientStart, theme.gradientEnd]}
                                style={styles.genderActive}
                            >
                                <Text style={styles.genderTextActive}>
                                    {gender.key === 'men' ? '👔 ' : gender.key === 'women' ? '👗 ' : '✨ '}{gender.label}
                                </Text>
                            </LinearGradient>
                        ) : (
                            <View style={[styles.genderInactive, { backgroundColor: theme.card }]}>
                                <Text style={[styles.genderText, { color: theme.textSecondary }]}>
                                    {gender.key === 'men' ? '👔 ' : gender.key === 'women' ? '👗 ' : '✨ '}{gender.label}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Sub-Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContent}
            >
                {getCategories().map(cat => (
                    <TouchableOpacity
                        key={cat.key}
                        onPress={() => handleCategoryPress(cat.key)}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.categoryPill,
                            {
                                backgroundColor: selectedCategory === cat.key ? theme.accentGlow : theme.card,
                                borderColor: selectedCategory === cat.key ? theme.accent : 'transparent',
                            }
                        ]}>
                            <Text style={[
                                styles.categoryText,
                                { color: selectedCategory === cat.key ? theme.accent : theme.textSecondary }
                            ]}>
                                {cat.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Sort Filter Row */}
            <View style={styles.sortRow}>
                <Text style={[styles.sortLabel, { color: theme.textSecondary }]}>{t('sortBy') || 'SORT BY'}:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortOptions}>
                    <TouchableOpacity
                        style={[styles.sortButton, sortBy === 'default' && { backgroundColor: theme.accentGlow, borderColor: theme.accent }]}
                        onPress={() => setSortBy('default')}
                    >
                        <Text style={[styles.sortButtonText, { color: sortBy === 'default' ? theme.accent : theme.textSecondary }]}>
                            {t('popular') || 'Popular'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortButton, sortBy === 'priceLow' && { backgroundColor: theme.accentGlow, borderColor: theme.accent }]}
                        onPress={() => setSortBy('priceLow')}
                    >
                        <Text style={[styles.sortButtonText, { color: sortBy === 'priceLow' ? theme.accent : theme.textSecondary }]}>
                            {t('priceLowToHigh') || 'Price ↑'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortButton, sortBy === 'priceHigh' && { backgroundColor: theme.accentGlow, borderColor: theme.accent }]}
                        onPress={() => setSortBy('priceHigh')}
                    >
                        <Text style={[styles.sortButtonText, { color: sortBy === 'priceHigh' ? theme.accent : theme.textSecondary }]}>
                            {t('priceHighToLow') || 'Price ↓'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortButton, sortBy === 'newest' && { backgroundColor: theme.accentGlow, borderColor: theme.accent }]}
                        onPress={() => setSortBy('newest')}
                    >
                        <Text style={[styles.sortButtonText, { color: sortBy === 'newest' ? theme.accent : theme.textSecondary }]}>
                            {t('newest') || 'Newest'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Recently Viewed */}
            {recentProducts.length > 0 && !searchQuery && (
                <View style={styles.recentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('recentlyViewed')}</Text>
                        <Sparkles size={16} color={theme.accent} />
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.recentScroll}
                    >
                        {recentProducts.map((product: any) => (
                            <TouchableOpacity
                                key={product.id}
                                style={[styles.recentItem, { backgroundColor: theme.card }]}
                                onPress={() => handleProductPress(product.id)}
                                activeOpacity={0.9}
                            >
                                <View style={[styles.recentEmoji, { backgroundColor: theme.inputBackground }]}>
                                    <Text style={{ fontSize: 32 }}>{product.emoji}</Text>
                                </View>
                                <Text style={[styles.recentName, { color: theme.text }]} numberOfLines={1}>
                                    {product.name}
                                </Text>
                                <Text style={[styles.recentPrice, { color: theme.accent }]}>
                                    {formatPrice(product.price)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Wishlist Preview */}
            {wishlistProducts.length > 0 && !searchQuery && (
                <TouchableOpacity
                    style={styles.wishlistBanner}
                    onPress={() => router.push('/wishlist')}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={isDark ? ['#1A0A0A', '#0A0A0A'] : ['#FEF2F2', '#FEE2E2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.wishlistGradient}
                    >
                        <View style={styles.wishlistLeft}>
                            <View style={[styles.wishlistIcon, { backgroundColor: theme.error + '30' }]}>
                                <Heart size={20} color={theme.error} fill={theme.error} />
                            </View>
                            <View>
                                <Text style={[styles.wishlistTitle, { color: theme.text }]}>
                                    {t('yourWishlist')}
                                </Text>
                                <Text style={[styles.wishlistCount, { color: theme.textSecondary }]}>
                                    {wishlistProducts.length} {wishlistProducts.length === 1 ? t('savedItem') : t('savedItems')}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.wishlistEmojis}>
                            {wishlistProducts.slice(0, 3).map((p: any) => (
                                <Text key={p.id} style={styles.miniEmoji}>{p.emoji}</Text>
                            ))}
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            )}

            {/* Products Header */}
            <View style={styles.productsHeader}>
                <View>
                    <Text style={[styles.productsSubtitle, { color: theme.accent }]}>
                        {selectedGender === 'all' ? t('newDrops') : selectedGender.toUpperCase()}
                    </Text>
                    <Text style={[styles.productsTitle, { color: theme.text }]}>
                        {selectedCategory === 'all' ? t('collection') : getCategories().find(c => c.key === selectedCategory)?.label}
                    </Text>
                </View>
                <View style={[styles.productCount, { backgroundColor: theme.accentGlow }]}>
                    <Text style={[styles.productCountText, { color: theme.accent }]}>
                        {filteredProducts.length}
                    </Text>
                </View>
            </View>

            {/* Featured New Arrivals Banner */}
            {sortedProducts.length > 0 && (
                <TouchableOpacity
                    style={[styles.featuredBanner, { backgroundColor: theme.card }]}
                    onPress={() => handleProductPress(sortedProducts[0]?.id)}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={isDark ? ['#1A1A18', '#0F0F0E'] : ['#F8F6F3', '#EDE9E4']}
                        style={styles.featuredGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={[styles.featuredTitle, { color: theme.text }]}>
                            {t('newest') || 'Новинки'}
                        </Text>
                        {sortedProducts[0]?.image && (
                            <Image
                                source={{ uri: sortedProducts[0].image }}
                                style={styles.featuredImage}
                                resizeMode="contain"
                            />
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Decorative Glow - Top Left Corner */}
            <View
                style={[
                    styles.decorativeGlow,
                    { backgroundColor: theme.accent + '15' }
                ]}
                pointerEvents="none"
            />
            {/* Header */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background }}>
                <Animated.View style={[
                    styles.header,
                    {
                        opacity: headerAnim,
                        transform: [{
                            translateY: headerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-20, 0],
                            })
                        }],
                    }
                ]}>
                    <Text style={[styles.logo, { color: theme.text }]}>LUXE</Text>

                    {/* Cart Quick Access */}
                    {cartItems.length > 0 && (
                        <TouchableOpacity
                            style={[styles.cartButton, { backgroundColor: theme.card }]}
                            onPress={() => setShowCartPreview(true)}
                        >
                            <ShoppingBag size={20} color={theme.accent} />
                            <View style={[styles.cartBadge, { backgroundColor: theme.accent }]}>
                                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </SafeAreaView>

            <Animated.FlatList
                data={loading ? Array(6).fill({}) : sortedProducts}
                renderItem={renderProduct}
                keyExtractor={(item, index) => item.id || `skeleton-${index}`}
                numColumns={2}
                contentContainerStyle={[styles.list, { backgroundColor: theme.backgroundSecondary }]}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={() => (
                    <View style={styles.empty}>
                        <Text style={{ fontSize: 48 }}>🔍</Text>
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            {t('noProducts')}
                        </Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.accent}
                        colors={[theme.accent]}
                    />
                }
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
            />

            {/* Cart Preview Sheet */}
            <CartPreviewSheet
                visible={showCartPreview}
                onClose={() => setShowCartPreview(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    logoBadge: {
        // Removed - now using text only
    },
    logo: {
        fontSize: 24,
        fontWeight: '200',
        letterSpacing: 12,
    },
    cartButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },
    list: {
        padding: 10,
        paddingBottom: 140,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        marginTop: -10,
    },
    headerSection: {
        paddingHorizontal: 6,
        paddingTop: 8,
        paddingBottom: 8,
    },
    searchSection: {
        marginBottom: 18,
        zIndex: 100,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderRadius: 2,
        paddingHorizontal: 16,
        borderWidth: 0.5,
        borderColor: 'transparent',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    suggestions: {
        position: 'absolute',
        top: 58,
        left: 0,
        right: 0,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        zIndex: 100,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    suggestionInfo: {
        flex: 1,
        marginLeft: 12,
    },
    suggestionName: {
        fontSize: 14,
        fontWeight: '600',
    },
    suggestionBrand: {
        fontSize: 12,
        marginTop: 2,
    },
    suggestionPrice: {
        fontSize: 15,
        fontWeight: '800',
    },
    genderTabs: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    genderActive: {
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    genderInactive: {
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    genderTextActive: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 14,
    },
    genderText: {
        fontWeight: '700',
        fontSize: 14,
    },
    categoriesScroll: {
        marginBottom: 20,
    },
    categoriesContent: {
        gap: 10,
    },
    categoryPill: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    categoryText: {
        fontWeight: '700',
        fontSize: 13,
    },
    recentSection: {
        marginBottom: 22,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    recentScroll: {
        gap: 12,
    },
    recentItem: {
        width: 130,
        borderRadius: 18,
        overflow: 'hidden',
    },
    recentEmoji: {
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recentName: {
        fontSize: 12,
        fontWeight: '700',
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    recentPrice: {
        fontSize: 14,
        fontWeight: '800',
        paddingHorizontal: 12,
        paddingBottom: 12,
        paddingTop: 4,
    },
    wishlistBanner: {
        marginBottom: 22,
    },
    wishlistGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        borderRadius: 18,
    },
    wishlistLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    wishlistIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wishlistTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    wishlistCount: {
        fontSize: 13,
        marginTop: 2,
    },
    wishlistEmojis: {
        flexDirection: 'row',
        gap: 4,
    },
    miniEmoji: {
        fontSize: 28,
    },
    productsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    productsSubtitle: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 4,
    },
    productsTitle: {
        fontSize: 24,
        fontWeight: '900',
    },
    productCount: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    productCountText: {
        fontSize: 14,
        fontWeight: '800',
    },
    empty: {
        padding: 60,
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
    },
    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    sortLabel: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
        marginRight: 10,
    },
    sortOptions: {
        flexDirection: 'row',
        gap: 8,
    },
    sortButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    sortButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    decorativeGlow: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 350,
        height: 350,
        borderRadius: 175,
        opacity: 0.6,
    },
    featuredBanner: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
    },
    featuredGradient: {
        padding: 20,
        minHeight: 140,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredTitle: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    featuredImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
    },
    // Category Cards Styles
    categoryCardsContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    categoryCardsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    categoryCard: {
        flex: 1,
        height: 160,
        borderRadius: 20,
        overflow: 'hidden',
    },
    categoryCardImage: {
        width: '100%',
        height: '100%',
    },
    categoryCardGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingTop: 40,
    },
    categoryCardTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    categoryCardActive: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth: 3,
        borderRadius: 20,
    },
    allProductsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
    },
    allProductsText: {
        fontSize: 15,
        fontWeight: '700',
    },
});
