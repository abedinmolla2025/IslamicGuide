import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/bottom-navigation";
import TopBar from "@/components/top-bar";
import Footer from "@/components/footer";
import { BookOpen, RefreshCw, Loader2, Sparkles } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Hadith } from "@shared/schema";

export default function HadithPage() {
  const { data: hadith, isLoading, error } = useQuery<Hadith>({
    queryKey: ["/api/hadith/daily"],
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/hadith/refresh");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hadith/daily"] });
    },
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 to-emerald-900">
      <TopBar title="আজকের হাদিস" subtitle="Hadith of the Day" />

      <main className="flex-1 overflow-hidden pb-16">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
                <p className="text-emerald-200 font-semibold">Loading today's hadith...</p>
              </div>
            )}

            {error && (
              <Card className="bg-red-900/20 border border-red-500/30">
                <CardContent className="p-4">
                  <p className="text-sm text-red-200">Failed to load hadith. Please try again.</p>
                </CardContent>
              </Card>
            )}

            {hadith && (
              <>
                {/* Hadith Card */}
                <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-950/50 border border-amber-400/30">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      আজকের হাদিস
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Arabic Text */}
                    <div className="text-center py-4 px-2">
                      <p 
                        className="text-2xl leading-loose text-amber-100 font-arabic"
                        dir="rtl"
                        data-testid="text-hadith-arabic"
                      >
                        {hadith.arabic}
                      </p>
                    </div>

                    {/* Bengali Translation */}
                    {hadith.translationBengali && (
                      <div className="border-t border-emerald-700/30 pt-4">
                        <p className="text-sm text-emerald-300 mb-2 font-semibold">
                          বাংলা অনুবাদ:
                        </p>
                        <p 
                          className="text-emerald-100 leading-relaxed text-lg"
                          style={{ 
                            fontFamily: "'Noto Sans Bengali', 'Nikosh', 'Kalpurush', sans-serif",
                            lineHeight: '1.8'
                          }}
                          data-testid="text-hadith-translation-bengali"
                        >
                          {hadith.translationBengali}
                        </p>
                      </div>
                    )}

                    {/* English Translation */}
                    <div className="border-t border-emerald-700/30 pt-4">
                      <p className="text-sm text-emerald-300 mb-2 font-semibold">
                        English Translation:
                      </p>
                      <p 
                        className="text-emerald-100 leading-relaxed text-base italic"
                        data-testid="text-hadith-translation"
                      >
                        {hadith.translation}
                      </p>
                    </div>

                    {/* Narrator & Source */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge className="bg-emerald-700 text-white" data-testid="badge-narrator">
                        {hadith.narratorBengali || hadith.narrator}
                      </Badge>
                      <Badge className="bg-amber-600 text-white" data-testid="badge-book">
                        {hadith.bookNameBengali || hadith.bookName}
                      </Badge>
                      <Badge variant="outline" className="border-emerald-500 text-emerald-200" data-testid="badge-reference">
                        {hadith.reference}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insight Card */}
                {(hadith.aiInsight || hadith.aiInsightBengali) && (
                  <Card className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 border border-amber-400/30">
                    <CardHeader>
                      <CardTitle className="text-amber-400 flex items-center gap-2 text-lg">
                        <Sparkles className="h-5 w-5" />
                        এআই ব্যাখ্যা
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {hadith.aiInsightBengali && (
                        <div>
                          <p 
                            className="text-emerald-100 leading-relaxed text-base"
                            style={{ 
                              fontFamily: "'Noto Sans Bengali', 'Nikosh', 'Kalpurush', sans-serif",
                              lineHeight: '1.8'
                            }}
                            data-testid="text-ai-insight-bengali"
                          >
                            {hadith.aiInsightBengali}
                          </p>
                        </div>
                      )}
                      {hadith.aiInsight && (
                        <div className={hadith.aiInsightBengali ? "border-t border-emerald-700/30 pt-3" : ""}>
                          <p 
                            className="text-emerald-100 leading-relaxed text-sm italic"
                            data-testid="text-ai-insight"
                          >
                            {hadith.aiInsight}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Refresh Button */}
                <Button
                  onClick={() => refreshMutation.mutate()}
                  disabled={refreshMutation.isPending}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  data-testid="button-refresh-hadith"
                >
                  {refreshMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      নতুন হাদিস লোড হচ্ছে...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      নতুন হাদিস দেখুন
                    </>
                  )}
                </Button>
              </>
            )}
            
            <Footer />
          </div>
        </ScrollArea>
      </main>

      <BottomNavigation currentPage="hadith" />
    </div>
  );
}
