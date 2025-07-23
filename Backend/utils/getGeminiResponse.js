
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export default async function getGeminiResponse(message) {
  try {
    const result = await model.generateContent(message);
    return await result.response.text();
  } catch (err) {
    console.error("Gemini error:", err);
    return null;
  }
}
