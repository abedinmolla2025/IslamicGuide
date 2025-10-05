export interface Surah {
  id: string;
  number: number;
  nameBengali: string;
  nameArabic: string;
  nameEnglish: string;
  meaningBengali: string;
  revelationType: "মক্কী" | "মাদানী";
  numberOfAyahs: number;
  fullText?: string;
  transliteration?: string;
  translation?: string;
}

export const surahs: Surah[] = [];
