import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { API_CONFIG, APP_CONFIG } from '../constants/theme';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [chats, setChats] = useState([]);
  const [offlineChats, setOfflineChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  // Load cached chats on mount
  useEffect(() => {
    loadCachedChats();
  }, []);

  // Sync when coming online
  useEffect(() => {
    if (isOnline && user && offlineChats.length > 0) {
      syncOfflineChats();
    }
  }, [isOnline, user]);

  // Fetch chats when user logs in
  useEffect(() => {
    if (user && isOnline) {
      fetchChats();
    }
  }, [user]);

  const loadCachedChats = async () => {
    try {
      const cached = await AsyncStorage.getItem('cachedChats');
      const offline = await AsyncStorage.getItem('offlineChats');

      if (cached) {
        setChats(JSON.parse(cached));
      }
      if (offline) {
        setOfflineChats(JSON.parse(offline));
      }
    } catch (err) {
      console.error('Error loading cached chats:', err);
    }
  };

  const saveCachedChats = async (chatData) => {
    try {
      // Keep only latest chats for cache
      const toCache = chatData.slice(0, APP_CONFIG.MAX_OFFLINE_CHATS);
      await AsyncStorage.setItem('cachedChats', JSON.stringify(toCache));
    } catch (err) {
      console.error('Error caching chats:', err);
    }
  };

  const saveOfflineChats = async (offline) => {
    try {
      await AsyncStorage.setItem('offlineChats', JSON.stringify(offline));
    } catch (err) {
      console.error('Error saving offline chats:', err);
    }
  };

  const fetchChats = async (page = 1) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/chats/${user._id}?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const fetchedChats = response.data.data.chats;
        setChats(fetchedChats);
        await saveCachedChats(fetchedChats);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
      // Use cached chats if offline
    } finally {
      setLoading(false);
    }
  };

  const uploadAndAnalyze = async (imageUri) => {
    if (!user) return { success: false, error: 'Not logged in' };

    try {
      setLoading(true);

      // Cache image locally
      const localUri = await cacheImageLocally(imageUri);

      if (isOnline) {
        // Online: Upload to server
        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: `leaf_${Date.now()}.jpg`,
        });
        formData.append('localImageUri', localUri);

        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const newChat = response.data.data.chat;
          setChats((prev) => [newChat, ...prev]);
          await saveCachedChats([newChat, ...chats]);
          return { success: true, data: newChat };
        }
      } else {
        // Offline: Store locally with mock prediction
        const offlineChat = {
          _id: `offline_${Date.now()}`,
          userId: user._id,
          imageUrl: localUri,
          localImageUri: localUri,
          ...mockPrediction(),
          createdAt: new Date().toISOString(),
          isOffline: true,
        };

        const newOfflineChats = [offlineChat, ...offlineChats];
        setOfflineChats(newOfflineChats);
        await saveOfflineChats(newOfflineChats);

        // Add to display chats
        setChats((prev) => [offlineChat, ...prev]);

        return { success: true, data: offlineChat, offline: true };
      }
    } catch (err) {
      console.error('Upload error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const mockPrediction = () => {
    // Mock predictions for offline mode
    const predictions = [
      {
        disease: 'Tomato Late Blight',
        plantType: 'Tomato',
        confidence: 91.2,
        severity: 'High',
        recommendations: [
          'Remove infected plants immediately',
          'Apply copper-based fungicide',
          'Avoid overhead irrigation',
        ],
        additionalInfo: {
          symptoms: ['Water-soaked spots', 'White fuzzy growth'],
          causes: ['Phytophthora infestans'],
          preventionTips: ['Use certified seeds', 'Improve drainage'],
        },
      },
      {
        disease: 'Apple Scab',
        plantType: 'Apple',
        confidence: 88.5,
        severity: 'Medium',
        recommendations: [
          'Remove infected leaves',
          'Apply fungicide spray',
          'Ensure proper air circulation',
        ],
        additionalInfo: {
          symptoms: ['Dark olive spots', 'Leaf curling'],
          causes: ['Venturia inaequalis fungus'],
          preventionTips: ['Plant resistant varieties'],
        },
      },
      {
        disease: 'Healthy Leaf',
        plantType: 'Unknown',
        confidence: 95.8,
        severity: 'Low',
        recommendations: [
          'Continue current care routine',
          'Monitor for any changes',
        ],
        additionalInfo: {
          symptoms: ['No disease detected'],
          causes: ['Plant is healthy'],
          preventionTips: ['Regular monitoring'],
        },
      },
    ];

    return predictions[Math.floor(Math.random() * predictions.length)];
  };

  const cacheImageLocally = async (uri) => {
    try {
      const filename = `leaf_${Date.now()}.jpg`;
      const cacheDir = `${FileSystem.cacheDirectory}images/`;

      // Ensure directory exists
      const dirInfo = await FileSystem.getInfoAsync(cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
      }

      const localUri = `${cacheDir}${filename}`;
      await FileSystem.copyAsync({ from: uri, to: localUri });

      return localUri;
    } catch (err) {
      console.error('Error caching image:', err);
      return uri;
    }
  };

  const syncOfflineChats = async () => {
    if (!user || offlineChats.length === 0 || syncing) return;

    try {
      setSyncing(true);

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/chats/sync`,
        { offlineChats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Clear offline chats
        setOfflineChats([]);
        await AsyncStorage.removeItem('offlineChats');

        // Refresh chats from server
        await fetchChats();
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      if (chatId.startsWith('offline_')) {
        // Delete offline chat
        const updated = offlineChats.filter((c) => c._id !== chatId);
        setOfflineChats(updated);
        await saveOfflineChats(updated);
      } else if (isOnline) {
        // Delete from server
        await axios.delete(`${API_CONFIG.BASE_URL}/chats/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Remove from display
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err);
      return { success: false, error: err.message };
    }
  };

  const getChat = (chatId) => {
    return chats.find((c) => c._id === chatId);
  };

  const value = {
    chats,
    offlineChats,
    loading,
    isOnline,
    syncing,
    fetchChats,
    uploadAndAnalyze,
    deleteChat,
    getChat,
    syncOfflineChats,
    pendingSyncCount: offlineChats.length,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
