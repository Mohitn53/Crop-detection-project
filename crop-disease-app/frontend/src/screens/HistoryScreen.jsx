import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useChat } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';

const HistoryScreen = ({ navigation }) => {
  const { chats, deleteChat, isOnline } = useChat();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredChats = chats.filter(
    (chat) =>
      chat.disease?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.plantType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteChat = (chatId) => {
    Alert.alert(
      t('delete'),
      t('deleteHistory'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteChat(chatId);
          },
        },
      ]
    );
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Low': return COLORS.severityLow;
      case 'Medium': return COLORS.severityMedium;
      case 'High': return COLORS.severityHigh;
      case 'Critical': return COLORS.severityCritical;
      default: return COLORS.textSecondary;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openDetail = (chat) => {
    setSelectedChat(chat);
    setShowDetailModal(true);
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() => openDetail(item)}
      onLongPress={() => handleDeleteChat(item._id)}
    >
      <Image
        source={{ uri: item.imageUrl || item.localImageUri }}
        style={styles.chatImage}
      />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.diseaseName} numberOfLines={1}>
            {item.disease}
          </Text>
          {item.isOffline && (
            <Ionicons name="cloud-offline" size={16} color={COLORS.warning} />
          )}
        </View>

        <Text style={styles.plantType}>🌱 {item.plantType}</Text>

        <View style={styles.chatMeta}>
          <View
            style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(item.severity) + '20' },
            ]}
          >
            <Text
              style={[
                styles.severityText,
                { color: getSeverityColor(item.severity) },
              ]}
            >
              {item.severity}
            </Text>
          </View>
          <Text style={styles.confidence}>{item.confidence?.toFixed(1)}%</Text>
        </View>

        <Text style={styles.timestamp}>{formatDate(item.createdAt)}</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteChat(item._id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('history')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchHistory')}
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {filteredChats.length} {filteredChats.length === 1 ? 'record' : 'records'}
      </Text>

      {/* Chat List */}
      {filteredChats.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyText}>{t('noHistory')}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item._id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('result')}</Text>
              <TouchableOpacity
                onPress={() => setShowDetailModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedChat && (
                <>
                  {/* Image */}
                  <Image
                    source={{ uri: selectedChat.imageUrl || selectedChat.localImageUri }}
                    style={styles.detailImage}
                  />

                  {/* Disease Info */}
                  <View style={styles.diseaseSection}>
                    <Text style={styles.detailDiseaseName}>
                      {selectedChat.disease}
                    </Text>
                    <View style={styles.detailMeta}>
                      <View
                        style={[
                          styles.detailBadge,
                          { backgroundColor: getSeverityColor(selectedChat.severity) },
                        ]}
                      >
                        <Text style={styles.detailBadgeText}>
                          {selectedChat.severity}
                        </Text>
                      </View>
                      <Text style={styles.detailConfidence}>
                        {selectedChat.confidence?.toFixed(1)}% {t('confidence')}
                      </Text>
                    </View>
                    <Text style={styles.detailPlantType}>
                      🌱 {selectedChat.plantType}
                    </Text>
                    <Text style={styles.detailDate}>
                      📅 {formatDate(selectedChat.createdAt)}
                    </Text>
                  </View>

                  {/* Recommendations */}
                  {selectedChat.recommendations?.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>
                        💡 {t('recommendations')}
                      </Text>
                      {selectedChat.recommendations.map((rec, idx) => (
                        <View key={idx} style={styles.recItem}>
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color={COLORS.success}
                          />
                          <Text style={styles.recText}>{rec}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Symptoms */}
                  {selectedChat.additionalInfo?.symptoms?.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>🔍 {t('symptoms')}</Text>
                      {selectedChat.additionalInfo.symptoms.map((sym, idx) => (
                        <Text key={idx} style={styles.infoItem}>• {sym}</Text>
                      ))}
                    </View>
                  )}

                  {/* Causes */}
                  {selectedChat.additionalInfo?.causes?.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>⚠️ {t('causes')}</Text>
                      {selectedChat.additionalInfo.causes.map((cause, idx) => (
                        <Text key={idx} style={styles.infoItem}>• {cause}</Text>
                      ))}
                    </View>
                  )}

                  {/* Prevention */}
                  {selectedChat.additionalInfo?.preventionTips?.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>🛡️ {t('prevention')}</Text>
                      {selectedChat.additionalInfo.preventionTips.map((tip, idx) => (
                        <Text key={idx} style={styles.infoItem}>• {tip}</Text>
                      ))}
                    </View>
                  )}

                  <View style={{ height: 40 }} />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: 50,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    ...SHADOWS.small,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    margin: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    paddingVertical: SPACING.md,
    marginLeft: SPACING.sm,
  },
  resultsCount: {
    paddingHorizontal: SPACING.lg,
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.sm,
  },
  listContent: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  chatImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
  },
  chatContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  diseaseName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  plantType: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  severityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
  },
  severityText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  timestamp: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  deleteButton: {
    padding: SPACING.sm,
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  detailImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  diseaseSection: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailDiseaseName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  detailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  detailBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginRight: SPACING.md,
  },
  detailBadgeText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
  },
  detailConfidence: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  detailPlantType: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  detailDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  detailSection: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  recText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  infoItem: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
});

export default HistoryScreen;
