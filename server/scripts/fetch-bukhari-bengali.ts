import fs from 'fs';
import path from 'path';

interface AlQuranBDHadith {
  hadithNo: string;
  hadithBengali: string;
  hadithEnglish: string;
  hadithArabic: string;
  rabiNameBn: string;
  rabiNameEn: string;
  topicName: string;
  chapterId: string;
}

interface AlQuranBDChapter {
  id: string;
  nameBengali: string;
  nameEnglish: string;
  chSerial: string;
}

interface BukhariJSON {
  id: number;
  metadata: any;
  chapters: any[];
  hadiths: any[];
}

async function fetchBukhariChapters(): Promise<AlQuranBDChapter[]> {
  try {
    const response = await fetch('https://alquranbd.com/api/hadith/bukhari');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
}

async function fetchChapterHadiths(chapterNo: number): Promise<AlQuranBDHadith[]> {
  try {
    const response = await fetch(`https://alquranbd.com/api/hadith/bukhari/${chapterNo}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching chapter ${chapterNo}:`, error);
    return [];
  }
}

async function fetchAllBukhariHadiths() {
  console.log('Fetching Bukhari chapters from alQuranBD API...');
  
  const chapters = await fetchBukhariChapters();
  console.log(`Found ${chapters.length} chapters`);
  
  const allHadiths: AlQuranBDHadith[] = [];
  const chapterMap = new Map<string, string>();
  
  for (const chapter of chapters) {
    chapterMap.set(chapter.id, chapter.nameBengali);
  }
  
  for (let i = 1; i <= chapters.length; i++) {
    console.log(`Fetching chapter ${i}/${chapters.length}...`);
    const hadiths = await fetchChapterHadiths(i);
    allHadiths.push(...hadiths);
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`Total hadiths fetched: ${allHadiths.length}`);
  
  const bukhariJsonPath = path.join(process.cwd(), 'attached_assets', 'bukhari_1759944652282.json');
  const bukhariData: BukhariJSON = JSON.parse(fs.readFileSync(bukhariJsonPath, 'utf-8'));
  
  const hadithMap = new Map<number, AlQuranBDHadith>();
  allHadiths.forEach(h => {
    const hadithNo = parseInt(h.hadithNo);
    if (!isNaN(hadithNo)) {
      hadithMap.set(hadithNo, h);
    }
  });
  
  console.log('Creating Bengali data mapping...');
  const bengaliData: any = {
    chapters: {},
    hadiths: {},
    narrators: {}
  };
  
  chapters.forEach(chapter => {
    bengaliData.chapters[chapter.id] = chapter.nameBengali;
  });
  
  allHadiths.forEach(hadith => {
    const hadithNo = parseInt(hadith.hadithNo);
    if (!isNaN(hadithNo)) {
      bengaliData.hadiths[hadithNo] = {
        translation: hadith.hadithBengali?.trim() || null,
        narrator: hadith.rabiNameBn?.trim() || null,
        topic: hadith.topicName?.trim() || null
      };
    }
  });
  
  const outputPath = path.join(process.cwd(), 'server', 'data', 'bukhari-bengali.json');
  fs.writeFileSync(outputPath, JSON.stringify(bengaliData, null, 2), 'utf-8');
  
  console.log(`Bengali data saved to ${outputPath}`);
  console.log(`Chapters: ${Object.keys(bengaliData.chapters).length}`);
  console.log(`Hadiths: ${Object.keys(bengaliData.hadiths).length}`);
  console.log('Done!');
}

fetchAllBukhariHadiths().catch(console.error);
