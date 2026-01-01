import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

// ═══════════════════════════════════════════════════════════════════════════
// LUXURY AUTH SCREEN - Chanel/Celine inspired
// ═══════════════════════════════════════════════════════════════════════════

const AppleLogo = ({ dark }: { dark?: boolean }) => (
    <Text style={{ fontSize: 18, color: dark ? '#000' : '#FFF' }}></Text>
);

const GoogleLogo = () => (
    <View style={styles.googleIcon}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#4285F4' }}>G</Text>
    </View>
);

export default function AuthScreen() {
    const router = useRouter();
    const { signInWithApple, signInWithGoogle, isAuthenticated } = useAuth();
    const { theme, supportsLiquidGlass, isDark } = useTheme();
    const { t } = useLanguage();
    const [videoError, setVideoError] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);

    // Slow, elegant animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const contentSlide = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)/home');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Slow, sophisticated entrance
        Animated.sequence([
            Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.timing(contentSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

    const handleAppleSignIn = async () => {
        if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setLoading('apple');
        try {
            await signInWithApple();
            router.replace('/(tabs)/home');
        } catch (e) {
            console.log(e);
        }
        setLoading(null);
    };

    const handleGoogleSignIn = async () => {
        if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setLoading('google');
        try {
            await signInWithGoogle();
            router.replace('/(tabs)/home');
        } catch (e) {
            console.log(e);
        }
        setLoading(null);
    };

    const handleEmailSignUp = () => {
        if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/sign-up');
    };

    return (
        <View style={styles.container}>
            {/* Background */}
            {!videoError ? (
                <Video
                    source={require('../assets/test.mp4')}
                    style={StyleSheet.absoluteFill}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    shouldPlay
                    isMuted
                    onError={() => setVideoError(true)}
                />
            ) : (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]} />
            )}

            {/* Subtle overlay */}
            <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
            />

            {/* Content */}
            <SafeAreaView style={styles.content}>
                {/* Logo - Centered, elegant */}
                <Animated.View style={[styles.logoSection, { opacity: logoOpacity }]}>
                    <Text style={styles.logo}>LUXE</Text>
                    <Text style={styles.tagline}>ATELIER</Text>
                </Animated.View>

                {/* Bottom Section */}
                <Animated.View style={[
                    styles.bottomSection,
                    { opacity: fadeAnim, transform: [{ translateY: contentSlide }] }
                ]}>
                    {/* Welcome Text */}
                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeText}>{t('welcome')}</Text>
                        <Text style={styles.descText}>{t('welcomeSubtitle')}</Text>
                    </View>

                    {/* Buttons - Clean, minimal */}
                    <View style={styles.buttons}>
                        <Button
                            title={t('continueWithApple')}
                            variant="apple"
                            icon={<AppleLogo dark={isDark} />}
                            onPress={handleAppleSignIn}
                            loading={loading === 'apple'}
                        />

                        <Button
                            title={t('continueWithGoogle')}
                            variant="google"
                            icon={<GoogleLogo />}
                            onPress={handleGoogleSignIn}
                            loading={loading === 'google'}
                        />

                        <View style={styles.dividerRow}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.divider} />
                        </View>

                        <Button
                            title={t('signUpWithEmail')}
                            variant="outline"
                            onPress={handleEmailSignUp}
                        />
                    </View>

                    {/* Terms */}
                    <View style={styles.terms}>
                        <Text style={styles.termsText}>{t('termsAgree')} </Text>
                        <TouchableOpacity onPress={() => router.push('/terms')}>
                            <Text style={[styles.termsLink, { color: theme.accent }]}>{t('terms')}</Text>
                        </TouchableOpacity>
                        <Text style={styles.termsText}> {t('and')} </Text>
                        <TouchableOpacity onPress={() => router.push('/privacy')}>
                            <Text style={[styles.termsLink, { color: theme.accent }]}>{t('privacy')}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    logoSection: {
        alignItems: 'center',
        marginTop: height * 0.15,
    },
    logo: {
        fontSize: 56,
        fontWeight: '200', // Light weight - luxury feel
        color: '#FFFFFF',
        letterSpacing: 24,
    },
    tagline: {
        fontSize: 12,
        fontWeight: '300',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 8,
        marginTop: 12,
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    welcomeSection: {
        marginBottom: 32,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '300',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 12,
    },
    descText: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    buttons: {
        gap: 12,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    divider: {
        flex: 1,
        height: 0.5,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    dividerText: {
        fontSize: 11,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 2,
        marginHorizontal: 16,
    },
    googleIcon: {
        width: 20,
        height: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    terms: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 28,
    },
    termsText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 0.3,
    },
    termsLink: {
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
});
