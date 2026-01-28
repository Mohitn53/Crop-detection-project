// React Native Integration Example
// Copy this into your React Native project (e.g., in a service file or screen)

import * as ImagePicker from 'expo-image-picker';

// REPLACE THIS WITH YOUR COMPUTER'S IP ADDRESS
// e.g., 'http://192.168.1.5:5000/predict'
const API_URL = 'http://YOUR_IPV4_ADDRESS:5000/predict';

const pickAndAnalyzeImage = async () => {
    // 1. Pick Image
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        analyzeImage(result.assets[0]);
    }
};

const analyzeImage = async (imageAsset) => {
    try {
        const formData = new FormData();

        // Append image data
        formData.append('image', {
            uri: imageAsset.uri,
            type: 'image/jpeg', // Adjust based on file type if needed
            name: 'upload.jpg',
        });

        console.log("Sending image to:", API_URL);

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const data = await response.json();
        console.log("Prediction Result:", data);

        /* 
          Example Response:
          {
            "crop": "Tomato",
            "disease": "Early Blight",
            "original_label": "Tomato___Early_blight",
            "confidence": 98.5,
            "confidence_level": "Very High"
          }
        */

        return data;

    } catch (error) {
        console.error("Analysis failed:", error);
        alert("Analysis failed. Make sure the Python API is running and the IP is correct.");
    }
};
