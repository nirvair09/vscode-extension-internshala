import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = "AIzaSyBZtEnWgm2k8SOBaUJ_lBJZBb3osRrznT0";

export async function callGeminiAPI(prompt: string, context: string, imageBase64: string | null): Promise<string> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Use this context to help answer: ${context}\n\nUser: ${prompt}`
                }
              ]
            }
          ]
        })
      }
    );

    const json = await res.json();
    console.log("Gemini raw response:", JSON.stringify(json, null, 2));

    // ✅ Handle API errors first
    if (json.error?.message) {
      if (json.error.message.includes('overloaded')) {
        return '🚧 Gemini is currently overloaded. Please try again in a few minutes.';
      }
      return `❌ Gemini Error: ${json.error.message}`;
    }

    // ✅ Check for a valid response
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return text;
    }

    return '⚠️ No valid response from Gemini.';
  } catch (err: any) {
    console.error("Gemini API failed:", err);
    return `❌ Request failed: ${err.message || 'Unknown error'}`;
  }
}
