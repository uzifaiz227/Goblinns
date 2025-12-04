import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

export const getGeminiClient = () => {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  return new GoogleGenerativeAI(API_KEY);
};

export const MODEL_NAME = "gemini-1.5-flash";
