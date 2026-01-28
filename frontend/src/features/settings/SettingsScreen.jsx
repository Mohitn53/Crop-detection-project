import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../../core/theme';
import { useAuth } from '../../store/authStore';
import { useLanguage } from '../../store/languageStore';

const LANGUAGES = [
    {
        code: 'en',
        label: 'English',
        nativeLabel: 'English',
        voiceCode: 'en-IN' // TTS code
    },
    {
        code: 'hi',
        label: 'Hindi',
        nativeLabel: 'हिंदी',
        voiceCode: 'hi-IN'
    },
    {
        code: 'mr',
        label: 'Marathi',
        nativeLabel: 'मराठी',
        voiceCode: 'mr-IN'
    },
];

export default function SettingsScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { t, language, changeLanguage } = useLanguage();
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const handleLanguageSelect = async (lang) => {
        // Change UI language
        await changeLanguage(lang.code);

        // Also change voice language to match
        try {
            await AsyncStorage.setItem('language_preference', lang.voiceCode);
        } catch (e) {
            console.log('Failed to save voice language', e);
        }

        setShowLanguageModal(false);
    };

    const currentLanguage = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{t('settings.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* User Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings.profile')}</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user?.username || 'User'}</Text>
                            <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
                        </View>
                    </View>
                </View>

                {/* Unified Language Setting */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🌐 {t('settings.uiLanguage')}</Text>
                    <Text style={styles.sectionDescription}>
                        Changes app language and voice for the entire experience
                    </Text>

                    <TouchableOpacity
                        style={styles.languageSelector}
                        onPress={() => setShowLanguageModal(true)}
                    >
                        <View style={styles.languageSelectorLeft}>
                            <Text style={styles.languageSelectorIcon}>🌐</Text>
                            <View>
                                <Text style={styles.languageSelectorLabel}>
                                    {currentLanguage.label}
                                </Text>
                                <Text style={styles.languageSelectorValue}>
                                    {currentLanguage.nativeLabel}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.languageSelectorArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>{t('settings.appVersion')}</Text>
                        <Text style={styles.infoValue}>1.0.0</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>{t('settings.model')}</Text>
                        <Text style={styles.infoValue}>{t('settings.modelName')}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Language Selection Modal */}
            <Modal
                visible={showLanguageModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowLanguageModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
                            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {LANGUAGES.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.modalOption,
                                    language === lang.code && styles.modalOptionSelected
                                ]}
                                onPress={() => handleLanguageSelect(lang)}
                            >
                                <View style={styles.languageInfo}>
                                    <Text style={styles.languageLabel}>{lang.label}</Text>
                                    <Text style={styles.languageNative}>{lang.nativeLabel}</Text>
                                </View>
                                {language === lang.code && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </TouchableOpacity>
                        ))}

                        <Text style={styles.modalNote}>
                            💡 This will change both app text and voice language
                        </Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.l,
        borderBottomWidth: 1,
        borderBottomColor: colors.light.border,
    },
    backButton: {
        padding: spacing.s,
    },
    backText: {
        fontSize: 24,
        color: colors.light.text,
    },
    title: {
        ...typography.header,
        color: colors.light.text,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: spacing.l,
        borderBottomWidth: 1,
        borderBottomColor: colors.light.border,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.light.text,
        marginBottom: spacing.s,
    },
    sectionDescription: {
        fontSize: 14,
        color: colors.light.textSecondary,
        marginBottom: spacing.m,
        lineHeight: 20,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.light.surface,
        padding: spacing.m,
        borderRadius: 12,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.light.text,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: colors.light.textSecondary,
    },
    languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.light.surface,
        padding: spacing.m,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.light.border,
    },
    languageSelectorLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    languageSelectorIcon: {
        fontSize: 24,
        marginRight: spacing.m,
    },
    languageSelectorLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.light.text,
    },
    languageSelectorValue: {
        fontSize: 14,
        color: colors.light.textSecondary,
        marginTop: 2,
    },
    languageSelectorArrow: {
        fontSize: 24,
        color: colors.light.textSecondary,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.s,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.light.textSecondary,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.light.text,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.light.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.l,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.light.text,
    },
    modalClose: {
        fontSize: 24,
        color: colors.light.textSecondary,
        padding: spacing.s,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.light.background,
        padding: spacing.m,
        borderRadius: 12,
        marginBottom: spacing.s,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    modalOptionSelected: {
        borderColor: colors.light.primary,
        backgroundColor: '#f0f9ff',
    },
    languageInfo: {
        flex: 1,
    },
    languageLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.light.text,
        marginBottom: 2,
    },
    languageNative: {
        fontSize: 14,
        color: colors.light.textSecondary,
    },
    checkmark: {
        fontSize: 24,
        color: colors.light.primary,
        fontWeight: 'bold',
    },
    modalNote: {
        fontSize: 12,
        color: colors.light.textSecondary,
        textAlign: 'center',
        marginTop: spacing.m,
        fontStyle: 'italic',
    },
});
