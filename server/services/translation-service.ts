import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface TranslationResult {
  bengali: string;
}

/**
 * Translate English text to Bengali using OpenAI
 */
export async function translateToBengali(englishText: string, context?: string): Promise<string> {
  try {
    const systemPrompt = `You are an expert Bengali translator specializing in Islamic texts. 
Translate the following text from English to Bengali accurately while maintaining the Islamic terminology and respectful language.
${context ? `Context: ${context}` : ''}
Respond with ONLY the Bengali translation, no additional text or explanations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: englishText }
      ],
      max_completion_tokens: 2048,
    });

    return response.choices[0].message.content?.trim() || englishText;
  } catch (error) {
    console.error("Translation error:", error);
    return englishText; // Fallback to English if translation fails
  }
}

/**
 * Batch translate multiple texts to Bengali
 */
export async function batchTranslateToBengali(
  texts: { text: string; context?: string }[]
): Promise<string[]> {
  const translations = await Promise.all(
    texts.map(({ text, context }) => translateToBengali(text, context))
  );
  return translations;
}

/**
 * Translate hadith components to Bengali
 */
export async function translateHadithToBengali(hadith: {
  english: string;
  narrator: string;
  chapterEnglish: string;
}): Promise<{
  bengaliTranslation: string;
  narratorBengali: string;
  chapterBengali: string;
}> {
  const context = `This is a hadith (Islamic tradition) from Sahih Bukhari. Narrator: ${hadith.narrator}, Chapter: ${hadith.chapterEnglish}`;
  
  const [bengaliTranslation, narratorBengali, chapterBengali] = await batchTranslateToBengali([
    { text: hadith.english, context },
    { text: hadith.narrator, context: "This is the name of a hadith narrator (Rabi/Sanad)" },
    { text: hadith.chapterEnglish, context: "This is a chapter title from Sahih Bukhari" }
  ]);

  return {
    bengaliTranslation,
    narratorBengali,
    chapterBengali,
  };
}
