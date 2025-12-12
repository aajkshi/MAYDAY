import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const sendMessageToGemini = async (message: string, history: string[], lang: Language): Promise<string> => {
  if (!apiKey) {
    return lang === 'zh' ? "缺少 API Key，請檢查設定。" : "API Key is missing. Please check your configuration.";
  }

  try {
    const model = ai.models;
    const languageInstruction = lang === 'zh' 
      ? "Please reply in Traditional Chinese (繁體中文)." 
      : "Please reply in English.";

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        System Instruction: You are an expert Android Automotive and ApplePie AI Box assistant. 
        Your goal is to help the user manage their car infotainment system.
        ${languageInstruction}

        The user might ask for recommended apps. Here are some good ones for Android Auto boxes:
        1. Nova Launcher (for better UI).
        2. VLC for Android (for playing local movies).
        3. Torque Pro (for OBD2 diagnostics).
        4. Spotify/YouTube Music.
        5. Waze (alternative to Google Maps).
        
        If the user asks technical questions about clearing cache or system settings, explain that as a web app, we cannot do it directly, but they can use the "Maintenance" tab to see the ADB commands.
        
        Keep answers short, concise, and helpful for a driver who might be glancing at the screen.
        
        Conversation History:
        ${history.join('\n')}
        
        User: ${message}
      `,
    });

    return response.text || (lang === 'zh' ? "無法產生回應。" : "I couldn't generate a response.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'zh' ? "抱歉，與 AI 服務連線時發生錯誤。" : "Sorry, I encountered an error communicating with the AI service.";
  }
};