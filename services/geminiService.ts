
import { GoogleGenAI, Type } from "@google/genai";
import { UserAnswer, InterviewResult, EmotionType } from "../types";

// Always initialize with the direct object parameter as per SDK requirements
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const evaluateInterview = async (answers: UserAnswer[]): Promise<InterviewResult> => {
  const prompt = `
    As an expert academic researcher in NLP and Human Resources, evaluate these 4 interview responses.
    
    Rubric:
    - Semantic Relevance: Does the answer address the core of the question?
    - Clarity: Is the professional terminology used correctly?
    - Depth: Does the candidate provide specific examples or evidence?
    - Emotion: Determine the likely emotional state based on text sentiment.

    Data to evaluate:
    ${answers.map((a, i) => `[Question ${i+1}]: ${a.questionText}\n[Answer ${i+1}]: ${a.answerText}`).join('\n\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional AI Interview Evaluator. Output valid JSON only.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER, description: "Score from 0 to 10" },
                  feedback: { type: Type.STRING },
                  suggestions: { type: Type.STRING },
                  emotion: { type: Type.STRING, enum: Object.values(EmotionType) }
                },
                required: ["score", "feedback", "suggestions", "emotion"]
              }
            },
            overallScore: { type: Type.NUMBER }
          },
          required: ["items", "overallScore"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI model");
    
    const parsed = JSON.parse(text);
    
    return {
      overallScore: parsed.overallScore,
      timestamp: new Date().toLocaleString(),
      items: answers.map((ans, idx) => ({
        ...ans,
        score: parsed.items[idx].score,
        feedback: parsed.items[idx].feedback,
        suggestions: parsed.items[idx].suggestions,
        emotion: parsed.items[idx].emotion as EmotionType
      }))
    };
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    throw error;
  }
};
