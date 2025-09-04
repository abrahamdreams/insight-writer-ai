import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote, BookOpen, Lightbulb, Users, Plus, X } from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'citation' | 'expansion' | 'expert' | 'data';
  text: string;
  expert?: string;
  expertRole?: string;
  citation?: string;
  position: number;
  priority: 'high' | 'medium' | 'low';
  insertText?: string;
}

interface InlineSuggestionsProps {
  content: string;
  cursorPosition: number;
  onInsertText: (text: string) => void;
  containerRef?: React.RefObject<HTMLElement>;
}

const InlineSuggestions = ({ content, cursorPosition, onInsertText, containerRef }: InlineSuggestionsProps) => {
  const [activeSuggestions, setActiveSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const expertData = {
    "Steven Pinker": {
      role: "Cognitive Scientist",
      color: "bg-blue-500",
      avatar: "SP"
    },
    "Mike Boyle": {
      role: "Strength Coach", 
      color: "bg-green-500",
      avatar: "MB"
    },
    "Stuart McGill": {
      role: "Spine Biomechanics Expert",
      color: "bg-expert-accent",
      avatar: "SM"
    }
  };

  const generateSuggestions = useMemo(() => {
    const suggestions: Suggestion[] = [];
    const words = content.split(' ');
    const currentWordIndex = Math.floor(cursorPosition / (content.length / words.length));
    const nearbyText = content.substring(Math.max(0, cursorPosition - 100), cursorPosition + 100).toLowerCase();

    // Context-aware suggestions based on content
    if (nearbyText.includes('strength') || nearbyText.includes('power')) {
      suggestions.push({
        id: 'strength-citation',
        type: 'citation',
        text: 'Add research citation for strength training effects',
        citation: '(Smith et al., 2023)',
        position: cursorPosition,
        priority: 'high',
        insertText: ' (Smith et al., 2023, found that resistance training improved soccer performance by 15-20%)'
      });

      suggestions.push({
        id: 'boyle-expert',
        type: 'expert',
        text: 'Mike Boyle suggests focusing on functional strength patterns',
        expert: 'Mike Boyle',
        expertRole: 'Strength Coach',
        position: cursorPosition,
        priority: 'high',
        insertText: '. As strength coach Mike Boyle emphasizes, "Soccer-specific strength training should mirror the movement patterns found in the game itself"'
      });
    }

    if (nearbyText.includes('injury') || nearbyText.includes('prevention')) {
      suggestions.push({
        id: 'mcgill-expert',
        type: 'expert',
        text: 'Stuart McGill\'s research on spine stability is relevant here',
        expert: 'Stuart McGill',
        expertRole: 'Spine Biomechanics Expert',
        position: cursorPosition,
        priority: 'high',
        insertText: '. Research by spine biomechanics expert Stuart McGill demonstrates that proper core stability reduces injury risk by up to 40% in athletes'
      });
    }

    if (nearbyText.includes('performance') || nearbyText.includes('athletes')) {
      suggestions.push({
        id: 'data-suggestion',
        type: 'data',
        text: 'Include specific performance metrics',
        position: cursorPosition,
        priority: 'medium',
        insertText: ' Studies show improvements of 12% in sprint speed and 18% in vertical jump height after 12 weeks of structured resistance training'
      });
    }

    if (nearbyText.includes('soccer') || nearbyText.includes('football')) {
      suggestions.push({
        id: 'pinker-expert',
        type: 'expert',
        text: 'Steven Pinker advocates for clear, concrete examples',
        expert: 'Steven Pinker',
        expertRole: 'Cognitive Scientist',
        position: cursorPosition,
        priority: 'medium',
        insertText: '. For instance, elite soccer players like Cristiano Ronaldo attribute significant portions of their explosive power to dedicated weightlifting regimens'
      });
    }

    return suggestions;
  }, [content, cursorPosition]);

  useEffect(() => {
    setActiveSuggestions(generateSuggestions);
  }, [generateSuggestions]);

  const handleApplySuggestion = (suggestion: Suggestion) => {
    if (suggestion.insertText) {
      onInsertText(suggestion.insertText);
      setActiveSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      setSelectedSuggestion(null);
    }
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setActiveSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    setSelectedSuggestion(null);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'citation': return BookOpen;
      case 'expert': return Users;
      case 'data': return Lightbulb;
      default: return Quote;
    }
  };

  const getSuggestionColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-accent text-accent bg-accent/5';
      case 'medium': return 'border-primary text-primary bg-primary/5';
      case 'low': return 'border-muted-foreground text-muted-foreground bg-muted/5';
      default: return 'border-muted-foreground text-muted-foreground bg-muted/5';
    }
  };

  if (activeSuggestions.length === 0) return null;

  return (
    <div className="space-y-2">
      {activeSuggestions.slice(0, 2).map((suggestion) => {
        const Icon = getSuggestionIcon(suggestion.type);
        const colorClass = getSuggestionColor(suggestion.priority);
        const expertInfo = suggestion.expert ? expertData[suggestion.expert as keyof typeof expertData] : null;
        
        return (
          <Card 
            key={suggestion.id} 
            className={`p-3 border-2 ${colorClass} animate-in slide-in-from-right-full duration-300 hover:shadow-md transition-all cursor-pointer`}
            onClick={() => setSelectedSuggestion(selectedSuggestion === suggestion.id ? null : suggestion.id)}
          >
            <div className="flex items-start gap-2">
              {expertInfo ? (
                <div className={`w-8 h-8 rounded-full ${expertInfo.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {expertInfo.avatar}
                </div>
              ) : (
                <div className={`p-1.5 rounded-full ${colorClass} flex-shrink-0`}>
                  <Icon className="h-3 w-3" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {suggestion.type}
                  </Badge>
                  {suggestion.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs">
                      High Priority
                    </Badge>
                  )}
                </div>
                <p className="text-sm leading-tight mb-2">{suggestion.text}</p>
                
                {selectedSuggestion === suggestion.id && (
                  <div className="flex gap-1 mt-2">
                    <Button 
                      size="sm" 
                      className="h-7 text-xs px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplySuggestion(suggestion);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismissSuggestion(suggestion.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
      
      {activeSuggestions.length > 3 && (
        <Card className="p-2 bg-muted/50 text-center">
          <p className="text-xs text-muted-foreground">
            +{activeSuggestions.length - 3} more suggestions available
          </p>
        </Card>
      )}
    </div>
  );
};

export default InlineSuggestions;