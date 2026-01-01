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
import { ArrowLeft, User, Mail, Phone } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/Button';

export default function EditProfileScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const { user, updateUser } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert(t('error'), t('name') + ' is required');
            return;
        }

        await updateUser({ name, email, phone });
        Alert.alert(t('profileUpdated'), t('profileUpdatedMessage'));
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: theme.card }]}
                >
                    <ArrowLeft size={22} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('editProfile')}</Text>
                <View style={styles.placeholder} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>{t('name')}</Text>
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
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>{t('email')}</Text>
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
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>{t('phone')}</Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
                            <Phone size={20} color={theme.textTertiary} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder={t('phone')}
                                placeholderTextColor={theme.textTertiary}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <Button
                        title={t('saveChanges')}
                        variant="primary"
                        size="large"
                        onPress={handleSave}
                        style={styles.saveButton}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    placeholder: {
        width: 44,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 10,
        textTransform: 'uppercase',
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
    saveButton: {
        marginTop: 20,
    },
});
