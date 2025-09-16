import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, List, CheckCircle2, XCircle, Minus } from "lucide-react";

interface AnalysisResult {
  clause: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
}

interface ClauseBreakdownProps {
  results: AnalysisResult[];
  isComplex: boolean;
}

export const ClauseBreakdown = ({ results, isComplex }: ClauseBreakdownProps) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'negative':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'sentiment-positive text-white';
      case 'negative':
        return 'sentiment-negative text-white';
      default:
        return 'sentiment-neutral text-white';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="w-5 h-5 text-primary" />
          Clause Breakdown
          {isComplex && (
            <Badge variant="destructive" className="ml-auto">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Complex
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((result, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg bg-background/30 border border-border/50 transition-all duration-300 hover:border-primary/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Badge 
                  className={`${getSentimentColor(result.sentiment)} border-0`}
                >
                  {getSentimentIcon(result.sentiment)}
                  {result.sentiment}
                </Badge>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-foreground leading-relaxed">
                  "{result.clause}"
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Confidence:
                  </span>
                  <div className="flex-1 bg-muted/30 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.sentiment === 'positive' ? 'bg-green-500' :
                        result.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${result.score * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {(result.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};