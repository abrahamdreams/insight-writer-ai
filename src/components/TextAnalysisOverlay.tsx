import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, TrendingUp, AlertCircle, Target } from 'lucide-react';

interface AnalysisPoint {
  id: string;
  type: 'strength' | 'weakness' | 'suggestion' | 'citation';
  text: string;
  position: { start: number; end: number };
  severity: 'high' | 'medium' | 'low';
  suggestion?: string;
  action?: () => void;
}

interface TextAnalysisOverlayProps {
  content: string;
  cursorPosition: number;
  onInsertText: (text: string) => void;
}

const TextAnalysisOverlay = ({ content, cursorPosition, onInsertText }: TextAnalysisOverlayProps) => {
  const [analysisPoints, setAnalysisPoints] = useState<AnalysisPoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const analyzeText = useMemo(() => {
    const points: AnalysisPoint[] = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
      const sentenceStart = content.indexOf(sentence);
      const sentenceEnd = sentenceStart + sentence.length;
      
      // Check for vague statements that need data
      if (sentence.toLowerCase().includes('improve') || sentence.toLowerCase().includes('enhance')) {
        if (!sentence.includes('%') && !sentence.includes('study') && !sentence.includes('research')) {
          points.push({
            id: `vague-${index}`,
            type: 'weakness',
            text: 'Vague claim needs quantification',
            position: { start: sentenceStart, end: sentenceEnd },
            severity: 'medium',
            suggestion: 'Add specific data or research citation',
            action: () => onInsertText(' Studies show improvements of 15-20% in performance metrics')
          });
        }
      }
      
      // Check for missing citations
      if (sentence.toLowerCase().includes('research') || sentence.toLowerCase().includes('studies')) {
        if (!sentence.includes('(') && !sentence.includes('et al')) {
          points.push({
            id: `citation-${index}`,
            type: 'citation',
            text: 'Missing citation',
            position: { start: sentenceStart, end: sentenceEnd },
            severity: 'high',
            suggestion: 'Add research citation',
            action: () => onInsertText(' (Smith et al., 2023)')
          });
        }
      }
      
      // Identify strong statements
      if (sentence.toLowerCase().includes('crucial') || sentence.toLowerCase().includes('essential') || sentence.toLowerCase().includes('vital')) {
        points.push({
          id: `strong-${index}`,
          type: 'strength',
          text: 'Strong argumentative language',
          position: { start: sentenceStart, end: sentenceEnd },
          severity: 'low'
        });
      }
      
      // Suggest expert opinions
      if (sentence.toLowerCase().includes('core stability') || sentence.toLowerCase().includes('injury prevention')) {
        points.push({
          id: `expert-${index}`,
          type: 'suggestion',
          text: 'Consider expert perspective',
          position: { start: sentenceStart, end: sentenceEnd },
          severity: 'medium',
          suggestion: 'Add expert opinion from Stuart McGill',
          action: () => onInsertText('. According to spine biomechanics expert Stuart McGill, proper core training reduces injury risk significantly')
        });
      }
    });
    
    return points;
  }, [content, onInsertText]);

  useEffect(() => {
    setAnalysisPoints(analyzeText);
  }, [analyzeText]);

  const getPointColor = (type: string, severity: string) => {
    switch (type) {
      case 'strength':
        return 'bg-green-500/20 border-green-500/50';
      case 'weakness':
        return severity === 'high' ? 'bg-red-500/20 border-red-500/50' : 'bg-yellow-500/20 border-yellow-500/50';
      case 'citation':
        return 'bg-blue-500/20 border-blue-500/50';
      case 'suggestion':
        return 'bg-purple-500/20 border-purple-500/50';
      default:
        return 'bg-muted/20 border-muted/50';
    }
  };

  const getPointIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return TrendingUp;
      case 'weakness':
        return AlertCircle;
      case 'citation':
        return BookOpen;
      case 'suggestion':
        return Target;
      default:
        return AlertCircle;
    }
  };

  const nearbyPoints = analysisPoints.filter(point => 
    Math.abs(point.position.start - cursorPosition) < 200
  );

  if (nearbyPoints.length === 0) return null;

  return (
    <div className="absolute -right-80 top-0 w-60 space-y-2 z-10">
      <div className="text-xs font-medium text-muted-foreground mb-2">
        Analysis for nearby text
      </div>
      
      {nearbyPoints.slice(0, 4).map((point) => {
        const Icon = getPointIcon(point.type);
        const colorClass = getPointColor(point.type, point.severity);
        
        return (
          <Card 
            key={point.id}
            className={`p-3 border ${colorClass} hover:shadow-md transition-all cursor-pointer`}
            onMouseEnter={() => setHoveredPoint(point.id)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <div className="flex items-start gap-2">
              <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">{point.text}</p>
                {point.suggestion && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {point.suggestion}
                  </p>
                )}
                
                {point.action && hoveredPoint === point.id && (
                  <Button 
                    size="sm" 
                    className="h-6 text-xs px-2 w-full"
                    onClick={point.action}
                  >
                    Apply Fix
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
      
      {nearbyPoints.length > 4 && (
        <Card className="p-2 bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">
            +{nearbyPoints.length - 4} more issues nearby
          </p>
        </Card>
      )}
    </div>
  );
};

export default TextAnalysisOverlay;