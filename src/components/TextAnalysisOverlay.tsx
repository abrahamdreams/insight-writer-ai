import React, { useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';

interface AnalysisResult {
  wordCount: number;
  readabilityScore: number;
  keyPhrases: string[];
  suggestedCitations: number;
  strengthAreas: string[];
  improvementAreas: string[];
}

interface TextAnalysisOverlayProps {
  content: string;
  isVisible: boolean;
}

const TextAnalysisOverlay: React.FC<TextAnalysisOverlayProps> = ({
  content,
  isVisible
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult>({
    wordCount: 0,
    readabilityScore: 0,
    keyPhrases: [],
    suggestedCitations: 0,
    strengthAreas: [],
    improvementAreas: []
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate real-time analysis
    const timeoutId = setTimeout(() => {
      const words = content.trim().split(/\s+/).length;
      
      // Mock analysis based on content
      const newAnalysis: AnalysisResult = {
        wordCount: words,
        readabilityScore: Math.min(100, 60 + (words / 50)),
        keyPhrases: ['weightlifting', 'soccer performance', 'injury prevention', 'core stability'],
        suggestedCitations: Math.floor(words / 100) + 2,
        strengthAreas: ['Clear structure', 'Academic tone', 'Logical flow'],
        improvementAreas: words < 200 ? ['Add more evidence', 'Include statistics'] : ['Consider counterarguments']
      };
      
      setAnalysis(newAnalysis);
      setIsAnalyzing(false);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [content]);

  if (!isVisible) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="fixed top-4 right-4 z-40 w-80">
      <div className="bg-card/95 backdrop-blur-sm border rounded-lg shadow-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Brain className={`h-4 w-4 ${isAnalyzing ? 'animate-pulse text-accent' : 'text-muted-foreground'}`} />
          <span className="font-medium text-sm">
            {isAnalyzing ? 'Analyzing...' : 'Live Analysis'}
          </span>
        </div>

        {!isAnalyzing && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-semibold">{analysis.wordCount}</div>
                <div className="text-xs text-muted-foreground">Words</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${getScoreColor(analysis.readabilityScore)}`}>
                  {Math.round(analysis.readabilityScore)}
                </div>
                <div className="text-xs text-muted-foreground">Readability</div>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Academic Quality</span>
                <Badge variant="outline" className={`${getScoreBg(analysis.readabilityScore)} ${getScoreColor(analysis.readabilityScore)}`}>
                  {analysis.readabilityScore >= 80 ? 'Excellent' : analysis.readabilityScore >= 60 ? 'Good' : 'Needs Work'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span>Citations Needed</span>
                <Badge variant="secondary">
                  {analysis.suggestedCitations}
                </Badge>
              </div>
            </div>

            {/* Key Phrases */}
            <div>
              <div className="text-xs font-medium mb-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Key Themes
              </div>
              <div className="flex flex-wrap gap-1">
                {analysis.keyPhrases.map((phrase, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {phrase}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Improvement Areas */}
            {analysis.improvementAreas.length > 0 && (
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-yellow-600" />
                  Focus Areas
                </div>
                <div className="space-y-1">
                  {analysis.improvementAreas.slice(0, 2).map((area, index) => (
                    <div key={index} className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TextAnalysisOverlay;