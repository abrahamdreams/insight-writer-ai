import { useState, useEffect, useCallback } from 'react';

interface ContentSuggestion {
  id: string;
  type: 'citation' | 'improvement' | 'expansion' | 'clarification';
  text: string;
  position: number;
  priority: 'high' | 'medium' | 'low';
  expert?: string;
  action?: string;
}

interface AnalysisResult {
  suggestions: ContentSuggestion[];
  currentSection: string;
  wordCount: number;
  isAnalyzing: boolean;
}

export const useContentAnalysis = (content: string, cursorPosition: number = 0) => {
  const [analysis, setAnalysis] = useState<AnalysisResult>({
    suggestions: [],
    currentSection: '',
    wordCount: 0,
    isAnalyzing: false
  });

  const analyzeContent = useCallback((text: string, position: number) => {
    setAnalysis(prev => ({ ...prev, isAnalyzing: true }));

    // Simulate real-time analysis with a small delay
    setTimeout(() => {
      const suggestions: ContentSuggestion[] = [];
      const words = text.split(/\s+/).length;
      
      // Get current paragraph/section
      const beforeCursor = text.substring(0, position);
      const currentParagraph = beforeCursor.split('\n\n').pop() || '';
      
      // Analyze for citation needs
      const claimPatterns = [
        /studies show|research indicates|according to|data suggests/gi,
        /\d+%|\d+ percent/gi,
        /significantly|dramatically|substantially/gi,
        /proven|demonstrated|established/gi
      ];

      claimPatterns.forEach(pattern => {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
          if (match.index !== undefined) {
            suggestions.push({
              id: `citation-${match.index}`,
              type: 'citation',
              text: `Consider adding a citation for: "${match[0]}"`,
              position: match.index,
              priority: 'high',
              expert: 'Academic Standards',
              action: 'Add Citation'
            });
          }
        }
      });

      // Analyze current paragraph for improvements
      if (currentParagraph.length > 50) {
        const sentences = currentParagraph.split(/[.!?]+/).filter(s => s.trim());
        
        if (sentences.length > 4) {
          suggestions.push({
            id: 'paragraph-length',
            type: 'improvement',
            text: 'This paragraph might benefit from being split for better readability.',
            position: position,
            priority: 'medium',
            expert: 'Steven Pinker',
            action: 'Split Paragraph'
          });
        }

        // Check for vague terms
        const vagueTerms = ['many', 'most', 'some', 'often', 'usually'];
        vagueTerms.forEach(term => {
          if (currentParagraph.toLowerCase().includes(term)) {
            suggestions.push({
              id: `vague-${term}`,
              type: 'clarification',
              text: `Consider being more specific than "${term}" with quantitative data.`,
              position: position,
              priority: 'medium',
              expert: 'Mike Boyle',
              action: 'Add Specifics'
            });
          }
        });
      }

      // Suggest content expansion
      if (text.includes('weightlifting') && !text.includes('powerlifting')) {
        suggestions.push({
          id: 'expansion-powerlifting',
          type: 'expansion',
          text: 'Consider discussing how weightlifting differs from powerlifting in soccer training.',
          position: position,
          priority: 'low',
          expert: 'Stuart McGill',
          action: 'Expand Topic'
        });
      }

      // Context-aware suggestions based on current section
      const sections = text.toLowerCase();
      if (sections.includes('introduction') && currentParagraph.toLowerCase().includes('introduction')) {
        suggestions.push({
          id: 'intro-hook',
          type: 'improvement',
          text: 'Start with a compelling statistic or real-world example to hook readers.',
          position: position,
          priority: 'high',
          expert: 'Steven Pinker',
          action: 'Add Hook'
        });
      }

      // Determine current section
      let currentSection = 'Introduction';
      if (beforeCursor.toLowerCase().includes('physical benefits')) currentSection = 'Physical Benefits';
      if (beforeCursor.toLowerCase().includes('injury prevention')) currentSection = 'Injury Prevention';
      if (beforeCursor.toLowerCase().includes('on-field performance')) currentSection = 'Performance';
      if (beforeCursor.toLowerCase().includes('conclusion')) currentSection = 'Conclusion';

      setAnalysis({
        suggestions: suggestions.slice(0, 5), // Limit to top 5 suggestions
        currentSection,
        wordCount: words,
        isAnalyzing: false
      });
    }, 500);
  }, []);

  useEffect(() => {
    if (content.length > 0) {
      analyzeContent(content, cursorPosition);
    }
  }, [content, cursorPosition, analyzeContent]);

  return analysis;
};