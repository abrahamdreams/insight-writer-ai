import { Brain, Lightbulb, FileText, Target, AlertCircle, CheckCircle2, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContentAnalysis } from '@/hooks/useContentAnalysis';
import ProSuggestionModal from './ProSuggestionModal';
import { useState } from 'react';

interface ProactiveAssistantProps {
  content: string;
  cursorPosition: number;
  onInsertText?: (text: string) => void;
  onInsertWithHighlight?: (text: string) => void;
}

const ProactiveAssistant = ({ content, cursorPosition, onInsertText, onInsertWithHighlight }: ProactiveAssistantProps) => {
  const { suggestions, currentSection, wordCount, isAnalyzing } = useContentAnalysis(content, cursorPosition);
  const [showProModal, setShowProModal] = useState(false);
  const [currentProSuggestion, setCurrentProSuggestion] = useState<any>(null);

  const proSuggestions = [
    {
      id: 'thesis-clarity',
      title: 'Clarify and strengthen thesis',
      description: 'State your main argument more explicitly, e.g., "This essay argues that weightlifting is essential for modern soccer performance." This helps professors quickly identify your stance.',
      example: 'This essay argues that systematic weightlifting training is not merely beneficial but essential for optimizing soccer performance, as evidenced by measurable improvements in sprint speed, injury resilience, and on-field power output.',
      category: 'thesis' as const,
      priority: 'high' as const
    },
    {
      id: 'evidence-expansion',
      title: 'Expand on supporting evidence',
      description: 'Add specific studies, statistics, or expert opinions to strengthen your arguments with concrete data.',
      example: 'A 2023 meta-analysis by Johnson et al. examining 15 studies with over 400 professional soccer players found that structured weightlifting programs resulted in an average 12% improvement in sprint times and a 34% reduction in lower-body injuries over a competitive season.',
      category: 'evidence' as const,
      priority: 'high' as const
    },
    {
      id: 'counterarguments',
      title: 'Acknowledge potential drawbacks',
      description: 'Demonstrate critical thinking by addressing potential concerns about weightlifting in soccer.',
      example: 'Critics argue that excessive weightlifting may reduce flexibility and increase muscle bulk that could hinder agility. However, when properly periodized with sport-specific movement patterns, these concerns are largely mitigated while preserving the performance benefits.',
      category: 'clarity' as const,
      priority: 'medium' as const
    }
  ];

  const handleShowProSuggestion = (suggestionId: string) => {
    const proSugg = proSuggestions.find(s => s.id === suggestionId);
    if (proSugg) {
      setCurrentProSuggestion(proSugg);
      setShowProModal(true);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'citation': return FileText;
      case 'improvement': return Target;
      case 'expansion': return Lightbulb;
      case 'clarification': return AlertCircle;
      default: return CheckCircle2;
    }
  };

  const getSuggestionColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (!onInsertWithHighlight) return;
    
    switch (suggestion.type) {
      case 'citation':
        onInsertWithHighlight(' (Smith et al., 2023)');
        break;
      case 'improvement':
        if (suggestion.id === 'paragraph-length') {
          onInsertWithHighlight('\n\n');
        } else if (suggestion.id === 'intro-hook') {
          onInsertWithHighlight('According to FIFA statistics, professional soccer players run an average of 10-12 kilometers per match. ');
        }
        break;
      case 'clarification':
        if (suggestion.id.includes('vague-many')) {
          onInsertWithHighlight('approximately 75% of');
        } else if (suggestion.id.includes('vague-most')) {
          onInsertWithHighlight('over 80% of');
        } else if (suggestion.id.includes('vague-some')) {
          onInsertWithHighlight('35-40% of');
        }
        break;
      case 'expansion':
        if (suggestion.id === 'expansion-powerlifting') {
          onInsertWithHighlight(' Unlike powerlifting, which focuses on maximal strength in three specific lifts, weightlifting for soccer emphasizes functional movement patterns and explosive power development.');
        }
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Pro Suggestions */}
      {content.length > 100 && (
        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 cursor-pointer hover:shadow-md transition-all"
              onClick={() => handleShowProSuggestion('thesis-clarity')}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-yellow-500">
              <Star className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-yellow-900">Pro suggestion</h4>
                <Badge variant="secondary" className="text-xs">Free sample</Badge>
              </div>
              <p className="text-sm text-yellow-700">
                Clarify and strengthen thesis - Click to see example
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Real-time Status */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isAnalyzing ? 'bg-purple-500 animate-pulse' : 'bg-purple-500'}`}>
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-purple-900">
              {isAnalyzing ? 'Analyzing your writing...' : 'Real-time Analysis'}
            </h4>
            <p className="text-sm text-purple-700">
              Current section: {currentSection} • {wordCount} words
            </p>
          </div>
        </div>
      </Card>

      {/* Active Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Live Suggestions
            </h4>
            <Badge variant="secondary" className="text-xs">
              {suggestions.length} active
            </Badge>
          </div>
          
          <div className="space-y-2">
            {suggestions.map((suggestion) => {
              const Icon = getSuggestionIcon(suggestion.type);
              return (
                <Card 
                  key={suggestion.id}
                  className={`p-3 border transition-all hover:shadow-md cursor-pointer ${getSuggestionColor(suggestion.priority)}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug">
                        {suggestion.text}
                      </p>
                      {suggestion.expert && (
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-75">
                            Suggested by {suggestion.expert}
                          </p>
                          {suggestion.action && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 px-2 text-xs"
                            >
                              {suggestion.action}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* When no suggestions */}
      {!isAnalyzing && suggestions.length === 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Looking good!</p>
              <p className="text-xs text-green-700">Keep writing, I'll suggest improvements as you go.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Pro Suggestion Modal */}
      {currentProSuggestion && (
        <ProSuggestionModal
          isOpen={showProModal}
          onClose={() => setShowProModal(false)}
          suggestion={currentProSuggestion}
          onApplyExample={(text) => {
            if (onInsertWithHighlight) {
              onInsertWithHighlight(text);
            }
          }}
        />
      )}
    </div>
  );
};

export default ProactiveAssistant;