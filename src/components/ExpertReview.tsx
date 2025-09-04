import { Brain, ChevronRight, Users, Lightbulb, CheckCircle, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ExpertComment from './ExpertComment';
import ProactiveAssistant from './ProactiveAssistant';
import ExpertReviewDocumentUpload from './ExpertReviewDocumentUpload';
import UsageCounter from './UsageCounter';
import { useState } from 'react';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploadedAt: Date;
}

interface LiveSuggestion {
  id: string;
  type: 'expert' | 'citation' | 'improvement';
  expert?: string;
  text: string;
  suggestion: string;
  position: number;
  confidence: number;
}

interface ExpertReviewProps {
  contentProps?: {
    content?: string;
    cursorPosition?: number;
    onInsertText?: (text: string) => void;
    onInsertWithHighlight?: (text: string) => void;
    onPaywallTrigger?: (trigger: 'ai-limit' | 'document-limit') => void;
  };
  uploadedDocuments?: any[];
  onDocumentsChange?: (documents: any[]) => void;
  onPaywallTrigger?: (trigger: 'ai-limit' | 'document-limit') => void;
  liveSuggestions?: LiveSuggestion[];
  onAcceptSuggestion?: (suggestionId: string, text: string) => void;
  onRejectSuggestion?: (suggestionId: string) => void;
  onPreviewSuggestion?: (position: number) => void;
}

const ExpertReview = ({ 
  contentProps, 
  uploadedDocuments = [], 
  onDocumentsChange = () => {}, 
  onPaywallTrigger,
  liveSuggestions = [],
  onAcceptSuggestion,
  onRejectSuggestion,
  onPreviewSuggestion
}: ExpertReviewProps) => {

  const getContextualComments = () => {
    const baseComments = [
      {
        name: "Steven Pinker",
        role: "Lead with a vivid, concrete snapshot",
        avatar: "SP",
        color: "bg-blue-500",
        suggestion: "Your essay is well-structured and clearly connects weightlifting to soccer performance; enriching it with concrete data, vivid examples, and holistic context will deepen credibility and reader engagement."
      },
      {
        name: "Mike Boyle",
        role: "Tie lifts to measurable soccer metrics",
        avatar: "MB",
        color: "bg-green-500",
        suggestion: "Consider adding specific percentages of improvement in sprint times, jump heights, or injury reduction rates to strengthen your arguments with quantifiable evidence."
      },
      {
        name: "Stuart McGill",
        role: "Professor of spine biomechanics and author of 'Back Mechanic: The Step-by-Step McGill Method to Fix Back Pain'",
        avatar: "SM",
        color: "bg-expert-accent",
        suggestion: "Excellent point on core stability and trunk stiffness. You might expand on the specific exercises that enhance this quality while avoiding spine-compromising movements."
      }
    ];

    // Add contextual comments based on uploaded documents
    if (uploadedDocuments.length > 0) {
      const contextualComments = uploadedDocuments.map(doc => ({
        name: "AI Context",
        role: `Based on ${doc.name}`,
        avatar: "AI",
        color: "bg-purple-500",
        suggestion: `Drawing from your uploaded materials in "${doc.name}", consider incorporating the specific methodologies and findings mentioned to strengthen your argument about weightlifting's impact on soccer performance.`
      }));
      return [...baseComments, ...contextualComments];
    }

    return baseComments;
  };

  const expertComments = getContextualComments();

  const suggestions = [
    "Add statistical data on injury reduction",
    "Include specific exercise protocols", 
    "Reference recent meta-analyses",
    "Discuss periodization strategies",
    "Address potential contraindications",
    "Compare with other training methods",
    ...(uploadedDocuments.length > 0 ? [
      "Integrate findings from uploaded materials",
      "Cross-reference with provided guidelines"
    ] : [])
  ];

  return (
    <div className="w-96 bg-sidebar-bg border-l border-border flex flex-col h-screen shadow-[var(--sidebar-shadow)]">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-expert-accent/10 rounded-lg">
              <Brain className="h-6 w-6 text-expert-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Expert Review</h2>
              <p className="text-sm text-muted-foreground">AI-powered academic feedback</p>
            </div>
          </div>
          
          {/* Compact Usage Counter in Expert Review Header */}
          <div className="flex flex-col items-end gap-2">
            <UsageCounter onUpgradeClick={onPaywallTrigger ? () => onPaywallTrigger('ai-limit') : () => {}} />
          </div>
        </div>
        
        <Button className="w-full justify-between" variant="outline">
          <Users className="h-4 w-4" />
          Choose experts
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Document Upload */}
      <ExpertReviewDocumentUpload 
        documents={uploadedDocuments}
        onDocumentsChange={onDocumentsChange}
        onPaywallTrigger={onPaywallTrigger}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Live Suggestions */}
        {liveSuggestions.length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-accent" />
              <h3 className="font-medium text-sm">Live Suggestions</h3>
              <Badge variant="secondary" className="text-xs">{liveSuggestions.length}</Badge>
            </div>
            <div className="space-y-3">
              {liveSuggestions.slice(0, 3).map((suggestion) => {
                const getExpertColor = (expert?: string) => {
                  switch (expert) {
                    case 'Steven Pinker': return 'bg-blue-500';
                    case 'Mike Boyle': return 'bg-green-500';
                    case 'Stuart McGill': return 'bg-expert-accent';
                    default: return 'bg-accent';
                  }
                };

                return (
                  <div key={suggestion.id} className="bg-muted/30 rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors"
                       onClick={() => onPreviewSuggestion?.(suggestion.position)}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getExpertColor(suggestion.expert)}`} />
                      {suggestion.expert && (
                        <Badge variant="outline" className="text-xs">{suggestion.expert}</Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(suggestion.confidence * 100)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {suggestion.suggestion}
                    </p>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        onClick={() => onAcceptSuggestion?.(suggestion.id, suggestion.text)}
                        className="h-6 text-xs px-2"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRejectSuggestion?.(suggestion.id)}
                        className="h-6 text-xs px-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Proactive Assistant */}
        {contentProps?.content && (
          <div className="p-4 border-b border-border">
            <ProactiveAssistant 
              content={contentProps.content}
              cursorPosition={contentProps.cursorPosition || 0}
              onInsertText={contentProps.onInsertText}
              onInsertWithHighlight={contentProps.onInsertWithHighlight}
              onPaywallTrigger={contentProps.onPaywallTrigger}
            />
          </div>
        )}

        {/* Main Feedback */}
        <div className="p-6 border-b border-border">
          <Card className="p-4 bg-suggestion-bg border-accent/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent/10 rounded-full">
                <Brain className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent mb-2">Overall Assessment</p>
                <p className="text-sm leading-relaxed">
                  Your essay demonstrates strong academic structure with clear connections between weightlifting and soccer performance. 
                  {uploadedDocuments.length > 0 && " Based on your uploaded materials, "}
                  Consider adding quantitative data and specific training protocols to enhance credibility.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Expert Comments */}
        <div className="p-6 border-b border-border">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Suggestions inspired by experts
          </h3>
          <div className="space-y-4">
            {expertComments.map((comment, index) => (
              <ExpertComment key={index} {...comment} />
            ))}
          </div>
        </div>

        {/* All Suggestions */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              All suggestions
            </h3>
            <Badge variant="secondary">{suggestions.length}</Badge>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg text-sm hover:bg-muted transition-colors cursor-pointer">
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertReview;