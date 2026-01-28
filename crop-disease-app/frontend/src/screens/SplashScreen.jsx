import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, APP_CONFIG } from '../constants/theme';

const SplashScreen = ({ onFinish }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [textAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate text after logo
    setTimeout(() => {
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    // Navigate after splash duration
    const timer = setTimeout(() => {
      onFinish();
    }, APP_CONFIG.SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark, '#1A2F1A']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Icon */}
        <View style={styles.logoIcon}>
          <Text style={styles.logoEmoji}>🌿</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textAnim,
            transform: [
              {
                translateY: textAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>{APP_CONFIG.APP_NAME}</Text>
        <Text style={styles.tagline}>Protect Your Crops with AI</Text>
      </Animated.View>

      <Animated.View style={[styles.loadingContainer, { opacity: textAnim }]}>
        <View style={styles.loadingDots}>
          {[0, 1, 2].map((i) => (
            <LoadingDot key={i} delay={i * 200} />
          ))}
        </View>
      </Animated.View>

      <Text style={styles.version}>v{APP_CONFIG.VERSION}</Text>
    </LinearGradient>
  );
};

// Animated loading dot
const LoadingDot = ({ delay }) => {
  const [anim] = useState(new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          }),
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.3],
              }),
            },
          ],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoEmoji: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.xxxl + 8,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FONTS.sizes.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: FONTS.sizes.sm,
  },
});

export default SplashScreen;
