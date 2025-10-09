import bukhariDataRaw from "../../attached_assets/bukhari_1759944652282.json";
import { type BukhariHadith } from "@shared/schema";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface RawBukhariHadith {
  id: number;
  idInBook: number;
  chapterId: number;
  bookId: number;
  arabic: string;
  english: {
    narrator: string;
    text: string;
  };
}

interface RawChapter {
  id: number;
  bookId: number;
  arabic: string;
  english: string;
}

interface RawBukhariData {
  id: number;
  metadata: {
    id: number;
    length: number;
    arabic: { title: string; author: string; introduction: string };
    english: { title: string; author: string; introduction: string };
  };
  chapters: RawChapter[];
  hadiths: RawBukhariHadith[];
}

interface BengaliTranslation {
  bengaliTranslation: string;
  narratorBengali: string;
  chapterBengali: string;
}

// Load Bengali translations if available
function loadBengaliTranslations(): Record<string, BengaliTranslation> {
  const translationPath = join(__dirname, "bukhari-bengali-translations.json");
  
  if (existsSync(translationPath)) {
    try {
      const data = readFileSync(translationPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading Bengali translations:", error);
      return {};
    }
  }
  
  return {};
}

export function loadBukhariHadiths(): BukhariHadith[] {
  const bukhariData = bukhariDataRaw as RawBukhariData;
  const chapters = bukhariData.chapters;
  const hadiths = bukhariData.hadiths;
  const bengaliTranslations = loadBengaliTranslations();
  
  // Create a chapter map for quick lookup
  const chapterMap = new Map(chapters.map(c => [c.id, c]));
  
  // Create chapter Bengali translations cache
  const chapterBengaliCache = new Map<number, string>();
  
  // Transform hadiths to our schema
  return hadiths.map((hadith): BukhariHadith => {
    const chapter = chapterMap.get(hadith.chapterId);
    const bookNumber = hadith.bookId;
    const hadithKey = hadith.idInBook.toString();
    const translation = bengaliTranslations[hadithKey];
    
    // Get or cache chapter Bengali name
    let chapterBengali = chapter?.english || "Unknown";
    if (translation?.chapterBengali) {
      chapterBengali = translation.chapterBengali;
      chapterBengaliCache.set(hadith.chapterId, translation.chapterBengali);
    } else if (chapterBengaliCache.has(hadith.chapterId)) {
      chapterBengali = chapterBengaliCache.get(hadith.chapterId)!;
    }
    
    return {
      id: `bukhari-${hadith.id}`,
      bookNumber: bookNumber,
      bookNameEnglish: bukhariData.metadata.english.title,
      bookNameArabic: bukhariData.metadata.arabic.title,
      bookNameBengali: "সহীহ বুখারী",
      chapterNumber: chapter?.id || 0,
      chapterNameEnglish: chapter?.english || "Unknown",
      chapterNameArabic: chapter?.arabic || "",
      chapterNameBengali: chapterBengali,
      hadithNumber: hadith.idInBook,
      arabicText: hadith.arabic,
      englishTranslation: hadith.english.text,
      bengaliTranslation: translation?.bengaliTranslation || hadith.english.text,
      narrator: hadith.english.narrator,
      narratorBengali: translation?.narratorBengali || hadith.english.narrator,
      grading: "Sahih",
      explanation: null,
      explanationBengali: null,
    };
  });
}
