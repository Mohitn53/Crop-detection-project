const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const predictDisease = (imageBuffer) => {
    return new Promise((resolve, reject) => {
        // Create a temp file
        const tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}.jpg`);

        try {
            fs.writeFileSync(tempFilePath, imageBuffer);
        } catch (err) {
            return reject(new Error(`Failed to write temp file: ${err.message}`));
        }

        // The python script is in the root project folder, which is 3 levels up from here?
        // backend/src/service -> backend/src -> backend -> root
        // So ../../../predict_disease.py
        // The python script is in the root project folder
        const scriptPath = path.resolve(__dirname, '../../../run_diagnosis.py');

        const pythonProcess = spawn('python', [
            scriptPath,
            tempFilePath,
            '--json'
        ]);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', (code) => {
            // Clean up temp file
            try {
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
            } catch (cleanupErr) {
                console.error("Failed to cleanup temp file:", cleanupErr);
            }

            if (code !== 0) {
                return reject(new Error(`Python script exited with code ${code}: ${errorString}`));
            }

            try {
                // Find the JSON part in the output. 
                // The script might print other things? I added --json to only print JSON but let's be safe.
                // My script prints ONLY json if json_output is true, except if there are errors (stderr).
                // But stdout should be pure JSON or contain it.
                // Let's try to parse the whole string.
                const result = JSON.parse(dataString.trim());
                resolve(result);
            } catch (parseError) {
                // If parsing fails, maybe there's extra text. Try to find the last valid JSON object?
                // Or just reject.
                reject(new Error(`Failed to parse Python output: ${parseError.message}. Output: ${dataString}`));
            }
        });
    });
};

module.exports = predictDisease;
