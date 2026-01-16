
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";

export const getGeminiResponse = async (
  prompt: string, 
  base64Image?: string,
  history: {role: string, parts: {text: string}[]}[] = []
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const contents: any[] = [];
  
  if (base64Image) {
    contents.push({
      parts: [
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
        { text: prompt }
      ]
    });
  } else {
    // Basic text/chat
    contents.push({ role: 'user', parts: [{ text: prompt }] });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: { 
      parts: [
        ...(base64Image ? [{ inlineData: { data: base64Image, mimeType: "image/jpeg" } }] : []),
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });

  return response.text || "Lo siento, no pude procesar tu solicitud.";
};
