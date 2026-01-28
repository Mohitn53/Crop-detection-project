import apiClient from './apiClient';

export const login = async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data; // Expects { token, message }
};

export const register = async (username, password) => {
    // Use /auth/register based on backend routes
    const response = await apiClient.post('/auth/register', { username, password });
    return response.data;
};

// Start or other auth methods can go here
