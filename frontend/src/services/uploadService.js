import apiClient from './apiClient';

export const uploadImage = async (imageUri) => {
    const formData = new FormData();

    // Extract filename and type from URI
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('image', { uri: imageUri, name: filename, type });

    try {
        const response = await apiClient.post('/api/scan', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Axios handles boundary automatically but good to be explicit about intent, actually Axios with FormData sets it correctly.
            },
        });
        return response.data;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
};

export const getHistory = async () => {
    const response = await apiClient.get('/api/history');
    return response.data;
}
