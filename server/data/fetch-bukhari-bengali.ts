/**
 * Script to fetch Bengali translations from alQuranBD Hadith API
 * and save them for offline use
 */

interface BengaliHadith {
  hadithEnglish: string;
  hadithArabic: string;
  hadithBengali: string;
  hadithNo: string;
  id: string;
  chapterId: string;
  bookId: string;
  topicName: string;
  rabiNameBn: string;
  rabiNameEn: string;
}

interface BengaliChapter {
  nameEnglish: string;
  nameBengali: string;
  id: string;
  chSerial: string;
  hadith_number: string;
  range_start: string;
  range_end: string;
}

async function fetchBukhariChapters(): Promise<BengaliChapter[]> {
  const response = await fetch('http://alquranbd.com/api/hadith/bukhari');
  const chapters = await response.json();
  return chapters;
}

async function fetchChapterHadiths(chapterNo: number): Promise<BengaliHadith[]> {
  const response = await fetch(`http://alquranbd.com/api/hadith/bukhari/${chapterNo}`);
  const hadiths = await response.json();
  return hadiths;
}

async function fetchAllBukhariData() {
  console.log('Fetching Bukhari chapters...');
  const chapters = await fetchBukhariChapters();
  
  const chapterMap: Record<string, BengaliChapter> = {};
  const hadithMap: Record<string, BengaliHadith> = {};
  const narratorMap: Record<string, string> = {};

  // Map chapters
  for (const chapter of chapters) {
    chapterMap[chapter.id] = chapter;
  }

  console.log(`Found ${chapters.length} chapters`);
  
  // Fetch hadiths for each chapter (with delay to avoid overwhelming the API)
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const chapterNo = parseInt(chapter.chSerial);
    
    console.log(`Fetching chapter ${chapterNo}/${chapters.length}: ${chapter.nameBengali}`);
    
    try {
      const hadiths = await fetchChapterHadiths(chapterNo);
      
      for (const hadith of hadiths) {
        hadithMap[hadith.hadithNo] = hadith;
        
        // Map narrator names
        if (hadith.rabiNameEn && hadith.rabiNameBn) {
          narratorMap[hadith.rabiNameEn] = hadith.rabiNameBn;
        }
      }
      
      // Small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error fetching chapter ${chapterNo}:`, error);
    }
  }

  const data = {
    chapters: chapterMap,
    hadiths: hadithMap,
    narrators: narratorMap,
  };

  console.log(`\nFetched ${Object.keys(hadithMap).length} hadiths`);
  console.log(`Mapped ${Object.keys(narratorMap).length} narrators`);

  return data;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchAllBukhariData()
    .then(data => {
      const fs = require('fs');
      const path = require('path');
      
      const outputPath = path.join(__dirname, 'bukhari-bengali.json');
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
      
      console.log(`\nData saved to ${outputPath}`);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export { fetchAllBukhariData };
