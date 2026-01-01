import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/Button';

export default function SignUpScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const { signUp } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            Alert.alert(t('error'), t('fillAllFields'));
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(t('error'), 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert(t('error'), 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await signUp(name, email, password);
            router.replace('/(tabs)/home');
        } catch (e) {
            Alert.alert(t('error'), e.message);
        }
        setLoading(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <SafeAreaView style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.backButton, { backgroundColor: theme.card }]}
                    >
                        <ArrowLeft size={22} color={theme.text} />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Title */}
                        <View style={styles.titleSection}>
                            <LinearGradient
                                colors={[theme.accent, theme.accentLight]}
                                style={styles.logoBadge}
                            >
                                <Text style={styles.logo}>LUXE</Text>
                            </LinearGradient>
                            <Text style={[styles.title, { color: theme.text }]}>{t('createAccount')}</Text>
                            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('joinLuxe')}</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            {/* Name */}
                            <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
                                <User size={20} color={theme.textTertiary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder={t('name')}
                                    placeholderTextColor={theme.textTertiary}
                                />
                            </View>

                            {/* Email */}
                            <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
                                <Mail size={20} color={theme.textTertiary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder={t('email')}
                                    placeholderTextColor={theme.textTertiary}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Password */}
                            <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
                                <Lock size={20} color={theme.textTertiary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder={t('password')}
                                    placeholderTextColor={theme.textTertiary}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff size={20} color={theme.textTertiary} />
                                    ) : (
                                        <Eye size={20} color={theme.textTertiary} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Confirm Password */}
                            <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
                                <Lock size={20} color={theme.textTertiary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder={t('confirmPassword')}
                                    placeholderTextColor={theme.textTertiary}
                                    secureTextEntry={!showPassword}
                                />
                            </View>

                            <Button
                                title={t('signUp')}
                                variant="primary"
                                size="large"
                                onPress={handleSignUp}
                                loading={loading}
                            />

                            <TouchableOpacity
                                style={styles.signInLink}
                                onPress={() => router.back()}
                            >
                                <Text style={[styles.signInText, { color: theme.textSecondary }]}>
                                    {t('alreadyHaveAccount')} <Text style={{ color: theme.accent, fontWeight: '700' }}>{t('signIn')}</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 60,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoBadge: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 14,
        marginBottom: 24,
    },
    logo: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
    },
    form: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 18,
        height: 56,
    },
    input: {
        flex: 1,
        marginLeft: 14,
        fontSize: 16,
        fontWeight: '500',
    },
    signInLink: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    signInText: {
        fontSize: 14,
    },
});
