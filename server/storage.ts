import { type User, type InsertUser, type PrayerTimes, type InsertPrayerTimes, type QuranVerse, type IslamicEvent, type IslamicName, type InsertIslamicName, type DailyQuiz, type InsertDailyQuiz, type Hadith, type InsertHadith } from "@shared/schema";
import { randomUUID } from "crypto";
import { islamicNames as namesData } from "../client/src/data/islamic-names";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  getPrayerTimes(latitude: number, longitude: number, date: string): Promise<PrayerTimes | undefined>;
  savePrayerTimes(prayerTimes: InsertPrayerTimes): Promise<PrayerTimes>;
  
  getQuranVerse(surahNumber: number, verseNumber: number): Promise<QuranVerse | undefined>;
  getRandomQuranVerse(): Promise<QuranVerse | undefined>;
  searchQuranVerses(query: string): Promise<QuranVerse[]>;
  
  getIslamicEvents(): Promise<IslamicEvent[]>;
  
  getIslamicNames(gender?: string, category?: string): Promise<IslamicName[]>;
  searchIslamicNames(query: string, gender?: string): Promise<IslamicName[]>;
  getIslamicNameById(id: string): Promise<IslamicName | undefined>;
  
  getDailyQuiz(): Promise<DailyQuiz | undefined>;
  saveDailyQuiz(quiz: InsertDailyQuiz): Promise<DailyQuiz>;
  
  getRandomHadith(): Promise<Hadith | undefined>;
  getDailyHadith(): Promise<Hadith | undefined>;
  setDailyHadith(hadith: Hadith): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private prayerTimes: Map<string, PrayerTimes>;
  private quranVerses: Map<string, QuranVerse>;
  private islamicEvents: Map<string, IslamicEvent>;
  private islamicNames: Map<string, IslamicName>;
  private dailyQuizzes: Map<string, DailyQuiz>;
  private hadiths: Map<string, Hadith>;
  private currentQuizDate: string | null;
  private currentHadithDate: string | null;
  private currentHadith: Hadith | null;

  constructor() {
    this.users = new Map();
    this.prayerTimes = new Map();
    this.quranVerses = new Map();
    this.islamicEvents = new Map();
    this.islamicNames = new Map();
    this.dailyQuizzes = new Map();
    this.hadiths = new Map();
    this.currentQuizDate = null;
    this.currentHadithDate = null;
    this.currentHadith = null;
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some Quran verses
    const verses = [
      {
        id: randomUUID(),
        surahNumber: 65,
        verseNumber: 2,
        arabic: "وَمَن يَتَّقِ ٱللَّهَ يَجْعَل لَّهُۥ مَخْرَجًا",
        translation: "And whoever fears Allah - He will make for him a way out.",
        translationBengali: null,
        transliteration: "Wa man yattaqi Allaha yaj'al lahu makhrajan",
        surahName: "At-Talaq",
        surahNameBengali: null,
        aiInsight: null,
        aiInsightBengali: null
      },
      {
        id: randomUUID(),
        surahNumber: 2,
        verseNumber: 255,
        arabic: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلۡحَيُّ ٱلۡقَيُّومُۚ لَا تَأۡخُذُهُۥ سِنَةٞ وَلَا نَوۡمٞۚ",
        translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.",
        translationBengali: null,
        transliteration: "Allahu la ilaha illa huwa al-hayyu al-qayyum. La ta'khuzuhu sinatun wa la nawm.",
        surahName: "Al-Baqarah",
        surahNameBengali: null,
        aiInsight: null,
        aiInsightBengali: null
      }
    ];

    verses.forEach(verse => {
      this.quranVerses.set(verse.id, verse);
    });

    // Initialize Islamic events
    const events = [
      {
        id: randomUUID(),
        hijriDate: "1 Muharram 1445",
        gregorianDate: "2023-07-19",
        title: "Islamic New Year",
        description: "First day of the Islamic calendar",
        isImportant: true
      },
      {
        id: randomUUID(),
        hijriDate: "10 Muharram 1445",
        gregorianDate: "2023-07-28",
        title: "Day of Ashura",
        description: "Important day of fasting and remembrance",
        isImportant: true
      }
    ];

    events.forEach(event => {
      this.islamicEvents.set(event.id, event);
    });

    // Initialize Islamic names with all 500 names
    const names = namesData.map(nameData => ({
      id: randomUUID(),
      name: nameData.name,
      nameArabic: nameData.nameArabic,
      nameBengali: nameData.nameBengali,
      meaning: nameData.meaning,
      meaningBengali: nameData.meaningBengali,
      origin: nameData.origin,
      gender: nameData.gender,
      category: nameData.category || null
    }));

    names.forEach(name => {
      this.islamicNames.set(name.id, name);
    });

    // Initialize some Hadiths
    const hadiths = [
      {
        id: randomUUID(),
        arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
        translation: "Actions are but by intentions, and every man shall have only that which he intended.",
        translationBengali: "কাজের ফলাফল নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী ফল পাবে।",
        narrator: "Umar ibn Al-Khattab",
        narratorBengali: "উমর ইবনুল খাত্তাব (রা.)",
        bookName: "Sahih Bukhari",
        bookNameBengali: "সহীহ বুখারী",
        reference: "Book 1, Hadith 1",
        aiInsight: "This fundamental hadith teaches that the value of our actions depends on our intentions. Before performing any deed, we should ensure our intention is purely for Allah's pleasure.",
        aiInsightBengali: "এই মৌলিক হাদীসটি শিক্ষা দেয় যে আমাদের কাজের মূল্য আমাদের নিয়তের উপর নির্ভর করে। যেকোনো কাজ করার আগে আমাদের নিয়ত শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য হওয়া উচিত।"
      },
      {
        id: randomUUID(),
        arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
        translation: "The best among you are those who learn the Quran and teach it.",
        translationBengali: "তোমাদের মধ্যে সর্বোত্তম ব্যক্তি হলো সে, যে কুরআন শেখে এবং অন্যদের শেখায়।",
        narrator: "Uthman ibn Affan",
        narratorBengali: "উসমান ইবন আফফান (রা.)",
        bookName: "Sahih Bukhari",
        bookNameBengali: "সহীহ বুখারী",
        reference: "Book 66, Hadith 21",
        aiInsight: "This hadith emphasizes the importance of learning and teaching the Quran. It encourages Muslims to dedicate time to understanding Allah's word and sharing that knowledge with others.",
        aiInsightBengali: "এই হাদিসটি কুরআন শেখা এবং শেখানোর গুরুত্ব তুলে ধরে। এটি মুসলমানদের আল্লাহর বাণী বোঝার জন্য সময় উৎসর্গ করতে এবং সেই জ্ঞান অন্যদের সাথে ভাগ করতে উৎসাহিত করে।"
      },
      {
        id: randomUUID(),
        arabic: "الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا",
        translation: "The believer to another believer is like a building whose different parts enforce each other.",
        translationBengali: "একজন মুমিন অপর মুমিনের জন্য ভবনের মতো যার এক অংশ অপর অংশকে শক্তিশালী করে।",
        narrator: "Abu Musa Al-Ash'ari",
        narratorBengali: "আবু মুসা আল-আশআরী (রা.)",
        bookName: "Sahih Bukhari",
        bookNameBengali: "সহীহ বুখারী",
        reference: "Book 8, Hadith 88",
        aiInsight: "This beautiful metaphor teaches us about the unity and mutual support that should exist among believers. Just as a building needs all its parts working together to stand strong, Muslims should support each other.",
        aiInsightBengali: "এই সুন্দর রূপকটি আমাদের শেখায় যে বিশ্বাসীদের মধ্যে একতা এবং পারস্পরিক সহায়তা থাকা উচিত। যেমন একটি ভবনের সমস্ত অংশ একসাথে কাজ করে শক্তিশালী হয়, তেমনি মুসলমানদেরও একে অপরকে সমর্থন করা উচিত।"
      },
      {
        id: randomUUID(),
        arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
        translation: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
        translationBengali: "যে ব্যক্তি আল্লাহ ও পরকালে বিশ্বাস করে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।",
        narrator: "Abu Hurairah",
        narratorBengali: "আবু হুরায়রা (রা.)",
        bookName: "Sahih Bukhari",
        bookNameBengali: "সহীহ বুখারী",
        reference: "Book 73, Hadith 47",
        aiInsight: "This hadith teaches us the importance of mindful speech. We should only speak when our words bring benefit, otherwise it's better to remain silent to avoid causing harm.",
        aiInsightBengali: "এই হাদিসটি আমাদের সচেতন কথা বলার গুরুত্ব শেখায়। আমাদের শুধুমাত্র তখনই কথা বলা উচিত যখন আমাদের কথা উপকার নিয়ে আসে, অন্যথায় ক্ষতি এড়াতে চুপ থাকাই ভালো।"
      },
      {
        id: randomUUID(),
        arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
        translation: "A Muslim is the one from whose tongue and hands the Muslims are safe.",
        translationBengali: "প্রকৃত মুসলমান সে, যার মুখ ও হাত থেকে অন্য মুসলমানরা নিরাপদ।",
        narrator: "Abdullah ibn Amr",
        narratorBengali: "আবদুল্লাহ ইবন আমর (রা.)",
        bookName: "Sahih Bukhari",
        bookNameBengali: "সহীহ বুখারী",
        reference: "Book 2, Hadith 9",
        aiInsight: "This hadith defines the core character of a true Muslim - one who doesn't harm others through words or actions. It reminds us to be mindful of how we treat fellow Muslims.",
        aiInsightBengali: "এই হাদিসটি একজন প্রকৃত মুসলমানের মূল চরিত্র সংজ্ঞায়িত করে - যে কথা বা কাজের মাধ্যমে অন্যদের ক্ষতি করে না। এটি আমাদের সহ-মুসলমানদের সাথে আচরণের বিষয়ে সচেতন হতে মনে করিয়ে দেয়।"
      }
    ];

    hadiths.forEach(hadith => {
      this.hadiths.set(hadith.id, hadith);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      location: insertUser.location || null,
      latitude: insertUser.latitude || null,
      longitude: insertUser.longitude || null,
      calculationMethod: insertUser.calculationMethod || "ISNA",
      dhikrCount: 0,
      favoriteVerses: [],
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userUpdate: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getPrayerTimes(latitude: number, longitude: number, date: string): Promise<PrayerTimes | undefined> {
    const key = `${latitude}-${longitude}-${date}`;
    return Array.from(this.prayerTimes.values()).find(
      pt => pt.latitude === latitude && pt.longitude === longitude && pt.date === date
    );
  }

  async savePrayerTimes(insertPrayerTimes: InsertPrayerTimes): Promise<PrayerTimes> {
    const id = randomUUID();
    const prayerTimes: PrayerTimes = { 
      ...insertPrayerTimes, 
      id,
      userId: insertPrayerTimes.userId || null
    };
    this.prayerTimes.set(id, prayerTimes);
    return prayerTimes;
  }

  async getQuranVerse(surahNumber: number, verseNumber: number): Promise<QuranVerse | undefined> {
    return Array.from(this.quranVerses.values()).find(
      verse => verse.surahNumber === surahNumber && verse.verseNumber === verseNumber
    );
  }

  async getRandomQuranVerse(): Promise<QuranVerse | undefined> {
    const verses = Array.from(this.quranVerses.values());
    if (verses.length === 0) return undefined;
    
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const verseIndex = dayOfYear % verses.length;
    
    return verses[verseIndex];
  }

  async searchQuranVerses(query: string): Promise<QuranVerse[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.quranVerses.values()).filter(verse =>
      verse.translation.toLowerCase().includes(searchTerm) ||
      verse.surahName.toLowerCase().includes(searchTerm) ||
      verse.transliteration?.toLowerCase().includes(searchTerm)
    );
  }

  async getIslamicEvents(): Promise<IslamicEvent[]> {
    return Array.from(this.islamicEvents.values());
  }

  async getIslamicNames(gender?: string, category?: string): Promise<IslamicName[]> {
    let names = Array.from(this.islamicNames.values());
    
    if (gender && gender !== 'all') {
      names = names.filter(name => name.gender === gender);
    }
    
    if (category && category !== 'All') {
      names = names.filter(name => name.category === category);
    }
    
    return names;
  }

  async searchIslamicNames(query: string, gender?: string): Promise<IslamicName[]> {
    const searchTerm = query.toLowerCase();
    let names = Array.from(this.islamicNames.values()).filter(name =>
      name.name.toLowerCase().includes(searchTerm) ||
      name.meaning.toLowerCase().includes(searchTerm) ||
      name.origin.toLowerCase().includes(searchTerm) ||
      name.category?.toLowerCase().includes(searchTerm)
    );

    if (gender && gender !== 'all') {
      names = names.filter(name => name.gender === gender);
    }

    return names;
  }

  async getIslamicNameById(id: string): Promise<IslamicName | undefined> {
    return this.islamicNames.get(id);
  }

  async getDailyQuiz(): Promise<DailyQuiz | undefined> {
    const today = new Date().toISOString().split('T')[0];
    
    if (this.currentQuizDate === today && this.dailyQuizzes.size > 0) {
      return Array.from(this.dailyQuizzes.values())[0];
    }
    
    return undefined;
  }

  async saveDailyQuiz(insertQuiz: InsertDailyQuiz): Promise<DailyQuiz> {
    const id = randomUUID();
    const quiz: DailyQuiz = { ...insertQuiz, id };
    
    this.dailyQuizzes.clear();
    this.dailyQuizzes.set(id, quiz);
    this.currentQuizDate = new Date().toISOString().split('T')[0];
    
    return quiz;
  }

  async getRandomHadith(): Promise<Hadith | undefined> {
    const hadithArray = Array.from(this.hadiths.values());
    if (hadithArray.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * hadithArray.length);
    return hadithArray[randomIndex];
  }

  async getDailyHadith(): Promise<Hadith | undefined> {
    const today = new Date().toISOString().split('T')[0];
    
    // If we have a current hadith for today, return it
    if (this.currentHadithDate === today && this.currentHadith) {
      return this.currentHadith;
    }
    
    // Otherwise, select a new one for today
    const hadithArray = Array.from(this.hadiths.values());
    if (hadithArray.length === 0) return undefined;
    
    // Use day of year to select consistent hadith for the day
    const todayDate = new Date();
    const dayOfYear = Math.floor((todayDate.getTime() - new Date(todayDate.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const hadithIndex = dayOfYear % hadithArray.length;
    
    this.currentHadith = hadithArray[hadithIndex];
    this.currentHadithDate = today;
    
    return this.currentHadith;
  }

  async setDailyHadith(hadith: Hadith): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    this.currentHadith = hadith;
    this.currentHadithDate = today;
  }
}

export const storage = new MemStorage();
