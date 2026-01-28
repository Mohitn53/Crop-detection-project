// Translations for multi-language support
const translations = {
  en: {
    // Common
    appName: 'CropGuard',
    tagline: 'Protect Your Crops with AI',
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    done: 'Done',
    
    // Auth
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    loginWithGoogle: 'Continue with Google',
    orContinueWith: 'or continue with',
    
    // Home
    welcome: 'Welcome',
    scanLeaf: 'Scan Leaf',
    uploadImage: 'Upload Image',
    recentScans: 'Recent Scans',
    viewAll: 'View All',
    noScans: 'No scans yet. Start by scanning a leaf!',
    
    // Scan
    scanTitle: 'Scan Your Plant',
    takePhoto: 'Take Photo',
    chooseFromGallery: 'Choose from Gallery',
    analyzing: 'Analyzing...',
    
    // Results
    result: 'Result',
    disease: 'Disease',
    confidence: 'Confidence',
    severity: 'Severity',
    plantType: 'Plant Type',
    recommendations: 'Recommendations',
    symptoms: 'Symptoms',
    causes: 'Causes',
    prevention: 'Prevention Tips',
    healthy: 'Healthy',
    
    // History
    history: 'History',
    searchHistory: 'Search history...',
    noHistory: 'No scan history yet',
    deleteHistory: 'Delete this record?',
    
    // Profile
    profile: 'Profile',
    editProfile: 'Edit Profile',
    phone: 'Phone Number',
    location: 'Location',
    farmDetails: 'Farm Details',
    farmName: 'Farm Name',
    cropTypes: 'Crop Types',
    farmSize: 'Farm Size',
    language: 'Language',
    
    // Settings
    settings: 'Settings',
    notifications: 'Notifications',
    darkMode: 'Dark Mode',
    about: 'About',
    help: 'Help & Support',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    
    // Offline
    offline: 'You are offline',
    syncPending: 'Sync pending',
    syncing: 'Syncing...',
    synced: 'All synced',
    
    // FAQ
    faq: 'FAQ',
    frequentlyAsked: 'Frequently Asked Questions',
    
    // Onboarding
    getStarted: 'Get Started',
    letsSetup: "Let's set up your profile",
    
    // Severity levels
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  },
  
  hi: {
    // Hindi translations
    appName: 'क्रॉपगार्ड',
    tagline: 'AI से अपनी फसलों की रक्षा करें',
    loading: 'लोड हो रहा है...',
    error: 'कुछ गलत हो गया',
    retry: 'पुनः प्रयास करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    confirm: 'पुष्टि करें',
    back: 'वापस',
    next: 'अगला',
    skip: 'छोड़ें',
    done: 'हो गया',
    
    login: 'लॉग इन',
    signup: 'साइन अप',
    logout: 'लॉग आउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'पूरा नाम',
    forgotPassword: 'पासवर्ड भूल गए?',
    noAccount: 'खाता नहीं है?',
    haveAccount: 'पहले से खाता है?',
    loginWithGoogle: 'Google से जारी रखें',
    
    welcome: 'स्वागत है',
    scanLeaf: 'पत्ता स्कैन करें',
    uploadImage: 'छवि अपलोड करें',
    recentScans: 'हाल के स्कैन',
    viewAll: 'सभी देखें',
    noScans: 'कोई स्कैन नहीं। पत्ता स्कैन करके शुरू करें!',
    
    result: 'परिणाम',
    disease: 'रोग',
    confidence: 'विश्वास',
    severity: 'गंभीरता',
    plantType: 'पौधे का प्रकार',
    recommendations: 'सिफारिशें',
    
    history: 'इतिहास',
    profile: 'प्रोफ़ाइल',
    language: 'भाषा',
    
    offline: 'आप ऑफलाइन हैं',
    faq: 'सामान्य प्रश्न',
    
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    critical: 'गंभीर',
  },
  
  es: {
    // Spanish translations
    appName: 'CropGuard',
    tagline: 'Protege tus cultivos con IA',
    loading: 'Cargando...',
    error: 'Algo salió mal',
    retry: 'Reintentar',
    cancel: 'Cancelar',
    save: 'Guardar',
    
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    logout: 'Cerrar sesión',
    email: 'Correo electrónico',
    password: 'Contraseña',
    name: 'Nombre completo',
    
    welcome: 'Bienvenido',
    scanLeaf: 'Escanear hoja',
    uploadImage: 'Subir imagen',
    recentScans: 'Escaneos recientes',
    
    result: 'Resultado',
    disease: 'Enfermedad',
    confidence: 'Confianza',
    severity: 'Gravedad',
    
    history: 'Historial',
    profile: 'Perfil',
    language: 'Idioma',
    
    offline: 'Estás sin conexión',
    faq: 'Preguntas frecuentes',
    
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    critical: 'Crítico',
  },
};

export default translations;

// Helper function to get translation
export const getTranslation = (lang, key) => {
  const langTranslations = translations[lang] || translations.en;
  return langTranslations[key] || translations.en[key] || key;
};
