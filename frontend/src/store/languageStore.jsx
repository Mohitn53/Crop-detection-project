import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';

const translations = { en, hi, mr };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('app_language');
            if (savedLanguage && translations[savedLanguage]) {
                setLanguage(savedLanguage);
            }
        } catch (error) {
            console.log('Failed to load language:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const changeLanguage = async (newLanguage) => {
        try {
            if (translations[newLanguage]) {
                setLanguage(newLanguage);
                await AsyncStorage.setItem('app_language', newLanguage);
            }
        } catch (error) {
            console.log('Failed to save language:', error);
        }
    };

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
