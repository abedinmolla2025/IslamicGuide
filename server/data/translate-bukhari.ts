import { loadBukhariHadiths } from "./bukhari-loader";
import { translateHadithToBengali } from "../services/translation-service";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Script to translate all Bukhari hadiths to Bengali using OpenAI
 */
async function translateAllBukhariHadiths() {
  console.log("Loading Bukhari hadiths...");
  const hadiths = loadBukhariHadiths();
  
  console.log(`Found ${hadiths.length} hadiths to translate`);
  
  const translatedData: Record<string, {
    bengaliTranslation: string;
    narratorBengali: string;
    chapterBengali: string;
  }> = {};

  // Group by chapter to minimize API calls
  const chapterMap = new Map<number, typeof hadiths>();
  
  for (const hadith of hadiths) {
    if (!chapterMap.has(hadith.chapterNumber)) {
      chapterMap.set(hadith.chapterNumber, []);
    }
    chapterMap.get(hadith.chapterNumber)!.push(hadith);
  }

  let processedCount = 0;
  const totalChapters = chapterMap.size;
  let currentChapter = 0;

  for (const [chapterNumber, chapterHadiths] of Array.from(chapterMap)) {
    currentChapter++;
    console.log(`\nProcessing Chapter ${chapterNumber} (${currentChapter}/${totalChapters})...`);
    console.log(`Hadiths in this chapter: ${chapterHadiths.length}`);

    for (const hadith of chapterHadiths) {
      try {
        const translated = await translateHadithToBengali({
          english: hadith.englishTranslation,
          narrator: hadith.narrator,
          chapterEnglish: hadith.chapterNameEnglish,
        });

        translatedData[hadith.hadithNumber.toString()] = translated;
        
        processedCount++;
        
        if (processedCount % 10 === 0) {
          console.log(`Progress: ${processedCount}/${hadiths.length} hadiths translated (${Math.round(processedCount/hadiths.length * 100)}%)`);
          
          // Save intermediate results every 10 hadiths
          const outputPath = join(__dirname, "bukhari-bengali-translations.json");
          writeFileSync(outputPath, JSON.stringify(translatedData, null, 2));
        }

        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error translating hadith ${hadith.hadithNumber}:`, error);
      }
    }
  }

  // Save final results
  const outputPath = join(__dirname, "bukhari-bengali-translations.json");
  writeFileSync(outputPath, JSON.stringify(translatedData, null, 2));
  
  console.log(`\n✅ Translation complete! ${processedCount} hadiths translated`);
  console.log(`Saved to: ${outputPath}`);
}

// Run the translation
if (import.meta.url === `file://${process.argv[1]}`) {
  translateAllBukhariHadiths()
    .then(() => {
      console.log("\n🎉 All hadiths translated successfully!");
      process.exit(0);
    })
    .catch(error => {
      console.error("❌ Translation failed:", error);
      process.exit(1);
    });
}

export { translateAllBukhariHadiths };
