import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPrayerTimesSchema } from "@shared/schema";
import { generateDailyQuiz } from "./openai-quiz";
import { enhanceVerseWithAI } from "./openai-verse";
import { enhanceHadithWithAI } from "./openai-hadith";
import { searchNearbyMosques } from "./google-maps";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // APK Download route
  app.get("/downloads/islamic-companion.apk", (req, res) => {
    const apkPath = path.join(process.cwd(), "dist/public/downloads/islamic-companion.apk");
    res.download(apkPath, "islamic-companion.apk", (err) => {
      if (err) {
        console.error("APK download error:", err);
        res.status(500).send("Error downloading APK");
      }
    });
  });

  // TWA assetlinks.json route for Android verification
  app.get("/.well-known/assetlinks.json", (req, res) => {
    const assetlinksPath = path.join(process.cwd(), "dist/public/.well-known/assetlinks.json");
    res.setHeader("Content-Type", "application/json");
    res.sendFile(assetlinksPath, (err) => {
      if (err) {
        console.error("Assetlinks error:", err);
        res.status(404).json({ error: "Assetlinks not found" });
      }
    });
  });
  
  // Prayer times routes
  app.get("/api/prayer-times", async (req, res) => {
    try {
      const { latitude, longitude, date } = req.query;
      
      if (!latitude || !longitude || !date) {
        return res.status(400).json({ message: "Latitude, longitude, and date are required" });
      }

      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      
      // Check if we have cached prayer times
      let prayerTimes = await storage.getPrayerTimes(lat, lng, date as string);
      
      if (!prayerTimes) {
        // Calculate prayer times using a simple algorithm
        // In a real app, you'd use a proper Islamic prayer time calculation library
        const now = new Date();
        const prayerTimesData = {
          userId: null,
          date: date as string,
          fajr: "05:20",
          sunrise: "06:45",
          dhuhr: "12:30",
          asr: "15:45",
          maghrib: "18:12",
          isha: "19:35",
          latitude: lat,
          longitude: lng,
          calculationMethod: "ISNA"
        };
        
        prayerTimes = await storage.savePrayerTimes(prayerTimesData);
      }
      
      res.json(prayerTimes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get prayer times" });
    }
  });

  // Qibla direction route
  app.get("/api/qibla", async (req, res) => {
    try {
      const { latitude, longitude } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      
      // Kaaba coordinates
      const kaabaLat = 21.422487;
      const kaabaLng = 39.826206;
      
      // Calculate direction to Kaaba
      const dLng = (kaabaLng - lng) * Math.PI / 180;
      const lat1Rad = lat * Math.PI / 180;
      const lat2Rad = kaabaLat * Math.PI / 180;
      
      const y = Math.sin(dLng) * Math.cos(lat2Rad);
      const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
      
      let bearing = Math.atan2(y, x) * 180 / Math.PI;
      bearing = (bearing + 360) % 360;
      
      // Calculate distance to Kaaba
      const R = 6371; // Earth's radius in km
      const dLat = (kaabaLat - lat) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      res.json({
        direction: Math.round(bearing),
        distance: Math.round(distance),
        compassDirection: getCompassDirection(bearing)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate Qibla direction" });
    }
  });

  // Quran verses routes
  app.get("/api/quran/random", async (req, res) => {
    try {
      let verse = await storage.getRandomQuranVerse();
      if (!verse) {
        return res.status(404).json({ message: "No verses found" });
      }
      
      // Enhance verse with AI if it doesn't have Bengali translation or AI insights
      if (!verse.translationBengali || !verse.aiInsight) {
        verse = await enhanceVerseWithAI(verse);
      }
      
      res.json(verse);
    } catch (error) {
      console.error("Error in /api/quran/random:", error);
      res.status(500).json({ message: "Failed to get random verse" });
    }
  });

  app.get("/api/quran/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const verses = await storage.searchQuranVerses(q as string);
      res.json(verses);
    } catch (error) {
      res.status(500).json({ message: "Failed to search verses" });
    }
  });

  app.get("/api/quran/:surah/:verse", async (req, res) => {
    try {
      const { surah, verse } = req.params;
      const surahNumber = parseInt(surah);
      const verseNumber = parseInt(verse);
      
      const quranVerse = await storage.getQuranVerse(surahNumber, verseNumber);
      if (!quranVerse) {
        return res.status(404).json({ message: "Verse not found" });
      }
      
      res.json(quranVerse);
    } catch (error) {
      res.status(500).json({ message: "Failed to get verse" });
    }
  });

  // Islamic events route
  app.get("/api/islamic-events", async (req, res) => {
    try {
      const events = await storage.getIslamicEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to get Islamic events" });
    }
  });

  // User dhikr counter route
  app.post("/api/dhikr/increment", async (req, res) => {
    try {
      // For now, we'll use a simple in-memory counter
      // In a real app, this would be tied to user authentication
      res.json({ count: Math.floor(Math.random() * 100) + 1 });
    } catch (error) {
      res.status(500).json({ message: "Failed to increment dhikr count" });
    }
  });

  // Islamic names routes
  app.get("/api/islamic-names", async (req, res) => {
    try {
      const { gender, category } = req.query;
      const names = await storage.getIslamicNames(
        gender as string, 
        category as string
      );
      res.json(names);
    } catch (error) {
      res.status(500).json({ message: "Failed to get Islamic names" });
    }
  });

  app.get("/api/islamic-names/search", async (req, res) => {
    try {
      const { q, gender } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const names = await storage.searchIslamicNames(q as string, gender as string);
      res.json(names);
    } catch (error) {
      res.status(500).json({ message: "Failed to search Islamic names" });
    }
  });

  app.get("/api/islamic-names/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const name = await storage.getIslamicNameById(id);
      
      if (!name) {
        return res.status(404).json({ message: "Name not found" });
      }
      
      res.json(name);
    } catch (error) {
      res.status(500).json({ message: "Failed to get Islamic name" });
    }
  });

  // Daily Quiz routes
  app.get("/api/daily-quiz", async (req, res) => {
    try {
      let quiz = await storage.getDailyQuiz();
      
      if (!quiz) {
        const quizData = await generateDailyQuiz();
        quiz = await storage.saveDailyQuiz(quizData);
      }
      
      res.json(quiz);
    } catch (error) {
      console.error("Daily quiz error:", error);
      res.status(500).json({ message: "Failed to get daily quiz" });
    }
  });

  app.post("/api/daily-quiz/refresh", async (req, res) => {
    try {
      const quizData = await generateDailyQuiz();
      const quiz = await storage.saveDailyQuiz(quizData);
      res.json(quiz);
    } catch (error) {
      console.error("Quiz refresh error:", error);
      res.status(500).json({ message: "Failed to refresh quiz" });
    }
  });

  // Hadith of the Day routes
  app.get("/api/hadith/daily", async (req, res) => {
    try {
      let hadith = await storage.getDailyHadith();
      
      if (!hadith) {
        hadith = await storage.getRandomHadith();
        if (!hadith) {
          return res.status(404).json({ message: "No hadith found" });
        }
        
        // Enhance hadith with AI if it doesn't have Bengali translation or AI insights
        if (!hadith.translationBengali || !hadith.aiInsight) {
          hadith = await enhanceHadithWithAI(hadith);
        }
        
        // Set as daily hadith for persistence
        await storage.setDailyHadith(hadith);
      } else {
        // Enhance hadith with AI if it doesn't have Bengali translation or AI insights
        if (!hadith.translationBengali || !hadith.aiInsight) {
          hadith = await enhanceHadithWithAI(hadith);
          // Update the stored hadith with AI enhancements
          await storage.setDailyHadith(hadith);
        }
      }
      
      res.json(hadith);
    } catch (error) {
      console.error("Daily hadith error:", error);
      res.status(500).json({ message: "Failed to get daily hadith" });
    }
  });

  app.post("/api/hadith/refresh", async (req, res) => {
    try {
      let hadith = await storage.getRandomHadith();
      if (!hadith) {
        return res.status(404).json({ message: "No hadith found" });
      }
      
      // Always enhance refreshed hadith with AI
      hadith = await enhanceHadithWithAI(hadith);
      
      // Set as new daily hadith
      await storage.setDailyHadith(hadith);
      
      res.json(hadith);
    } catch (error) {
      console.error("Hadith refresh error:", error);
      res.status(500).json({ message: "Failed to refresh hadith" });
    }
  });

  // Bukhari Hadith routes
  app.get("/api/bukhari/all", async (req, res) => {
    try {
      const hadiths = await storage.getAllBukhariHadiths();
      res.json(hadiths);
    } catch (error) {
      console.error("Get all Bukhari hadiths error:", error);
      res.status(500).json({ message: "Failed to get Bukhari hadiths" });
    }
  });

  app.get("/api/bukhari/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const hadiths = await storage.searchBukhariHadiths(q);
      res.json(hadiths);
    } catch (error) {
      console.error("Search Bukhari hadiths error:", error);
      res.status(500).json({ message: "Failed to search Bukhari hadiths" });
    }
  });

  app.get("/api/bukhari/random", async (req, res) => {
    try {
      const hadith = await storage.getRandomBukhariHadith();
      if (!hadith) {
        return res.status(404).json({ message: "No Bukhari hadith found" });
      }
      res.json(hadith);
    } catch (error) {
      console.error("Get random Bukhari hadith error:", error);
      res.status(500).json({ message: "Failed to get random Bukhari hadith" });
    }
  });

  app.get("/api/bukhari/book/:bookNumber", async (req, res) => {
    try {
      const bookNumber = parseInt(req.params.bookNumber);
      if (isNaN(bookNumber)) {
        return res.status(400).json({ message: "Invalid book number" });
      }
      
      const hadiths = await storage.getBukhariHadithsByBook(bookNumber);
      res.json(hadiths);
    } catch (error) {
      console.error("Get Bukhari hadiths by book error:", error);
      res.status(500).json({ message: "Failed to get Bukhari hadiths by book" });
    }
  });

  app.get("/api/bukhari/:id", async (req, res) => {
    try {
      const hadith = await storage.getBukhariHadithById(req.params.id);
      if (!hadith) {
        return res.status(404).json({ message: "Bukhari hadith not found" });
      }
      res.json(hadith);
    } catch (error) {
      console.error("Get Bukhari hadith by ID error:", error);
      res.status(500).json({ message: "Failed to get Bukhari hadith" });
    }
  });

  // Bukhari Quiz endpoints
  app.get("/api/bukhari/quiz/daily", async (req, res) => {
    try {
      const allHadiths = await storage.getAllBukhariHadiths();
      if (allHadiths.length === 0) {
        return res.status(404).json({ message: "No Bukhari hadiths found" });
      }

      // Use day of year for consistent daily quiz
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
      const hadithIndex = dayOfYear % allHadiths.length;
      const hadith = allHadiths[hadithIndex];

      // Generate quiz question
      const questionTypes = ['narrator', 'book', 'meaning'];
      const questionType = questionTypes[dayOfYear % questionTypes.length];

      let question, questionBengali, options, optionsBengali, correctAnswer;

      if (questionType === 'narrator') {
        question = "Who narrated this hadith?";
        questionBengali = "এই হাদীসটি কে বর্ণনা করেছেন?";
        
        // Get unique narrators and deduplicate
        const uniqueNarrators = Array.from(new Set(
          allHadiths
            .filter(h => h.narrator !== hadith.narrator)
            .map(h => h.narrator)
        )).slice(0, 15);  // Get more to choose from
        
        // Shuffle and pick 3
        const shuffled = uniqueNarrators.sort(() => Math.random() - 0.5).slice(0, 3);
        const wrongNarrators = shuffled.map(narrator => {
          const found = allHadiths.find(h => h.narrator === narrator);
          return { en: narrator, bn: found?.narratorBengali || narrator };
        });
        
        // Combine with correct answer
        const allOptions = [
          { en: hadith.narrator, bn: hadith.narratorBengali },
          ...wrongNarrators
        ].sort(() => Math.random() - 0.5);

        options = allOptions.map(o => o.en);
        optionsBengali = allOptions.map(o => o.bn);
        correctAnswer = allOptions.findIndex(o => o.en === hadith.narrator);

      } else if (questionType === 'book') {
        question = "Which chapter is this hadith from?";
        questionBengali = "এই হাদীসটি কোন অধ্যায় থেকে?";
        
        // Get unique chapters and deduplicate
        const uniqueChapters = Array.from(new Set(
          allHadiths
            .filter(h => h.chapterNameEnglish !== hadith.chapterNameEnglish)
            .map(h => h.chapterNameEnglish)
        )).slice(0, 15);
        
        // Shuffle and pick 3
        const shuffled = uniqueChapters.sort(() => Math.random() - 0.5).slice(0, 3);
        const wrongChapters = shuffled.map(chapter => {
          const found = allHadiths.find(h => h.chapterNameEnglish === chapter);
          return { en: chapter, bn: found?.chapterNameBengali || chapter };
        });
        
        // Combine with correct answer
        const allOptions = [
          { en: hadith.chapterNameEnglish, bn: hadith.chapterNameBengali },
          ...wrongChapters
        ].sort(() => Math.random() - 0.5);

        options = allOptions.map(o => o.en);
        optionsBengali = allOptions.map(o => o.bn);
        correctAnswer = allOptions.findIndex(o => o.en === hadith.chapterNameEnglish);

      } else {
        question = `What does the Prophet (ﷺ) teach in this hadith? "${hadith.englishTranslation.substring(0, 100)}..."`;
        questionBengali = `এই হাদীসে নবী (সাঃ) কী শিক্ষা দিয়েছেন? "${hadith.bengaliTranslation.substring(0, 100)}..."`;
        
        const meaningOptions = [
          { en: hadith.explanation || "This hadith emphasizes the importance of intention and sincerity", bn: "এই হাদীস নিয়ত এবং আন্তরিকতার গুরুত্ব তুলে ধরে" },
          { en: "The importance of praying five times a day", bn: "দিনে পাঁচবার সালাত আদায়ের গুরুত্ব" },
          { en: "The virtues of fasting during Ramadan", bn: "রমজানে রোজা রাখার ফজিলত" },
          { en: "The obligation of paying Zakat", bn: "যাকাত প্রদানের বাধ্যবাধকতা" }
        ].sort(() => Math.random() - 0.5);
        
        options = meaningOptions.map(o => o.en);
        optionsBengali = meaningOptions.map(o => o.bn);
        correctAnswer = meaningOptions.findIndex(o => o.en === (hadith.explanation || "This hadith emphasizes the importance of intention and sincerity"));
      }

      res.json({
        hadith,
        question,
        questionBengali,
        options,
        optionsBengali,
        correctAnswer,
        explanation: hadith.explanation || "Study the hadith carefully to understand its meaning",
        explanationBengali: hadith.explanationBengali || "হাদীসটি ভালোভাবে পড়ুন এবং এর অর্থ বোঝার চেষ্টা করুন"
      });
    } catch (error) {
      console.error("Bukhari daily quiz error:", error);
      res.status(500).json({ message: "Failed to generate daily quiz" });
    }
  });

  app.get("/api/bukhari/quiz/random", async (req, res) => {
    try {
      const hadith = await storage.getRandomBukhariHadith();
      if (!hadith) {
        return res.status(404).json({ message: "No Bukhari hadiths found" });
      }

      const allHadiths = await storage.getAllBukhariHadiths();

      // Random question type
      const questionTypes = ['narrator', 'book', 'meaning'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

      let question, questionBengali, options, optionsBengali, correctAnswer;

      if (questionType === 'narrator') {
        question = "Who narrated this hadith?";
        questionBengali = "এই হাদীসটি কে বর্ণনা করেছেন?";
        
        // Get unique narrators and deduplicate
        const uniqueNarrators = Array.from(new Set(
          allHadiths
            .filter(h => h.narrator !== hadith.narrator)
            .map(h => h.narrator)
        )).slice(0, 15);  // Get more to choose from
        
        // Shuffle and pick 3
        const shuffled = uniqueNarrators.sort(() => Math.random() - 0.5).slice(0, 3);
        const wrongNarrators = shuffled.map(narrator => {
          const found = allHadiths.find(h => h.narrator === narrator);
          return { en: narrator, bn: found?.narratorBengali || narrator };
        });
        
        // Combine with correct answer
        const allOptions = [
          { en: hadith.narrator, bn: hadith.narratorBengali },
          ...wrongNarrators
        ].sort(() => Math.random() - 0.5);

        options = allOptions.map(o => o.en);
        optionsBengali = allOptions.map(o => o.bn);
        correctAnswer = allOptions.findIndex(o => o.en === hadith.narrator);

      } else if (questionType === 'book') {
        question = "Which chapter is this hadith from?";
        questionBengali = "এই হাদীসটি কোন অধ্যায় থেকে?";
        
        // Get unique chapters and deduplicate
        const uniqueChapters = Array.from(new Set(
          allHadiths
            .filter(h => h.chapterNameEnglish !== hadith.chapterNameEnglish)
            .map(h => h.chapterNameEnglish)
        )).slice(0, 15);
        
        // Shuffle and pick 3
        const shuffled = uniqueChapters.sort(() => Math.random() - 0.5).slice(0, 3);
        const wrongChapters = shuffled.map(chapter => {
          const found = allHadiths.find(h => h.chapterNameEnglish === chapter);
          return { en: chapter, bn: found?.chapterNameBengali || chapter };
        });
        
        // Combine with correct answer
        const allOptions = [
          { en: hadith.chapterNameEnglish, bn: hadith.chapterNameBengali },
          ...wrongChapters
        ].sort(() => Math.random() - 0.5);

        options = allOptions.map(o => o.en);
        optionsBengali = allOptions.map(o => o.bn);
        correctAnswer = allOptions.findIndex(o => o.en === hadith.chapterNameEnglish);

      } else {
        question = `What does the Prophet (ﷺ) teach in this hadith? "${hadith.englishTranslation.substring(0, 100)}..."`;
        questionBengali = `এই হাদীসে নবী (সাঃ) কী শিক্ষা দিয়েছেন? "${hadith.bengaliTranslation.substring(0, 100)}..."`;
        
        const meaningOptions = [
          { en: hadith.explanation || "This hadith emphasizes the importance of intention and sincerity", bn: "এই হাদীস নিয়ত এবং আন্তরিকতার গুরুত্ব তুলে ধরে" },
          { en: "The importance of praying five times a day", bn: "দিনে পাঁচবার সালাত আদায়ের গুরুত্ব" },
          { en: "The virtues of fasting during Ramadan", bn: "রমজানে রোজা রাখার ফজিলত" },
          { en: "The obligation of paying Zakat", bn: "যাকাত প্রদানের বাধ্যবাধকতা" }
        ].sort(() => Math.random() - 0.5);
        
        options = meaningOptions.map(o => o.en);
        optionsBengali = meaningOptions.map(o => o.bn);
        correctAnswer = meaningOptions.findIndex(o => o.en === (hadith.explanation || "This hadith emphasizes the importance of intention and sincerity"));
      }

      res.json({
        hadith,
        question,
        questionBengali,
        options,
        optionsBengali,
        correctAnswer,
        explanation: hadith.explanation || "Study the hadith carefully to understand its meaning",
        explanationBengali: hadith.explanationBengali || "হাদীসটি ভালোভাবে পড়ুন এবং এর অর্থ বোঝার চেষ্টা করুন"
      });
    } catch (error) {
      console.error("Bukhari random quiz error:", error);
      res.status(500).json({ message: "Failed to generate random quiz" });
    }
  });

  // Mosque finder route
  app.get("/api/mosques/nearby", async (req, res) => {
    try {
      const { latitude, longitude, radius } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const searchRadius = radius ? parseFloat(radius as string) : 5000;
      
      const mosques = await searchNearbyMosques(lat, lng, searchRadius);
      res.json(mosques);
    } catch (error) {
      console.error("Mosque finder error:", error);
      res.status(500).json({ message: "Failed to find nearby mosques" });
    }
  });

  // APK download endpoint
  app.get("/download/apk", (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || req.headers['x-forwarded-host'];
    const fullUrl = `${protocol}://${host}`;
    
    const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(fullUrl)}`;
    res.redirect(pwaBuilderUrl);
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getCompassDirection(bearing: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
}
