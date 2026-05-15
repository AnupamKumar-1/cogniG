import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are cogniG, a helpful and intelligent AI assistant.
Be concise, clear, and friendly. Format responses with markdown when helpful.
You can search the web for current information when needed.
Always cite sources when using search results.`;

export default async function getGeminiResponse(messages) {
  try {
    const contents = messages
      .filter(msg => msg.content?.trim())
      .slice(-20)
      .map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content.trim() }]
      }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 8192,
        tools: [{ googleSearch: {} }],
      }
    });

    return response.text;
  } catch (err) {
    if (err.status === 429) return "Rate limit exceeded, please try again later.";
    if (err.status === 503) return "Gemini service unavailable, please try again.";
    console.error("Gemini error:", err);
    return null;
  }
}