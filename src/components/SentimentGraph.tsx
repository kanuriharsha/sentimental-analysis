import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";

interface AnalysisResult {
  clause: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
}

interface SentimentGraphProps {
  results: AnalysisResult[];
}

export const SentimentGraph = ({ results }: SentimentGraphProps) => {
  const getNodeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '#22c55e';
      case 'negative':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getNodeGradient = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'url(#positiveGradient)';
      case 'negative':
        return 'url(#negativeGradient)';
      default:
        return 'url(#neutralGradient)';
    }
  };

  const nodeSpacing = 120;
  const svgWidth = Math.max(600, results.length * nodeSpacing);
  const svgHeight = 300;
  const nodeY = svgHeight / 2;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5 text-primary" />
          Sentiment Flow Graph
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="border border-border/30 rounded-lg bg-background/20"
          >
            {/* Gradients */}
            <defs>
              <radialGradient id="positiveGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="1" />
              </radialGradient>
              <radialGradient id="negativeGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="1" />
              </radialGradient>
              <radialGradient id="neutralGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6b7280" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4b5563" stopOpacity="1" />
              </radialGradient>
              
              {/* Glow filters */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Connections */}
            {results.map((_, index) => {
              if (index === results.length - 1) return null;
              const x1 = 80 + index * nodeSpacing;
              const x2 = 80 + (index + 1) * nodeSpacing;
              
              return (
                <line
                  key={`connection-${index}`}
                  x1={x1 + 25}
                  y1={nodeY}
                  x2={x2 - 25}
                  y2={nodeY}
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                  className="animate-pulse"
                />
              );
            })}

            {/* Nodes */}
            {results.map((result, index) => {
              const x = 80 + index * nodeSpacing;
              const radius = 20 + (result.score * 15);
              
              return (
                <g key={index}>
                  {/* Node circle */}
                  <circle
                    cx={x}
                    cy={nodeY}
                    r={radius}
                    fill={getNodeGradient(result.sentiment)}
                    stroke={getNodeColor(result.sentiment)}
                    strokeWidth="3"
                    filter="url(#glow)"
                    className="transition-all duration-300 hover:scale-110"
                  />
                  
                  {/* Node label */}
                  <text
                    x={x}
                    y={nodeY + 5}
                    textAnchor="middle"
                    className="fill-white text-sm font-semibold"
                    style={{ fontSize: '12px' }}
                  >
                    {index + 1}
                  </text>
                  
                  {/* Sentiment label */}
                  <text
                    x={x}
                    y={nodeY + radius + 20}
                    textAnchor="middle"
                    className="fill-foreground text-xs font-medium"
                    style={{ fontSize: '10px' }}
                  >
                    {result.sentiment.toUpperCase()}
                  </text>
                  
                  {/* Score label */}
                  <text
                    x={x}
                    y={nodeY + radius + 35}
                    textAnchor="middle"
                    className="fill-muted-foreground text-xs"
                    style={{ fontSize: '9px' }}
                  >
                    {(result.score * 100).toFixed(0)}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 p-4 bg-background/20 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground">Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm text-muted-foreground">Negative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-500"></div>
            <span className="text-sm text-muted-foreground">Neutral</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};