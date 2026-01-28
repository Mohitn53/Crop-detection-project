const scanModel = require('../models/scan.model');
const predictDisease = require('../service/diseaseDetection.service');
const uploadImage = require('../service/storage.service');


const scanController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const file = req.file;

        // Parallel processing: Upload to cloud AND Run Inference
        const predictionPromise = predictDisease(file.buffer);
        const uploadPromise = uploadImage(file.buffer, file.originalname);

        let predictionResult;
        try {
            predictionResult = await predictionPromise;
        } catch (err) {
            console.error("AI Prediction failed:", err.message);
            // Fallback object to prevent crash
            predictionResult = {
                crop: "Unknown",
                disease: "Error during analysis",
                original_label: "Unknown",
                confidence: 0,
                confidence_level: "Low"
            };
        }

        // Wait for upload if it hasn't finished
        let uploadResult;
        try {
            uploadResult = await uploadPromise;
        } catch (err) {
            console.error("Image Upload failed:", err.message);
            throw new Error("Image upload failed: " + err.message);
        }

        // Check for AI error or missing data
        if (predictionResult.error || !predictionResult.disease) {
            console.warn("AI Analysis issue:", predictionResult);
            // Ensure we have fallback values so saving doesn't crash
            predictionResult.crop = predictionResult.crop || "Unknown";
            predictionResult.disease = predictionResult.disease || (predictionResult.error ? "Analysis Error" : "Unknown");
            predictionResult.confidence = predictionResult.confidence || 0;
        }

        const isHealthy = predictionResult.disease && predictionResult.disease.toLowerCase() === "healthy";
        const status = predictionResult.error ? "FAILED" : (isHealthy ? "HEALTHY" : "DISEASED");

        const newScan = await scanModel.create({
            imageUrl: uploadResult.url,
            plant: predictionResult.crop,
            condition: predictionResult.disease,
            status: status,
            confidence: predictionResult.confidence,
            fullReport: predictionResult,
            user: req.user._id
        });

        res.status(201).json({
            message: 'Scan completed successfully',
            scan: newScan
        });

    } catch (error) {
        console.error("Scan processing error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getHistoryController = async (req, res) => {
    try {
        const scans = await scanModel.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(scans);
    } catch (error) {
        console.error("History fetch error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    scanController,
    getHistoryController
}
