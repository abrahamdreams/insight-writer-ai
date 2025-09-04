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
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-screen shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Expert Review</h2>
              <p className="text-sm text-gray-600">AI-powered academic feedback</p>
            </div>
          </div>
          
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
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Live Suggestions */}
        {liveSuggestions && liveSuggestions.length > 0 && (
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium text-sm text-gray-900">Live Suggestions</h3>
              <Badge variant="secondary" className="text-xs">{liveSuggestions.length}</Badge>
            </div>
            <div className="space-y-3">
              {liveSuggestions.slice(0, 3).map((suggestion) => (
                <div key={suggestion.id} className="bg-gray-50 rounded-lg p-3 space-y-2 cursor-pointer hover:bg-gray-100 transition-colors"
                     onClick={() => onPreviewSuggestion?.(suggestion.position)}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <Badge variant="outline" className="text-xs">{suggestion.expert || 'AI'}</Badge>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
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
              ))}
            </div>
          </div>
        )}

        {/* Always show some content for testing */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Brain className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 mb-2">Overall Assessment</p>
                <p className="text-sm leading-relaxed text-gray-700">
                  Your essay demonstrates strong academic structure with clear connections between weightlifting and soccer performance. 
                  Consider adding quantitative data and specific training protocols to enhance credibility.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Static expert comments for testing */}
        <div className="p-6 bg-white">
          <h3 className="font-medium mb-4 flex items-center gap-2 text-gray-900">
            <Users className="h-4 w-4" />
            Expert Suggestions
          </h3>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  SP
                </div>
                <span className="text-sm font-medium text-gray-900">Steven Pinker</span>
              </div>
              <p className="text-xs text-gray-600">
                Consider adding concrete data and vivid examples to strengthen your arguments.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  MB
                </div>
                <span className="text-sm font-medium text-gray-900">Mike Boyle</span>
              </div>
              <p className="text-xs text-gray-600">
                Add specific percentages of improvement in performance metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertReview;