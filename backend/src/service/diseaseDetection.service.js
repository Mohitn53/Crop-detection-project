const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { analyzeCropDisease } = require('./ai.service');

/**
 * Primary disease detection service
 * Priority 1: Local Python Model (run_diagnosis.py + disease_utils.py)
 * Priority 2: Gemini AI Service (fallback)
 */
const predictDisease = async (imageBuffer) => {
    // STEP 1: Try Local Python Model First
    try {
        console.log("🔬 [PRIMARY] Attempting Local Python Model Diagnosis...");
        const localResult = await runPythonModel(imageBuffer);

        // Validate result has required fields
        if (localResult && (localResult.disease || localResult.crop)) {
            console.log("✅ [SUCCESS] Local Python Model returned valid result");
            return localResult;
        } else {
            throw new Error("Local model returned incomplete data");
        }

    } catch (localError) {
        console.warn("⚠️ [FALLBACK] Local Python Model Failed:", localError.message);
        console.log("🤖 [FALLBACK] Switching to Gemini AI Service...");

        // STEP 2: Fallback to AI Service
        try {
            const aiResult = await analyzeCropDisease(imageBuffer);
            console.log("✅ [SUCCESS] AI Service returned result");
            return aiResult;

        } catch (aiError) {
            console.error("❌ [FAILED] All diagnosis methods failed");
            console.error("Local Error:", localError.message);
            console.error("AI Error:", aiError.message);

            // Return safe error object
            return {
                error: "All Diagnosis Methods Failed",
                crop: "Unknown",
                disease: "Analysis Error",
                confidence: 0,
                confidence_level: "Low",
                message: "Could not diagnose the plant. Please try again or contact support.",
                details: {
                    localError: localError.message,
                    aiError: aiError.message
                }
            };
        }
    }
};

/**
 * Execute Python model script
 */
const runPythonModel = (imageBuffer) => {
    return new Promise((resolve, reject) => {
        // Create temporary file
        const tempFilePath = path.join(
            os.tmpdir(),
            `crop_scan_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`
        );

        try {
            fs.writeFileSync(tempFilePath, imageBuffer);
            console.log("📁 Temp file created:", tempFilePath);
        } catch (err) {
            return reject(new Error(`Failed to write temp file: ${err.message}`));
        }

        // Python script path (3 levels up from backend/src/service)
        const scriptPath = path.resolve(__dirname, '../../../run_diagnosis.py');

        // Verify script exists
        if (!fs.existsSync(scriptPath)) {
            cleanup(tempFilePath);
            return reject(new Error(`Python script not found at: ${scriptPath}`));
        }

        console.log("🐍 Executing Python script:", scriptPath);

        // Spawn Python process
        const pythonProcess = spawn('python', [
            scriptPath,
            tempFilePath,
            '--json'
        ]);

        let stdoutData = '';
        let stderrData = '';

        pythonProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            cleanup(tempFilePath);

            if (code !== 0) {
                console.error("Python stderr:", stderrData);
                return reject(new Error(`Python process exited with code ${code}. Error: ${stderrData}`));
            }

            try {
                // Parse JSON output
                const result = JSON.parse(stdoutData.trim());
                console.log("📊 Python model result:", JSON.stringify(result, null, 2));
                resolve(result);

            } catch (parseError) {
                console.error("Failed to parse Python output");
                console.error("Raw stdout:", stdoutData);
                console.error("Raw stderr:", stderrData);
                reject(new Error(`Failed to parse Python output: ${parseError.message}`));
            }
        });

        pythonProcess.on('error', (err) => {
            cleanup(tempFilePath);
            reject(new Error(`Failed to spawn Python process: ${err.message}. Ensure Python is installed and in PATH.`));
        });
    });
};

/**
 * Clean up temporary file
 */
const cleanup = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("🗑️ Temp file cleaned up");
        }
    } catch (e) {
        console.error("⚠️ Failed to cleanup temp file:", e.message);
    }
};

module.exports = predictDisease;
