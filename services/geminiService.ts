import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Chat with Aura (Resident Concierge)
 * Uses Thinking Mode for complex reasoning about hotel services.
 */
export const chatWithAura = async (message: string, history: { role: string; parts: { text: string }[] }[]): Promise<string> => {
  const ai = getAiClient();
  const systemInstruction = `You are Aura, the AI Concierge for The Plaza OS. 
  You are polite, efficient, and sophisticated. 
  You assist residents with gym schedules, guest passes, and general building queries.
  Keep responses concise and elegant.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 32768 }, // High budget for complex reasoning
      }
    });
    return response.text || "I apologize, I could not process that request.";
  } catch (error) {
    console.error("Aura Error:", error);
    return "I am currently experiencing a connection issue. Please try again momentarily.";
  }
};

/**
 * Lens Analysis (Visual Maintenance)
 * Uses Gemini 2.5 Flash Image to analyze maintenance issues.
 */
export const analyzeMaintenanceImage = async (base64Image: string): Promise<string> => {
  const ai = getAiClient();
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Optimized for image analysis
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analyze this image for building maintenance issues. 
            Identify the issue (e.g., Water Leak, Crack, Electrical Hazard). 
            Assess severity (Low, Medium, Critical). 
            Recommend an immediate action.
            Format the output strictly as JSON: {"issue": "...", "severity": "...", "action": "..."}`
          }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });
    return response.text || "{}";
  } catch (error) {
    console.error("Lens Analysis Error:", error);
    throw error;
  }
};

/**
 * Lens Edit (Nano Banana / Generative Edit)
 * Uses Gemini 2.5 Flash Image to edit images based on prompts.
 */
export const editMaintenanceImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Edit this image based on the following instruction: ${prompt}. 
            Return a description of the edited image first.` 
          }
        ]
      }
    });
    return response.text; 

  } catch (error) {
    console.error("Lens Edit Error:", error);
    return null;
  }
};

/**
 * AI Diplomat (Manager Tool)
 * Uses Gemini 3 Pro to polish sloppy text.
 */
export const polishDiplomaticText = async (roughText: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{
        parts: [{
          text: `You are a diplomatic communications expert for a luxury hotel. 
          Rewrite the following rough note into a polished, professional, and reassuring announcement for residents. 
          Keep it warm but formal.
          
          Rough Note: "${roughText}"`
        }]
      }]
    });
    return response.text || roughText;
  } catch (error) {
    console.error("Diplomat Error:", error);
    return roughText;
  }
};

/**
 * Community Marketplace Generator
 * Generates high-end listings for the resident bulletin board.
 */
export const draftCommunityPost = async (item: string, details: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        parts: [{
          text: `Write a sophisticated, short marketplace listing description for a resident bulletin board in a luxury building.
          Item: ${item}
          Details: ${details}
          
          Tone: Exclusive, minimalist, and appealing. Max 50 words.`
        }]
      }]
    });
    return response.text || "Contact for details.";
  } catch (error) {
    console.error("Marketplace Error:", error);
    return "Contact for details.";
  }
};