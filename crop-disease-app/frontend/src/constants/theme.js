// Theme colors - Earthy palette
export const COLORS = {
  // Primary greens
  primary: '#2D5A27',
  primaryLight: '#4A7C43',
  primaryDark: '#1E3D1A',
  
  // Secondary browns
  secondary: '#8B6914',
  secondaryLight: '#B8941F',
  secondaryDark: '#5C460D',
  
  // Background colors
  background: '#F5F5F0',
  backgroundDark: '#E8E8E0',
  card: '#FFFFFF',
  
  // Text colors
  text: '#2C2C2C',
  textSecondary: '#666666',
  textLight: '#999999',
  textWhite: '#FFFFFF',
  
  // Accent colors
  accent: '#D4A84B',
  accentLight: '#F0D78C',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Severity colors
  severityLow: '#4CAF50',
  severityMedium: '#FF9800',
  severityHigh: '#F44336',
  severityCritical: '#9C27B0',
  
  // Others
  border: '#E0E0E0',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
};

// Typography
export const FONTS = {
  regular: 'System',
  bold: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
    title: 28,
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border radius
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 50,
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  // For Android emulator use: 'http://10.0.2.2:5000/api'
  // For physical device use your computer's IP: 'http://192.168.x.x:5000/api'
  TIMEOUT: 30000,
};

// App Constants
export const APP_CONFIG = {
  APP_NAME: 'CropGuard',
  VERSION: '1.0.0',
  SPLASH_DURATION: 2500,
  MAX_OFFLINE_CHATS: 50,
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_SIZE: 1024,
};

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

// Onboarding Questions
export const ONBOARDING_QUESTIONS = [
  {
    id: 1,
    question: 'What type of crops do you grow?',
    options: ['Fruits', 'Vegetables', 'Grains', 'Mixed/Other'],
  },
  {
    id: 2,
    question: 'How large is your farming area?',
    options: ['Small (< 1 acre)', 'Medium (1-10 acres)', 'Large (> 10 acres)', 'Home Garden'],
  },
  {
    id: 3,
    question: 'Have you faced crop diseases before?',
    options: ['Yes, frequently', 'Yes, occasionally', 'Rarely', 'Never'],
  },
  {
    id: 4,
    question: 'What is your main goal with this app?',
    options: ['Early disease detection', 'Treatment recommendations', 'Learn about plant health', 'All of the above'],
  },
];

// FAQ Data
export const FAQ_DATA = [
  {
    question: 'How accurate is the disease detection?',
    answer: 'Our AI model is trained on the PlantVillage dataset with over 90% accuracy. However, we recommend consulting an agricultural expert for critical decisions.',
  },
  {
    question: 'Can I use the app offline?',
    answer: 'Yes! The app caches your recent scans and can work offline. Your data will sync when you reconnect to the internet.',
  },
  {
    question: 'What plants can the app detect diseases for?',
    answer: 'Currently we support: Apple, Tomato, Corn, Grape, Potato, Pepper, Strawberry, Peach, Orange, and more!',
  },
  {
    question: 'How do I get the best scan results?',
    answer: 'Take clear, well-lit photos of individual leaves. Avoid shadows and ensure the diseased area is visible.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, all your data is encrypted and stored securely. We never share your personal information.',
  },
];

export default {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
  API_CONFIG,
  APP_CONFIG,
  LANGUAGES,
  ONBOARDING_QUESTIONS,
  FAQ_DATA,
};
