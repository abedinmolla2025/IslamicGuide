import bukhariDataRaw from "../../attached_assets/bukhari_1759944652282.json";
import { type BukhariHadith } from "@shared/schema";

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

export function loadBukhariHadiths(): BukhariHadith[] {
  const bukhariData = bukhariDataRaw as RawBukhariData;
  const chapters = bukhariData.chapters;
  const hadiths = bukhariData.hadiths;
  
  // Create a chapter map for quick lookup
  const chapterMap = new Map(chapters.map(c => [c.id, c]));
  
  // Transform hadiths to our schema
  return hadiths.map((hadith): BukhariHadith => {
    const chapter = chapterMap.get(hadith.chapterId);
    const bookNumber = hadith.bookId;
    
    return {
      id: `bukhari-${hadith.id}`,
      bookNumber: bookNumber,
      bookNameEnglish: bukhariData.metadata.english.title,
      bookNameArabic: bukhariData.metadata.arabic.title,
      bookNameBengali: "সহীহ বুখারী",
      chapterNumber: chapter?.id || 0,
      chapterNameEnglish: chapter?.english || "Unknown",
      chapterNameArabic: chapter?.arabic || "",
      chapterNameBengali: chapter?.english || "Unknown", // Will need Bengali translation
      hadithNumber: hadith.idInBook,
      arabicText: hadith.arabic,
      englishTranslation: hadith.english.text,
      bengaliTranslation: hadith.english.text, // Will need Bengali translation
      narrator: hadith.english.narrator,
      narratorBengali: hadith.english.narrator, // Will need Bengali translation
      grading: "Sahih",
      explanation: null,
      explanationBengali: null,
    };
  });
}
