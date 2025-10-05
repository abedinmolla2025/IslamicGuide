import OpenAI from "openai";
import type { DailyQuiz } from "@shared/schema";
import { quizQuestions } from "../client/src/data/quiz-questions";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface QuizResponse {
  question: string;
  questionBengali: string;
  options: string[];
  optionsBengali: string[];
  correctAnswer: number;
  explanation: string;
  explanationBengali: string;
  category: string;
}

export async function generateDailyQuiz(): Promise<Omit<DailyQuiz, 'id'>> {
  // Try OpenAI first if API key is available and valid
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are an Islamic knowledge expert. Generate one multiple-choice quiz question about Islam. 
            
            Categories to choose from: Quran, Hadith, Prophets, Pillars of Islam, Islamic History, Fiqh (Islamic Law), Seerah (Prophet's Life)
            
            Provide the response in JSON format with:
            - question (in English)
            - questionBengali (in Bengali script)
            - options (array of 4 options in English)
            - optionsBengali (array of 4 options in Bengali script)
            - correctAnswer (index 0-3 of correct option)
            - explanation (detailed explanation in English)
            - explanationBengali (detailed explanation in Bengali script)
            - category (one of the categories listed above)
            
            Make sure the Bengali translations are accurate and use proper Bengali script.`
          },
          {
            role: "user",
            content: "Generate an Islamic quiz question with Bengali translation."
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 2048,
      });

      const quizData: QuizResponse = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        question: quizData.question,
        questionBengali: quizData.questionBengali,
        options: quizData.options,
        optionsBengali: quizData.optionsBengali,
        correctAnswer: quizData.correctAnswer,
        explanation: quizData.explanation,
        explanationBengali: quizData.explanationBengali,
        category: quizData.category,
      };
    } catch (error) {
      console.error("Error generating quiz with OpenAI, using fallback:", error);
      // Fall through to use fallback questions
    }
  }
  
  // Fallback: Use pre-defined questions
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const quizIndex = dayOfYear % quizQuestions.length;
  
  return quizQuestions[quizIndex];
}
