import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { API_CONFIG } from '../constants/theme';

// API instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth API calls
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Profile API calls
export const profileAPI = {
  getProfile: (userId) => api.get(`/profile/${userId}`),
  updateProfile: (userId, data) => api.put(`/profile/${userId}`, data),
  updateLanguage: (userId, language) => 
    api.put(`/profile/${userId}/language`, { language }),
  deleteProfile: (userId) => api.delete(`/profile/${userId}`),
};

// Chat API calls
export const chatAPI = {
  getChats: (userId, page = 1, limit = 20) =>
    api.get(`/chats/${userId}?page=${page}&limit=${limit}`),
  getChat: (chatId) => api.get(`/chats/single/${chatId}`),
  deleteChat: (chatId) => api.delete(`/chats/${chatId}`),
  syncOfflineChats: (offlineChats) => 
    api.post('/chats/sync', { offlineChats }),
};

// Upload image and get prediction
export const uploadImage = async (imageUri, additionalData = {}) => {
  try {
    // Create form data
    const formData = new FormData();
    
    // Add image file
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('image', {
      uri: imageUri,
      name: filename || `leaf_${Date.now()}.jpg`,
      type,
    });
    
    // Add additional data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 second timeout for uploads
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Upload image as base64 (alternative method)
export const uploadImageBase64 = async (imageUri, additionalData = {}) => {
  try {
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    const response = await api.post('/upload', {
      imageBase64: `data:image/jpeg;base64,${base64}`,
      ...additionalData,
    });
    
    return response.data;
  } catch (error) {
    console.error('Base64 upload error:', error);
    throw error;
  }
};

// Error handler helper
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      success: false,
      status: error.response.status,
      message: error.response.data?.message || 'Server error',
      data: error.response.data,
    };
  } else if (error.request) {
    // No response received
    return {
      success: false,
      status: 0,
      message: 'Network error. Please check your connection.',
      isNetworkError: true,
    };
  } else {
    // Error setting up request
    return {
      success: false,
      status: -1,
      message: error.message || 'An error occurred',
    };
  }
};

// Health check
export const checkServerHealth = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    return null;
  }
};

export default api;
