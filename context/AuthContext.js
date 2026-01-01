import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { Platform, Alert } from 'react-native';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = '@auth_user';
const BIOMETRIC_SETTINGS_KEY = '@biometric_settings';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [biometricType, setBiometricType] = useState(null);

    useEffect(() => {
        loadUser();
        checkBiometricSupport();
    }, []);

    const checkBiometricSupport = async () => {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (compatible) {
                const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
                if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                    setBiometricType('faceId');
                } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                    setBiometricType('touchId');
                }
            }
            // Load biometric settings
            const settings = await AsyncStorage.getItem(BIOMETRIC_SETTINGS_KEY);
            if (settings) {
                setBiometricEnabled(JSON.parse(settings).enabled || false);
            }
        } catch (error) {
            console.log('Biometric check error:', error);
        }
    };

    const authenticateWithBiometrics = async () => {
        try {
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (!enrolled) {
                Alert.alert('Biometric Not Set Up', 'Please set up Face ID or Touch ID in your device settings.');
                return false;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to access LUXE',
                fallbackLabel: 'Use passcode',
                cancelLabel: 'Cancel',
            });

            if (result.success) {
                if (Platform.OS === 'ios') {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.log('Biometric auth error:', error);
            return false;
        }
    };

    const enableBiometrics = async () => {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (!compatible) {
                Alert.alert('Not Supported', 'Biometric authentication is not available on this device.');
                return false;
            }

            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (!enrolled) {
                Alert.alert('Biometric Not Set Up', 'Please set up Face ID or Touch ID in your device settings first.');
                return false;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: `Enable ${biometricType === 'faceId' ? 'Face ID' : 'Touch ID'}`,
            });

            if (result.success) {
                setBiometricEnabled(true);
                await AsyncStorage.setItem(BIOMETRIC_SETTINGS_KEY, JSON.stringify({ enabled: true }));
                if (Platform.OS === 'ios') {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.log('Enable biometrics error:', error);
            return false;
        }
    };

    const disableBiometrics = async () => {
        setBiometricEnabled(false);
        await AsyncStorage.setItem(BIOMETRIC_SETTINGS_KEY, JSON.stringify({ enabled: false }));
    };

    const loadUser = async () => {
        try {
            const savedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (e) {
            console.log('Error loading user:', e);
        }
        setIsLoading(false);
    };

    const signInWithApple = async () => {
        const mockUser = {
            id: 'apple_' + Date.now(),
            name: 'John Appleseed',
            email: 'john@icloud.com',
            provider: 'apple',
            avatar: null,
            phone: '',
            createdAt: new Date().toISOString(),
        };
        await saveUser(mockUser);
        return mockUser;
    };

    const signInWithGoogle = async () => {
        const mockUser = {
            id: 'google_' + Date.now(),
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            provider: 'google',
            avatar: null,
            phone: '',
            createdAt: new Date().toISOString(),
        };
        await saveUser(mockUser);
        return mockUser;
    };

    const signUpWithEmail = async (name, email, password) => {
        const mockUser = {
            id: 'email_' + Date.now(),
            name: name,
            email: email,
            provider: 'email',
            avatar: null,
            phone: '',
            createdAt: new Date().toISOString(),
        };
        await saveUser(mockUser);
        return mockUser;
    };

    const saveUser = async (userData) => {
        setUser(userData);
        try {
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        } catch (e) {
            console.log('Error saving user:', e);
        }
    };

    const updateProfile = async (updates) => {
        const updatedUser = { ...user, ...updates };
        await saveUser(updatedUser);
        return updatedUser;
    };

    const signOut = async () => {
        setUser(null);
        try {
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        } catch (e) {
            console.log('Error removing user:', e);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            biometricEnabled,
            biometricType,
            signInWithApple,
            signInWithGoogle,
            signUpWithEmail,
            updateProfile,
            signOut,
            authenticateWithBiometrics,
            enableBiometrics,
            disableBiometrics,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

