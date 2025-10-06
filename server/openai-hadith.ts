import OpenAI from "openai";
import type { Hadith } from "@shared/schema";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

interface EnhancedHadith {
  translationBengali: string;
  narratorBengali: string;
  bookNameBengali: string;
  aiInsight: string;
  aiInsightBengali: string;
}

export async function enhanceHadithWithAI(hadith: Hadith): Promise<Hadith> {
  if (!openai) {
    return {
      ...hadith,
      translationBengali: null,
      narratorBengali: null,
      bookNameBengali: null,
      aiInsight: "This hadith provides guidance for daily life.",
      aiInsightBengali: "এই হাদিসটি দৈনন্দিন জীবনের জন্য নির্দেশনা প্রদান করে।",
    };
  }

  try {
    const prompt = `You are an Islamic scholar and Bengali translator specializing in Hadith. For the following Hadith from ${hadith.bookName}, provide:

1. Bengali translation (accurate and respectful)
2. Bengali narrator name
3. Bengali book name
4. A brief, meaningful insight in English (2-3 sentences) about the Hadith's message and practical application
5. The same insight translated to Bengali

Hadith Details:
- Book: ${hadith.bookName}
- Reference: ${hadith.reference}
- Narrator: ${hadith.narrator}
- Arabic: ${hadith.arabic}
- English Translation: ${hadith.translation}

Please respond in JSON format with these exact keys:
{
  "translationBengali": "...",
  "narratorBengali": "...",
  "bookNameBengali": "...",
  "aiInsight": "...",
  "aiInsightBengali": "..."
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert Islamic scholar and Bengali translator. Provide accurate, respectful translations and meaningful insights about Hadiths from Sahih Bukhari and other authentic sources."
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

    const enhanced = JSON.parse(content) as EnhancedHadith;

    return {
      ...hadith,
      translationBengali: enhanced.translationBengali,
      narratorBengali: enhanced.narratorBengali,
      bookNameBengali: enhanced.bookNameBengali,
      aiInsight: enhanced.aiInsight,
      aiInsightBengali: enhanced.aiInsightBengali,
    };
  } catch (error) {
    console.error("Error enhancing Hadith with AI:", error);
    return {
      ...hadith,
      translationBengali: null,
      narratorBengali: null,
      bookNameBengali: null,
      aiInsight: "This hadith provides guidance for daily life.",
      aiInsightBengali: "এই হাদিসটি দৈনন্দিন জীবনের জন্য নির্দেশনা প্রদান করে।",
    };
  }
}
