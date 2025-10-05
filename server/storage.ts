import { type User, type InsertUser, type PrayerTimes, type InsertPrayerTimes, type QuranVerse, type IslamicEvent, type IslamicName, type InsertIslamicName, type DailyQuiz, type InsertDailyQuiz } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private prayerTimes: Map<string, PrayerTimes>;
  private quranVerses: Map<string, QuranVerse>;
  private islamicEvents: Map<string, IslamicEvent>;
  private islamicNames: Map<string, IslamicName>;
  private dailyQuizzes: Map<string, DailyQuiz>;
  private currentQuizDate: string | null;

  constructor() {
    this.users = new Map();
    this.prayerTimes = new Map();
    this.quranVerses = new Map();
    this.islamicEvents = new Map();
    this.islamicNames = new Map();
    this.dailyQuizzes = new Map();
    this.currentQuizDate = null;
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
        transliteration: "Wa man yattaqi Allaha yaj'al lahu makhrajan",
        surahName: "At-Talaq"
      },
      {
        id: randomUUID(),
        surahNumber: 2,
        verseNumber: 255,
        arabic: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلۡحَيُّ ٱلۡقَيُّومُۚ لَا تَأۡخُذُهُۥ سِنَةٞ وَلَا نَوۡمٞۚ",
        translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.",
        transliteration: "Allahu la ilaha illa huwa al-hayyu al-qayyum. La ta'khuzuhu sinatun wa la nawm.",
        surahName: "Al-Baqarah"
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
}

export const storage = new MemStorage();
