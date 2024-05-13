import OpenAI from "openai";

// Demo - explain
export const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});
