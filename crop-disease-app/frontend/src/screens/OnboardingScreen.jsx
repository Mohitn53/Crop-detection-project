import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, ONBOARDING_QUESTIONS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [slideAnim] = useState(new Animated.Value(0));

  const questions = ONBOARDING_QUESTIONS;

  const handleAnswer = (answer) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: {
        question: questions[currentQuestion].question,
        answer,
      },
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      // Animate to next question
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Complete onboarding
      completeOnboarding(newAnswers);
    }
  };

  const completeOnboarding = async (finalAnswers) => {
    try {
      const answersArray = Object.values(finalAnswers);
      await updateUser({
        onboardingCompleted: true,
        onboardingAnswers: answersArray,
      });
      navigation.replace('Home');
    } catch (err) {
      console.error('Error completing onboarding:', err);
      navigation.replace('Home');
    }
  };

  const handleSkip = () => {
    completeOnboarding(answers);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundDark]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          disabled={currentQuestion === 0}
          style={[
            styles.backButton,
            currentQuestion === 0 && styles.disabledButton,
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={currentQuestion === 0 ? COLORS.textLight : COLORS.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>{t('skip')}</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1} / {questions.length}
        </Text>
      </View>

      {/* Question */}
      <Animated.View
        style={[
          styles.questionContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.questionIcon}>
            {currentQuestion === 0 && '🌾'}
            {currentQuestion === 1 && '📐'}
            {currentQuestion === 2 && '🦠'}
            {currentQuestion === 3 && '🎯'}
          </Text>
        </View>

        <Text style={styles.questionText}>{currentQ.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQ.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                answers[currentQ.id]?.answer === option && styles.selectedOption,
              ]}
              onPress={() => handleAnswer(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  answers[currentQ.id]?.answer === option &&
                    styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
              <Ionicons
                name={
                  answers[currentQ.id]?.answer === option
                    ? 'checkmark-circle'
                    : 'ellipse-outline'
                }
                size={24}
                color={
                  answers[currentQ.id]?.answer === option
                    ? COLORS.textWhite
                    : COLORS.textLight
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Footer hint */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tap an option to continue
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  backButton: {
    padding: SPACING.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  skipButton: {
    padding: SPACING.sm,
  },
  skipText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    textAlign: 'center',
    marginTop: SPACING.sm,
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  questionIcon: {
    fontSize: 40,
  },
  questionText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  selectedOptionText: {
    color: COLORS.textWhite,
  },
  footer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: FONTS.sizes.sm,
  },
});

export default OnboardingScreen;
