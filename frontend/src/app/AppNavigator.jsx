import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen'; // New Import
import CameraScreen from '../features/camera/CameraScreen';
import DetectionScreen from '../features/detection/DetectionScreen';
import HistoryScreen from '../features/history/HistoryScreen';
import HomeScreen from '../features/home/HomeScreen';
import { colors } from '../core/theme';
import { useAuth } from '../store/authStore';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { token, isLoading } = useAuth(); // Use real auth state

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.light.background }}>
                <ActivityIndicator size="large" color={colors.light.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {token ? (
                    // Authenticated Stack
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Camera" component={CameraScreen} />
                        <Stack.Screen name="Detection" component={DetectionScreen} />
                        <Stack.Screen name="History" component={HistoryScreen} />
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
