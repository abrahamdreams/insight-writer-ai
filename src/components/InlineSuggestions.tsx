import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Users, Quote, Lightbulb } from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'expert' | 'citation' | 'improvement';
  expert?: string;
  text: string;
  suggestion: string;
  position: number;
  confidence: number;
}

interface InlineSuggestionsProps {
  suggestions: Suggestion[];
  cursorPosition: number;
  onAccept: (suggestionId: string, text: string) => void;
  onReject: (suggestionId: string) => void;
  containerRect?: DOMRect;
}

const InlineSuggestions: React.FC<InlineSuggestionsProps> = ({
  suggestions,
  cursorPosition,
  onAccept,
  onReject,
  containerRect
}) => {
  // Filter suggestions near cursor position (within 50 characters)
  const nearCursorSuggestions = suggestions.filter(
    suggestion => Math.abs(suggestion.position - cursorPosition) <= 50
  ).slice(0, 3); // Limit to 3 suggestions to avoid clutter

  if (nearCursorSuggestions.length === 0) return null;

  const getExpertColor = (expert?: string) => {
    switch (expert) {
      case 'Steven Pinker': return 'bg-blue-500';
      case 'Mike Boyle': return 'bg-green-500';
      case 'Stuart McGill': return 'bg-expert-accent';
      default: return 'bg-accent';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'expert': return Users;
      case 'citation': return Quote;
      case 'improvement': return Lightbulb;
      default: return Lightbulb;
    }
  };

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 top-32 z-50 max-w-md">
      <div className="space-y-2">
        {nearCursorSuggestions.map((suggestion) => {
          const Icon = getSuggestionIcon(suggestion.type);
          
          return (
            <Card key={suggestion.id} className="p-3 bg-card/95 backdrop-blur-sm border shadow-lg animate-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${getExpertColor(suggestion.expert)}`}>
                  <Icon className="h-3 w-3 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {suggestion.expert && (
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.expert}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-foreground mb-2 line-clamp-2">
                    {suggestion.suggestion}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onAccept(suggestion.id, suggestion.text)}
                      className="h-7 text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onReject(suggestion.id)}
                      className="h-7 text-xs"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InlineSuggestions;