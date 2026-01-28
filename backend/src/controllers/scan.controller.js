const scanModel = require('../models/scan.model');
const predictDisease = require('../service/diseaseDetection.service');
const uploadImage = require('../service/storage.service');
const { getSolution } = require('../../../disease_solutions');

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

        // Get detailed solution from database
        const solution = getSolution(predictionResult.original_label || "Unknown");

        // Construct the full object to save
        // Check if healthy
        const isHealthy = predictionResult.disease.toLowerCase() === "healthy";
        const status = isHealthy ? "HEALTHY" : "DISEASED";

        const newScan = await scanModel.create({
            imageUrl: uploadResult.url,
            plant: predictionResult.crop,
            condition: predictionResult.disease,
            status: status,
            confidence: predictionResult.confidence,
            fullReport: {
                detection: predictionResult,
                solution: solution
            },
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
