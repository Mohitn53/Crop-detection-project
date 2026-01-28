import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { uploadImage } from '../../services/uploadService';
import { colors, spacing, typography } from '../../core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetectionScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { imageUri } = route.params;

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        processImage();
    }, []);

    const processImage = async () => {
        try {
            const data = await uploadImage(imageUri);
            // Data format: { message, scan: { imageUrl, plant, condition, status, confidence, fullReport } }
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
            await AsyncStorage.setItem('scan_history', JSON.stringify(parsed)); // Cache for offline
        } catch (e) {
            console.log('Failed to save offline', e);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Image source={{ uri: imageUri }} style={styles.backgroundImage} blurRadius={10} />
                <View style={styles.overlay} />
                <ActivityIndicator size="large" color={colors.light.primary} />
                <Text style={styles.loadingText}>Analyzing Crop Health...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={[typography.title, { color: colors.light.error }]}>Error</Text>
                    <Text style={typography.body}>{error}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.buttonText}>Go Home</Text>
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
                        <Text style={styles.plantName}>{result?.plant || 'Unknown Plant'}</Text>
                        <View style={[styles.badge, { backgroundColor: result?.status === 'Healthy' ? colors.light.success : colors.light.error }]}>
                            <Text style={styles.badgeText}>{result?.status || 'Unknown'}</Text>
                        </View>
                    </View>

                    <Text style={styles.diseaseName}>{result?.condition || 'Analyzing...'}</Text>
                    <Text style={styles.confidence}>Confidence: {Math.round((result?.confidence || 0) * 100)}%</Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Treatment / Details</Text>
                    <Text style={styles.description}>
                        {/* Fallback description if backend doesn't provide treatment text */}
                        {result?.fullReport?.treatment || result?.fullReport?.description || 'No specific treatment data available from server. Please consult an expert.'}
                    </Text>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.buttonText}>Done</Text>
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
        paddingBottom: spacing.l,
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
    confidence: {
        fontSize: 14,
        color: colors.light.textSecondary,
        marginBottom: spacing.l,
    },
    divider: {
        height: 1,
        backgroundColor: colors.light.border,
        marginVertical: spacing.m,
    },
    sectionTitle: {
        ...typography.subtitle,
        color: colors.light.text,
        marginBottom: spacing.s,
    },
    description: {
        ...typography.body,
        color: colors.light.textSecondary,
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    button: {
        backgroundColor: colors.light.primary,
        paddingVertical: spacing.m,
        borderRadius: 12,
        alignItems: 'center',
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
    }
});
