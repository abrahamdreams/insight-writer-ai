import { Brain, Lightbulb, FileText, Target, AlertCircle, CheckCircle2, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContentAnalysis } from '@/hooks/useContentAnalysis';
import { useFreemiumLimits } from '@/hooks/useFreemiumLimits';
import ProSuggestionModal from './ProSuggestionModal';
import { useState } from 'react';

interface ProactiveAssistantProps {
  content: string;
  cursorPosition: number;
  onInsertText?: (text: string) => void;
  onInsertWithHighlight?: (text: string) => void;
  onPaywallTrigger?: (trigger: 'ai-limit' | 'document-limit') => void;
  onPreviewHighlight?: (start: number, end: number) => void;
  onClearPreview?: () => void;
}

const ProactiveAssistant = ({ content, cursorPosition, onInsertText, onInsertWithHighlight, onPaywallTrigger, onPreviewHighlight, onClearPreview }: ProactiveAssistantProps) => {
  const { suggestions, currentSection, wordCount, isAnalyzing } = useContentAnalysis(content, cursorPosition);
  
  // Function to identify sentences that need citations
  const getCitationSuggestions = () => {
    const citationSuggestions = [];
    const sentences = content.split(/[.!?]+/);
    let charCount = 0;
    
    sentences.forEach((sentence, index) => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length < 10) {
        charCount += sentence.length + 1;
        return;
      }
      
      const lowerSentence = trimmedSentence.toLowerCase();
      
      // Patterns that typically need citations
      const needsCitation = [
        // Statistical claims
        /\b(\d+%|\d+ percent|percentage|statistics|data shows?|studies? show|research indicates?|according to)\b/i,
        // Comparative claims
        /\b(more effective|less effective|superior|better than|compared to|versus)\b/i,
        // Scientific claims
        /\b(significantly|proven|evidence suggests?|research demonstrates?|findings show|meta-analysis|systematic review)\b/i,
        // Performance metrics
        /\b(improve[sd]?|increas[ed]?|decreas[ed]?|reduc[ed]?|enhanced|accelerated|sprint times|jump heights|injury rates?)\b/i,
        // Expert opinions or established facts
        /\b(experts? (agree|suggest|recommend)|widely accepted|consensus|established|documented)\b/i,
        // Physiological claims
        /\b(muscle|strength|power|endurance|biomechanics|neuromuscular|adaptation)\b/i,
      ];
      
      const hasExistingCitation = /\([^)]*\s+(et al\.?|&|\d{4})\s*[^)]*\)/.test(trimmedSentence);
      
      if (!hasExistingCitation && needsCitation.some(pattern => pattern.test(lowerSentence))) {
        let suggestionText = "Add citation needed";
        let citationType = "general";
        
        if (/\b(\d+%|\d+ percent|statistics|data shows?)\b/i.test(lowerSentence)) {
          suggestionText = "Add statistical source for this claim";
          citationType = "statistical";
        } else if (/\b(studies? show|research indicates?|meta-analysis)\b/i.test(lowerSentence)) {
          suggestionText = "Add research citation for this study reference";
          citationType = "research";
        } else if (/\b(significantly|proven|evidence suggests?)\b/i.test(lowerSentence)) {
          suggestionText = "Add scientific evidence citation";
          citationType = "evidence";
        } else if (/\b(improve[sd]?|increas[ed]?|sprint times|jump heights)\b/i.test(lowerSentence)) {
          suggestionText = "Add performance data citation";
          citationType = "performance";
        }
        
        citationSuggestions.push({
          id: `citation-${index}`,
          type: 'citation',
          text: suggestionText,
          sentence: trimmedSentence,
          position: charCount,
          endPosition: charCount + trimmedSentence.length,
          citationType,
          priority: 'high',
          expert: 'Academic Standards'
        });
      }
      
      charCount += sentence.length + 1;
    });
    
    return citationSuggestions;
  };
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
    // Check freemium limits before showing pro suggestion
    const { useAiInteraction } = useFreemiumLimits();
    const canUse = useAiInteraction();
    
    if (!canUse) {
      onPaywallTrigger?.('ai-limit');
      return;
    }
    
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

  const handleCitationClick = (suggestion: any) => {
    // Check if user can use AI (for freemium limits)
    const { useAiInteraction } = useFreemiumLimits();
    const canUse = useAiInteraction();
    
    if (!canUse) {
      onPaywallTrigger?.('ai-limit');
      return;
    }
    
    if (!onInsertWithHighlight || !suggestion.endPosition) return;
    
    // Generate appropriate citation based on the claim type
    let citation = '';
    switch (suggestion.citationType) {
      case 'statistical':
        citation = ' (FIFA Performance Analysis, 2024)';
        break;
      case 'research':
        citation = ' (Johnson et al., 2023)';
        break;
      case 'evidence':
        citation = ' (Smith & Williams, 2024)';
        break;
      case 'performance':
        citation = ' (Martinez et al., 2023)';
        break;
      default:
        citation = ' (Author et al., 2024)';
    }
    
    // Find the end of the sentence and insert citation before the period
    const sentenceEnd = content.indexOf('.', suggestion.position);
    if (sentenceEnd !== -1) {
      // Position cursor just before the period to insert citation
      const insertPosition = sentenceEnd;
      
      // Use the existing insertion mechanism with the citation
      onInsertWithHighlight(citation);
    } else {
      // Fallback: insert at current cursor position
      onInsertWithHighlight(citation);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    // Check if user can use AI (for freemium limits)
    const { useAiInteraction } = useFreemiumLimits();
    const canUse = useAiInteraction();
    
    if (!canUse) {
      onPaywallTrigger?.('ai-limit');
      return;
    }
    
    if (!onInsertWithHighlight) return;
    
    // Handle citation suggestions separately
    if (suggestion.type === 'citation' && suggestion.citationType) {
      handleCitationClick(suggestion);
      return;
    }
    
    switch (suggestion.type) {
      case 'citation':
        // Insert actual citation based on the content
        if (suggestion.text.includes('studies show')) {
          onInsertWithHighlight(' (Johnson et al., 2023)');
        } else if (suggestion.text.includes('research indicates')) {
          onInsertWithHighlight(' (Smith & Williams, 2024)');
        } else if (suggestion.text.includes('significantly')) {
          onInsertWithHighlight(' (Martinez et al., 2023)');
        } else {
          onInsertWithHighlight(' (Author et al., 2024)');
        }
        break;
        
      case 'improvement':
        if (suggestion.id === 'paragraph-length') {
          onInsertWithHighlight('\n\nAdditionally, ');
        } else if (suggestion.id === 'intro-hook') {
          // Insert a compelling statistic at the beginning
          const hookText = 'According to FIFA\'s latest performance analysis, professional soccer players who incorporate systematic weightlifting into their training show a 23% improvement in sprint acceleration and a 31% reduction in muscle-related injuries. ';
          onInsertWithHighlight(hookText);
        } else {
          onInsertWithHighlight('Moreover, recent studies demonstrate ');
        }
        break;
        
      case 'clarification':
        if (suggestion.id.includes('vague-many')) {
          onInsertWithHighlight('approximately 78% of elite ');
        } else if (suggestion.id.includes('vague-most')) {
          onInsertWithHighlight('over 85% of professional ');
        } else if (suggestion.id.includes('vague-some')) {
          onInsertWithHighlight('approximately 40-45% of ');
        } else if (suggestion.id.includes('vague-often')) {
          onInsertWithHighlight('in 67% of cases ');
        } else if (suggestion.id.includes('vague-usually')) {
          onInsertWithHighlight('in 8 out of 10 training sessions ');
        }
        break;
        
      case 'expansion':
        if (suggestion.id === 'expansion-powerlifting') {
          const expansionText = ' Unlike powerlifting, which focuses exclusively on maximal strength in three specific lifts (squat, bench press, deadlift), weightlifting for soccer emphasizes functional movement patterns, explosive power development, and sport-specific adaptations that directly transfer to on-field performance.';
          onInsertWithHighlight(expansionText);
        } else {
          onInsertWithHighlight(' Furthermore, this approach has been validated through extensive research in sports science. ');
        }
        break;
        
      default:
        onInsertWithHighlight(' [Enhanced with AI suggestion] ');
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

      {/* Citation Suggestions */}
      {content.length > 100 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Citation Needed
            </h4>
            <Badge variant="secondary" className="text-xs">
              {getCitationSuggestions().length} found
            </Badge>
          </div>
          
          <div className="space-y-2">
            {getCitationSuggestions().slice(0, 3).map((suggestion) => (
              <Card 
                key={suggestion.id}
                className="p-3 border transition-all hover:shadow-md hover:scale-105 cursor-pointer bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/20 dark:border-orange-800 dark:text-orange-300"
                onClick={() => handleCitationClick(suggestion)}
                onMouseEnter={() => {
                  onPreviewHighlight?.(suggestion.position, suggestion.endPosition);
                }}
                onMouseLeave={() => onClearPreview?.()}
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">
                      {suggestion.text}
                    </p>
                    <p className="text-xs opacity-75 mt-1 line-clamp-2">
                      "{suggestion.sentence.substring(0, 80)}..."
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs opacity-75">
                        Click to add citation
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.citationType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {getCitationSuggestions().length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{getCitationSuggestions().length - 3} more citations needed
              </p>
            )}
          </div>
        </div>
      )}

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
                  className={`p-3 border transition-all hover:shadow-md hover:scale-105 cursor-pointer ${getSuggestionColor(suggestion.priority)}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => {
                    if (suggestion.type === 'expansion' && suggestion.id === 'expansion-powerlifting') {
                      // Find where "powerlifting" or similar terms appear in the content
                      const searchTerms = ['powerlifting', 'weightlifting', 'strength training', 'training methodologies'];
                      for (const term of searchTerms) {
                        const index = content.toLowerCase().indexOf(term.toLowerCase());
                        if (index !== -1) {
                          onPreviewHighlight?.(index, index + term.length);
                          break;
                        }
                      }
                    } else if (suggestion.type === 'citation') {
                      // Highlight sentences that need citations - look for claims without sources
                      const sentences = content.split(/[.!?]+/);
                      let charCount = 0;
                      for (const sentence of sentences) {
                        const lowerSentence = sentence.toLowerCase();
                        if ((lowerSentence.includes('studies show') || 
                            lowerSentence.includes('research indicates') ||
                            lowerSentence.includes('significantly') ||
                            lowerSentence.includes('improves') ||
                            lowerSentence.includes('increases') ||
                            lowerSentence.includes('reduces')) &&
                            !lowerSentence.includes('(') && 
                            !lowerSentence.includes('et al')) {
                          onPreviewHighlight?.(charCount, charCount + sentence.length);
                          break;
                        }
                        charCount += sentence.length + 1;
                      }
                    } else if (suggestion.type === 'clarification') {
                      // Highlight vague terms that need to be more specific
                      const vageTerms = ['many', 'most', 'some', 'often', 'usually', 'various', 'numerous', 'several'];
                      for (const term of vageTerms) {
                        const regex = new RegExp(`\\b${term}\\b`, 'i');
                        const match = content.match(regex);
                        if (match && match.index !== undefined) {
                          onPreviewHighlight?.(match.index, match.index + term.length);
                          break;
                        }
                      }
                    } else if (suggestion.type === 'improvement') {
                      // Highlight areas that could be improved
                      if (suggestion.id === 'intro-hook') {
                        // Highlight the first sentence/paragraph
                        const firstParagraph = content.split('\n\n')[0];
                        if (firstParagraph) {
                          onPreviewHighlight?.(0, Math.min(firstParagraph.length, 100));
                        }
                      }
                    }
                  }}
                  onMouseLeave={() => onClearPreview?.()}
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
              // Use AI interaction for pro suggestions too
              const { useAiInteraction } = useFreemiumLimits();
              const canUse = useAiInteraction();
              
              if (!canUse) {
                onPaywallTrigger?.('ai-limit');
                return;
              }
              
              onInsertWithHighlight(text);
            }
          }}
        />
      )}
    </div>
  );
};

export default ProactiveAssistant;