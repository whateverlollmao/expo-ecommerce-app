import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    ActivityIndicator,
    Animated,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

// ═══════════════════════════════════════════════════════════════════════════
// LUXURY BUTTON SYSTEM
// Elegant, minimal, unhurried animations
// ═══════════════════════════════════════════════════════════════════════════

export function Button({
    title,
    onPress,
    variant = 'primary',
    icon,
    loading = false,
    disabled = false,
    style,
    size = 'default',
    haptic = true,
}) {
    const { theme, isDark, supportsLiquidGlass } = useTheme();
    const scaleValue = React.useRef(new Animated.Value(1)).current;
    const opacityValue = React.useRef(new Animated.Value(1)).current;

    // Elegant, slow press animation
    const handlePressIn = () => {
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 0.97,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 0.85,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleValue, {
                toValue: 1,
                friction: 8,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePress = () => {
        if (haptic && Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
    };

    const getHeight = () => {
        switch (size) {
            case 'small': return 48;
            case 'large': return 60;
            default: return 54;
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'small': return 13;
            case 'large': return 15;
            default: return 14;
        }
    };

    const buttonContent = (
        <View style={styles.content}>
            {loading ? (
                <ActivityIndicator
                    color={variant === 'google' || variant === 'secondary' || variant === 'outline' ? theme.text : '#FFFFFF'}
                    size="small"
                />
            ) : (
                <>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={[
                        styles.text,
                        { fontSize: getTextSize() },
                        (variant === 'primary' || variant === 'gradient' || variant === 'danger') && styles.whiteText,
                        variant === 'apple' && { color: isDark ? '#000000' : '#FFFFFF' },
                        variant === 'google' && { color: '#1A1915' },
                        variant === 'secondary' && { color: theme.text },
                        variant === 'outline' && { color: theme.accent },
                        variant === 'ghost' && { color: theme.accent },
                        variant === 'glass' && { color: '#FFFFFF' },
                        variant === 'elegant' && { color: theme.accent },
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </View>
    );

    // Elegant primary button with subtle gradient
    if (variant === 'gradient' || variant === 'primary') {
        return (
            <Animated.View style={[
                { transform: [{ scale: scaleValue }], opacity: opacityValue },
                style,
            ]}>
                <TouchableOpacity
                    onPress={handlePress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={disabled || loading}
                    activeOpacity={1}
                    style={[disabled && styles.disabled]}
                >
                    <LinearGradient
                        colors={[theme.gradientStart, theme.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.button, { height: getHeight() }]}
                    >
                        {buttonContent}
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    // Elegant outline button - thin border, refined
    if (variant === 'outline' || variant === 'elegant') {
        return (
            <Animated.View style={[
                { transform: [{ scale: scaleValue }], opacity: opacityValue },
                style,
            ]}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.outlineButton,
                        { height: getHeight(), borderColor: theme.accent },
                        disabled && styles.disabled,
                    ]}
                    onPress={handlePress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={disabled || loading}
                    activeOpacity={1}
                >
                    {buttonContent}
                </TouchableOpacity>
            </Animated.View>
        );
    }

    // Ghost button - no border, just text
    if (variant === 'ghost') {
        return (
            <Animated.View style={[
                { transform: [{ scale: scaleValue }], opacity: opacityValue },
                style,
            ]}>
                <TouchableOpacity
                    style={[
                        styles.ghostButton,
                        { height: getHeight() },
                        disabled && styles.disabled,
                    ]}
                    onPress={handlePress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={disabled || loading}
                    activeOpacity={1}
                >
                    {buttonContent}
                </TouchableOpacity>
            </Animated.View>
        );
    }

    // Glass button with blur
    if (variant === 'glass') {
        return (
            <Animated.View style={[
                { transform: [{ scale: scaleValue }], opacity: opacityValue },
                style,
            ]}>
                <TouchableOpacity
                    onPress={handlePress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={disabled || loading}
                    activeOpacity={1}
                    style={[styles.glassWrapper, { height: getHeight() }, disabled && styles.disabled]}
                >
                    {supportsLiquidGlass && Platform.OS === 'ios' ? (
                        <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.blurContent}>
                            {buttonContent}
                        </BlurView>
                    ) : (
                        <View style={[styles.blurFallback, styles.blurContent, { backgroundColor: theme.glassBg }]}>
                            {buttonContent}
                        </View>
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    }

    // Standard buttons (apple, google, secondary, danger)
    const getButtonStyle = () => {
        switch (variant) {
            case 'apple':
                return { backgroundColor: isDark ? '#FFFFFF' : '#000000' };
            case 'google':
                return { backgroundColor: isDark ? theme.card : '#FFFFFF', borderWidth: 1, borderColor: theme.border };
            case 'secondary':
                return { backgroundColor: theme.inputBackground };
            case 'danger':
                return { backgroundColor: theme.error };
            default:
                return { backgroundColor: theme.accent };
        }
    };

    return (
        <Animated.View style={[
            { transform: [{ scale: scaleValue }], opacity: opacityValue },
            style,
        ]}>
            <TouchableOpacity
                style={[
                    styles.button,
                    { height: getHeight() },
                    getButtonStyle(),
                    disabled && styles.disabled,
                ]}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                activeOpacity={1}
            >
                {buttonContent}
            </TouchableOpacity>
        </Animated.View>
    );
}

// Elegant Icon Button
export function IconButton({
    icon,
    onPress,
    size = 48,
    style,
    variant = 'default',
    haptic = true,
}) {
    const { theme } = useTheme();
    const scaleValue = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.timing(scaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 6,
            tension: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = () => {
        if (haptic && Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
    };

    const getStyle = () => {
        switch (variant) {
            case 'glass':
                return { backgroundColor: theme.glassBg };
            case 'filled':
                return { backgroundColor: theme.inputBackground };
            case 'accent':
                return { backgroundColor: theme.accentGlow };
            case 'outline':
                return { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.border };
            default:
                return { backgroundColor: theme.card };
        }
    };

    return (
        <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
            <TouchableOpacity
                style={[
                    styles.iconButton,
                    { width: size, height: size, borderRadius: size * 0.35 },
                    getStyle(),
                ]}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                {icon}
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 4, // Sharp, minimal corners (luxury style)
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
    },
    ghostButton: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: 12,
    },
    text: {
        fontWeight: '500',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    whiteText: {
        color: '#FFFFFF',
    },
    glassWrapper: {
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    blurContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    blurFallback: {},
    disabled: {
        opacity: 0.4,
    },
    iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
