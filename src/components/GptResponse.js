import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDsETzTTSQONLVd6Xpp-iO9jaUTq4blomY" });

const getChatGptResponse = async (text) => {
  try {
    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: text+" in short decription as a paragraph",
  });
  console.log(response.text);

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with Gemini.";
  }
};

export { getChatGptResponse };
