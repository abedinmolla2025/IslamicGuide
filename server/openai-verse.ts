import OpenAI from "openai";
import type { QuranVerse } from "@shared/schema";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

interface EnhancedVerse {
  translationBengali: string;
  surahNameBengali: string;
  aiInsight: string;
  aiInsightBengali: string;
}

export async function enhanceVerseWithAI(verse: QuranVerse): Promise<QuranVerse> {
  if (!openai) {
    // Return verse with fallback values if OpenAI is not configured
    return {
      ...verse,
      translationBengali: verse.translation,
      surahNameBengali: verse.surahName,
      aiInsight: "This verse offers guidance and wisdom for believers.",
      aiInsightBengali: "এই আয়াতটি বিশ্বাসীদের জন্য নির্দেশনা এবং প্রজ্ঞা প্রদান করে।",
    };
  }

  try {
    const prompt = `You are an Islamic scholar and Bengali translator. For the following Quran verse, provide:

1. Bengali translation (accurate and respectful)
2. Bengali surah name
3. A brief, meaningful insight in English (2-3 sentences) about the verse's message and relevance to daily life
4. The same insight translated to Bengali

Verse Details:
- Surah: ${verse.surahName} (${verse.surahNumber}:${verse.verseNumber})
- Arabic: ${verse.arabic}
- English Translation: ${verse.translation}

Please respond in JSON format with these exact keys:
{
  "translationBengali": "...",
  "surahNameBengali": "...",
  "aiInsight": "...",
  "aiInsightBengali": "..."
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert Islamic scholar and Bengali translator. Provide accurate, respectful translations and meaningful insights about Quran verses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const enhanced = JSON.parse(content) as EnhancedVerse;

    return {
      ...verse,
      translationBengali: enhanced.translationBengali,
      surahNameBengali: enhanced.surahNameBengali,
      aiInsight: enhanced.aiInsight,
      aiInsightBengali: enhanced.aiInsightBengali,
    };
  } catch (error) {
    console.error("Error enhancing verse with AI:", error);
    // Return verse with fallback values if AI fails
    return {
      ...verse,
      translationBengali: verse.translation, // Fallback to English if AI fails
      surahNameBengali: verse.surahName,
      aiInsight: "This verse offers guidance and wisdom for believers.",
      aiInsightBengali: "এই আয়াতটি বিশ্বাসীদের জন্য নির্দেশনা এবং প্রজ্ঞা প্রদান করে।",
    };
  }
}
