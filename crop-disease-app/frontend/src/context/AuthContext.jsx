import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_CONFIG } from '../constants/theme';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load stored auth on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Configure axios with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('authToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verify token is still valid
        try {
          const response = await axios.get(`${API_CONFIG.BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setUser(response.data.data.user);
        } catch (err) {
          // Token invalid, clear auth
          await clearAuth();
        }
      }
    } catch (err) {
      console.error('Error loading auth:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveAuth = async (userData, authToken) => {
    try {
      await SecureStore.setItemAsync('authToken', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(authToken);
    } catch (err) {
      console.error('Error saving auth:', err);
    }
  };

  const clearAuth = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error('Error clearing auth:', err);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      if (response.data.success) {
        await saveAuth(response.data.data.user, response.data.data.token);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        await saveAuth(response.data.data.user, response.data.data.token);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleData) => {
    try {
      setLoading(true);
      setError(null);

      // Mock Google login for demo
      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/google`, {
        googleId: googleData?.id || `mock-${Date.now()}`,
        email: googleData?.email || `demo${Date.now()}@gmail.com`,
        name: googleData?.name || 'Demo User',
        avatar: googleData?.picture || '',
      });

      if (response.data.success) {
        await saveAuth(response.data.data.user, response.data.data.token);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Google login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_CONFIG.BASE_URL}/auth/logout`);
    } catch (err) {
      console.error('Logout API error:', err);
    }
    await clearAuth();
  };

  const updateUser = async (updates) => {
    try {
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/profile/${user._id}`,
        updates
      );

      if (response.data.success) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed';
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    signup,
    login,
    googleLogin,
    logout,
    updateUser,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
