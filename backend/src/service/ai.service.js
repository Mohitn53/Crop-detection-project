const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

const generateCaption = async (file) => {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        // Ensure this is a base64 string
        data: file.toString("base64"), 
      },
    },
    { text: "Caption this image." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
    systemInstruction: `
    You are an expert in generating captions for images.
    You generate single caption for the image.
    Your caption should be short and concise.
    You use hashtags and emojis in the caption.
    `
}
  });

  // FIX: Access the data manually
  // The structure is: candidates -> index 0 -> content -> parts -> index 0 -> text
  const generatedText = response.candidates[0].content.parts[0].text;

  return generatedText;
};

module.exports = generateCaption;