import "dotenv/config";
import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function getGeminiResponse(message) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite", // "gemini-2.5-flash"
      contents: message,
    });

    return response.text;
  } catch (err) {
    console.error("Gemini error:", err);
    return null;
  }
}