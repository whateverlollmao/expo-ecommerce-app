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
import { ArrowLeft, Sun, Moon, Clock, Smartphone } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const THEME_SCHEDULE_KEY = '@theme_schedule';

type ThemeMode = 'manual' | 'system' | 'schedule';

export default function ThemeSettingsScreen() {
    const router = useRouter();
    const { theme, isDark, toggleTheme } = useTheme();
    const { t } = useLanguage();

    const [themeMode, setThemeMode] = useState<ThemeMode>('manual');
    const [darkModeStart, setDarkModeStart] = useState(new Date().setHours(20, 0, 0, 0));
    const [darkModeEnd, setDarkModeEnd] = useState(new Date().setHours(7, 0, 0, 0));
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem(THEME_SCHEDULE_KEY);
            if (saved) {
                const settings = JSON.parse(saved);
                setThemeMode(settings.mode || 'manual');
                if (settings.darkModeStart) setDarkModeStart(settings.darkModeStart);
                if (settings.darkModeEnd) setDarkModeEnd(settings.darkModeEnd);
            }
        } catch (error) {
            console.log('Error loading theme settings:', error);
        }
    };

    const saveSettings = async (mode: ThemeMode, start?: number, end?: number) => {
        try {
            await AsyncStorage.setItem(THEME_SCHEDULE_KEY, JSON.stringify({
                mode,
                darkModeStart: start || darkModeStart,
                darkModeEnd: end || darkModeEnd,
            }));
        } catch (error) {
            console.log('Error saving theme settings:', error);
        }
    };

    const handleModeChange = (mode: ThemeMode) => {
        if (Platform.OS === 'ios') {
            Haptics.selectionAsync();
        }
        setThemeMode(mode);
        saveSettings(mode);
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const ThemeModeOption = ({ mode, icon: Icon, title, description }: any) => {
        const isSelected = themeMode === mode;
        return (
            <TouchableOpacity
                onPress={() => handleModeChange(mode)}
                style={[
                    styles.modeOption,
                    { backgroundColor: theme.card },
                    isSelected && { borderColor: theme.accent, borderWidth: 2 }
                ]}
                activeOpacity={0.8}
            >
                <View style={[styles.modeIcon, { backgroundColor: isSelected ? theme.accentGlow : theme.inputBackground }]}>
                    <Icon size={24} color={isSelected ? theme.accent : theme.textSecondary} />
                </View>
                <View style={styles.modeContent}>
                    <Text style={[styles.modeTitle, { color: theme.text }]}>{title}</Text>
                    <Text style={[styles.modeDesc, { color: theme.textSecondary }]}>{description}</Text>
                </View>
                <View style={[
                    styles.radioOuter,
                    { borderColor: isSelected ? theme.accent : theme.border }
                ]}>
                    {isSelected && <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />}
                </View>
            </TouchableOpacity>
        );
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
                    {t('themeSettings') || 'Theme Settings'}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Current Theme Preview */}
                <LinearGradient
                    colors={isDark
                        ? ['#1A1A18', '#0F0F0E']
                        : ['#F8F6F3', '#EDE9E4']
                    }
                    style={styles.previewCard}
                >
                    <View style={styles.previewContent}>
                        {isDark ? <Moon size={32} color={theme.accent} /> : <Sun size={32} color={theme.accent} />}
                        <View>
                            <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>
                                {t('currentTheme') || 'Current Theme'}
                            </Text>
                            <Text style={[styles.previewValue, { color: theme.text }]}>
                                {isDark ? (t('darkMode') || 'Dark Mode') : (t('lightMode') || 'Light Mode')}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={toggleTheme}
                        style={[styles.toggleButton, { backgroundColor: theme.accent }]}
                    >
                        <Text style={styles.toggleButtonText}>{t('toggle') || 'Toggle'}</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Theme Mode Options */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    {t('themeModeTitle') || 'THEME MODE'}
                </Text>

                <ThemeModeOption
                    mode="manual"
                    icon={Sun}
                    title={t('manualMode') || 'Manual'}
                    description={t('manualModeDesc') || 'Manually switch between light and dark'}
                />

                <ThemeModeOption
                    mode="system"
                    icon={Smartphone}
                    title={t('systemMode') || 'Follow System'}
                    description={t('systemModeDesc') || 'Match your device appearance settings'}
                />

                <ThemeModeOption
                    mode="schedule"
                    icon={Clock}
                    title={t('scheduleMode') || 'Schedule'}
                    description={t('scheduleModeDesc') || 'Automatically switch at set times'}
                />

                {/* Schedule Options */}
                {themeMode === 'schedule' && (
                    <View style={[styles.scheduleContainer, { backgroundColor: theme.card }]}>
                        <Text style={[styles.scheduleTitle, { color: theme.text }]}>
                            {t('scheduleSettings') || 'Schedule Settings'}
                        </Text>

                        <TouchableOpacity
                            onPress={() => setShowStartPicker(true)}
                            style={[styles.timeRow, { borderBottomColor: theme.border }]}
                        >
                            <View style={styles.timeLabel}>
                                <Moon size={18} color={theme.textSecondary} />
                                <Text style={[styles.timeLabelText, { color: theme.text }]}>
                                    {t('darkModeStarts') || 'Dark Mode Starts'}
                                </Text>
                            </View>
                            <Text style={[styles.timeValue, { color: theme.accent }]}>
                                {formatTime(darkModeStart)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowEndPicker(true)}
                            style={styles.timeRow}
                        >
                            <View style={styles.timeLabel}>
                                <Sun size={18} color={theme.textSecondary} />
                                <Text style={[styles.timeLabelText, { color: theme.text }]}>
                                    {t('darkModeEnds') || 'Dark Mode Ends'}
                                </Text>
                            </View>
                            <Text style={[styles.timeValue, { color: theme.accent }]}>
                                {formatTime(darkModeEnd)}
                            </Text>
                        </TouchableOpacity>

                        {(showStartPicker || showEndPicker) && (
                            <DateTimePicker
                                value={new Date(showStartPicker ? darkModeStart : darkModeEnd)}
                                mode="time"
                                is24Hour={false}
                                display="spinner"
                                onChange={(event, selectedDate) => {
                                    if (showStartPicker) {
                                        setShowStartPicker(false);
                                        if (selectedDate) {
                                            setDarkModeStart(selectedDate.getTime());
                                            saveSettings(themeMode, selectedDate.getTime(), darkModeEnd);
                                        }
                                    } else {
                                        setShowEndPicker(false);
                                        if (selectedDate) {
                                            setDarkModeEnd(selectedDate.getTime());
                                            saveSettings(themeMode, darkModeStart, selectedDate.getTime());
                                        }
                                    }
                                }}
                            />
                        )}
                    </View>
                )}

                {/* Info Note */}
                <View style={[styles.infoNote, { backgroundColor: theme.accentGlow }]}>
                    <Text style={[styles.infoText, { color: theme.accent }]}>
                        💡 {t('themeInfo') || 'Changes will be applied immediately and saved automatically.'}
                    </Text>
                </View>
            </ScrollView>
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
    placeholder: { width: 44 },
    content: { padding: 20, paddingBottom: 40 },
    previewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 20,
        marginBottom: 28,
    },
    previewContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    previewLabel: { fontSize: 12, fontWeight: '600' },
    previewValue: { fontSize: 18, fontWeight: '800' },
    toggleButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
    },
    toggleButtonText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 14,
    },
    modeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 18,
        marginBottom: 12,
    },
    modeIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    modeContent: { flex: 1 },
    modeTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    modeDesc: { fontSize: 13 },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    scheduleContainer: {
        borderRadius: 18,
        padding: 18,
        marginTop: 8,
        marginBottom: 20,
    },
    scheduleTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    timeLabel: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    timeLabelText: { fontSize: 15, fontWeight: '600' },
    timeValue: { fontSize: 15, fontWeight: '700' },
    infoNote: {
        padding: 16,
        borderRadius: 14,
        marginTop: 10,
    },
    infoText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
