import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations, { getTranslation } from '../constants/translations';
import { useAuth } from './AuthContext';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [language, setLanguageState] = useState('en');

  // Load saved language on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  // Update language when user changes
  useEffect(() => {
    if (user?.language) {
      setLanguageState(user.language);
    }
  }, [user?.language]);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem('language');
      if (saved && translations[saved]) {
        setLanguageState(saved);
      }
    } catch (err) {
      console.error('Error loading language:', err);
    }
  };

  const setLanguage = async (langCode) => {
    if (!translations[langCode]) {
      console.error('Invalid language code:', langCode);
      return;
    }

    try {
      setLanguageState(langCode);
      await AsyncStorage.setItem('language', langCode);

      // Update user preference if logged in
      if (user) {
        await updateUser({ language: langCode });
      }
    } catch (err) {
      console.error('Error setting language:', err);
    }
  };

  // Translation function
  const t = (key) => {
    return getTranslation(language, key);
  };

  const value = {
    language,
    setLanguage,
    t,
    availableLanguages: Object.keys(translations),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
