import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

// Shimmer effect for loading states
export function Shimmer({ width = '100%', height = 20, borderRadius = 8, style }) {
    const { theme, isDark } = useTheme();
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
    });

    return (
        <View style={[styles.shimmerContainer, { width, height, borderRadius, backgroundColor: isDark ? '#1A1A1A' : '#E8E8E8' }, style]}>
            <Animated.View style={[styles.shimmerWave, { transform: [{ translateX }] }]}>
                <LinearGradient
                    colors={isDark
                        ? ['transparent', 'rgba(255,255,255,0.08)', 'transparent']
                        : ['transparent', 'rgba(255,255,255,0.8)', 'transparent']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </View>
    );
}

// Skeleton card for product loading
export function ProductSkeleton() {
    const { theme } = useTheme();

    return (
        <View style={[styles.productSkeleton, { backgroundColor: theme.card }]}>
            <Shimmer height={160} borderRadius={16} />
            <View style={styles.skeletonContent}>
                <Shimmer width="60%" height={12} style={{ marginBottom: 8 }} />
                <Shimmer width="80%" height={16} style={{ marginBottom: 8 }} />
                <Shimmer width="40%" height={20} />
            </View>
        </View>
    );
}

// Animated counter for prices
export function AnimatedPrice({ value, style, prefix = '$' }) {
    const { theme } = useTheme();
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = React.useState(0);

    useEffect(() => {
        animatedValue.setValue(0);
        Animated.timing(animatedValue, {
            toValue: value,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();

        const listener = animatedValue.addListener(({ value: v }) => {
            setDisplayValue(v.toFixed(2));
        });

        return () => animatedValue.removeListener(listener);
    }, [value]);

    return (
        <Animated.Text style={[styles.priceText, { color: theme.accent }, style]}>
            {prefix}{displayValue}
        </Animated.Text>
    );
}

// Pulse animation wrapper
export function PulseView({ children, active = true, style }) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (active) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                ])
            ).start();
        }
    }, [active]);

    return (
        <Animated.View style={[{ transform: [{ scale: pulseAnim }] }, style]}>
            {children}
        </Animated.View>
    );
}

// Glow effect wrapper
export function GlowView({ children, color = '#10B981', intensity = 0.5, style }) {
    return (
        <View style={[styles.glowContainer, style]}>
            <View style={[
                styles.glowEffect,
                {
                    shadowColor: color,
                    shadowOpacity: intensity,
                    shadowRadius: 20,
                    shadowOffset: { width: 0, height: 0 },
                }
            ]}>
                {children}
            </View>
        </View>
    );
}

// Floating animation
export function FloatingView({ children, style, range = 8, duration = 3000 }) {
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: -range, duration: duration / 2, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                Animated.timing(floatAnim, { toValue: range, duration: duration / 2, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[{ transform: [{ translateY: floatAnim }] }, style]}>
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    shimmerContainer: {
        overflow: 'hidden',
    },
    shimmerWave: {
        ...StyleSheet.absoluteFillObject,
        width: 200,
    },
    productSkeleton: {
        flex: 1,
        margin: 6,
        borderRadius: 20,
        overflow: 'hidden',
    },
    skeletonContent: {
        padding: 14,
    },
    priceText: {
        fontSize: 24,
        fontWeight: '900',
    },
    glowContainer: {
        position: 'relative',
    },
    glowEffect: {
        elevation: 20,
    },
});
