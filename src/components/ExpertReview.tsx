import { Brain, ChevronRight, Users, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ExpertComment from './ExpertComment';
import DocumentUpload from './DocumentUpload';
import WritingAgents from './WritingAgents';
import CitationFinder from './CitationFinder';
import { useState } from 'react';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploadedAt: Date;
}

const ExpertReview = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

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
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-expert-accent/10 rounded-lg">
            <Brain className="h-6 w-6 text-expert-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Expert Review</h2>
            <p className="text-sm text-muted-foreground">AI-powered academic feedback</p>
          </div>
        </div>
        
        <Button className="w-full justify-between" variant="outline">
          <Users className="h-4 w-4" />
          Choose experts
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Citation Finder */}
        <CitationFinder />
        
        {/* Writing Agents */}
        <WritingAgents />
        
        {/* Document Upload */}
        <DocumentUpload onDocumentsChange={setUploadedDocuments} />

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