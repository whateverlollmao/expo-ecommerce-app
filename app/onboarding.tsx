import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { FloatingView } from '../components/Animations';

const { width, height } = Dimensions.get('window');

const ONBOARDING_KEY = '@onboarding_complete';

const slides = [
    {
        id: 1,
        emoji: '✨',
        titleKey: 'onboardingTitle1',
        descKey: 'onboardingDesc1',
        gradient: ['#10B981', '#059669'],
    },
    {
        id: 2,
        emoji: '👗',
        titleKey: 'onboardingTitle2',
        descKey: 'onboardingDesc2',
        gradient: ['#8B5CF6', '#7C3AED'],
    },
    {
        id: 3,
        emoji: '🚀',
        titleKey: 'onboardingTitle3',
        descKey: 'onboardingDesc3',
        gradient: ['#F59E0B', '#D97706'],
    },
    {
        id: 4,
        emoji: '💎',
        titleKey: 'onboardingTitle4',
        descKey: 'onboardingDesc4',
        gradient: ['#EC4899', '#DB2777'],
    },
];

const onboardingTranslations = {
    en: {
        onboardingTitle1: 'Welcome to LUXE',
        onboardingDesc1: 'Discover premium fashion curated just for you',
        onboardingTitle2: 'Exclusive Collections',
        onboardingDesc2: 'Access the latest designer pieces from around the world',
        onboardingTitle3: 'Lightning Fast Delivery',
        onboardingDesc3: 'Free express shipping on orders over $100',
        onboardingTitle4: 'Premium Experience',
        onboardingDesc4: 'Your satisfaction is our priority',
        skip: 'Skip',
        next: 'Next',
        getStarted: 'Get Started',
    },
    ru: {
        onboardingTitle1: 'Добро пожаловать в LUXE',
        onboardingDesc1: 'Откройте премиум моду, созданную для вас',
        onboardingTitle2: 'Эксклюзивные коллекции',
        onboardingDesc2: 'Доступ к новейшим дизайнерским вещам со всего мира',
        onboardingTitle3: 'Молниеносная доставка',
        onboardingDesc3: 'Бесплатная экспресс-доставка от $100',
        onboardingTitle4: 'Премиум опыт',
        onboardingDesc4: 'Ваше удовлетворение — наш приоритет',
        skip: 'Пропустить',
        next: 'Далее',
        getStarted: 'Начать',
    },
    kk: {
        onboardingTitle1: 'LUXE-ке қош келдіңіз',
        onboardingDesc1: 'Сіз үшін жасалған премиум сәнді ашыңыз',
        onboardingTitle2: 'Эксклюзивті коллекциялар',
        onboardingDesc2: 'Әлем бойынша дизайнер заттарына қол жеткізу',
        onboardingTitle3: 'Жылдам жеткізу',
        onboardingDesc3: '$100-ден тегін экспресс жеткізу',
        onboardingTitle4: 'Премиум тәжірибе',
        onboardingDesc4: 'Сіздің қанағаттануыңыз біздің басымдығымыз',
        skip: 'Өткізу',
        next: 'Келесі',
        getStarted: 'Бастау',
    },
};

export default function OnboardingScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { language } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slideRef = useRef(null);

    const t = (key) => onboardingTranslations[language]?.[key] || onboardingTranslations.en[key];

    const fadeAnims = slides.map(() => useRef(new Animated.Value(0)).current);
    const scaleAnims = slides.map(() => useRef(new Animated.Value(0.8)).current);

    useEffect(() => {
        // Animate first slide
        Animated.parallel([
            Animated.timing(fadeAnims[0], { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(scaleAnims[0], { toValue: 1, friction: 6, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleNext = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        if (currentIndex < slides.length - 1) {
            const nextIndex = currentIndex + 1;

            // Animate next slide
            Animated.parallel([
                Animated.timing(fadeAnims[nextIndex], { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.spring(scaleAnims[nextIndex], { toValue: 1, friction: 6, useNativeDriver: true }),
            ]).start();

            slideRef.current?.scrollTo({ x: width * nextIndex, animated: true });
            setCurrentIndex(nextIndex);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        handleComplete();
    };

    const handleComplete = async () => {
        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
        router.replace('/');
    };

    const renderSlide = (slide, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
        });

        return (
            <View key={slide.id} style={styles.slide}>
                <Animated.View style={[styles.slideContent, { opacity, transform: [{ scale }] }]}>
                    {/* Floating Emoji */}
                    <FloatingView duration={4000} range={15}>
                        <LinearGradient
                            colors={slide.gradient}
                            style={styles.emojiCircle}
                        >
                            <Text style={styles.emoji}>{slide.emoji}</Text>
                        </LinearGradient>
                    </FloatingView>

                    {/* Text */}
                    <Text style={[styles.title, { color: theme.text }]}>
                        {t(slide.titleKey)}
                    </Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>
                        {t(slide.descKey)}
                    </Text>
                </Animated.View>
            </View>
        );
    };

    const renderDots = () => (
        <View style={styles.dotsContainer}>
            {slides.map((_, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 30, 10],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                width: dotWidth,
                                opacity,
                                backgroundColor: theme.accent,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Skip Button */}
            <SafeAreaView style={styles.header}>
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                    <Text style={[styles.skipText, { color: theme.textSecondary }]}>{t('skip')}</Text>
                </TouchableOpacity>
            </SafeAreaView>

            {/* Slides */}
            <Animated.ScrollView
                ref={slideRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(newIndex);
                }}
            >
                {slides.map(renderSlide)}
            </Animated.ScrollView>

            {/* Footer */}
            <SafeAreaView style={styles.footer} edges={['bottom']}>
                {renderDots()}

                <TouchableOpacity onPress={handleNext} activeOpacity={0.9}>
                    <LinearGradient
                        colors={slides[currentIndex].gradient}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextText}>
                            {currentIndex === slides.length - 1 ? t('getStarted') : t('next')}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
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
        right: 0,
        zIndex: 10,
        paddingHorizontal: 24,
    },
    skipButton: {
        padding: 12,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
    },
    slide: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    slideContent: {
        alignItems: 'center',
    },
    emojiCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
    },
    emoji: {
        fontSize: 72,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 17,
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: 20,
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 20,
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    dot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    nextButton: {
        paddingHorizontal: 60,
        paddingVertical: 18,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 20,
    },
    nextText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
});

// Export function to check if onboarding is complete
export async function isOnboardingComplete() {
    try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        return value === 'true';
    } catch {
        return false;
    }
}
