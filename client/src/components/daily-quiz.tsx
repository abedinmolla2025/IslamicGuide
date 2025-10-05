import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Brain, RefreshCw, Check, X } from "lucide-react";
import type { DailyQuiz as DailyQuizType } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function DailyQuiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const getMillisecondsUntilMidnight = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  };
  
  const { data: quiz, isLoading, error } = useQuery<DailyQuizType>({
    queryKey: ["/api/daily-quiz"],
    staleTime: getMillisecondsUntilMidnight(),
  });
  
  if (error) {
    console.error("Daily quiz error:", error);
  }

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/daily-quiz/refresh");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-quiz"] });
      setSelectedAnswer(null);
      setShowResult(false);
    }
  });

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  if (isLoading) {
    return (
      <section className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-emerald-800/30 rounded w-1/3"></div>
          <div className="h-48 bg-emerald-800/30 rounded-2xl"></div>
        </div>
      </section>
    );
  }

  if (!quiz) {
    return (
      <section className="p-4">
        <div className="text-center text-emerald-300">
          Unable to load quiz
        </div>
      </section>
    );
  }

  const isCorrect = selectedAnswer === quiz.correctAnswer;

  return (
    <section className="p-4" data-testid="section-daily-quiz">
      <h2 className="text-xl font-black mb-4 flex items-center justify-between text-amber-400">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mr-3">
            <Brain className="text-emerald-950 w-5 h-5" />
          </div>
          Daily Quiz
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshMutation.isPending}
          className="text-amber-400 hover:text-amber-300 hover:bg-emerald-800/30"
          data-testid="button-refresh-quiz"
        >
          <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
        </Button>
      </h2>
      
      <div className="bg-gradient-to-br from-[#0E3B1A] to-[#0A2E14] rounded-2xl p-6 border border-amber-400/20 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        <div className="mb-4">
          <p className="text-sm text-amber-400 font-semibold mb-2">{quiz.category}</p>
          <p className="text-lg text-white font-semibold mb-2" data-testid="text-question">
            {quiz.questionBengali}
          </p>
          <p className="text-sm text-emerald-200 italic">{quiz.question}</p>
        </div>

        <div className="space-y-2 mb-4">
          {quiz.optionsBengali.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                showResult
                  ? index === quiz.correctAnswer
                    ? 'bg-green-600/30 border-2 border-green-500'
                    : selectedAnswer === index
                    ? 'bg-red-600/30 border-2 border-red-500'
                    : 'bg-emerald-900/30 border border-emerald-700/30'
                  : 'bg-emerald-900/30 border border-emerald-700/30 hover:bg-emerald-800/50 hover:border-amber-400/50'
              }`}
              data-testid={`button-option-${index}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{option}</p>
                  <p className="text-xs text-emerald-300 mt-1">{quiz.options[index]}</p>
                </div>
                {showResult && (
                  <div>
                    {index === quiz.correctAnswer && (
                      <Check className="h-5 w-5 text-green-400" />
                    )}
                    {selectedAnswer === index && index !== quiz.correctAnswer && (
                      <X className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-600/20 border border-green-500/30' : 'bg-red-600/20 border border-red-500/30'}`}>
            <p className={`font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✓ সঠিক উত্তর!' : '✗ ভুল উত্তর'}
            </p>
            <p className="text-white font-medium mb-1">{quiz.explanationBengali}</p>
            <p className="text-sm text-emerald-200 italic">{quiz.explanation}</p>
          </div>
        )}
      </div>
    </section>
  );
}
