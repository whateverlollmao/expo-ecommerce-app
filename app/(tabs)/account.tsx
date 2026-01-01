import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    Modal,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
    User,
    Bell,
    Package,
    LogOut,
    ChevronRight,
    Moon,
    Sun,
    Heart,
    Headphones,
    HelpCircle,
    FileText,
    Globe,
    Check,
    X,
    MapPin,
    Fingerprint,
    Palette,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { InsightsCard, useShoppingInsights } from '../../components/EliteUI';

function SettingsItem({ icon: Icon, title, subtitle, onPress, rightComponent, theme }: any) {
    return (
        <TouchableOpacity
            style={[styles.settingsItem, { backgroundColor: theme.card }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={[styles.settingsIcon, { backgroundColor: theme.accentGlow }]}>
                <Icon size={20} color={theme.accent} />
            </View>
            <View style={styles.settingsContent}>
                <Text style={[styles.settingsTitle, { color: theme.text }]}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.settingsSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
                )}
            </View>
            {rightComponent || <ChevronRight size={20} color={theme.textTertiary} />}
        </TouchableOpacity>
    );
}

export default function AccountScreen() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
    const { wishlist } = useCart();
    const { t, language, changeLanguage, languageNames, languageFlags, availableLanguages } = useLanguage();
    const { currentCurrency } = useCurrency();
    const { insights } = useShoppingInsights();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    // Load saved profile image on mount
    useEffect(() => {
        loadProfileImage();
    }, []);

    const loadProfileImage = async () => {
        try {
            const saved = await AsyncStorage.getItem('@profile_image');
            if (saved) setProfileImage(saved);
        } catch (e) {
            console.log('Error loading profile image:', e);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setProfileImage(uri);
            // Save to AsyncStorage
            try {
                await AsyncStorage.setItem('@profile_image', uri);
            } catch (e) {
                console.log('Error saving profile image:', e);
            }
        }
    };

    const handleLogOut = () => {
        Alert.alert(
            t('logOut'),
            t('logOutConfirm'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('logOut'),
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/');
                    }
                },
            ]
        );
    };

    const handleLanguageSelect = (lang: string) => {
        changeLanguage(lang);
        setShowLanguageModal(false);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                style={[styles.avatar, { borderColor: theme.accent }]}
                            />
                        ) : (
                            <LinearGradient
                                colors={[theme.accent, theme.accentDark]}
                                style={[styles.avatar, { borderWidth: 0 }]}
                            >
                                <Text style={styles.avatarText}>
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </Text>
                            </LinearGradient>
                        )}
                        <View style={[styles.editBadge, { backgroundColor: theme.accent }]}>
                            <Text style={styles.editBadgeText}>✏️</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.userName, { color: theme.text }]}>
                        {user?.name || t('guestUser')}
                    </Text>
                    <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                        {user?.email || t('notSignedInSubtitle')}
                    </Text>
                </View>

                {/* Personal Insights */}
                <InsightsCard insights={insights} theme={theme} t={t} />

                {/* Account Settings */}
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{t('account').toUpperCase()}</Text>
                <View style={styles.settingsGroup}>
                    <SettingsItem
                        icon={User}
                        title={t('editProfile')}
                        subtitle={t('nameEmailPhone')}
                        onPress={() => router.push('/edit-profile')}
                        theme={theme}
                    />
                    <SettingsItem
                        icon={Heart}
                        title={t('wishlist')}
                        subtitle={`${wishlist.length} ${wishlist.length === 1 ? t('savedItem') : t('savedItems')}`}
                        onPress={() => router.push('/wishlist')}
                        theme={theme}
                    />
                    <SettingsItem
                        icon={Package}
                        title={t('orderHistory')}
                        subtitle={t('viewPastPurchases')}
                        onPress={() => router.push('/order-history')}
                        theme={theme}
                    />
                    <SettingsItem
                        icon={Bell}
                        title={t('notifications')}
                        subtitle={t('pushEmailSettings')}
                        onPress={() => router.push('/notifications-settings')}
                        theme={theme}
                    />
                </View>

                {/* Preferences */}
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{t('preferences')}</Text>
                <View style={styles.settingsGroup}>
                    <SettingsItem
                        icon={isDark ? Moon : Sun}
                        title={t('darkMode')}
                        subtitle={isDark ? t('darkModeOn') : t('darkModeOff')}
                        onPress={toggleTheme}
                        theme={theme}
                        rightComponent={
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: theme.border, true: theme.accent }}
                                thumbColor="#FFFFFF"
                            />
                        }
                    />
                    <SettingsItem
                        icon={Globe}
                        title={t('language')}
                        subtitle={`${languageFlags[language]} ${languageNames[language]}`}
                        onPress={() => setShowLanguageModal(true)}
                        theme={theme}
                    />
                    <SettingsItem
                        icon={Globe}
                        title={t('currency') || 'Currency'}
                        subtitle={`${currentCurrency?.flag} ${currentCurrency?.code} (${currentCurrency?.symbol})`}
                        onPress={() => router.push('/currency-select')}
                        theme={theme}
                    />
                </View>

                {/* New Features Section */}
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                    {t('features') || 'FEATURES'}
                </Text>
                <View style={styles.settingsGroup}>
                    <SettingsItem
                        icon={MapPin}
                        title={t('savedAddresses') || 'Saved Addresses'}
                        subtitle={t('manageAddresses') || 'Manage delivery addresses'}
                        onPress={() => router.push('/addresses')}
                        theme={theme}
                    />
                    <SettingsItem
                        icon={Fingerprint}
                        title={t('biometricLogin') || 'Face ID / Touch ID'}
                        subtitle={t('biometricLoginDesc') || 'Biometric authentication'}
                        onPress={() => Alert.alert('Biometric', 'Go to Settings > Privacy & Security to enable biometrics')}
                        theme={theme}
                    />
                </View>

                {/* Support & Help */}
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{t('support')}</Text>
                <View style={styles.settingsGroup}>
                    <SettingsItem
                        icon={Headphones}
                        title={t('supportTitle')}
                        subtitle={t('whatsappEmailTelegram')}
                        onPress={() => router.push('/support')}
                        theme={theme}
                    />
                    <SettingsItem
                        icon={HelpCircle}
                        title={t('help')}
                        subtitle={t('howToPurchase')}
                        onPress={() => router.push('/help')}
                        theme={theme}
                    />
                    <SettingsItem
                        icon={FileText}
                        title={t('legalDocuments')}
                        subtitle={t('privacyCopyright')}
                        onPress={() => router.push('/legal')}
                        theme={theme}
                    />
                </View>

                {/* Log Out */}
                <TouchableOpacity
                    style={[styles.logOutButton, { backgroundColor: theme.error + '15' }]}
                    onPress={handleLogOut}
                >
                    <LogOut size={20} color={theme.error} />
                    <Text style={[styles.logOutText, { color: theme.error }]}>{t('logOut')}</Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={[styles.version, { color: theme.textTertiary }]}>
                    LUXE v1.0.0
                </Text>
            </ScrollView>

            {/* Language Modal */}
            <Modal
                visible={showLanguageModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowLanguageModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>{t('language')}</Text>
                            <TouchableOpacity
                                onPress={() => setShowLanguageModal(false)}
                                style={[styles.closeButton, { backgroundColor: theme.inputBackground }]}
                            >
                                <X size={20} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        {availableLanguages.map((lang: string) => (
                            <TouchableOpacity
                                key={lang}
                                style={[
                                    styles.languageOption,
                                    { backgroundColor: language === lang ? theme.accentGlow : 'transparent' }
                                ]}
                                onPress={() => handleLanguageSelect(lang)}
                            >
                                <Text style={styles.languageFlag}>{languageFlags[lang]}</Text>
                                <Text style={[styles.languageName, { color: theme.text }]}>
                                    {languageNames[lang]}
                                </Text>
                                {language === lang && (
                                    <Check size={20} color={theme.accent} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 140,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 28,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#000',
    },
    editBadgeText: {
        fontSize: 14,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 16,
    },
    userEmail: {
        fontSize: 14,
        marginTop: 4,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
        marginTop: 24,
        marginBottom: 14,
        marginLeft: 4,
    },
    settingsGroup: {
        gap: 10,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
    },
    settingsIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    settingsContent: {
        flex: 1,
    },
    settingsTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    settingsSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    logOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 16,
        marginTop: 32,
        gap: 10,
    },
    logOutText: {
        fontSize: 16,
        fontWeight: '700',
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 16,
        marginBottom: 10,
    },
    languageFlag: {
        fontSize: 28,
        marginRight: 16,
    },
    languageName: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
});
