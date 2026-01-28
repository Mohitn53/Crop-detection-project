import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getHistory } from '../../services/uploadService';
import { colors, spacing, typography } from '../../core/theme';
import { useAuth } from '../../store/authStore';

export default function HistoryScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        try {
            const data = await getHistory();
            setHistory(data);
        } catch (e) {
            console.log('Failed to fetch history', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                style={styles.cardImage}
            />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.plant}</Text>
                    <Text style={[
                        styles.statusText,
                        { color: item.status === 'Healthy' ? colors.light.success : colors.light.error }
                    ]}>
                        {item.status}
                    </Text>
                </View>
                <Text style={styles.cardSubtitle}>{item.condition}</Text>
                <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Scan History</Text>
            </View>

            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No scans yet.</Text>
                        </View>
                    )
                }
            />
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: spacing.m,
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
    listContent: {
        padding: spacing.l,
    },
    card: {
        backgroundColor: colors.light.surface,
        borderRadius: 16,
        marginBottom: spacing.m,
        overflow: 'hidden',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        height: 100,
    },
    cardImage: {
        width: 100,
        height: '100%',
        resizeMode: 'cover',
    },
    cardContent: {
        flex: 1,
        padding: spacing.m,
        justifyContent: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.light.text,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        color: colors.light.textSecondary,
        marginBottom: spacing.xs,
    },
    cardDate: {
        fontSize: 12,
        color: colors.light.textSecondary,
        opacity: 0.7,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.light.textSecondary,
    }
});
