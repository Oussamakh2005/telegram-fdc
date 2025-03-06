import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLM_API_KEY } from "../env.js";
const genAI = new GoogleGenerativeAI(LLM_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
export default model;
