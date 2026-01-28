import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../features/splash/SplashScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';
import CameraScreen from '../features/camera/CameraScreen';
import DetectionScreen from '../features/detection/DetectionScreen';
import HistoryScreen from '../features/history/HistoryScreen';
import HomeScreen from '../features/home/HomeScreen';
import SettingsScreen from '../features/settings/SettingsScreen';
import { colors } from '../core/theme';
import { useAuth } from '../store/authStore';
import { useLanguage } from '../store/languageStore';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { token, isLoading: authLoading } = useAuth();
    const { isLoading: langLoading } = useLanguage();
    const [hasSeenSplash, setHasSeenSplash] = useState(false);
    const [checkingSplash, setCheckingSplash] = useState(true);

    useEffect(() => {
        checkSplashStatus();
    }, []);

    const checkSplashStatus = async () => {
        try {
            const seen = await AsyncStorage.getItem('has_seen_splash');
            setHasSeenSplash(seen === 'true');
        } catch (error) {
            console.log('Failed to check splash status:', error);
        } finally {
            setCheckingSplash(false);
        }
    };

    if (authLoading || langLoading || checkingSplash) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.light.background }}>
                <ActivityIndicator size="large" color={colors.light.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!hasSeenSplash ? (
                    // Splash Screen (shown once)
                    <Stack.Screen
                        name="Splash"
                        component={SplashScreen}
                        listeners={{
                            focus: async () => {
                                await AsyncStorage.setItem('has_seen_splash', 'true');
                                setHasSeenSplash(true);
                            }
                        }}
                    />
                ) : token ? (
                    // Authenticated Stack
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Camera" component={CameraScreen} />
                        <Stack.Screen name="Detection" component={DetectionScreen} />
                        <Stack.Screen name="History" component={HistoryScreen} />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                    </>
                ) : (
                    // Auth Stack
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
