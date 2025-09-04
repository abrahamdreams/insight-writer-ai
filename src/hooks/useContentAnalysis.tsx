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
      
      // Analyze for citation needs - make more specific
      const claimPatterns = [
        { pattern: /studies show|research indicates/gi, priority: 'high' as const },
        { pattern: /\d+%|\d+ percent/gi, priority: 'high' as const },
        { pattern: /significantly|dramatically|substantially/gi, priority: 'medium' as const },
        { pattern: /proven|demonstrated|established/gi, priority: 'medium' as const },
        { pattern: /evidence suggests|data shows/gi, priority: 'high' as const }
      ];

      claimPatterns.forEach(({ pattern, priority }) => {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
          if (match.index !== undefined) {
            const matchText = match[0];
            suggestions.push({
              id: `citation-${match.index}`,
              type: 'citation',
              text: `Add citation for "${matchText}" - Click to insert reference`,
              position: match.index,
              priority,
              expert: 'Academic Standards',
              action: 'Insert Citation'
            });
          }
        }
      });

      // Analyze current paragraph for improvements - more specific suggestions
      if (currentParagraph.length > 50) {
        const sentences = currentParagraph.split(/[.!?]+/).filter(s => s.trim());
        
        if (sentences.length > 4) {
          suggestions.push({
            id: 'paragraph-length',
            type: 'improvement',
            text: 'Long paragraph detected - Click to add paragraph break for better readability',
            position: position,
            priority: 'medium',
            expert: 'Steven Pinker',
            action: 'Split Paragraph'
          });
        }

        // Check for vague terms - more specific replacements
        const vagueTerms = [
          { term: 'many', replacement: 'approximately 78% of elite' },
          { term: 'most', replacement: 'over 85% of professional' },
          { term: 'some', replacement: 'approximately 40-45% of' },
          { term: 'often', replacement: 'in 67% of cases' },
          { term: 'usually', replacement: 'in 8 out of 10 training sessions' }
        ];
        
        vagueTerms.forEach(({ term, replacement }) => {
          if (currentParagraph.toLowerCase().includes(term)) {
            suggestions.push({
              id: `vague-${term}`,
              type: 'clarification',
              text: `Replace "${term}" with "${replacement}" - Click to apply`,
              position: position,
              priority: 'medium',
              expert: 'Mike Boyle',
              action: 'Make Specific'
            });
          }
        });
      }

      // Suggest content expansion - more actionable
      if (text.includes('weightlifting') && !text.includes('powerlifting')) {
        suggestions.push({
          id: 'expansion-powerlifting',
          type: 'expansion',
          text: 'Add comparison with powerlifting - Click to insert detailed explanation',
          position: position,
          priority: 'low',
          expert: 'Stuart McGill',
          action: 'Add Comparison'
        });
      }

      // Context-aware suggestions based on current section - more helpful
      const sections = text.toLowerCase();
      if (sections.includes('introduction') && currentParagraph.toLowerCase().includes('soccer')) {
        suggestions.push({
          id: 'intro-hook',
          type: 'improvement',
          text: 'Add compelling FIFA statistic to hook readers - Click to insert',
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