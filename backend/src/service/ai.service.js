require('dotenv').config(); // Ensure env vars are loaded independent of entry point
const { GoogleGenAI } = require("@google/genai");

// Debug: Check if API key is present
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("CRITICAL ERROR: GEMINI_API_KEY is missing from environment variables!");
} else {
  // Log masked key for verification
  const maskedKey = apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4);
  console.log("AI Service: Init with API Key: " + maskedKey);
}

// Initialize client
const ai = new GoogleGenAI({ apiKey: apiKey });

const generateCaption = async (file) => {
  try {
    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: file.toString("base64"),
        },
      },
      { text: "Caption this image." },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: contents,
      config: {
        systemInstruction: `
        You are an expert in generating captions for images.
        You generate single caption for the image.
        Your caption should be short and concise.
        `
      }
    });

    const generatedText = response.candidates[0].content.parts[0].text;
    return generatedText;
  } catch (error) {
    console.error("Caption Generation Error:", error);
    return "Crop image";
  }
};

const analyzeCropDisease = async (fileBuffer) => {
  try {
    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: fileBuffer.toString("base64"),
        },
      },
      { text: "Analyze this image for crop diseases." },
    ];

    console.log("AI Service: Sending image to Gemini 1.5 Flash for analysis...");

    // Explicitly using gemini-1.5-flash which is widely available
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        systemInstruction: `You are an expert plant pathologist and agricultural consultant. 
          Your task is to analyze crop images to detect diseases and provide comprehensive treatment plans.
          
          RETURN STRICT JSON ONLY.
          Structure:
          {
            "crop": "Name of the crop detected",
            "disease": "Name of the disease detected or 'Healthy'",
            "confidence": 0.0 to 1.0,
            "confidence_level": "High", "Medium", or "Low",
            "severity": "Low", "Medium", "High", or "N/A" (if healthy),
            "message": "A short, encouraging or informative message for the farmer about this result.",
            "maintenance": ["List of general maintenance tips"],
            "organic": ["List of organic/natural remedies"],
            "chemical": ["List of recommended chemical treatments"],
            "prevention": ["List of preventive measures"],
            "recommendation": "A summary recommendation"
          }
          
          If the image is not a plant or crop, return: {"error": "Not a plant image", "crop": "Unknown", "disease": "Unknown"}.
          `
      }
    });

    if (!response || !response.candidates || !response.candidates[0]) {
      console.error("AI Service: Invalid response structure", JSON.stringify(response));
      throw new Error("Invalid response from Gemini API");
    }

    const text = response.candidates[0].content.parts[0].text;
    console.log("AI Service: Response received. Length:", text.length);
    // console.log("AI Raw Text:", text); // Uncomment to see full JSON if needed

    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);

  } catch (e) {
    console.error("AI Analysis Failed. Full error:", e);
    return {
      error: e.message || "AI Analysis Failed",
      crop: "Unknown",
      disease: "Analysis Error",
      confidence: 0,
      confidence_level: "Low",
      message: "We encountered an issue analyzing this image. Please check the backend console for details."
    };
  }
};

module.exports = {
  generateCaption,
  analyzeCropDisease
};