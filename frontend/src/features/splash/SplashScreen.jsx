import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../../core/theme';
import { useLanguage } from '../../store/languageStore';

export default function SplashScreen() {
    const navigation = useNavigation();
    const { t, language, changeLanguage } = useLanguage();
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    const languages = [
        { code: 'en', label: 'English', nativeLabel: 'English' },
        { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
        { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
    ];

    const handleStart = () => {
        navigation.replace('Login');
    };

    const handleLanguageSelect = async (langCode) => {
        await changeLanguage(langCode);
        setShowLanguageSelector(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Main Content */}
            <View style={styles.content}>
                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>🌾</Text>
                    </View>
                    <Text style={styles.appName}>{t('splash.appName')}</Text>
                    <Text style={styles.tagline}>{t('splash.tagline')}</Text>
                </View>

                {/* Language Selector */}
                <TouchableOpacity
                    style={styles.languageButton}
                    onPress={() => setShowLanguageSelector(!showLanguageSelector)}
                >
                    <Text style={styles.languageIcon}>🌐</Text>
                    <Text style={styles.languageButtonText}>
                        {languages.find(l => l.code === language)?.nativeLabel || 'English'}
                    </Text>
                </TouchableOpacity>

                {/* Language Options */}
                {showLanguageSelector && (
                    <View style={styles.languageOptions}>
                        {languages.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.languageOption,
                                    language === lang.code && styles.languageOptionSelected
                                ]}
                                onPress={() => handleLanguageSelect(lang.code)}
                            >
                                <Text style={styles.languageOptionText}>{lang.nativeLabel}</Text>
                                {language === lang.code && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {/* Start Button */}
            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={handleStart}
                    activeOpacity={0.9}
                >
                    <Text style={styles.startButtonText}>{t('splash.start')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logoCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.l,
        shadowColor: colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    logoEmoji: {
        fontSize: 70,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.light.text,
        marginBottom: spacing.s,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 16,
        color: colors.light.textSecondary,
        textAlign: 'center',
        marginTop: spacing.xs,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.light.surface,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.l,
        borderRadius: 24,
        marginTop: spacing.xl,
        borderWidth: 1,
        borderColor: colors.light.border,
    },
    languageIcon: {
        fontSize: 20,
        marginRight: spacing.s,
    },
    languageButtonText: {
        fontSize: 15,
        color: colors.light.text,
        fontWeight: '600',
    },
    languageOptions: {
        width: '100%',
        marginTop: spacing.m,
        backgroundColor: colors.light.surface,
        borderRadius: 12,
        padding: spacing.s,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.m,
        borderRadius: 8,
    },
    languageOptionSelected: {
        backgroundColor: '#f0f9ff',
    },
    languageOptionText: {
        fontSize: 16,
        color: colors.light.text,
        fontWeight: '500',
    },
    checkmark: {
        fontSize: 20,
        color: colors.light.primary,
        fontWeight: 'bold',
    },
    bottomSection: {
        padding: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    startButton: {
        width: '100%',
        backgroundColor: colors.light.primary,
        paddingVertical: spacing.l,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
