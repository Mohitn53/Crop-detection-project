import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography } from '../../core/theme';
import { Ionicons } from '@expo/vector-icons'; // Assuming Ionicons is available in Expo standard or I should use simple text

// Note: Expo 50+ uses CameraView. If using older request: Camera. 
// Package.json said "expo-camera": "~17.0.10" which is Expo 52 compatible, uses CameraView.

export default function CameraScreen() {
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const [facing, setFacing] = useState('back');
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const takePicture = async () => {
        if (cameraRef.current && !isCapturing) {
            setIsCapturing(true);
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    skipProcessing: true, // faster
                });
                navigation.navigate('Detection', { imageUri: photo.uri });
            } catch (e) {
                Alert.alert('Error', 'Failed to capture image');
            } finally {
                setIsCapturing(false);
            }
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });

        if (!result.canceled) {
            navigation.navigate('Detection', { imageUri: result.assets[0].uri });
        }
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <SafeAreaView style={styles.uiContainer}>

                    {/* Top Bar */}
                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                            <Text style={styles.iconText}>✕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
                            <Text style={styles.iconText}>⟲</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Controls */}
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                            <Text style={styles.iconText}>🖼️</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={takePicture}
                            disabled={isCapturing}
                        >
                            <View style={styles.captureInner} />
                        </TouchableOpacity>

                        <View style={{ width: 50 }} />
                    </View>

                </SafeAreaView>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.light.background,
    },
    message: {
        ...typography.body,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: colors.light.primary,
        padding: spacing.m,
        borderRadius: 12,
    },
    buttonText: {
        color: 'white',
        ...typography.subtitle
    },
    uiContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacing.l,
        paddingTop: Platform.OS === 'android' ? spacing.xl + 20 : spacing.l,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        color: 'white',
        fontSize: 24,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: spacing.xl + 20,
        paddingHorizontal: spacing.l,
        backgroundColor: 'rgba(0,0,0,0.3)', // Gradient would be better but simple transparency for now
        paddingTop: spacing.l,
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'white',
    },
    galleryButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 25,
    }
});
