import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Easing, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

// Custom branded pull-to-refresh indicator
export function CustomRefreshControl({ refreshing, onRefresh, children }) {
    const { theme } = useTheme();
    const spinAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (refreshing) {
            setIsRefreshing(true);
            // Continuous spin
            Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();

            // Pulse effect
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            ).start();
        } else {
            spinAnim.stopAnimation();
            pulseAnim.stopAnimation();
            spinAnim.setValue(0);
            pulseAnim.setValue(1);
            setIsRefreshing(false);
        }
    }, [refreshing]);

    const rotate = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {isRefreshing && (
                <View style={styles.refreshContainer}>
                    <Animated.View style={[
                        styles.logoContainer,
                        {
                            transform: [{ rotate }, { scale: pulseAnim }],
                        }
                    ]}>
                        <LinearGradient
                            colors={[theme.gradientStart, theme.gradientEnd]}
                            style={styles.logoGradient}
                        >
                            <Text style={styles.logoText}>L</Text>
                        </LinearGradient>
                    </Animated.View>
                </View>
            )}
            {children}
        </View>
    );
}

// Search suggestions dropdown
export function SearchSuggestions({ query, suggestions, onSelect, visible, theme }) {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible && query.length > 0) {
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
            ]).start();
        }
    }, [visible, query]);

    const scale = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.95, 1],
    });

    if (!visible || suggestions.length === 0) return null;

    return (
        <Animated.View style={[
            styles.suggestionsContainer,
            {
                backgroundColor: theme.card,
                opacity: opacityAnim,
                transform: [{ scale }],
            }
        ]}>
            {suggestions.slice(0, 5).map((item, index) => (
                <Animated.View key={item.id || index}>
                    <View
                        style={[
                            styles.suggestionItem,
                            index < suggestions.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
                        ]}
                    >
                        <Text style={styles.suggestionEmoji}>{item.emoji}</Text>
                        <View style={styles.suggestionInfo}>
                            <Text style={[styles.suggestionName, { color: theme.text }]} numberOfLines={1}>
                                {highlightMatch(item.name, query, theme.accent)}
                            </Text>
                            <Text style={[styles.suggestionBrand, { color: theme.textSecondary }]}>
                                {item.brand}
                            </Text>
                        </View>
                        <Text style={[styles.suggestionPrice, { color: theme.accent }]}>
                            ${item.price}
                        </Text>
                    </View>
                </Animated.View>
            ))}
        </Animated.View>
    );
}

// Highlight matching text
function highlightMatch(text, query, accentColor) {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));

    return (
        <Text>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <Text key={i} style={{ color: accentColor, fontWeight: '800' }}>{part}</Text>
                ) : (
                    <Text key={i}>{part}</Text>
                )
            )}
        </Text>
    );
}

// Order tracking timeline
export function OrderTrackingTimeline({ status, theme }) {
    const steps = [
        { key: 'confirmed', label: 'Confirmed', emoji: '✅' },
        { key: 'processing', label: 'Processing', emoji: '📦' },
        { key: 'shipped', label: 'Shipped', emoji: '🚚' },
        { key: 'delivered', label: 'Delivered', emoji: '🏠' },
    ];

    const currentIndex = steps.findIndex(s => s.key === status);

    return (
        <View style={styles.timeline}>
            {steps.map((step, index) => {
                const isComplete = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <React.Fragment key={step.key}>
                        <View style={styles.timelineStep}>
                            <Animated.View style={[
                                styles.stepCircle,
                                {
                                    backgroundColor: isComplete ? theme.accent : theme.inputBackground,
                                    transform: [{ scale: isCurrent ? 1.2 : 1 }],
                                }
                            ]}>
                                <Text style={styles.stepEmoji}>{step.emoji}</Text>
                            </Animated.View>
                            <Text style={[
                                styles.stepLabel,
                                { color: isComplete ? theme.text : theme.textTertiary }
                            ]}>
                                {step.label}
                            </Text>
                        </View>
                        {index < steps.length - 1 && (
                            <View style={[
                                styles.timelineLine,
                                { backgroundColor: index < currentIndex ? theme.accent : theme.border }
                            ]} />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    refreshContainer: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
    },
    logoContainer: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    logoGradient: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '900',
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        zIndex: 100,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    suggestionEmoji: {
        fontSize: 28,
        marginRight: 14,
    },
    suggestionInfo: {
        flex: 1,
    },
    suggestionName: {
        fontSize: 14,
        fontWeight: '600',
    },
    suggestionBrand: {
        fontSize: 12,
        marginTop: 2,
    },
    suggestionPrice: {
        fontSize: 15,
        fontWeight: '800',
    },
    timeline: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    timelineStep: {
        alignItems: 'center',
    },
    stepCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    stepEmoji: {
        fontSize: 18,
    },
    stepLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    timelineLine: {
        flex: 1,
        height: 3,
        marginHorizontal: 8,
        marginBottom: 28,
        borderRadius: 2,
    },
});
