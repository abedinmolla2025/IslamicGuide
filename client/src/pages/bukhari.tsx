import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/bottom-navigation";
import TopBar from "@/components/top-bar";
import { BookOpen, Search, Loader2, Brain, Dices } from "lucide-react";
import type { BukhariHadith } from "@shared/schema";
import { useLocation } from "wouter";

export default function BukhariPage() {
  const [showBengali, setShowBengali] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: allHadiths, isLoading } = useQuery<BukhariHadith[]>({
    queryKey: ["/api/bukhari/all"],
  });

  const { data: searchResults } = useQuery<BukhariHadith[]>({
    queryKey: ["/api/bukhari/search", searchQuery],
    enabled: searchQuery.length > 2,
    queryFn: async () => {
      const response = await fetch(`/api/bukhari/search?q=${encodeURIComponent(searchQuery)}`);
      return response.json();
    },
  });

  const displayHadiths = searchQuery.length > 2 ? searchResults : allHadiths;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 to-emerald-900">
      <TopBar title="সহীহ বুখারী" subtitle="Sahih Bukhari" />

      <main className="flex-1 overflow-hidden pb-16">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {/* Language Toggle */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBengali(!showBengali)}
                className="text-emerald-200 hover:text-amber-400"
                data-testid="button-toggle-language"
              >
                {showBengali ? "EN" : "বাং"}
              </Button>
            </div>

            {/* Tabs for Browse and Quiz */}
            <Tabs defaultValue="browse" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-emerald-900/50">
                <TabsTrigger value="browse" data-testid="tab-browse">
                  <Search className="h-4 w-4 mr-2" />
                  {showBengali ? "খুঁজুন" : "Browse"}
                </TabsTrigger>
                <TabsTrigger value="quiz" data-testid="tab-quiz">
                  <Brain className="h-4 w-4 mr-2" />
                  {showBengali ? "কুইজ" : "Quiz"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="browse" className="space-y-4 mt-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
                  <Input
                    type="text"
                    placeholder={showBengali ? "হাদীস খুঁজুন..." : "Search hadiths..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-emerald-900/30 border-emerald-700 text-emerald-100 placeholder:text-emerald-400"
                    data-testid="input-search"
                  />
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
                    <p className="text-emerald-200 font-semibold">
                      {showBengali ? "হাদীস লোড হচ্ছে..." : "Loading hadiths..."}
                    </p>
                  </div>
                )}

                {/* Hadiths List */}
                {displayHadiths && displayHadiths.length > 0 && (
                  <div className="space-y-4">
                    {displayHadiths.map((hadith) => (
                      <Card
                        key={hadith.id}
                        className="bg-gradient-to-br from-emerald-900/50 to-emerald-950/50 border border-amber-400/30"
                        data-testid={`card-hadith-${hadith.id}`}
                      >
                        <CardHeader>
                          <CardTitle className="text-amber-400 flex items-center gap-2 text-base">
                            <BookOpen className="h-4 w-4" />
                            {showBengali ? hadith.bookNameBengali : hadith.bookNameEnglish}
                            {" - "}
                            {showBengali ? hadith.chapterNameBengali : hadith.chapterNameEnglish}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Arabic Text */}
                          <div className="text-center py-2">
                            <p
                              className="text-xl leading-loose text-amber-100 font-arabic"
                              dir="rtl"
                              data-testid={`text-arabic-${hadith.id}`}
                            >
                              {hadith.arabicText}
                            </p>
                          </div>

                          {/* Translation */}
                          <div className="border-t border-emerald-700/30 pt-3">
                            <p className="text-sm text-emerald-300 mb-1 font-semibold">
                              {showBengali ? "অনুবাদ:" : "Translation:"}
                            </p>
                            <p className="text-emerald-100 leading-relaxed" data-testid={`text-translation-${hadith.id}`}>
                              {showBengali ? hadith.bengaliTranslation : hadith.englishTranslation}
                            </p>
                          </div>

                          {/* Explanation */}
                          {hadith.explanation && (
                            <div className="border-t border-emerald-700/30 pt-3">
                              <p className="text-sm text-emerald-300 mb-1 font-semibold">
                                {showBengali ? "ব্যাখ্যা:" : "Explanation:"}
                              </p>
                              <p className="text-emerald-100 text-sm leading-relaxed">
                                {showBengali && hadith.explanationBengali
                                  ? hadith.explanationBengali
                                  : hadith.explanation}
                              </p>
                            </div>
                          )}

                          {/* Metadata */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Badge className="bg-emerald-700 text-white" data-testid={`badge-narrator-${hadith.id}`}>
                              {showBengali ? hadith.narratorBengali : hadith.narrator}
                            </Badge>
                            <Badge className="bg-amber-600 text-white">
                              {showBengali ? "হাদীস নং" : "Hadith"} {hadith.hadithNumber}
                            </Badge>
                            <Badge variant="outline" className="border-emerald-500 text-emerald-200">
                              {hadith.grading}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {displayHadiths && displayHadiths.length === 0 && (
                  <Card className="bg-emerald-900/20 border border-emerald-700/30">
                    <CardContent className="p-8 text-center">
                      <p className="text-emerald-300">
                        {showBengali ? "কোন হাদীস পাওয়া যায়নি" : "No hadiths found"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="quiz" className="space-y-4 mt-4">
                <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-950/50 border border-amber-400/30">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {showBengali ? "হাদীস কুইজ" : "Hadith Quiz"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-emerald-200">
                      {showBengali
                        ? "আপনার হাদীসের জ্ঞান পরীক্ষা করুন! নিচের বোতাম থেকে কুইজ শুরু করুন।"
                        : "Test your knowledge of hadith! Start a quiz from the buttons below."}
                    </p>

                    <div className="space-y-3">
                      <Button
                        onClick={() => setLocation("/bukhari-quiz/daily")}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                        data-testid="button-daily-quiz"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        {showBengali ? "দৈনিক কুইজ" : "Daily Quiz"}
                      </Button>

                      <Button
                        onClick={() => setLocation("/bukhari-quiz/unlimited")}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                        data-testid="button-unlimited-quiz"
                      >
                        <Dices className="h-4 w-4 mr-2" />
                        {showBengali ? "আনলিমিটেড কুইজ" : "Unlimited Quiz"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </main>

      <BottomNavigation currentPage="hadith" />
    </div>
  );
}
