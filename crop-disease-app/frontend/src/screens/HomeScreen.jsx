import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  Animated,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, LANGUAGES, FAQ_DATA } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

// Banner data for carousel
const BANNERS = [
  {
    id: 1,
    title: 'AI-Powered Detection',
    subtitle: 'Identify plant diseases instantly',
    color: COLORS.primary,
    icon: '🔬',
  },
  {
    id: 2,
    title: 'Expert Recommendations',
    subtitle: 'Get treatment advice',
    color: COLORS.secondary,
    icon: '💡',
  },
  {
    id: 3,
    title: 'Track Your Crops',
    subtitle: 'Monitor plant health over time',
    color: COLORS.primaryLight,
    icon: '📊',
  },
];

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { chats, loading, isOnline, uploadAndAnalyze, pendingSyncCount, fetchChats } = useChat();
  const { t, language, setLanguage } = useLanguage();

  const [refreshing, setRefreshing] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Auto-scroll carousel
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentBanner + 1) % BANNERS.length;
      carouselRef.current?.scrollTo({
        x: nextIndex * (width - SPACING.lg * 2),
        animated: true,
      });
      setCurrentBanner(nextIndex);
    }, 4000);

    return () => clearInterval(timer);
  }, [currentBanner]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  };

  const handleScanLeaf = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Camera permission is required to scan leaves');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      analyzeImage(result.assets[0].uri);
    }
  };

  const handleUploadImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Gallery permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (uri) => {
    setAnalyzing(true);
    const result = await uploadAndAnalyze(uri);
    setAnalyzing(false);

    if (result.success) {
      setSelectedChat(result.data);
      setShowResultModal(true);
    } else {
      alert('Analysis failed: ' + (result.error || 'Please try again'));
    }
  };

  const openChatDetail = (chat) => {
    setSelectedChat(chat);
    setShowResultModal(true);
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
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hrs ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="time-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>🌱 CropGuard</Text>

        <View style={styles.navRight}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setShowLanguageModal(true)}
          >
            <Ionicons name="globe-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            {t('welcome')}, {user?.name?.split(' ')[0] || 'Farmer'}! 👋
          </Text>
          <Text style={styles.welcomeSubtext}>
            Scan your plant leaves to detect diseases
          </Text>
        </View>

        {/* Carousel Banners */}
        <ScrollView
          ref={carouselRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          style={styles.carouselContainer}
        >
          {BANNERS.map((banner, index) => (
            <LinearGradient
              key={banner.id}
              colors={[banner.color, banner.color + 'CC']}
              style={styles.bannerCard}
            >
              <Text style={styles.bannerIcon}>{banner.icon}</Text>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
              </View>
            </LinearGradient>
          ))}
        </ScrollView>

        {/* Carousel Dots */}
        <View style={styles.dotsContainer}>
          {BANNERS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentBanner === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Scan Buttons */}
        <View style={styles.scanButtonsContainer}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScanLeaf}
            disabled={analyzing}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.scanButtonGradient}
            >
              <Ionicons name="camera" size={32} color={COLORS.textWhite} />
              <Text style={styles.scanButtonText}>{t('scanLeaf')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleUploadImage}
            disabled={analyzing}
          >
            <LinearGradient
              colors={[COLORS.secondary, COLORS.secondaryDark]}
              style={styles.scanButtonGradient}
            >
              <Ionicons name="images" size={32} color={COLORS.textWhite} />
              <Text style={styles.scanButtonText}>{t('uploadImage')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Analyzing Indicator */}
        {analyzing && (
          <View style={styles.analyzingContainer}>
            <Text style={styles.analyzingText}>🔬 Analyzing your image...</Text>
          </View>
        )}

        {/* Recent Scans - ChatGPT Style */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('recentScans')}</Text>
            {chats.length > 0 && (
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={styles.viewAllText}>{t('viewAll')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {chats.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🌿</Text>
              <Text style={styles.emptyText}>{t('noScans')}</Text>
            </View>
          ) : (
            <View style={styles.chatList}>
              {chats.slice(0, 5).map((chat) => (
                <TouchableOpacity
                  key={chat._id}
                  style={styles.chatCard}
                  onPress={() => openChatDetail(chat)}
                >
                  <Image
                    source={{ uri: chat.imageUrl || chat.localImageUri }}
                    style={styles.chatImage}
                  />
                  <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                      <Text style={styles.chatDisease} numberOfLines={1}>
                        {chat.disease}
                      </Text>
                      {chat.isOffline && (
                        <Ionicons
                          name="cloud-offline"
                          size={14}
                          color={COLORS.warning}
                        />
                      )}
                    </View>
                    <View style={styles.chatMeta}>
                      <View
                        style={[
                          styles.severityBadge,
                          { backgroundColor: getSeverityColor(chat.severity) + '20' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.severityText,
                            { color: getSeverityColor(chat.severity) },
                          ]}
                        >
                          {chat.severity}
                        </Text>
                      </View>
                      <Text style={styles.confidenceText}>
                        {chat.confidence?.toFixed(1)}%
                      </Text>
                    </View>
                    <Text style={styles.chatTime}>
                      {formatDate(chat.createdAt)}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('faq')}</Text>
            <TouchableOpacity onPress={() => setShowFAQModal(true)}>
              <Text style={styles.viewAllText}>{t('viewAll')}</Text>
            </TouchableOpacity>
          </View>

          {FAQ_DATA.slice(0, 2).map((item, index) => (
            <View key={index} style={styles.faqCard}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Text style={styles.faqAnswer} numberOfLines={2}>
                {item.answer}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Offline Indicator */}
      {!isOnline && (
        <View style={styles.offlineBar}>
          <Ionicons name="cloud-offline" size={16} color={COLORS.textWhite} />
          <Text style={styles.offlineText}>
            {t('offline')} {pendingSyncCount > 0 && `(${pendingSyncCount} pending)`}
          </Text>
        </View>
      )}

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.languageModal}>
            <Text style={styles.modalTitle}>{t('language')}</Text>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  language === lang.code && styles.selectedLanguage,
                ]}
                onPress={() => {
                  setLanguage(lang.code);
                  setShowLanguageModal(false);
                }}
              >
                <Text style={styles.languageName}>{lang.nativeName}</Text>
                <Text style={styles.languageCode}>{lang.name}</Text>
                {language === lang.code && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Result Modal */}
      <Modal
        visible={showResultModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowResultModal(false)}
      >
        <View style={styles.resultModalContainer}>
          <View style={styles.resultModal}>
            {/* Modal Header */}
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>{t('result')}</Text>
              <TouchableOpacity
                onPress={() => setShowResultModal(false)}
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
                    style={styles.resultImage}
                  />

                  {/* Disease Info */}
                  <View style={styles.diseaseInfo}>
                    <Text style={styles.diseaseName}>{selectedChat.disease}</Text>
                    <View style={styles.resultMeta}>
                      <View
                        style={[
                          styles.resultBadge,
                          { backgroundColor: getSeverityColor(selectedChat.severity) },
                        ]}
                      >
                        <Text style={styles.resultBadgeText}>
                          {selectedChat.severity}
                        </Text>
                      </View>
                      <Text style={styles.resultConfidence}>
                        {selectedChat.confidence?.toFixed(1)}% {t('confidence')}
                      </Text>
                    </View>
                    <Text style={styles.plantType}>
                      🌱 {selectedChat.plantType}
                    </Text>
                  </View>

                  {/* Recommendations */}
                  {selectedChat.recommendations?.length > 0 && (
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>
                        💡 {t('recommendations')}
                      </Text>
                      {selectedChat.recommendations.map((rec, idx) => (
                        <View key={idx} style={styles.recommendationItem}>
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color={COLORS.success}
                          />
                          <Text style={styles.recommendationText}>{rec}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Symptoms */}
                  {selectedChat.additionalInfo?.symptoms?.length > 0 && (
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>
                        🔍 {t('symptoms')}
                      </Text>
                      {selectedChat.additionalInfo.symptoms.map((sym, idx) => (
                        <Text key={idx} style={styles.infoItem}>• {sym}</Text>
                      ))}
                    </View>
                  )}

                  {/* Prevention Tips */}
                  {selectedChat.additionalInfo?.preventionTips?.length > 0 && (
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>
                        🛡️ {t('prevention')}
                      </Text>
                      {selectedChat.additionalInfo.preventionTips.map((tip, idx) => (
                        <Text key={idx} style={styles.infoItem}>• {tip}</Text>
                      ))}
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* FAQ Modal */}
      <Modal
        visible={showFAQModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFAQModal(false)}
      >
        <View style={styles.resultModalContainer}>
          <View style={styles.resultModal}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>{t('faq')}</Text>
              <TouchableOpacity
                onPress={() => setShowFAQModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {FAQ_DATA.map((item, index) => (
                <View key={index} style={styles.faqModalCard}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Text style={styles.faqAnswerFull}>{item.answer}</Text>
                </View>
              ))}
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: 50,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    ...SHADOWS.small,
  },
  navButton: {
    padding: SPACING.sm,
  },
  navTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  navRight: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: SPACING.lg,
  },
  welcomeText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  welcomeSubtext: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  carouselContainer: {
    paddingHorizontal: SPACING.lg,
  },
  bannerCard: {
    width: width - SPACING.lg * 2,
    height: 140,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xl,
    marginRight: SPACING.md,
  },
  bannerIcon: {
    fontSize: 50,
    marginRight: SPACING.lg,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    marginBottom: SPACING.xs,
  },
  bannerSubtitle: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.9)',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  scanButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  scanButton: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  scanButtonGradient: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  scanButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginTop: SPACING.sm,
  },
  analyzingContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  analyzingText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary,
    fontWeight: '600',
  },
  section: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewAllText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
  },
  chatList: {
    gap: SPACING.md,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  chatImage: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
  },
  chatInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  chatDisease: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
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
  confidenceText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  chatTime: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  faqCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  faqQuestion: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  faqAnswer: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  faqAnswerFull: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  faqModalCard: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  offlineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warning,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  offlineText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  languageModal: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedLanguage: {
    backgroundColor: COLORS.primary + '10',
    marginHorizontal: -SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  languageName: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    fontWeight: '500',
  },
  languageCode: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.md,
  },
  resultModalContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  resultModal: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: '90%',
    paddingBottom: 40,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  resultImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  diseaseInfo: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  diseaseName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  resultBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginRight: SPACING.md,
  },
  resultBadgeText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
  },
  resultConfidence: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  plantType: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
  },
  resultSection: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultSectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  recommendationText: {
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

export default HomeScreen;
