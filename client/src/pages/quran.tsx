import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNavigation from "@/components/bottom-navigation";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import AyahAudioPlayer from "@/components/ayah-audio-player";
import { Search, BookOpen, ArrowLeft, Loader2, Volume2 } from "lucide-react";
import { quranSurahs } from "@/data/quran-surahs";
import type { BengaliVerse, ArabicVerse } from "@/data/quran-surahs";

type SurahData = {
  arabic: ArabicVerse[];
  bengali: BengaliVerse[];
};

export default function QuranPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [filteredSurahs, setFilteredSurahs] = useState(quranSurahs);
  const [selectedReciter, setSelectedReciter] = useState("ar.alafasy");
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
  const ayahRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Auto-scroll to currently playing ayah
  useEffect(() => {
    if (currentPlayingAyah !== null) {
      const element = ayahRefs.current.get(currentPlayingAyah);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentPlayingAyah]);

  // Available reciters
  const reciters = [
    { value: "ar.alafasy", label: "মিশারি আল-আফাসি (Mishary Alafasy)" },
    { value: "ar.abdulbasitmurattal", label: "আব্দুল বাসিত (Abdul Basit)" },
    { value: "ar.abdurrahmaansudais", label: "আবদুর রহমান সুদাইস (Sudais)" },
    { value: "ar.shaatree", label: "আবু বকর শাতেরি (Abu Bakr Shatri)" },
    { value: "ar.hanirifai", label: "হানি রিফাই (Hani Rifai)" },
  ];

  // Fetch Arabic text for selected surah
  const { data: arabicData, isLoading: arabicLoading } = useQuery<{ chapter: ArabicVerse[] }>({
    queryKey: [`/quran/arabic/${selectedSurah}`],
    queryFn: async () => {
      if (!selectedSurah) return { chapter: [] };
      const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quransimple/${selectedSurah}.json`);
      return response.json();
    },
    enabled: !!selectedSurah,
  });

  // Fetch Bengali translation for selected surah
  const { data: bengaliData, isLoading: bengaliLoading } = useQuery<{ chapter: BengaliVerse[] }>({
    queryKey: [`/quran/bengali/${selectedSurah}`],
    queryFn: async () => {
      if (!selectedSurah) return { chapter: [] };
      const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ben-muhiuddinkhan/${selectedSurah}.json`);
      return response.json();
    },
    enabled: !!selectedSurah,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredSurahs(quranSurahs);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = quranSurahs.filter(
      (surah) =>
        surah.bengali.toLowerCase().includes(lowerQuery) ||
        surah.english.toLowerCase().includes(lowerQuery) ||
        surah.arabic.includes(query) ||
        surah.number.toString() === query
    );
    setFilteredSurahs(filtered);
  };

  const selectedSurahInfo = quranSurahs.find((s) => s.number === selectedSurah);
  const isLoading = arabicLoading || bengaliLoading;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 to-emerald-900">
      <TopBar title="পবিত্র কুরআন" subtitle="সম্পূর্ণ বাংলা অনুবাদ সহ" />

      <main className="flex-1 overflow-y-auto p-4 pb-20 space-y-4">
        {/* Search Section */}
        <div className="flex gap-2">
          <Input
            placeholder="সূরা খুঁজুন... (নাম বা নম্বর)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-emerald-900/50 border-emerald-700 text-white placeholder:text-emerald-300"
            data-testid="input-search-surah"
          />
          <Button
            onClick={() => handleSearch(searchQuery)}
            className="bg-emerald-600 hover:bg-emerald-700"
            data-testid="button-search-surah"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Surah List */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            সূরা তালিকা ({filteredSurahs.length}টি)
          </h2>

          {filteredSurahs.map((surah) => (
            <Card
              key={surah.number}
              className="bg-emerald-900/40 border-emerald-700 hover-elevate cursor-pointer"
              onClick={() => setSelectedSurah(surah.number)}
              data-testid={`card-surah-${surah.number}`}
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-bold">
                      {surah.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{surah.bengali}</h3>
                      <p className="text-sm text-emerald-200">{surah.english}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>
                      {surah.arabic}
                    </p>
                    <p className="text-xs text-emerald-300">
                      {surah.verses} আয়াত • {surah.revelation === "Mecca" ? "মক্কী" : "মাদানী"}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}

          {filteredSurahs.length === 0 && (
            <Card className="bg-emerald-900/40 border-emerald-700">
              <CardContent className="p-8 text-center">
                <p className="text-emerald-200">কোনো সূরা পাওয়া যায়নি</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Surah Detail Modal */}
      <Dialog open={!!selectedSurah} onOpenChange={() => {
        setSelectedSurah(null);
        setCurrentPlayingAyah(null); // Clear auto-play when closing dialog
      }}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-emerald-950 border-emerald-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex flex-col gap-4">
              {selectedSurahInfo && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white">
                      {selectedSurahInfo.number}
                    </span>
                    <div className="flex-1">
                      <div className="text-2xl">{selectedSurahInfo.bengali}</div>
                      <div className="text-sm text-emerald-300 font-normal">
                        {selectedSurahInfo.english} • {selectedSurahInfo.verses} আয়াত
                      </div>
                    </div>
                    <div className="text-3xl" style={{ fontFamily: 'Times New Roman, serif' }}>
                      {selectedSurahInfo.arabic}
                    </div>
                  </div>
                  
                  {/* Reciter Selection */}
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-emerald-300" />
                    <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                      <SelectTrigger className="bg-emerald-900/50 border-emerald-700 text-white" data-testid="select-reciter">
                        <SelectValue placeholder="কারি নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="bg-emerald-950 border-emerald-700">
                        {reciters.map((reciter) => (
                          <SelectItem 
                            key={reciter.value} 
                            value={reciter.value}
                            className="text-white hover:bg-emerald-800"
                            data-testid={`reciter-${reciter.value}`}
                          >
                            {reciter.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
              </div>
            ) : (
              <div className="space-y-6 pb-6">
                {arabicData?.chapter.map((ayah, index) => {
                  const bengaliVerse = bengaliData?.chapter[index];
                  return (
                    <Card 
                      key={ayah.verse} 
                      ref={(el) => {
                        if (el) {
                          ayahRefs.current.set(ayah.verse, el);
                        }
                      }}
                      className="bg-emerald-900/30 border-emerald-700" 
                      data-testid={`card-verse-${selectedSurah}-${ayah.verse}`}
                    >
                      <CardContent className="p-6 space-y-4">
                        {/* Verse Number & Audio Player */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold">
                            {ayah.verse}
                          </div>
                          <div className="h-px flex-1 bg-emerald-700"></div>
                          
                          {/* Audio Player */}
                          {selectedSurah && (
                            <AyahAudioPlayer
                              surahNumber={selectedSurah}
                              ayahNumber={ayah.verse}
                              reciter={selectedReciter}
                              autoPlay={currentPlayingAyah === ayah.verse}
                              onEnded={() => {
                                // Auto-play next ayah
                                const nextIndex = index + 1;
                                if (nextIndex < (arabicData?.chapter.length || 0)) {
                                  setCurrentPlayingAyah(arabicData.chapter[nextIndex].verse);
                                } else {
                                  // End of surah, reset auto-play
                                  setCurrentPlayingAyah(null);
                                }
                              }}
                            />
                          )}
                        </div>

                        {/* Arabic Text */}
                        <div
                          className="text-right text-2xl leading-loose text-white"
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          {ayah.text}
                        </div>

                        {/* Bengali Translation */}
                        {bengaliVerse && (
                          <div className="text-lg leading-relaxed text-emerald-100 bg-emerald-900/50 p-4 rounded-md">
                            {bengaliVerse.text}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="border-t border-emerald-700 pt-4">
            <Button
              onClick={() => setSelectedSurah(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6"
              data-testid="button-back-from-surah"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              ফিরে যান
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />

      <BottomNavigation currentPage="quran" />
    </div>
  );
}
