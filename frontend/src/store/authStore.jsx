import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginApi, register as registerApi } from '../services/authService';

const AuthContext = createContext({
    user: null,
    token: null,
    isLoading: true,
    login: async () => { },
    register: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Backend doesn't return user object yet, just token
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkContext();
    }, []);

    const checkContext = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync('user_token');
            const storedUser = await SecureStore.getItemAsync('user_info');

            if (storedToken) {
                setToken(storedToken);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    // If we have token but no user info, we consider them logged in but maybe "Anonymous" or fetch profile
                    // For this App, just "logged in" is enough usually
                    setUser({ name: 'Farmer' });
                }
            }
        } catch (e) {
            console.log('Failed to restore auth', e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const data = await loginApi(username, password);
            // data = { token, message }
            if (data.token) {
                setToken(data.token);
                setUser({ username }); // We assume username is the user identity
                await SecureStore.setItemAsync('user_token', data.token);
                await SecureStore.setItemAsync('user_info', JSON.stringify({ username }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (username, password) => {
        try {
            const data = await registerApi(username, password);
            if (data.token) {
                setToken(data.token);
                setUser({ username });
                await SecureStore.setItemAsync('user_token', data.token);
                await SecureStore.setItemAsync('user_info', JSON.stringify({ username }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Register failed', error);
            throw error;
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('user_token');
        await SecureStore.deleteItemAsync('user_info');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
