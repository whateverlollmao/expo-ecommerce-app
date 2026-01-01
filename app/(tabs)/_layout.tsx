import React, { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Platform, Animated, View, Text, StyleSheet } from 'react-native';
import { Home, ShoppingBag, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';

// Simplified Tab Icon - smoother animation without glitches
function TabIcon({ IconComponent, focused, color, cartCount = 0, showBadge = false }: any) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1.1 : 1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.1 : 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <IconComponent size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
      {showBadge && cartCount > 0 && <CartBadge count={cartCount} />}
    </Animated.View>
  );
}

// Cart Badge
function CartBadge({ count }: any) {
  const { theme } = useTheme();

  return (
    <View style={styles.badge}>
      <LinearGradient
        colors={[theme.accent, theme.accentDark]}
        style={styles.badgeGradient}
      >
        <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
      </LinearGradient>
    </View>
  );
}

export default function TabLayout() {
  const { theme, isDark } = useTheme();
  const { getCartCount } = useCart();
  const { t } = useLanguage();
  const cartCount = getCartCount();

  const handleTabPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.selectionAsync();
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: theme.tabBar,
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          height: 88,
          paddingTop: 8,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 12,
        },
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.tabBar }]} />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: '800',
          color: theme.text,
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
      screenListeners={{
        tabPress: handleTabPress,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('shop'),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={Home} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('cart'),
          headerTitle: t('shoppingBag'),
          headerStyle: { backgroundColor: theme.background },
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              IconComponent={ShoppingBag}
              focused={focused}
              color={color}
              cartCount={cartCount}
              showBadge={true}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('account'),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={User} focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -10,
    top: -6,
  },
  badgeGradient: {
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
