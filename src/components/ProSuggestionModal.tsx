import { useState } from 'react';
import { X, Star, BookOpen, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProSuggestion {
  id: string;
  title: string;
  description: string;
  example: string;
  category: 'thesis' | 'evidence' | 'structure' | 'clarity';
  priority: 'high' | 'medium' | 'low';
}

interface ProSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: ProSuggestion;
  onApplyExample: (text: string) => void;
}

const ProSuggestionModal = ({ isOpen, onClose, suggestion, onApplyExample }: ProSuggestionModalProps) => {
  const [showExample, setShowExample] = useState(false);

  if (!isOpen) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'thesis': return 'bg-blue-500';
      case 'evidence': return 'bg-green-500';
      case 'structure': return 'bg-purple-500';
      case 'clarity': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'thesis': return '🎯';
      case 'evidence': return '📊';
      case 'structure': return '🏗️';
      case 'clarity': return '✨';
      default: return '💡';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Pro suggestion</h3>
                <Badge variant="secondary" className="text-xs">Free sample</Badge>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered academic enhancement</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${getCategoryColor(suggestion.category)}`}>
              <span className="text-white text-lg">{getCategoryIcon(suggestion.category)}</span>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-foreground mb-3">
                {suggestion.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {suggestion.description}
              </p>

              {/* Example Section */}
              {showExample && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border-l-4 border-accent">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-accent">Example Implementation</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 italic">
                    "{suggestion.example}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 bg-muted/20 border-t border-border">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowExample(!showExample)}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {showExample ? 'Hide example' : 'Show example'}
            </Button>
            
            {showExample && (
              <Button 
                onClick={() => {
                  onApplyExample(suggestion.example);
                  onClose();
                }}
                className="flex items-center gap-2"
              >
                Apply example
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Button variant="ghost" onClick={onClose}>
            Dismiss
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProSuggestionModal;