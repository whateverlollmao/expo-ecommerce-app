import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// Confetti particle for celebrations
function Particle({ delay, color, startX, startY }) {
    const translateY = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0)).current;
    const rotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const randomX = (Math.random() - 0.5) * 200;
        const randomRotate = Math.random() * 720;

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
                Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 150, duration: 800, useNativeDriver: true }),
                Animated.timing(translateX, { toValue: randomX, duration: 800, useNativeDriver: true }),
                Animated.timing(rotate, { toValue: randomRotate, duration: 800, useNativeDriver: true }),
            ]).start(() => {
                Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
            });
        }, delay);
    }, []);

    const rotateStr = rotate.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    left: startX,
                    top: startY,
                    backgroundColor: color,
                    opacity,
                    transform: [
                        { translateX },
                        { translateY },
                        { scale },
                        { rotate: rotateStr },
                    ],
                },
            ]}
        />
    );
}

// Confetti burst effect
export function ConfettiBurst({ trigger, onComplete }) {
    const colors = ['#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6', '#EF4444'];
    const [particles, setParticles] = React.useState([]);

    useEffect(() => {
        if (trigger) {
            if (Platform.OS === 'ios') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            const newParticles = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 200,
                startX: width / 2 - 5 + (Math.random() - 0.5) * 40,
                startY: 0,
            }));

            setParticles(newParticles);

            setTimeout(() => {
                setParticles([]);
                onComplete?.();
            }, 1500);
        }
    }, [trigger]);

    if (particles.length === 0) return null;

    return (
        <View style={styles.confettiContainer} pointerEvents="none">
            {particles.map(p => (
                <Particle key={p.id} {...p} />
            ))}
        </View>
    );
}

// Sparkle effect for wishlist
export function SparkleEffect({ active, style }) {
    const [sparkles, setSparkles] = React.useState([]);

    useEffect(() => {
        if (active) {
            const newSparkles = Array.from({ length: 8 }, (_, i) => ({
                id: i,
                scale: new Animated.Value(0),
                opacity: new Animated.Value(1),
                x: Math.cos((i / 8) * Math.PI * 2) * 25,
                y: Math.sin((i / 8) * Math.PI * 2) * 25,
            }));

            setSparkles(newSparkles);

            newSparkles.forEach((sparkle, i) => {
                setTimeout(() => {
                    Animated.parallel([
                        Animated.spring(sparkle.scale, { toValue: 1, friction: 3, useNativeDriver: true }),
                        Animated.timing(sparkle.opacity, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
                    ]).start();
                }, i * 50);
            });

            setTimeout(() => setSparkles([]), 1000);
        }
    }, [active]);

    return (
        <View style={[styles.sparkleContainer, style]} pointerEvents="none">
            {sparkles.map(s => (
                <Animated.Text
                    key={s.id}
                    style={[
                        styles.sparkle,
                        {
                            transform: [
                                { translateX: s.x },
                                { translateY: s.y },
                                { scale: s.scale },
                            ],
                            opacity: s.opacity,
                        },
                    ]}
                >
                    ✦
                </Animated.Text>
            ))}
        </View>
    );
}

// Success checkmark animation
export function SuccessCheck({ visible, size = 60 }) {
    const scale = useRef(new Animated.Value(0)).current;
    const checkScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            if (Platform.OS === 'ios') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            Animated.sequence([
                Animated.spring(scale, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }),
                Animated.spring(checkScale, { toValue: 1, friction: 3, useNativeDriver: true }),
            ]).start();
        } else {
            scale.setValue(0);
            checkScale.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.successContainer, { transform: [{ scale }] }]}>
            <LinearGradient
                colors={['#10B981', '#059669']}
                style={[styles.successCircle, { width: size, height: size, borderRadius: size / 2 }]}
            >
                <Animated.Text style={[styles.checkmark, { transform: [{ scale: checkScale }] }]}>
                    ✓
                </Animated.Text>
            </LinearGradient>
        </Animated.View>
    );
}

// Ripple effect for buttons
export function RippleButton({ children, onPress, style, color = 'rgba(255,255,255,0.3)' }) {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0.5)).current;

    const handlePress = () => {
        scale.setValue(0);
        opacity.setValue(0.5);

        Animated.parallel([
            Animated.timing(scale, { toValue: 4, duration: 400, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start();

        onPress?.();
    };

    return (
        <TouchableOpacity onPress={handlePress} style={[styles.rippleContainer, style]} activeOpacity={0.9}>
            <Animated.View
                style={[
                    styles.ripple,
                    {
                        backgroundColor: color,
                        transform: [{ scale }],
                        opacity,
                    },
                ]}
            />
            {children}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    confettiContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
    particle: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 2,
    },
    sparkleContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sparkle: {
        position: 'absolute',
        fontSize: 12,
        color: '#F59E0B',
    },
    successContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    successCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '900',
    },
    rippleContainer: {
        overflow: 'hidden',
        position: 'relative',
    },
    ripple: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        left: '50%',
        top: '50%',
        marginLeft: -25,
        marginTop: -25,
    },
});
