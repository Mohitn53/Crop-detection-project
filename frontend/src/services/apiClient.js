import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../core/config';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000,
});

// Request Interceptor: Add Token
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('user_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`; // Standard
                // Note: Backend might look for cookie, but we also send header.
                // We might need to ensure backend checks header if cookie is missing.
                // But for now, we rely on the token we saved.
            }
        } catch (error) {
            console.error('Error attaching token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401/403 (Logout?)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Potentially trigger global logout here if we had a way to access store
            // For now, just reject
        }
        return Promise.reject(error);
    }
);

export default apiClient;
