import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Package, Gift, Mail, Sparkles, AlertCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

function SettingToggle({ icon: Icon, title, description, value, onValueChange, theme }: any) {
    return (
        <View style={[styles.settingItem, { backgroundColor: theme.card }]}>
            <View style={[styles.settingIcon, { backgroundColor: theme.accentGlow }]}>
                <Icon size={20} color={theme.accent} />
            </View>
            <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
                <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="#FFFFFF"
            />
        </View>
    );
}

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';

export default function NotificationsSettingsScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useLanguage();

    const [pushEnabled, setPushEnabled] = useState(true);
    const [orderUpdates, setOrderUpdates] = useState(true);
    const [promotions, setPromotions] = useState(false);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [newArrivals, setNewArrivals] = useState(true);
    const [backInStock, setBackInStock] = useState(true);

    // Load settings from AsyncStorage
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
            if (saved) {
                const settings = JSON.parse(saved);
                setPushEnabled(settings.pushEnabled ?? true);
                setOrderUpdates(settings.orderUpdates ?? true);
                setPromotions(settings.promotions ?? false);
                setEmailEnabled(settings.emailEnabled ?? true);
                setNewArrivals(settings.newArrivals ?? true);
                setBackInStock(settings.backInStock ?? true);
            }
        } catch (error) {
            console.log('Error loading notification settings:', error);
        }
    };

    const saveSettings = async (key: string, value: boolean) => {
        try {
            const saved = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
            const settings = saved ? JSON.parse(saved) : {};
            settings[key] = value;
            await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.log('Error saving notification settings:', error);
        }
    };

    const handleToggle = (setter: Function, key: string) => (value: boolean) => {
        setter(value);
        saveSettings(key, value);
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('notificationSettings')}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{t('push')}</Text>

                <SettingToggle
                    icon={Bell}
                    title={t('pushNotifications')}
                    description={t('pushNotificationsDesc')}
                    value={pushEnabled}
                    onValueChange={handleToggle(setPushEnabled, 'pushEnabled')}
                    theme={theme}
                />

                <SettingToggle
                    icon={Package}
                    title={t('orderUpdates')}
                    description={t('orderUpdatesDesc')}
                    value={orderUpdates}
                    onValueChange={handleToggle(setOrderUpdates, 'orderUpdates')}
                    theme={theme}
                />

                <SettingToggle
                    icon={Gift}
                    title={t('promotions')}
                    description={t('promotionsDesc')}
                    value={promotions}
                    onValueChange={handleToggle(setPromotions, 'promotions')}
                    theme={theme}
                />

                <SettingToggle
                    icon={AlertCircle}
                    title={t('backInStock') || 'Back in Stock'}
                    description={t('backInStockDesc') || 'Get notified when items are available again'}
                    value={backInStock}
                    onValueChange={handleToggle(setBackInStock, 'backInStock')}
                    theme={theme}
                />

                <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: 32 }]}>{t('emailSection')}</Text>

                <SettingToggle
                    icon={Mail}
                    title={t('emailNotifications')}
                    description={t('emailNotificationsDesc')}
                    value={emailEnabled}
                    onValueChange={handleToggle(setEmailEnabled, 'emailEnabled')}
                    theme={theme}
                />

                <SettingToggle
                    icon={Sparkles}
                    title={t('newArrivals')}
                    description={t('newArrivalsDesc')}
                    value={newArrivals}
                    onValueChange={handleToggle(setNewArrivals, 'newArrivals')}
                    theme={theme}
                />
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
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    settingIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    settingDesc: {
        fontSize: 12,
    },
});
