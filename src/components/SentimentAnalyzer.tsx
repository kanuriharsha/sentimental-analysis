import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { ClauseBreakdown } from "./ClauseBreakdown";
import { SentimentGraph } from "./SentimentGraph";
import { OverallAnalysis } from "./OverallAnalysis";

interface AnalysisResult {
  clause: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
}

export const SentimentAnalyzer = () => {
  const [text, setText] = useState("The phone is good but the battery is not good, overall things are good.");
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplex, setIsComplex] = useState(false);

  // Mock sentiment analysis function (simulating the Python backend)
  const mockAnalyzeSentiment = (clause: string): { sentiment: 'positive' | 'negative' | 'neutral'; score: number } => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'fantastic', 'wonderful', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'not good', 'poor'];
    
    const lowerClause = clause.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerClause.includes(word));
    const hasNegative = negativeWords.some(word => lowerClause.includes(word));
    
    if (hasNegative && hasPositive) {
      return { sentiment: 'neutral', score: 0.6 };
    } else if (hasNegative) {
      return { sentiment: 'negative', score: 0.8 };
    } else if (hasPositive) {
      return { sentiment: 'positive', score: 0.85 };
    } else {
      return { sentiment: 'neutral', score: 0.5 };
    }
  };

  const splitIntoClauses = (text: string): string[] => {
    const conjunctions = ['but', 'however', 'although', 'though', 'and', 'while', 'yet'];
    let sentences = [text];
    
    for (const conj of conjunctions) {
      const newSentences: string[] = [];
      for (const sentence of sentences) {
        const parts = sentence.split(new RegExp(`\\s+${conj}\\s+`, 'i'))
          .map(p => p.trim())
          .filter(p => p.length > 0);
        newSentences.push(...parts);
      }
      sentences = newSentences;
    }
    
    return sentences;
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const clauses = splitIntoClauses(text);
    const analyzed: AnalysisResult[] = clauses.map(clause => {
      const { sentiment, score } = mockAnalyzeSentiment(clause);
      return { clause, sentiment, score };
    });
    
    const sentiments = analyzed.map(a => a.sentiment);
    const uniqueSentiments = new Set(sentiments);
    setIsComplex(uniqueSentiments.size > 1);
    
    setResults(analyzed);
    setIsAnalyzing(false);
  };

  const overallSentiment = results.length > 0 ? (() => {
    const scores = { positive: 0, negative: 0, neutral: 0 };
    results.forEach(({ sentiment, score }) => {
      scores[sentiment] += score;
    });
    return Object.entries(scores).reduce((a, b) => scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b)[0] as 'positive' | 'negative' | 'neutral';
  })() : 'neutral';

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Sentiment Analysis Dashboard
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced sentiment analysis with clause-level breakdown and complexity detection
          </p>
        </div>

        {/* Input Section */}
        <Card className="glass-card animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Text Analysis Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your text for sentiment analysis..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !text.trim()}
              className="w-full glow-primary bg-primary hover:bg-primary/90 transition-all duration-300"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Analyze Sentiment
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Left Column */}
            <div className="space-y-6">
              <ClauseBreakdown 
                results={results} 
                isComplex={isComplex}
              />
              <OverallAnalysis
                sentiment={overallSentiment}
                isComplex={isComplex}
                clauseCount={results.length}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <SentimentGraph results={results} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};