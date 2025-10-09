import { loadBukhariHadiths } from "./bukhari-loader";
import { translateHadithToBengali } from "../services/translation-service";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Script to translate a sample of Bukhari hadiths (first 5) to test the translation system
 */
async function translateSampleHadiths() {
  console.log("Loading Bukhari hadiths...");
  const hadiths = loadBukhariHadiths();
  
  // Take only first 5 hadiths as a sample
  const sampleHadiths = hadiths.slice(0, 5);
  
  console.log(`Translating ${sampleHadiths.length} sample hadiths...\n`);
  
  const translatedData: Record<string, {
    bengaliTranslation: string;
    narratorBengali: string;
    chapterBengali: string;
  }> = {};

  for (let i = 0; i < sampleHadiths.length; i++) {
    const hadith = sampleHadiths[i];
    console.log(`Translating hadith ${i + 1}/${sampleHadiths.length} (Hadith #${hadith.hadithNumber})...`);
    
    try {
      const translated = await translateHadithToBengali({
        english: hadith.englishTranslation,
        narrator: hadith.narrator,
        chapterEnglish: hadith.chapterNameEnglish,
      });

      translatedData[hadith.hadithNumber.toString()] = translated;
      
      console.log(`✅ Translated hadith #${hadith.hadithNumber}`);
      console.log(`   Narrator: ${hadith.narrator} → ${translated.narratorBengali}`);
      console.log(`   Chapter: ${hadith.chapterNameEnglish} → ${translated.chapterBengali}\n`);
      
      // Small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Error translating hadith ${hadith.hadithNumber}:`, error);
    }
  }

  // Save sample results
  const outputPath = join(__dirname, "bukhari-bengali-translations.json");
  writeFileSync(outputPath, JSON.stringify(translatedData, null, 2));
  
  console.log(`\n✅ Sample translation complete! Translated ${Object.keys(translatedData).length} hadiths`);
  console.log(`Saved to: ${outputPath}\n`);
  console.log("Sample translation data:");
  console.log(JSON.stringify(translatedData, null, 2));
}

// Run the translation
if (import.meta.url === `file://${process.argv[1]}`) {
  translateSampleHadiths()
    .then(() => {
      console.log("\n🎉 Sample translation successful!");
      process.exit(0);
    })
    .catch(error => {
      console.error("❌ Translation failed:", error);
      process.exit(1);
    });
}

export { translateSampleHadiths };
