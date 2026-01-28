// Utility functions for offline storage and sync
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { APP_CONFIG } from '../constants/theme';

// Storage keys
const STORAGE_KEYS = {
  CACHED_CHATS: 'cachedChats',
  OFFLINE_CHATS: 'offlineChats',
  USER_DATA: 'user',
  LANGUAGE: 'language',
  LAST_SYNC: 'lastSync',
};

// Cache images locally for offline access
export const cacheImage = async (uri) => {
  try {
    const filename = `cached_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
    const cacheDir = `${FileSystem.cacheDirectory}images/`;
    
    // Ensure directory exists
    const dirInfo = await FileSystem.getInfoAsync(cacheDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
    }
    
    const localUri = `${cacheDir}${filename}`;
    
    // Copy or download the file
    if (uri.startsWith('file://') || uri.startsWith('/')) {
      await FileSystem.copyAsync({ from: uri, to: localUri });
    } else if (uri.startsWith('http')) {
      const download = await FileSystem.downloadAsync(uri, localUri);
      return download.uri;
    }
    
    return localUri;
  } catch (error) {
    console.error('Error caching image:', error);
    return uri; // Return original URI if caching fails
  }
};

// Get cached image or download
export const getCachedImageUri = async (remoteUri) => {
  try {
    // Generate a consistent filename from the URL
    const urlHash = remoteUri.split('/').pop() || Date.now().toString();
    const localPath = `${FileSystem.cacheDirectory}images/${urlHash}`;
    
    const fileInfo = await FileSystem.getInfoAsync(localPath);
    
    if (fileInfo.exists) {
      return localPath;
    }
    
    // Download and cache
    const download = await FileSystem.downloadAsync(remoteUri, localPath);
    return download.uri;
  } catch (error) {
    console.error('Error getting cached image:', error);
    return remoteUri;
  }
};

// Clear old cached images (keep last N)
export const cleanImageCache = async (keepCount = 50) => {
  try {
    const cacheDir = `${FileSystem.cacheDirectory}images/`;
    const dirInfo = await FileSystem.getInfoAsync(cacheDir);
    
    if (!dirInfo.exists) return;
    
    const files = await FileSystem.readDirectoryAsync(cacheDir);
    
    if (files.length <= keepCount) return;
    
    // Get file info with modification dates
    const fileInfos = await Promise.all(
      files.map(async (file) => {
        const info = await FileSystem.getInfoAsync(`${cacheDir}${file}`);
        return { name: file, modTime: info.modificationTime || 0 };
      })
    );
    
    // Sort by modification time (oldest first)
    fileInfos.sort((a, b) => a.modTime - b.modTime);
    
    // Delete oldest files
    const toDelete = fileInfos.slice(0, fileInfos.length - keepCount);
    await Promise.all(
      toDelete.map((file) =>
        FileSystem.deleteAsync(`${cacheDir}${file.name}`, { idempotent: true })
      )
    );
    
    console.log(`Cleaned ${toDelete.length} cached images`);
  } catch (error) {
    console.error('Error cleaning image cache:', error);
  }
};

// Save offline chat for later sync
export const saveOfflineChat = async (chatData) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_CHATS);
    const offlineChats = existing ? JSON.parse(existing) : [];
    
    offlineChats.unshift({
      ...chatData,
      _id: `offline_${Date.now()}`,
      isOffline: true,
      createdAt: new Date().toISOString(),
    });
    
    // Keep only last N offline chats
    const trimmed = offlineChats.slice(0, APP_CONFIG.MAX_OFFLINE_CHATS);
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.OFFLINE_CHATS,
      JSON.stringify(trimmed)
    );
    
    return trimmed[0];
  } catch (error) {
    console.error('Error saving offline chat:', error);
    throw error;
  }
};

// Get all offline chats
export const getOfflineChats = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_CHATS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting offline chats:', error);
    return [];
  }
};

// Clear synced offline chats
export const clearOfflineChats = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_CHATS);
  } catch (error) {
    console.error('Error clearing offline chats:', error);
  }
};

// Cache chats for offline viewing
export const cacheChats = async (chats) => {
  try {
    const toCache = chats.slice(0, APP_CONFIG.MAX_OFFLINE_CHATS);
    await AsyncStorage.setItem(
      STORAGE_KEYS.CACHED_CHATS,
      JSON.stringify(toCache)
    );
    
    // Also cache the images
    await Promise.all(
      toCache.map(async (chat) => {
        if (chat.imageUrl && chat.imageUrl.startsWith('http')) {
          chat.localImageUri = await getCachedImageUri(chat.imageUrl);
        }
      })
    );
    
    // Update with local URIs
    await AsyncStorage.setItem(
      STORAGE_KEYS.CACHED_CHATS,
      JSON.stringify(toCache)
    );
  } catch (error) {
    console.error('Error caching chats:', error);
  }
};

// Get cached chats
export const getCachedChats = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_CHATS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting cached chats:', error);
    return [];
  }
};

// Save last sync timestamp
export const saveLastSync = async () => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_SYNC,
      new Date().toISOString()
    );
  } catch (error) {
    console.error('Error saving last sync:', error);
  }
};

// Get last sync timestamp
export const getLastSync = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  } catch (error) {
    console.error('Error getting last sync:', error);
    return null;
  }
};

// Clear all app data
export const clearAllData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    
    // Clear image cache
    const cacheDir = `${FileSystem.cacheDirectory}images/`;
    await FileSystem.deleteAsync(cacheDir, { idempotent: true });
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

export default {
  cacheImage,
  getCachedImageUri,
  cleanImageCache,
  saveOfflineChat,
  getOfflineChats,
  clearOfflineChats,
  cacheChats,
  getCachedChats,
  saveLastSync,
  getLastSync,
  clearAllData,
  STORAGE_KEYS,
};
