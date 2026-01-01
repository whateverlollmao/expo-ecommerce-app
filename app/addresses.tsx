import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, MapPin, Check, Trash2, Edit2, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const ADDRESSES_KEY = '@saved_addresses';

interface Address {
    id: string;
    name: string;
    phone: string;
    street: string;
    city: string;
    country: string;
    isDefault: boolean;
}

export default function AddressesScreen() {
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const { t } = useLanguage();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const saved = await AsyncStorage.getItem(ADDRESSES_KEY);
            if (saved) {
                setAddresses(JSON.parse(saved));
            }
        } catch (error) {
            console.log('Error loading addresses:', error);
        }
    };

    const saveAddresses = async (newAddresses: Address[]) => {
        try {
            await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(newAddresses));
            setAddresses(newAddresses);
        } catch (error) {
            console.log('Error saving addresses:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setPhone('');
        setStreet('');
        setCity('');
        setCountry('');
        setEditingAddress(null);
    };

    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setName(address.name);
        setPhone(address.phone);
        setStreet(address.street);
        setCity(address.city);
        setCountry(address.country);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!name || !phone || !street || !city || !country) {
            Alert.alert(t('error') || 'Error', t('fillAllFields') || 'Please fill all fields');
            return;
        }

        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        let newAddresses: Address[];

        if (editingAddress) {
            // Update existing
            newAddresses = addresses.map(addr =>
                addr.id === editingAddress.id
                    ? { ...addr, name, phone, street, city, country }
                    : addr
            );
        } else {
            // Add new
            const newAddress: Address = {
                id: Date.now().toString(),
                name,
                phone,
                street,
                city,
                country,
                isDefault: addresses.length === 0,
            };
            newAddresses = [...addresses, newAddress];
        }

        saveAddresses(newAddresses);
        setShowModal(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            t('deleteAddress') || 'Delete Address',
            t('deleteAddressConfirm') || 'Are you sure you want to delete this address?',
            [
                { text: t('cancel') || 'Cancel', style: 'cancel' },
                {
                    text: t('delete') || 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        const newAddresses = addresses.filter(addr => addr.id !== id);
                        saveAddresses(newAddresses);
                        if (Platform.OS === 'ios') {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        }
                    }
                },
            ]
        );
    };

    const handleSetDefault = (id: string) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        const newAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id,
        }));
        saveAddresses(newAddresses);
    };

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
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    {t('savedAddresses') || 'Saved Addresses'}
                </Text>
                <TouchableOpacity
                    onPress={handleAddNew}
                    style={[styles.addButton, { backgroundColor: theme.accentGlow }]}
                >
                    <Plus size={22} color={theme.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {addresses.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={[styles.emptyIcon, { backgroundColor: theme.accentGlow }]}>
                            <MapPin size={48} color={theme.accent} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>
                            {t('noAddresses') || 'No saved addresses'}
                        </Text>
                        <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                            {t('addAddressHint') || 'Add an address for faster checkout'}
                        </Text>
                        <TouchableOpacity onPress={handleAddNew} activeOpacity={0.9}>
                            <LinearGradient
                                colors={[theme.gradientStart, theme.gradientEnd]}
                                style={styles.addFirstButton}
                            >
                                <Plus size={20} color="#FFF" />
                                <Text style={styles.addFirstText}>
                                    {t('addAddress') || 'Add Address'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    addresses.map((address) => (
                        <View
                            key={address.id}
                            style={[
                                styles.addressCard,
                                { backgroundColor: theme.card },
                                address.isDefault && { borderColor: theme.accent, borderWidth: 2 }
                            ]}
                        >
                            {address.isDefault && (
                                <View style={[styles.defaultBadge, { backgroundColor: theme.accentGlow }]}>
                                    <Check size={12} color={theme.accent} />
                                    <Text style={[styles.defaultText, { color: theme.accent }]}>
                                        {t('default') || 'Default'}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.addressContent}>
                                <Text style={[styles.addressName, { color: theme.text }]}>
                                    {address.name}
                                </Text>
                                <Text style={[styles.addressPhone, { color: theme.textSecondary }]}>
                                    {address.phone}
                                </Text>
                                <Text style={[styles.addressStreet, { color: theme.textSecondary }]}>
                                    {address.street}
                                </Text>
                                <Text style={[styles.addressCity, { color: theme.textSecondary }]}>
                                    {address.city}, {address.country}
                                </Text>
                            </View>
                            <View style={styles.addressActions}>
                                {!address.isDefault && (
                                    <TouchableOpacity
                                        onPress={() => handleSetDefault(address.id)}
                                        style={[styles.actionButton, { backgroundColor: theme.accentGlow }]}
                                    >
                                        <Check size={16} color={theme.accent} />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => handleEdit(address)}
                                    style={[styles.actionButton, { backgroundColor: theme.inputBackground }]}
                                >
                                    <Edit2 size={16} color={theme.text} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleDelete(address.id)}
                                    style={[styles.actionButton, { backgroundColor: theme.error + '20' }]}
                                >
                                    <Trash2 size={16} color={theme.error} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Add/Edit Modal */}
            <Modal visible={showModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>
                                {editingAddress ? (t('editAddress') || 'Edit Address') : (t('addAddress') || 'Add Address')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => { setShowModal(false); resetForm(); }}
                                style={[styles.modalClose, { backgroundColor: theme.card }]}
                            >
                                <X size={20} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>
                                    {t('fullName') || 'Full Name'}
                                </Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="John Doe"
                                    placeholderTextColor={theme.textTertiary}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>
                                    {t('phoneNumber') || 'Phone Number'}
                                </Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="+7 (701) 234-5678"
                                    placeholderTextColor={theme.textTertiary}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>
                                    {t('streetAddress') || 'Street Address'}
                                </Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
                                    value={street}
                                    onChangeText={setStreet}
                                    placeholder="123 Main Street, Apt 4B"
                                    placeholderTextColor={theme.textTertiary}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>
                                    {t('city') || 'City'}
                                </Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
                                    value={city}
                                    onChangeText={setCity}
                                    placeholder="Almaty"
                                    placeholderTextColor={theme.textTertiary}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>
                                    {t('country') || 'Country'}
                                </Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
                                    value={country}
                                    onChangeText={setCountry}
                                    placeholder="Kazakhstan"
                                    placeholderTextColor={theme.textTertiary}
                                />
                            </View>
                        </ScrollView>

                        <TouchableOpacity onPress={handleSave} activeOpacity={0.9}>
                            <LinearGradient
                                colors={[theme.gradientStart, theme.gradientEnd]}
                                style={styles.saveButton}
                            >
                                <Text style={styles.saveButtonText}>
                                    {t('save') || 'Save'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
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
    headerTitle: { fontSize: 18, fontWeight: '800' },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: { padding: 20, paddingBottom: 40 },
    emptyContainer: { alignItems: 'center', paddingTop: 60 },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
    emptySubtitle: { fontSize: 15, textAlign: 'center', marginBottom: 32 },
    addFirstButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: 16,
        gap: 10,
    },
    addFirstText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    addressCard: {
        padding: 18,
        borderRadius: 18,
        marginBottom: 14,
    },
    defaultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        gap: 4,
        marginBottom: 12,
    },
    defaultText: { fontSize: 11, fontWeight: '700' },
    addressContent: { marginBottom: 16 },
    addressName: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
    addressPhone: { fontSize: 14, marginBottom: 8 },
    addressStreet: { fontSize: 14, marginBottom: 2 },
    addressCity: { fontSize: 14 },
    addressActions: { flexDirection: 'row', gap: 10 },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    modalTitle: { fontSize: 22, fontWeight: '800' },
    modalClose: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formGroup: { marginBottom: 20 },
    label: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 8,
    },
    input: {
        padding: 16,
        borderRadius: 14,
        fontSize: 16,
    },
    saveButton: {
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
