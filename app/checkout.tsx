import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CreditCard, MapPin, Check, Lock, CheckCircle, ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

const ADDRESSES_STORAGE_KEY = '@saved_addresses';

const getCurrentDate = () => {
    const now = new Date();
    return {
        month: now.getMonth() + 1,
        year: now.getFullYear() % 100,
        fullYear: now.getFullYear(),
    };
};

function Section({ title, children, theme }: any) {
    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.accent }]}>{title}</Text>
            <View style={[styles.sectionContent, { backgroundColor: theme.card }]}>
                {children}
            </View>
        </View>
    );
}

export default function CheckoutScreen() {
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const { cartItems, getCartTotal, placeOrder } = useCart();
    const { t } = useLanguage();
    const { formatPrice } = useCurrency();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Saved addresses state
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showAddressPicker, setShowAddressPicker] = useState(false);

    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardType, setCardType] = useState('');
    const [expiryError, setExpiryError] = useState('');

    // Load saved addresses on mount
    useEffect(() => {
        loadSavedAddresses();
    }, []);

    const loadSavedAddresses = async () => {
        try {
            const saved = await AsyncStorage.getItem(ADDRESSES_STORAGE_KEY);
            if (saved) {
                const addresses = JSON.parse(saved);
                setSavedAddresses(addresses);
                // Auto-select default address
                const defaultAddr = addresses.find((a: any) => a.isDefault);
                if (defaultAddr) {
                    selectAddress(defaultAddr);
                }
            }
        } catch (e) {
            console.log('Error loading addresses:', e);
        }
    };

    const selectAddress = (addr: any) => {
        setSelectedAddressId(addr.id);
        setFullName(addr.fullName || '');
        setAddress(addr.street || '');
        setCity(addr.city || '');
        setZipCode(addr.zip || '');
        setShowAddressPicker(false);
        if (Platform.OS === 'ios') {
            Haptics.selectionAsync();
        }
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const currentDate = getCurrentDate();

    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');

        if (cleaned.startsWith('4')) {
            setCardType('Visa');
        } else if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) {
            setCardType('Mastercard');
        } else if (/^3[47]/.test(cleaned)) {
            setCardType('Amex');
        } else if (/^6(?:011|5)/.test(cleaned)) {
            setCardType('Discover');
        } else {
            setCardType('');
        }

        const groups = cleaned.match(/.{1,4}/g);
        return groups ? groups.join(' ').substring(0, 19) : '';
    };

    const formatExpiry = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        let formatted = cleaned;

        if (cleaned.length >= 2) {
            let month = parseInt(cleaned.substring(0, 2), 10);

            if (month > 12) month = 12;
            if (month < 1 && cleaned.length >= 2) month = 1;

            const monthStr = month.toString().padStart(2, '0');
            formatted = monthStr + (cleaned.length > 2 ? '/' + cleaned.substring(2, 4) : '');

            if (cleaned.length >= 4) {
                const year = parseInt(cleaned.substring(2, 4), 10);
                const inputYear = 2000 + year;

                if (inputYear < currentDate.fullYear) {
                    setExpiryError(t('invalidExpiry'));
                } else if (inputYear === currentDate.fullYear && month < currentDate.month) {
                    setExpiryError(t('invalidExpiry'));
                } else if (year > currentDate.year + 10) {
                    setExpiryError(t('invalidExpiry'));
                } else {
                    setExpiryError('');
                }
            } else {
                setExpiryError('');
            }
        }

        return formatted;
    };

    const validateShipping = () => {
        if (!fullName.trim() || !address.trim() || !city.trim() || !zipCode.trim()) {
            Alert.alert(t('missingInfo'), t('fillAllFields'));
            return false;
        }
        return true;
    };

    const validatePayment = () => {
        const cleanCard = cardNumber.replace(/\s/g, '');

        if (cleanCard.length < 15) {
            Alert.alert(t('invalidCard'), t('enterValidCard'));
            return false;
        }
        if (expiry.length !== 5) {
            Alert.alert(t('invalidExpiry'), t('enterExpiry'));
            return false;
        }
        if (expiryError) {
            Alert.alert(t('invalidExpiry'), expiryError);
            return false;
        }
        if (cvv.length < 3) {
            Alert.alert(t('invalidCvv'), t('enterValidCvv'));
            return false;
        }
        if (!cardName.trim()) {
            Alert.alert(t('missingName'), t('enterCardName'));
            return false;
        }
        return true;
    };

    const animateStep = (newStep: number) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        Animated.sequence([
            Animated.timing(slideAnim, {
                toValue: newStep > step ? -50 : 50,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        setStep(newStep);
    };

    const handleNext = () => {
        if (step === 1 && validateShipping()) {
            animateStep(2);
        } else if (step === 2 && validatePayment()) {
            animateStep(3);
        }
    };

    const handlePlaceOrder = async () => {
        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        setLoading(true);
        try {
            const order = await placeOrder(
                { fullName, address, city, zipCode },
                { cardNumber: cardNumber.replace(/\s/g, ''), cardName, cardType }
            );

            Alert.alert(
                t('orderConfirmed'),
                `${t('orderNumber')}${order.id}\n\n${t('total')}: $${total.toFixed(2)}\n\n${t('confirmationSent')}`,
                [
                    {
                        text: t('viewOrders'),
                        onPress: () => router.replace('/order-history')
                    },
                    {
                        text: t('keepShopping'),
                        onPress: () => router.replace('/(tabs)/home')
                    }
                ]
            );
        } catch (e) {
            Alert.alert(t('error'), 'Failed to place order. Please try again.');
        }
        setLoading(false);
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                    <Animated.View style={[
                        styles.stepCircle,
                        {
                            backgroundColor: step >= s ? theme.accent : theme.inputBackground,
                            transform: [{ scale: step === s ? 1.1 : 1 }],
                        }
                    ]}>
                        {step > s ? (
                            <Check size={14} color="#FFFFFF" strokeWidth={3} />
                        ) : (
                            <Text style={[styles.stepNumber, { color: step >= s ? '#FFFFFF' : theme.textSecondary }]}>
                                {s}
                            </Text>
                        )}
                    </Animated.View>
                    {s < 3 && (
                        <View style={[
                            styles.stepLine,
                            { backgroundColor: step > s ? theme.accent : theme.border }
                        ]} />
                    )}
                </React.Fragment>
            ))}
        </View>
    );

    const stepLabels = [t('shipping'), t('payment'), t('review')];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={[styles.header, { backgroundColor: theme.card }]}>
                    <TouchableOpacity
                        onPress={() => step > 1 ? animateStep(step - 1) : router.back()}
                        style={[styles.backButton, { backgroundColor: theme.inputBackground }]}
                    >
                        <ArrowLeft size={22} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        {stepLabels[step - 1]}
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                {renderStepIndicator()}

                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    style={{ transform: [{ translateX: slideAnim }] }}
                >
                    {step === 1 && (
                        <Section title={t('shippingAddress')} theme={theme}>
                            {/* Saved Addresses Picker */}
                            {savedAddresses.length > 0 && (
                                <View style={styles.savedAddressSection}>
                                    <Text style={[styles.savedAddressLabel, { color: theme.textSecondary }]}>
                                        {t('useSavedAddress') || 'Use saved address'}
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.addressPicker, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
                                        onPress={() => setShowAddressPicker(!showAddressPicker)}
                                    >
                                        <MapPin size={18} color={theme.accent} />
                                        <Text style={[styles.addressPickerText, { color: theme.text }]} numberOfLines={1}>
                                            {selectedAddressId
                                                ? savedAddresses.find(a => a.id === selectedAddressId)?.label || fullName
                                                : t('selectAddress') || 'Select an address'}
                                        </Text>
                                        <ChevronDown size={18} color={theme.textSecondary} />
                                    </TouchableOpacity>

                                    {showAddressPicker && (
                                        <View style={[styles.addressDropdown, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                            {savedAddresses.map((addr: any) => (
                                                <TouchableOpacity
                                                    key={addr.id}
                                                    style={[
                                                        styles.addressOption,
                                                        selectedAddressId === addr.id && { backgroundColor: theme.accentGlow }
                                                    ]}
                                                    onPress={() => selectAddress(addr)}
                                                >
                                                    <View style={styles.addressOptionContent}>
                                                        <Text style={[styles.addressOptionLabel, { color: theme.text }]}>
                                                            {addr.label}
                                                            {addr.isDefault && (
                                                                <Text style={{ color: theme.accent }}> ★</Text>
                                                            )}
                                                        </Text>
                                                        <Text style={[styles.addressOptionDetail, { color: theme.textSecondary }]} numberOfLines={1}>
                                                            {addr.street}, {addr.city}
                                                        </Text>
                                                    </View>
                                                    {selectedAddressId === addr.id && (
                                                        <Check size={18} color={theme.accent} />
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}

                                    <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                                    <Text style={[styles.orText, { color: theme.textTertiary }]}>
                                        {t('orEnterManually') || 'Or enter manually'}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>{t('fullName')}</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder="John Doe"
                                    placeholderTextColor={theme.textTertiary}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>{t('streetAddress')}</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
                                    value={address}
                                    onChangeText={setAddress}
                                    placeholder="123 Main Street"
                                    placeholderTextColor={theme.textTertiary}
                                />
                            </View>
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 2 }]}>
                                    <Text style={[styles.label, { color: theme.textSecondary }]}>{t('city')}</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
                                        value={city}
                                        onChangeText={setCity}
                                        placeholder="Almaty"
                                        placeholderTextColor={theme.textTertiary}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                                    <Text style={[styles.label, { color: theme.textSecondary }]}>{t('zipCode')}</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
                                        value={zipCode}
                                        onChangeText={setZipCode}
                                        placeholder="050000"
                                        placeholderTextColor={theme.textTertiary}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />
                                </View>
                            </View>
                        </Section>
                    )}

                    {step === 2 && (
                        <Section title={t('paymentDetails')} theme={theme}>
                            <View style={styles.inputGroup}>
                                <View style={styles.labelRow}>
                                    <Text style={[styles.label, { color: theme.textSecondary }]}>{t('cardNumber')}</Text>
                                    {cardType && (
                                        <View style={[styles.cardTypeBadge, { backgroundColor: theme.accentGlow }]}>
                                            <Text style={[styles.cardTypeText, { color: theme.accent }]}>{cardType}</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={[styles.cardInputWrapper, { backgroundColor: theme.inputBackground }]}>
                                    <CreditCard size={20} color={theme.textTertiary} />
                                    <TextInput
                                        style={[styles.cardInput, { color: theme.text }]}
                                        value={cardNumber}
                                        onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                                        placeholder="1234 5678 9012 3456"
                                        placeholderTextColor={theme.textTertiary}
                                        keyboardType="number-pad"
                                        maxLength={19}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={[styles.label, { color: theme.textSecondary }]}>
                                        {t('expiry')}
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { backgroundColor: theme.inputBackground, color: theme.text },
                                            expiryError && { borderColor: theme.error, borderWidth: 1 }
                                        ]}
                                        value={expiry}
                                        onChangeText={(t) => setExpiry(formatExpiry(t))}
                                        placeholder="12/26"
                                        placeholderTextColor={theme.textTertiary}
                                        keyboardType="number-pad"
                                        maxLength={5}
                                    />
                                    {expiryError ? (
                                        <Text style={[styles.errorText, { color: theme.error }]}>{expiryError}</Text>
                                    ) : null}
                                </View>
                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                                    <Text style={[styles.label, { color: theme.textSecondary }]}>{t('cvv')}</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
                                        value={cvv}
                                        onChangeText={setCvv}
                                        placeholder="123"
                                        placeholderTextColor={theme.textTertiary}
                                        keyboardType="number-pad"
                                        maxLength={4}
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>{t('nameOnCard')}</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
                                    value={cardName}
                                    onChangeText={setCardName}
                                    placeholder="JOHN DOE"
                                    placeholderTextColor={theme.textTertiary}
                                    autoCapitalize="characters"
                                />
                            </View>

                            <View style={[styles.secureRow, { backgroundColor: theme.accentGlow }]}>
                                <Lock size={16} color={theme.accent} />
                                <Text style={[styles.secureText, { color: theme.accent }]}>
                                    {t('securePayment')}
                                </Text>
                            </View>
                        </Section>
                    )}

                    {step === 3 && (
                        <>
                            <Section title={t('orderItems')} theme={theme}>
                                {cartItems.map((item: any, idx: number) => (
                                    <View
                                        key={item.cartItemId}
                                        style={[
                                            styles.orderItem,
                                            idx < cartItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
                                        ]}
                                    >
                                        <View style={[styles.orderEmoji, { backgroundColor: theme.inputBackground }]}>
                                            <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                                        </View>
                                        <View style={styles.orderItemInfo}>
                                            <Text style={[styles.orderItemName, { color: theme.text }]} numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                            <Text style={[styles.orderItemMeta, { color: theme.textSecondary }]}>
                                                {t('size')}: {item.selectedSize} • {t('qty')}: {item.quantity}
                                            </Text>
                                        </View>
                                        <Text style={[styles.orderItemPrice, { color: theme.text }]}>
                                            {formatPrice(item.price * item.quantity)}
                                        </Text>
                                    </View>
                                ))}
                            </Section>

                            <Section title={t('delivery')} theme={theme}>
                                <View style={styles.reviewRow}>
                                    <MapPin size={18} color={theme.accent} />
                                    <Text style={[styles.reviewText, { color: theme.text }]}>
                                        {fullName}{'\n'}{address}{'\n'}{city}, {zipCode}
                                    </Text>
                                </View>
                            </Section>

                            <Section title={t('payment')} theme={theme}>
                                <View style={styles.reviewRow}>
                                    <CreditCard size={18} color={theme.accent} />
                                    <View>
                                        <Text style={[styles.reviewText, { color: theme.text }]}>
                                            {cardType} •••• {cardNumber.slice(-4)}
                                        </Text>
                                        <Text style={[styles.reviewSubtext, { color: theme.textSecondary }]}>
                                            {t('expires')} {expiry}
                                        </Text>
                                    </View>
                                </View>
                            </Section>
                        </>
                    )}

                    <LinearGradient
                        colors={isDark ? ['#141414', '#0A0A0A'] : ['#FFFFFF', '#FAF9F7']}
                        style={styles.totalsCard}
                    >
                        <View style={styles.totalRow}>
                            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>{t('subtotal')}</Text>
                            <Text style={[styles.totalValue, { color: theme.text }]}>{formatPrice(subtotal)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>{t('shipping')}</Text>
                            <Text style={[styles.totalValue, { color: shipping === 0 ? theme.accent : theme.text }]}>
                                {shipping === 0 ? t('free') : formatPrice(shipping)}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>{t('tax')}</Text>
                            <Text style={[styles.totalValue, { color: theme.text }]}>{formatPrice(tax)}</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <View style={styles.totalRow}>
                            <Text style={[styles.grandTotalLabel, { color: theme.text }]}>{t('total')}</Text>
                            <Text style={[styles.grandTotalValue, { color: theme.accent }]}>{formatPrice(total)}</Text>
                        </View>
                    </LinearGradient>
                </Animated.ScrollView>

                <View style={[styles.footer, { backgroundColor: theme.card }]}>
                    <Button
                        title={step < 3 ? t('continueBtn') : t('placeOrder')}
                        variant="primary"
                        onPress={step < 3 ? handleNext : handlePlaceOrder}
                        loading={loading}
                        size="large"
                        icon={null}
                        style={null}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
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
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumber: {
        fontSize: 13,
        fontWeight: '800',
    },
    stepLine: {
        width: 50,
        height: 3,
        borderRadius: 2,
    },
    scrollContent: {
        paddingBottom: 140,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 10,
        marginLeft: 4,
    },
    sectionContent: {
        borderRadius: 20,
        padding: 18,
    },
    inputGroup: {
        marginBottom: 18,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
    },
    cardTypeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
    },
    cardTypeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    input: {
        height: 54,
        borderRadius: 14,
        paddingHorizontal: 18,
        fontSize: 16,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
    },
    cardInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        paddingHorizontal: 18,
        height: 54,
    },
    cardInput: {
        flex: 1,
        marginLeft: 14,
        fontSize: 16,
        fontWeight: '500',
    },
    errorText: {
        fontSize: 11,
        marginTop: 6,
        fontWeight: '600',
    },
    secureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        marginTop: 8,
    },
    secureText: {
        fontSize: 12,
        marginLeft: 10,
        fontWeight: '600',
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    orderEmoji: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderItemInfo: {
        flex: 1,
        marginLeft: 14,
    },
    orderItemName: {
        fontSize: 14,
        fontWeight: '700',
    },
    orderItemMeta: {
        fontSize: 12,
        marginTop: 4,
    },
    orderItemPrice: {
        fontSize: 15,
        fontWeight: '700',
    },
    reviewRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    reviewText: {
        fontSize: 14,
        marginLeft: 14,
        lineHeight: 22,
        fontWeight: '500',
    },
    reviewSubtext: {
        fontSize: 12,
        marginLeft: 14,
        marginTop: 2,
    },
    totalsCard: {
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    totalValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginVertical: 14,
    },
    grandTotalLabel: {
        fontSize: 17,
        fontWeight: '700',
    },
    grandTotalValue: {
        fontSize: 24,
        fontWeight: '900',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 34,
    },
    // Saved Address Picker Styles
    savedAddressSection: {
        marginBottom: 16,
    },
    savedAddressLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    addressPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
        gap: 10,
    },
    addressPickerText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },
    addressDropdown: {
        marginTop: 8,
        borderRadius: 14,
        borderWidth: 1,
        overflow: 'hidden',
    },
    addressOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    addressOptionContent: {
        flex: 1,
    },
    addressOptionLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
    addressOptionDetail: {
        fontSize: 13,
        marginTop: 2,
    },
    dividerLine: {
        height: 1,
        marginVertical: 16,
    },
    orText: {
        fontSize: 12,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
