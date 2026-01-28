import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { colors, spacing, typography } from '../../core/theme';
import { useAuth } from '../../store/authStore';
import { useLanguage } from '../../store/languageStore';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const { t, language } = useLanguage();

    const [location, setLocation] = useState(null);
    const [nearbyDepartments, setNearbyDepartments] = useState([]);
    const [locationPermission, setLocationPermission] = useState(false);
    const [weatherAlert, setWeatherAlert] = useState(null);
    const [recommendedCrops, setRecommendedCrops] = useState([]);
    const [currentSeason, setCurrentSeason] = useState('');

    // Get localized date
    const getLocalizedDate = () => {
        const date = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };

        if (language === 'hi') {
            return date.toLocaleDateString('hi-IN', options);
        } else if (language === 'mr') {
            return date.toLocaleDateString('mr-IN', options);
        }
        return date.toLocaleDateString('en-US', options);
    };

    // Sample agricultural departments data
    const sampleDepartments = [
        { id: 1, name: 'District Agriculture Office', lat: 19.0760, lng: 72.8777, distance: 2.5 },
        { id: 2, name: 'Krishi Vigyan Kendra', lat: 19.0896, lng: 72.8656, distance: 4.2 },
        { id: 3, name: 'Agricultural Extension Center', lat: 19.0545, lng: 72.8910, distance: 5.8 },
    ];

    // Crop recommendations based on season (sample data)
    const cropDatabase = {
        'Kharif': [
            { name: 'Rice', icon: '🌾', profitability: 'High', duration: '120-150 days' },
            { name: 'Cotton', icon: '🌸', profitability: 'High', duration: '150-180 days' },
            { name: 'Soybean', icon: '🫘', profitability: 'Medium', duration: '90-120 days' },
        ],
        'Rabi': [
            { name: 'Wheat', icon: '🌾', profitability: 'High', duration: '120-150 days' },
            { name: 'Mustard', icon: '🌼', profitability: 'Medium', duration: '90-120 days' },
            { name: 'Chickpea', icon: '🫘', profitability: 'High', duration: '100-120 days' },
        ],
        'Zaid': [
            { name: 'Watermelon', icon: '🍉', profitability: 'High', duration: '80-100 days' },
            { name: 'Cucumber', icon: '🥒', profitability: 'Medium', duration: '50-70 days' },
            { name: 'Muskmelon', icon: '🍈', profitability: 'Medium', duration: '80-100 days' },
        ],
    };

    useEffect(() => {
        requestLocationPermission();
        determineSeasonAndCrops();
    }, []);

    const determineSeasonAndCrops = () => {
        const month = new Date().getMonth() + 1; // 1-12
        let season = '';

        if (month >= 6 && month <= 10) {
            season = 'Kharif'; // Monsoon season (June-October)
        } else if (month >= 11 || month <= 3) {
            season = 'Rabi'; // Winter season (November-March)
        } else {
            season = 'Zaid'; // Summer season (April-May)
        }

        setCurrentSeason(season);
        setRecommendedCrops(cropDatabase[season] || []);
    };

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setLocationPermission(true);
                getUserLocation();
            }
        } catch (error) {
            console.log('Location permission error:', error);
        }
    };

    const getUserLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
            setNearbyDepartments(sampleDepartments);

            // Simulate weather check (in production, call weather API)
            checkWeatherAlerts(location.coords);
        } catch (error) {
            console.log('Get location error:', error);
        }
    };

    const checkWeatherAlerts = (coords) => {
        // Simulated weather check - in production, call OpenWeatherMap or similar API
        // For now, showing "no alerts" message
        setWeatherAlert({
            type: 'safe',
            message: t('home.noAlerts')
        });
    };

    const openDirections = (dept) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${dept.lat},${dept.lng}`;
        Linking.openURL(url);
    };

    const handleLogout = () => {
        Alert.alert(t('home.logout'), t('home.logoutConfirm'), [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('home.logout'), style: 'destructive', onPress: logout }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>{t('home.greeting')}, {user?.username || 'Farmer'}</Text>
                    <Text style={styles.date}>{getLocalizedDate()}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>{t('home.logout')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Weather Alert Banner */}
                    {weatherAlert && (
                        <View style={[
                            styles.alertBanner,
                            weatherAlert.type === 'safe' ? styles.alertSafe : styles.alertDanger
                        ]}>
                            <Text style={styles.alertIcon}>
                                {weatherAlert.type === 'safe' ? '☀️' : '⚠️'}
                            </Text>
                            <View style={styles.alertTextContainer}>
                                <Text style={styles.alertTitle}>{t('home.weatherAlert')}</Text>
                                <Text style={styles.alertMessage}>{weatherAlert.message}</Text>
                            </View>
                        </View>
                    )}

                    {/* Main Action */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => navigation.navigate('Camera')}
                            activeOpacity={0.9}
                        >
                            <View style={styles.iconCircle}>
                                <Text style={{ fontSize: 50 }}>📷</Text>
                            </View>
                            <Text style={styles.scanButtonText}>{t('home.scanCrop')}</Text>
                            <Text style={styles.scanButtonSubtext}>{t('home.detectDiseases')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Secondary Actions */}
                    <View style={styles.grid}>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('History')}
                        >
                            <Text style={styles.cardIcon}>📜</Text>
                            <Text style={styles.cardTitle}>{t('home.history')}</Text>
                            <Text style={styles.cardSubtitle}>{t('home.pastScans')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('Settings')}
                        >
                            <Text style={styles.cardIcon}>⚙️</Text>
                            <Text style={styles.cardTitle}>{t('home.settings')}</Text>
                            <Text style={styles.cardSubtitle}>{t('home.preferences')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Recommended Crops Section */}
                    <View style={styles.cropsSection}>
                        <Text style={styles.sectionTitle}>🌱 {t('home.profitableCrops')}</Text>
                        <Text style={styles.sectionSubtitle}>
                            {t('home.basedOnLocation')} • {t('home.season')}: {currentSeason}
                        </Text>

                        {recommendedCrops.map((crop, index) => (
                            <View key={index} style={styles.cropCard}>
                                <Text style={styles.cropIcon}>{crop.icon}</Text>
                                <View style={styles.cropDetails}>
                                    <Text style={styles.cropName}>{crop.name}</Text>
                                    <Text style={styles.cropDuration}>⏱️ {crop.duration}</Text>
                                </View>
                                <View style={[
                                    styles.profitBadge,
                                    crop.profitability === 'High' ? styles.profitHigh : styles.profitMedium
                                ]}>
                                    <Text style={styles.profitText}>{crop.profitability}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Nearby Agricultural Departments */}
                    <View style={styles.departmentsSection}>
                        <Text style={styles.sectionTitle}>📍 {t('home.nearbyDepartments')}</Text>

                        {!locationPermission ? (
                            <View style={styles.permissionCard}>
                                <Text style={styles.permissionIcon}>🗺️</Text>
                                <Text style={styles.permissionText}>{t('home.locationPermission')}</Text>
                                <TouchableOpacity
                                    style={styles.permissionButton}
                                    onPress={requestLocationPermission}
                                >
                                    <Text style={styles.permissionButtonText}>Enable Location</Text>
                                </TouchableOpacity>
                            </View>
                        ) : nearbyDepartments.length > 0 ? (
                            nearbyDepartments.map((dept) => (
                                <View key={dept.id} style={styles.departmentCard}>
                                    <View style={styles.departmentInfo}>
                                        <Text style={styles.departmentIcon}>🏛️</Text>
                                        <View style={styles.departmentDetails}>
                                            <Text style={styles.departmentName}>{dept.name}</Text>
                                            <Text style={styles.departmentDistance}>
                                                📏 {dept.distance} {t('home.distance')}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.directionsButton}
                                        onPress={() => openDirections(dept)}
                                    >
                                        <Text style={styles.directionsButtonText}>🧭</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={styles.noDepartmentsCard}>
                                <Text style={styles.noDepartmentsText}>{t('home.noNearbyDepartments')}</Text>
                            </View>
                        )}
                    </View>
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
    header: {
        padding: spacing.l,
        paddingTop: spacing.xl,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        ...typography.header,
        color: colors.light.text,
    },
    date: {
        ...typography.caption,
        fontSize: 14,
        color: colors.light.textSecondary,
        marginTop: spacing.xs,
    },
    logoutButton: {
        padding: spacing.s,
    },
    logoutText: {
        color: colors.light.error,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: spacing.l,
    },
    // Weather Alert Banner
    alertBanner: {
        flexDirection: 'row',
        padding: spacing.m,
        borderRadius: 12,
        marginBottom: spacing.l,
        alignItems: 'center',
    },
    alertSafe: {
        backgroundColor: '#e8f5e9',
        borderLeftWidth: 4,
        borderLeftColor: '#4caf50',
    },
    alertDanger: {
        backgroundColor: '#ffebee',
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
    },
    alertIcon: {
        fontSize: 32,
        marginRight: spacing.m,
    },
    alertTextContainer: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.light.text,
        marginBottom: 2,
    },
    alertMessage: {
        fontSize: 13,
        color: colors.light.textSecondary,
    },
    actionContainer: {
        flex: 2,
        justifyContent: 'center',
        marginBottom: spacing.l,
    },
    scanButton: {
        width: '100%',
        aspectRatio: 1.1,
        backgroundColor: colors.light.primary,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.light.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    scanButtonText: {
        ...typography.title,
        color: 'white',
    },
    scanButtonSubtext: {
        ...typography.body,
        color: 'rgba(255,255,255,0.9)',
        marginTop: spacing.xs,
    },
    grid: {
        flex: 1,
        flexDirection: 'row',
        gap: spacing.m,
    },
    card: {
        flex: 1,
        backgroundColor: colors.light.surface,
        borderRadius: 20,
        padding: spacing.m,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardIcon: {
        fontSize: 32,
        marginBottom: spacing.s,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.light.text,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 12,
        color: colors.light.textSecondary,
    },
    // Crops Section
    cropsSection: {
        marginTop: spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.light.text,
        marginBottom: spacing.xs,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: colors.light.textSecondary,
        marginBottom: spacing.m,
    },
    cropCard: {
        backgroundColor: colors.light.surface,
        borderRadius: 16,
        padding: spacing.m,
        marginBottom: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cropIcon: {
        fontSize: 36,
        marginRight: spacing.m,
    },
    cropDetails: {
        flex: 1,
    },
    cropName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.light.text,
        marginBottom: 4,
    },
    cropDuration: {
        fontSize: 13,
        color: colors.light.textSecondary,
    },
    profitBadge: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: 12,
    },
    profitHigh: {
        backgroundColor: '#4caf50',
    },
    profitMedium: {
        backgroundColor: '#ff9800',
    },
    profitText: {
        fontSize: 12,
        fontWeight: '700',
        color: 'white',
    },
    // Departments Section
    departmentsSection: {
        marginTop: spacing.xl,
        paddingBottom: spacing.xl,
    },
    permissionCard: {
        backgroundColor: colors.light.surface,
        borderRadius: 16,
        padding: spacing.l,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.light.border,
        borderStyle: 'dashed',
    },
    permissionIcon: {
        fontSize: 48,
        marginBottom: spacing.m,
    },
    permissionText: {
        fontSize: 14,
        color: colors.light.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.m,
    },
    permissionButton: {
        backgroundColor: colors.light.primary,
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.s,
        borderRadius: 12,
    },
    permissionButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    departmentCard: {
        backgroundColor: colors.light.surface,
        borderRadius: 16,
        padding: spacing.m,
        marginBottom: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    departmentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    departmentIcon: {
        fontSize: 32,
        marginRight: spacing.m,
    },
    departmentDetails: {
        flex: 1,
    },
    departmentName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.light.text,
        marginBottom: 4,
    },
    departmentDistance: {
        fontSize: 13,
        color: colors.light.textSecondary,
    },
    directionsButton: {
        backgroundColor: colors.light.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionsButtonText: {
        fontSize: 20,
    },
    noDepartmentsCard: {
        backgroundColor: colors.light.surface,
        borderRadius: 16,
        padding: spacing.l,
        alignItems: 'center',
    },
    noDepartmentsText: {
        fontSize: 14,
        color: colors.light.textSecondary,
        textAlign: 'center',
    }
});
