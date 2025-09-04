import { Brain, ChevronRight, Users, Lightbulb, ChevronDown, FileText, Sparkles, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ExpertComment from './ExpertComment';
import WritingAgents from './WritingAgents';
import CitationFinder from './CitationFinder';
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
}

const ExpertReview = ({ contentProps, uploadedDocuments = [], onDocumentsChange = () => {}, onPaywallTrigger }: ExpertReviewProps) => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

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
    <div className="w-80 bg-sidebar-bg border-l border-border flex flex-col h-screen shadow-[var(--sidebar-shadow)]">
      {/* Compact Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-expert-accent/10 rounded-md">
              <Brain className="h-4 w-4 text-expert-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Expert Review</h2>
              <p className="text-xs text-muted-foreground">AI-powered feedback</p>
            </div>
          </div>
          <UsageCounter onUpgradeClick={onPaywallTrigger ? () => onPaywallTrigger('ai-limit') : () => {}} />
        </div>
      </div>

      {/* Document Upload - Always visible but compact */}
      <ExpertReviewDocumentUpload 
        documents={uploadedDocuments}
        onDocumentsChange={onDocumentsChange}
        onPaywallTrigger={onPaywallTrigger}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Live Suggestions - Always visible when content exists */}
        {contentProps?.content && (
          <div className="p-3 border-b border-border">
            <ProactiveAssistant 
              content={contentProps.content}
              cursorPosition={contentProps.cursorPosition || 0}
              onInsertText={contentProps.onInsertText}
              onInsertWithHighlight={contentProps.onInsertWithHighlight}
              onPaywallTrigger={contentProps.onPaywallTrigger}
            />
          </div>
        )}

        {/* AI Tools - Collapsible */}
        <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 h-auto border-b border-border rounded-none">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI Tools</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CitationFinder />
            <WritingAgents />
          </CollapsibleContent>
        </Collapsible>

        {/* Expert Feedback - Collapsible */}
        <Collapsible open={feedbackOpen} onOpenChange={setFeedbackOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 h-auto border-b border-border rounded-none">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Expert Feedback</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${feedbackOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {/* Overall Assessment - Compact */}
            <div className="p-3 border-b border-border">
              <Card className="p-3 bg-suggestion-bg border-accent/20">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-accent/10 rounded-full">
                    <Brain className="h-3 w-3 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-accent mb-1">Overall Assessment</p>
                    <p className="text-xs leading-relaxed">
                      Strong academic structure. 
                      {uploadedDocuments.length > 0 && " Based on uploads, "}
                      Add quantitative data for credibility.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Expert Comments - Compact */}
            <div className="p-3">
              <div className="space-y-2">
                {expertComments.slice(0, 2).map((comment, index) => (
                  <ExpertComment key={index} {...comment} />
                ))}
              </div>
              {expertComments.length > 2 && (
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                  View {expertComments.length - 2} more experts
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* All Suggestions - Collapsible */}
        <Collapsible open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 h-auto rounded-none">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm font-medium">All Suggestions</span>
                <Badge variant="secondary" className="text-xs">{suggestions.length}</Badge>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${suggestionsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-3 space-y-1">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-2 bg-muted/50 rounded text-xs hover:bg-muted transition-colors cursor-pointer">
                  {suggestion}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default ExpertReview;