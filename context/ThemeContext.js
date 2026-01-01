import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Platform, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

// Check if device supports Liquid Glass (iOS 15+)
const supportsLiquidGlass = Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 15;

// ═══════════════════════════════════════════════════════════════════════════
// HAUTE COUTURE THEME - Inspired by Chanel, Celine, The Row
// Elegant, minimal, understated luxury
// ═══════════════════════════════════════════════════════════════════════════

const lightTheme = {
    mode: 'light',

    // Backgrounds - warm ivory tones
    background: '#FDFCFA',
    backgroundSecondary: '#F7F5F2',
    card: '#FFFFFF',
    cardAlt: '#FAFAF8',

    // Text - rich blacks and warm grays
    text: '#1A1915',
    textSecondary: '#6B6760',
    textTertiary: '#9C9890',

    // Accent - warm taupe/champagne (understated, not flashy)
    accent: '#8B7355',           // Warm taupe - Celine inspired
    accentLight: '#A8917A',
    accentDark: '#6B5744',
    accentGlow: 'rgba(139, 115, 85, 0.12)',

    // Secondary accents
    secondary: '#2C3E50',        // Deep slate
    tertiary: '#C9A962',         // Muted gold (subtle, not gaudy)

    // Semantic
    error: '#C53030',
    success: '#2D6A4F',
    warning: '#B7791F',

    // UI Elements
    border: '#E8E5E0',
    tabBar: 'rgba(253, 252, 250, 0.98)',
    overlay: 'rgba(26, 25, 21, 0.6)',
    inputBackground: '#F5F3EF',
    cardShadow: 'rgba(0, 0, 0, 0.06)',

    // Glass effects
    glassBg: 'rgba(255, 255, 255, 0.9)',
    glassBlur: supportsLiquidGlass ? 30 : 0,

    // Gradients - subtle, elegant
    gradientStart: '#8B7355',
    gradientEnd: '#6B5744',
    gradientAlt: ['#A8917A', '#8B7355'],
    bgGradient: ['#FDFCFA', '#F7F5F2'],
};

const darkTheme = {
    mode: 'dark',

    // Backgrounds - PURE luxurious black
    background: '#000000',
    backgroundSecondary: '#080808',
    card: '#0F0F0E',
    cardAlt: '#151413',

    // Text - warm off-white
    text: '#FAF9F7',
    textSecondary: '#A09A90',
    textTertiary: '#5C5850',

    // Accent - warm champagne/taupe (elegant on black)
    accent: '#C9B897',           // Warm champagne
    accentLight: '#D6C8A8',
    accentDark: '#A99A7A',
    accentGlow: 'rgba(201, 184, 151, 0.15)',

    // Secondary accents
    secondary: '#8999A8',        // Cool slate
    tertiary: '#987654',         // Muted bronze

    // Semantic
    error: '#E57373',
    success: '#81C784',
    warning: '#DCB67A',

    // UI Elements
    border: '#1A1918',
    tabBar: 'rgba(0, 0, 0, 0.98)',
    overlay: 'rgba(0, 0, 0, 0.85)',
    inputBackground: '#141312',
    cardShadow: 'rgba(0, 0, 0, 0.6)',

    // Glass effects
    glassBg: 'rgba(15, 15, 14, 0.95)',
    glassBlur: supportsLiquidGlass ? 30 : 0,

    // Gradients - sophisticated
    gradientStart: '#C9B897',
    gradientEnd: '#A99A7A',
    gradientAlt: ['#D6C8A8', '#C9B897'],
    bgGradient: ['#000000', '#080808'],
};

// Typography Scale - Luxury editorial
export const Typography = {
    // Headers - light weight, generous spacing (editorial feel)
    h1: { fontSize: 36, fontWeight: '300', letterSpacing: 1 },
    h2: { fontSize: 28, fontWeight: '300', letterSpacing: 0.5 },
    h3: { fontSize: 24, fontWeight: '400', letterSpacing: 0.3 },
    h4: { fontSize: 20, fontWeight: '500', letterSpacing: 0.2 },

    // Body
    body: { fontSize: 16, fontWeight: '400', letterSpacing: 0.1 },
    bodySmall: { fontSize: 14, fontWeight: '400', letterSpacing: 0 },

    // Labels - ALL CAPS, wide spacing
    label: { fontSize: 11, fontWeight: '600', letterSpacing: 2.5, textTransform: 'uppercase' },
    labelLarge: { fontSize: 13, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },

    // Prices
    price: { fontSize: 24, fontWeight: '300', letterSpacing: 0.5 },
    priceSmall: { fontSize: 16, fontWeight: '400', letterSpacing: 0.3 },
};

// Spacing Scale - Generous luxury spacing
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

// Shadows - Soft, diffuse (luxury feel)
export const Shadows = {
    subtle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    soft: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },
};

const THEME_STORAGE_KEY = '@app_theme';

export function ThemeProvider({ children }) {
    const deviceColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const fadeAnim = React.useRef(new Animated.Value(1)).current;

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme !== null) {
                setIsDark(savedTheme === 'dark');
            }
        } catch (e) {
            console.log('Error loading theme:', e);
        }
    };

    const toggleTheme = async () => {
        // Start fade out
        setIsTransitioning(true);
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            // Toggle theme
            const newValue = !isDark;
            setIsDark(newValue);

            // Fade back in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setIsTransitioning(false);
            });
        });

        try {
            const newValue = !isDark;
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newValue ? 'dark' : 'light');
        } catch (e) {
            console.log('Error saving theme:', e);
        }
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{
            theme,
            isDark,
            toggleTheme,
            supportsLiquidGlass,
            Typography,
            Spacing,
            Shadows,
            fadeAnim,
            isTransitioning,
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
