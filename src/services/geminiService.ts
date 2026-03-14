import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function solveMathProblem(prompt: string, imageBase64?: string) {
  try {
    const model = ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: imageBase64 
        ? {
            parts: [
              { text: prompt || "Solve this math problem step-by-step." },
              { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
            ]
          }
        : prompt,
      config: {
        systemInstruction: `You are "Chat AI Math", a specialized AI designed to provide complete, step-by-step math solutions. 
        Your goal is to answer any math-related question (algebra, calculus, geometry, arithmetic, etc.) with clear explanations and accurate results.
        
        Guidelines:
        1. Always provide a step-by-step breakdown of the solution.
        2. Use LaTeX for all mathematical formulas and equations (e.g., $x^2 + 3x$).
        3. Be accurate and verify your calculations.
        4. If a problem is ambiguous, ask for clarification.
        5. For geometry, describe the steps to find the area, perimeter, or angles clearly.
        6. For calculus, show the derivation or integration process step-by-step.
        7. Format the final result clearly at the end.`,
      }
    });

    const response = await model;
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
