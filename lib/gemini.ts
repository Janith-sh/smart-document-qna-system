import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Free text generation model
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Free embedding model
export const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});
