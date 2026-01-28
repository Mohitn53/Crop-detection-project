import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, SafeAreaView, Alert, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { uploadImage } from '../../services/uploadService';
import { colors, spacing, typography } from '../../core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../store/languageStore';

export default function DetectionScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { imageUri } = route.params;
    const { t } = useLanguage();

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [language, setLanguage] = useState('en-IN');
    const [isHelpful, setIsHelpful] = useState(null); // null, true, or false
    const [feedbackComment, setFeedbackComment] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);


    useEffect(() => {
        loadLanguagePreference();
        processImage();
    }, []);

    const loadLanguagePreference = async () => {
        try {
            // Try to load voice language first (set by unified language selector)
            let voiceLang = await AsyncStorage.getItem('language_preference');

            // If not found, derive from UI language
            if (!voiceLang) {
                const uiLang = await AsyncStorage.getItem('app_language');
                const langMap = {
                    'en': 'en-IN',
                    'hi': 'hi-IN',
                    'mr': 'mr-IN'
                };
                voiceLang = langMap[uiLang] || 'en-IN';
            }

            setLanguage(voiceLang);
        } catch (e) {
            console.log('Failed to load language preference', e);
        }
    };

    const processImage = async () => {
        try {
            const data = await uploadImage(imageUri);
            setResult(data.scan);
            saveOffline(data.scan);
        } catch (err) {
            setError('Could not analyze the image. Please try again.');
            Alert.alert('Analysis Failed', err.message || 'Check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    const saveOffline = async (scanData) => {
        try {
            const history = await AsyncStorage.getItem('scan_history');
            const parsed = history ? JSON.parse(history) : [];
            parsed.unshift({ ...scanData, localUri: imageUri, date: new Date().toISOString() });
            await AsyncStorage.setItem('scan_history', JSON.stringify(parsed));
        } catch (e) {
            console.log('Failed to save offline', e);
        }
    };

    const speakTreatment = () => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
            return;
        }

        // Build the speech text
        let speechText = '';

        // Disease name
        if (result?.condition) {
            speechText += `Disease detected: ${result.condition}. `;
        }

        // Message
        if (result?.fullReport?.message) {
            speechText += `${result.fullReport.message}. `;
        }

        // Severity
        if (result?.fullReport?.severity && result.fullReport.severity !== 'N/A') {
            speechText += `Severity level: ${result.fullReport.severity}. `;
        }

        // Organic treatment
        if (result?.fullReport?.organic && result.fullReport.organic.length > 0) {
            speechText += 'Organic treatment options: ';
            result.fullReport.organic.forEach((item, index) => {
                speechText += `${index + 1}. ${item}. `;
            });
        }

        // Chemical treatment
        if (result?.fullReport?.chemical && result.fullReport.chemical.length > 0) {
            speechText += 'Chemical treatment options: ';
            result.fullReport.chemical.forEach((item, index) => {
                speechText += `${index + 1}. ${item}. `;
            });
        }

        // Maintenance
        if (result?.fullReport?.maintenance && result.fullReport.maintenance.length > 0) {
            speechText += 'Maintenance tips: ';
            result.fullReport.maintenance.forEach((item, index) => {
                speechText += `${index + 1}. ${item}. `;
            });
        }

        // Prevention
        if (result?.fullReport?.prevention && result.fullReport.prevention.length > 0) {
            speechText += 'Prevention measures: ';
            result.fullReport.prevention.forEach((item, index) => {
                speechText += `${index + 1}. ${item}. `;
            });
        }

        // Recommendation
        if (result?.fullReport?.recommendation) {
            speechText += `Recommendation: ${result.fullReport.recommendation}`;
        }

        if (speechText) {
            setIsSpeaking(true);
            Speech.speak(speechText, {
                language: language, // Use selected language from settings
                pitch: 1.0,
                rate: 0.9, // Slightly slower for clarity
                onDone: () => setIsSpeaking(false),
                onStopped: () => setIsSpeaking(false),
                onError: () => {
                    setIsSpeaking(false);
                    Alert.alert('Error', 'Failed to read treatment information');
                }
            });
        }
    };

    const submitFeedback = async () => {
        if (isHelpful === null) {
            Alert.alert(t('detection.error'), t('detection.feedbackQuestion'));
            return;
        }

        try {
            // Save feedback locally
            const feedbackData = {
                scanId: result?._id || Date.now(),
                isHelpful,
                comment: feedbackComment,
                timestamp: new Date().toISOString(),
                disease: result?.condition,
            };

            const existingFeedback = await AsyncStorage.getItem('user_feedback');
            const feedbackList = existingFeedback ? JSON.parse(existingFeedback) : [];
            feedbackList.push(feedbackData);
            await AsyncStorage.setItem('user_feedback', JSON.stringify(feedbackList));

            setFeedbackSubmitted(true);
            Alert.alert(t('common.success'), t('detection.feedbackThanks'));
        } catch (error) {
            console.error('Failed to save feedback:', error);
            Alert.alert(t('detection.error'), 'Failed to save feedback');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Image source={{ uri: imageUri }} style={styles.backgroundImage} blurRadius={10} />
                <View style={styles.overlay} />
                <ActivityIndicator size="large" color={colors.light.primary} />
                <Text style={styles.loadingText}>{t('detection.analyzing')}</Text>
            </View>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={[typography.title, { color: colors.light.error }]}>{t('detection.error')}</Text>
                    <Text style={typography.body}>{error}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.buttonText}>{t('detection.goHome')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: imageUri }} style={styles.image} />

                <View style={styles.resultCard}>
                    <View style={styles.headerRow}>
                        <Text style={styles.plantName}>{result?.plant || t('detection.plant')}</Text>
                        <View style={[styles.badge, { backgroundColor: result?.status === 'HEALTHY' ? colors.light.success : colors.light.error }]}>
                            <Text style={styles.badgeText}>{result?.status || 'Unknown'}</Text>
                        </View>
                    </View>

                    <Text style={styles.diseaseName}>{result?.condition || 'Analyzing...'}</Text>

                    <View style={styles.confidenceRow}>
                        <Text style={styles.confidence}>{t('detection.confidence')}: {Math.round((result?.confidence || 0) * 100)}%</Text>

                        {/* Speaker Button */}
                        <TouchableOpacity
                            style={[styles.speakerButton, isSpeaking && styles.speakerButtonActive]}
                            onPress={speakTreatment}
                        >
                            <Text style={styles.speakerIcon}>{isSpeaking ? '🔊' : '🔈'}</Text>
                            <Text style={styles.speakerText}>{isSpeaking ? t('detection.stop') : t('detection.listen')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* Message Card */}
                    {result?.fullReport?.message && (
                        <View style={styles.messageCard}>
                            <Text style={styles.messageIcon}>💬</Text>
                            <Text style={styles.messageText}>{result.fullReport.message}</Text>
                        </View>
                    )}

                    {/* Severity Badge */}
                    {result?.fullReport?.severity && result.fullReport.severity !== 'N/A' && (
                        <View style={[
                            styles.severityBadge,
                            {
                                backgroundColor:
                                    result.fullReport.severity === 'High' || result.fullReport.severity === 'Very High' ? '#ff4444' :
                                        result.fullReport.severity === 'Medium' ? '#ffaa00' : '#44cc44'
                            }
                        ]}>
                            <Text style={styles.severityText}>
                                ⚠️ {t('detection.severity')}: {result.fullReport.severity}
                            </Text>
                        </View>
                    )}

                    {/* Treatment Header */}
                    <Text style={styles.treatmentHeader}>📋 {t('detection.treatment')}</Text>

                    {/* Organic Treatment */}
                    {result?.fullReport?.organic && result.fullReport.organic.length > 0 && (
                        <View style={styles.treatmentCard}>
                            <View style={styles.treatmentCardHeader}>
                                <Text style={styles.treatmentCardIcon}>🌿</Text>
                                <Text style={styles.treatmentCardTitle}>{t('detection.organic')}</Text>
                            </View>
                            <View style={styles.treatmentCardContent}>
                                {result.fullReport.organic.map((item, index) => (
                                    <View key={index} style={styles.treatmentItem}>
                                        <Text style={styles.bulletPoint}>•</Text>
                                        <Text style={styles.treatmentItemText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Chemical Treatment */}
                    {result?.fullReport?.chemical && result.fullReport.chemical.length > 0 && (
                        <View style={styles.treatmentCard}>
                            <View style={styles.treatmentCardHeader}>
                                <Text style={styles.treatmentCardIcon}>💊</Text>
                                <Text style={styles.treatmentCardTitle}>{t('detection.chemical')}</Text>
                            </View>
                            <View style={styles.treatmentCardContent}>
                                {result.fullReport.chemical.map((item, index) => (
                                    <View key={index} style={styles.treatmentItem}>
                                        <Text style={styles.bulletPoint}>•</Text>
                                        <Text style={styles.treatmentItemText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Maintenance Tips */}
                    {result?.fullReport?.maintenance && result.fullReport.maintenance.length > 0 && (
                        <View style={styles.treatmentCard}>
                            <View style={styles.treatmentCardHeader}>
                                <Text style={styles.treatmentCardIcon}>✅</Text>
                                <Text style={styles.treatmentCardTitle}>{t('detection.maintenance')}</Text>
                            </View>
                            <View style={styles.treatmentCardContent}>
                                {result.fullReport.maintenance.map((item, index) => (
                                    <View key={index} style={styles.treatmentItem}>
                                        <Text style={styles.bulletPoint}>•</Text>
                                        <Text style={styles.treatmentItemText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Prevention */}
                    {result?.fullReport?.prevention && result.fullReport.prevention.length > 0 && (
                        <View style={styles.treatmentCard}>
                            <View style={styles.treatmentCardHeader}>
                                <Text style={styles.treatmentCardIcon}>🛡️</Text>
                                <Text style={styles.treatmentCardTitle}>{t('detection.prevention')}</Text>
                            </View>
                            <View style={styles.treatmentCardContent}>
                                {result.fullReport.prevention.map((item, index) => (
                                    <View key={index} style={styles.treatmentItem}>
                                        <Text style={styles.bulletPoint}>•</Text>
                                        <Text style={styles.treatmentItemText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Recommendation */}
                    {result?.fullReport?.recommendation && (
                        <View style={styles.recommendationCard}>
                            <Text style={styles.recommendationIcon}>💡</Text>
                            <Text style={styles.recommendationText}>{result.fullReport.recommendation}</Text>
                        </View>
                    )}

                    {/* Fallback */}
                    {!result?.fullReport?.organic && !result?.fullReport?.chemical && !result?.fullReport?.maintenance && (
                        <View style={styles.fallbackCard}>
                            <Text style={styles.fallbackText}>
                                {result?.fullReport?.treatment || result?.fullReport?.description || t('detection.noData')}
                            </Text>
                        </View>
                    )}

                    {/* Feedback Form */}
                    {!feedbackSubmitted ? (
                        <View style={styles.feedbackCard}>
                            <Text style={styles.feedbackTitle}>💭 {t('detection.feedbackTitle')}</Text>

                            <Text style={styles.feedbackQuestion}>{t('detection.feedbackQuestion')}</Text>

                            <View style={styles.feedbackButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.feedbackOption,
                                        isHelpful === true && styles.feedbackOptionSelected
                                    ]}
                                    onPress={() => setIsHelpful(true)}
                                >
                                    <Text style={styles.feedbackIcon}>
                                        {isHelpful === true ? '✅' : '☑️'}
                                    </Text>
                                    <Text style={[
                                        styles.feedbackOptionText,
                                        isHelpful === true && styles.feedbackOptionTextSelected
                                    ]}>
                                        Yes
                                    </Text>
                                </TouchableOpacity>

                                <View style={{ width: spacing.m }} />

                                <TouchableOpacity
                                    style={[
                                        styles.feedbackOption,
                                        isHelpful === false && styles.feedbackOptionSelected
                                    ]}
                                    onPress={() => setIsHelpful(false)}
                                >
                                    <Text style={styles.feedbackIcon}>
                                        {isHelpful === false ? '✅' : '☑️'}
                                    </Text>
                                    <Text style={[
                                        styles.feedbackOptionText,
                                        isHelpful === false && styles.feedbackOptionTextSelected
                                    ]}>
                                        No
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.feedbackInput}
                                placeholder={t('detection.feedbackComment')}
                                placeholderTextColor={colors.light.textSecondary}
                                value={feedbackComment}
                                onChangeText={setFeedbackComment}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />

                            <TouchableOpacity
                                style={[
                                    styles.feedbackSubmitButton,
                                    isHelpful === null && styles.feedbackSubmitButtonDisabled
                                ]}
                                onPress={submitFeedback}
                                disabled={isHelpful === null}
                            >
                                <Text style={styles.feedbackSubmitButtonText}>
                                    {t('detection.feedbackSubmit')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.feedbackThanksCard}>
                            <Text style={styles.feedbackThanksIcon}>✨</Text>
                            <Text style={styles.feedbackThanksText}>{t('detection.feedbackThanks')}</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.buttonText}>{t('detection.done')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    loadingText: {
        marginTop: spacing.m,
        color: 'white',
        ...typography.subtitle,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    resultCard: {
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: colors.light.surface,
        padding: spacing.l,
        minHeight: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    plantName: {
        fontSize: 18,
        color: colors.light.textSecondary,
        fontWeight: '600',
    },
    badge: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: 16,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    diseaseName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.light.text,
        marginBottom: spacing.xs,
    },
    confidenceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    confidence: {
        fontSize: 14,
        color: colors.light.textSecondary,

    },
    divider: {
        height: 1,
        backgroundColor: colors.light.border,
        marginVertical: spacing.m,
    },
    messageCard: {
        flexDirection: 'row',
        backgroundColor: '#f0f9ff',
        borderLeftWidth: 4,
        borderLeftColor: colors.light.primary,
        padding: spacing.m,
        borderRadius: 8,
        marginBottom: spacing.m,
    },
    messageIcon: {
        fontSize: 20,
        marginRight: spacing.s,
    },
    messageText: {
        flex: 1,
        fontSize: 14,
        color: colors.light.text,
        lineHeight: 20,
    },
    severityBadge: {
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderRadius: 8,
        marginBottom: spacing.m,
        alignSelf: 'flex-start',
    },
    severityText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
    },
    treatmentHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.light.text,
        marginTop: spacing.m,
        marginBottom: spacing.m,
    },
    treatmentCard: {
        backgroundColor: '#fafafa',
        borderRadius: 12,
        marginBottom: spacing.m,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.light.border,
    },
    treatmentCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.light.surface,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: colors.light.border,
    },
    treatmentCardIcon: {
        fontSize: 20,
        marginRight: spacing.s,
    },
    treatmentCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.light.text,
    },
    treatmentCardContent: {
        padding: spacing.m,
    },
    treatmentItem: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    bulletPoint: {
        fontSize: 16,
        color: colors.light.primary,
        marginRight: spacing.s,
        fontWeight: 'bold',
    },
    treatmentItemText: {
        flex: 1,
        fontSize: 14,
        color: colors.light.textSecondary,
        lineHeight: 20,
    },
    recommendationCard: {
        flexDirection: 'row',
        backgroundColor: '#fffbeb',
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
        padding: spacing.m,
        borderRadius: 8,
        marginTop: spacing.m,
        marginBottom: spacing.m,
    },
    recommendationIcon: {
        fontSize: 20,
        marginRight: spacing.s,
    },
    recommendationText: {
        flex: 1,
        fontSize: 14,
        color: colors.light.text,
        lineHeight: 20,
        fontStyle: 'italic',
    },
    fallbackCard: {
        backgroundColor: '#f9fafb',
        padding: spacing.m,
        borderRadius: 8,
        marginBottom: spacing.m,
    },
    fallbackText: {
        fontSize: 14,
        color: colors.light.textSecondary,
        lineHeight: 20,
    },
    button: {
        backgroundColor: colors.light.primary,
        paddingVertical: spacing.m,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: spacing.l,
    },
    buttonText: {
        color: 'white',
        ...typography.subtitle,
        fontWeight: '600',
    },
    content: {
        padding: spacing.l,
        flex: 1,
        justifyContent: 'center'
    },
    speakerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.light.primary,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.m,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    speakerButtonActive: {
        backgroundColor: '#ff6b6b',
    },
    speakerIcon: {
        fontSize: 18,
        marginRight: 4,
    },
    speakerText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
    feedbackCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: spacing.l,
        marginTop: spacing.l,
        marginBottom: spacing.m,
        borderWidth: 1,
        borderColor: colors.light.border,
    },
    feedbackTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.light.text,
        marginBottom: spacing.m,
    },
    feedbackQuestion: {
        fontSize: 14,
        color: colors.light.textSecondary,
        marginBottom: spacing.m,
    },
    feedbackButtons: {
        flexDirection: 'row',
        marginBottom: spacing.m,
    },
    feedbackOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.s,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.light.border,
    },
    feedbackOptionSelected: {
        borderColor: colors.light.primary,
        backgroundColor: '#f0f9ff',
    },
    feedbackIcon: {
        fontSize: 20,
        marginRight: spacing.xs,
    },
    feedbackOptionText: {
        fontSize: 14,
        color: colors.light.textSecondary,
        fontWeight: '600',
    },
    feedbackOptionTextSelected: {
        color: colors.light.primary,
    },
    feedbackInput: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.light.border,
        padding: spacing.m,
        fontSize: 14,
        color: colors.light.text,
        minHeight: 80,
        marginBottom: spacing.m,
    },
    feedbackSubmitButton: {
        backgroundColor: colors.light.primary,
        paddingVertical: spacing.m,
        borderRadius: 8,
        alignItems: 'center',
    },
    feedbackSubmitButtonDisabled: {
        backgroundColor: colors.light.border,
        opacity: 0.6,
    },
    feedbackSubmitButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    feedbackThanksCard: {
        backgroundColor: '#f0fdf4',
        borderRadius: 12,
        padding: spacing.l,
        marginTop: spacing.l,
        marginBottom: spacing.m,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#86efac',
    },
    feedbackThanksIcon: {
        fontSize: 32,
        marginBottom: spacing.s,
    },
    feedbackThanksText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#16a34a',
        textAlign: 'center',
    },
});
