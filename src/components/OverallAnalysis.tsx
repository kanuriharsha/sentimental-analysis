import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, BarChart3, AlertCircle, CheckCircle } from "lucide-react";

interface OverallAnalysisProps {
  sentiment: 'positive' | 'negative' | 'neutral';
  isComplex: boolean;
  clauseCount: number;
}

export const OverallAnalysis = ({ sentiment, isComplex, clauseCount }: OverallAnalysisProps) => {
  const getSentimentIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-6 h-6" />;
      case 'negative':
        return <TrendingDown className="w-6 h-6" />;
      default:
        return <Minus className="w-6 h-6" />;
    }
  };

  const getSentimentColors = () => {
    switch (sentiment) {
      case 'positive':
        return {
          bg: 'sentiment-positive',
          text: 'text-white',
          icon: 'text-white'
        };
      case 'negative':
        return {
          bg: 'sentiment-negative',
          text: 'text-white',
          icon: 'text-white'
        };
      default:
        return {
          bg: 'sentiment-neutral',
          text: 'text-white',
          icon: 'text-white'
        };
    }
  };

  const colors = getSentimentColors();

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Overall Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Sentiment */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Final Sentiment</h3>
          <div className={`p-6 rounded-xl ${colors.bg} text-center animate-pulse-glow`}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className={colors.icon}>
                {getSentimentIcon()}
              </div>
              <span className={`text-2xl font-bold ${colors.text} uppercase tracking-wider`}>
                {sentiment}
              </span>
            </div>
            <p className={`${colors.text} opacity-90`}>
              {sentiment === 'positive' && "The overall tone is optimistic and favorable"}
              {sentiment === 'negative' && "The overall tone is critical and unfavorable"}
              {sentiment === 'neutral' && "The overall tone is balanced and objective"}
            </p>
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Complexity Analysis</h3>
          <div className="flex items-center gap-3 p-4 bg-background/30 rounded-lg border border-border/50">
            {isComplex ? (
              <>
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div className="flex-1">
                  <Badge variant="outline" className="border-amber-500 text-amber-500 mb-2">
                    Complex Sentiment
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    This text contains mixed sentiments across different clauses, indicating nuanced opinions or conflicting viewpoints.
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="flex-1">
                  <Badge variant="outline" className="border-green-500 text-green-500 mb-2">
                    Simple Sentiment
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    This text has a consistent sentiment throughout all clauses, indicating a clear and unified opinion.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-background/20 rounded-lg border border-border/30">
            <div className="text-2xl font-bold text-primary mb-1">{clauseCount}</div>
            <div className="text-sm text-muted-foreground">Clauses Analyzed</div>
          </div>
          <div className="text-center p-4 bg-background/20 rounded-lg border border-border/30">
            <div className="text-2xl font-bold text-primary mb-1">
              {isComplex ? 'Mixed' : 'Unified'}
            </div>
            <div className="text-sm text-muted-foreground">Sentiment Pattern</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};