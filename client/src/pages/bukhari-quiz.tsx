import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/bottom-navigation";
import TopBar from "@/components/top-bar";
import { Brain, Check, X, RefreshCw, Loader2, BookOpen } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { BukhariHadith } from "@shared/schema";
import { useLocation, useRoute } from "wouter";

interface QuizData {
  hadith: BukhariHadith;
  question: string;
  questionBengali: string;
  options: string[];
  optionsBengali: string[];
  correctAnswer: number;
  explanation: string;
  explanationBengali: string;
}

export default function BukhariQuizPage() {
  const [showBengali, setShowBengali] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [, params] = useRoute("/bukhari-quiz/:type");
  const quizType = params?.type || "daily";

  const { data: quizData, isLoading } = useQuery<QuizData>({
    queryKey: [`/api/bukhari/quiz/${quizType}`],
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      setSelectedAnswer(null);
      setShowResult(false);
      await queryClient.invalidateQueries({ queryKey: [`/api/bukhari/quiz/${quizType}`] });
    },
  });

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === quizData?.correctAnswer;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-950 to-emerald-900">
      <TopBar 
        title={quizType === "daily" ? "দৈনিক কুইজ" : "আনলিমিটেড কুইজ"} 
        subtitle={quizType === "daily" ? "Daily Quiz" : "Unlimited Quiz"} 
      />

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

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
                <p className="text-emerald-200 font-semibold">
                  {showBengali ? "কুইজ লোড হচ্ছে..." : "Loading quiz..."}
                </p>
              </div>
            )}

            {quizData && (
              <>
                {/* Hadith Card */}
                <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-950/50 border border-amber-400/30">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {showBengali ? "হাদীস" : "Hadith"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center py-2">
                      <p className="text-xl leading-loose text-amber-100 font-arabic" dir="rtl">
                        {quizData.hadith.arabicText.substring(0, 200)}...
                      </p>
                    </div>
                    <div className="border-t border-emerald-700/30 pt-3">
                      <p className="text-emerald-100 leading-relaxed text-sm">
                        {showBengali 
                          ? quizData.hadith.bengaliTranslation.substring(0, 200) 
                          : quizData.hadith.englishTranslation.substring(0, 200)}...
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quiz Question */}
                <Card className="bg-gradient-to-br from-amber-900/30 to-amber-950/30 border border-amber-400/30">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {showBengali ? "প্রশ্ন" : "Question"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-emerald-100 text-lg font-medium">
                      {showBengali ? quizData.questionBengali : quizData.question}
                    </p>

                    <div className="space-y-2">
                      {quizData.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrectOption = index === quizData.correctAnswer;
                        const showCorrect = showResult && isCorrectOption;
                        const showWrong = showResult && isSelected && !isCorrectOption;

                        return (
                          <Button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={showResult}
                            className={`w-full justify-start text-left h-auto py-3 px-4 ${
                              showCorrect
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : showWrong
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-emerald-800/50 hover:bg-emerald-700/50 text-emerald-100"
                            }`}
                            data-testid={`button-option-${index}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{showBengali ? quizData.optionsBengali[index] : option}</span>
                              {showCorrect && <Check className="h-5 w-5" />}
                              {showWrong && <X className="h-5 w-5" />}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Result */}
                {showResult && (
                  <Card 
                    className={`${
                      isCorrect 
                        ? "bg-green-900/30 border-green-500/30" 
                        : "bg-red-900/30 border-red-500/30"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className={isCorrect ? "text-green-400" : "text-red-400"}>
                        {isCorrect 
                          ? (showBengali ? "সঠিক! 🎉" : "Correct! 🎉")
                          : (showBengali ? "ভুল উত্তর" : "Incorrect")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-emerald-100 leading-relaxed">
                        {showBengali ? quizData.explanationBengali : quizData.explanation}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge className="bg-emerald-700 text-white">
                          {showBengali ? quizData.hadith.narratorBengali : quizData.hadith.narrator}
                        </Badge>
                        <Badge className="bg-amber-600 text-white">
                          {showBengali ? quizData.hadith.chapterNameBengali : quizData.hadith.chapterNameEnglish}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Next Quiz Button */}
                {quizType === "unlimited" && (
                  <Button
                    onClick={() => refreshMutation.mutate()}
                    disabled={refreshMutation.isPending}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                    data-testid="button-next-quiz"
                  >
                    {refreshMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {showBengali ? "লোড হচ্ছে..." : "Loading..."}
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {showBengali ? "পরবর্তী কুইজ" : "Next Quiz"}
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </main>

      <BottomNavigation currentPage="hadith" />
    </div>
  );
}
