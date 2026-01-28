import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../../core/theme';
import { useAuth } from '../../store/authStore';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user, logout } = useAuth();

    // Format date
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.username || 'Farmer'}</Text>
                    <Text style={styles.date}>{today}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
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
                        <Text style={styles.scanButtonText}>Scan Crop</Text>
                        <Text style={styles.scanButtonSubtext}>Detect diseases instantly</Text>
                    </TouchableOpacity>
                </View>

                {/* Secondary Actions */}
                <View style={styles.grid}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('History')}
                    >
                        <Text style={styles.cardIcon}>📜</Text>
                        <Text style={styles.cardTitle}>History</Text>
                        <Text style={styles.cardSubtitle}>Past scans</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => Alert.alert('Coming Soon', 'Weather features coming soon!')}
                    >
                        <Text style={styles.cardIcon}>☁️</Text>
                        <Text style={styles.cardTitle}>Weather</Text>
                        <Text style={styles.cardSubtitle}>Local forecast</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    content: {
        flex: 1,
        padding: spacing.l,
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
    }

});
