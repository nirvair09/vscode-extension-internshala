import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in environment variables.");
}

export async function callGeminiAPI(prompt: string, context: string, imageBase64: string | null): Promise<string> {
  try {
    const parts: any[] = [];

    if (context) {
      parts.push({
        text: `Use this context to help answer: ${context}\n\n`
      });
    }

    parts.push({
      text: `User: ${prompt}`
    });

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64
        }
      });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }]
        })
      }
    );

    const json = await res.json();
    console.log("Gemini raw response:", JSON.stringify(json, null, 2));

    if (json.error?.message) {
      if (json.error.message.includes('overloaded')) {
        return '🚧 Gemini is currently overloaded. Please try again in a few minutes.';
      }
      return `❌ Gemini Error: ${json.error.message}`;
    }

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
