import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GOOGLE_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function askAI(question: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(question);
  const response = await result.response;
  return response.text();
}
