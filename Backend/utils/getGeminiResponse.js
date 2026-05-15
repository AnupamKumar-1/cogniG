import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are cogniG, a helpful and intelligent AI assistant.
Be concise, clear, and friendly. Format responses with markdown when helpful.
You can search the web for current information when needed.
Always cite sources when using search results.
When given an image, analyze it in detail.
When asked to run code or solve math, use code execution to give accurate results.`;

export default async function getGeminiResponse(messages, imageBase64 = null, imageMimeType = null) {
  try {
    const filtered = messages
      .filter(msg => (msg.content && msg.content.trim()) || msg.hasImage)
      .slice(-20);

    const contents = filtered.map((msg, idx) => {
      const isLastMessage = idx === filtered.length - 1;
      const parts = [];

      if (isLastMessage && imageBase64 && imageMimeType) {
        parts.push({ inlineData: { mimeType: imageMimeType, data: imageBase64 } });
      }

      if (msg.content && msg.content.trim()) {
        parts.push({ text: msg.content.trim() });
      }

      return {
        role: msg.role === "assistant" ? "model" : "user",
        parts
      };
    });

    if (contents.length === 0) return "Kuch message toh bhejo!";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 8192,
        tools: [{ googleSearch: {} }, { codeExecution: {} }],
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