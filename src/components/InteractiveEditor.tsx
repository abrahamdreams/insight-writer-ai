import React, { useState, useRef, useEffect } from 'react';
import DocumentEditor from './DocumentEditor';

interface Suggestion {
  id: string;
  type: 'expert' | 'citation' | 'improvement';
  expert?: string;
  text: string;
  suggestion: string;
  position: number;
  confidence: number;
}

interface InteractiveEditorProps {
  onContentChange?: (content: string, cursorPosition: number) => void;
  onSuggestionsChange?: (suggestions: Suggestion[]) => void;
}

const InteractiveEditor = React.forwardRef<any, InteractiveEditorProps>(
  ({ onContentChange, onSuggestionsChange }, ref) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [currentContent, setCurrentContent] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const documentEditorRef = useRef<any>(null);

    // Generate contextual suggestions based on content and cursor position
    const generateSuggestions = (content: string, cursor: number) => {
      const newSuggestions: Suggestion[] = [];
      
      // Expert suggestions based on content analysis
      if (content.toLowerCase().includes('weightlifting') && content.toLowerCase().includes('soccer')) {
        newSuggestions.push({
          id: 'pinker-1',
          type: 'expert',
          expert: 'Steven Pinker',
          text: 'Research by Faigenbaum et al. (2009) demonstrates that',
          suggestion: 'Add concrete evidence: "Research by Faigenbaum et al. (2009) demonstrates that youth athletes who engaged in supervised resistance training showed 13% improvement in sprint performance."',
          position: cursor,
          confidence: 0.92
        });
      }

      if (content.toLowerCase().includes('injury prevention')) {
        newSuggestions.push({
          id: 'mcgill-1',
          type: 'expert',
          expert: 'Stuart McGill',
          text: 'According to McGill\'s research on spine biomechanics',
          suggestion: 'Strengthen with biomechanics evidence: "According to McGill\'s research on spine biomechanics, exercises that enhance core endurance rather than maximum strength show superior injury prevention outcomes."',
          position: cursor,
          confidence: 0.88
        });
      }

      if (content.toLowerCase().includes('strength') && content.toLowerCase().includes('power')) {
        newSuggestions.push({
          id: 'boyle-1',
          type: 'expert',
          expert: 'Mike Boyle',
          text: 'Studies indicate 15-20% improvements in vertical jump',
          suggestion: 'Add performance metrics: "Studies indicate 15-20% improvements in vertical jump height and 8-12% increases in sprint acceleration following 8-week periodized strength programs."',
          position: cursor,
          confidence: 0.85
        });
      }

      // Citation suggestions
      const paragraphs = content.split('\n\n');
      paragraphs.forEach((paragraph, index) => {
        if (paragraph.length > 200 && !paragraph.includes('(') && !paragraph.includes('et al.')) {
          const paragraphStart = content.indexOf(paragraph);
          newSuggestions.push({
            id: `citation-${index}`,
            type: 'citation',
            text: '(Smith et al., 2023)',
            suggestion: 'This claim needs citation support. Consider adding: "(Smith et al., 2023)" or similar academic reference.',
            position: paragraphStart + paragraph.length,
            confidence: 0.78
          });
        }
      });

      // Improvement suggestions
      if (content.includes('improves') || content.includes('enhances')) {
        const improvementIndex = Math.max(
          content.indexOf('improves'),
          content.indexOf('enhances')
        );
        if (improvementIndex !== -1) {
          newSuggestions.push({
            id: 'improvement-1',
            type: 'improvement',
            text: 'by approximately 15-25%',
            suggestion: 'Quantify the improvement: Add specific percentages or measurable outcomes to strengthen your argument.',
            position: improvementIndex + 8,
            confidence: 0.73
          });
        }
      }

      return newSuggestions;
    };

    const handleContentChange = (content: string, cursor: number) => {
      setCurrentContent(content);
      setCursorPosition(cursor);
      onContentChange?.(content, cursor);
      
      // Generate suggestions after a brief delay to avoid too frequent updates
      const timeoutId = setTimeout(() => {
        const newSuggestions = generateSuggestions(content, cursor);
        setSuggestions(newSuggestions);
        onSuggestionsChange?.(newSuggestions);
      }, 1000);

      return () => clearTimeout(timeoutId);
    };

    const handleAcceptSuggestion = (suggestionId: string, text: string) => {
      if (documentEditorRef.current) {
        documentEditorRef.current.insertWithHighlight(text);
      }
      
      // Remove the accepted suggestion
      const updatedSuggestions = suggestions.filter(s => s.id !== suggestionId);
      setSuggestions(updatedSuggestions);
      onSuggestionsChange?.(updatedSuggestions);
    };

    const handleRejectSuggestion = (suggestionId: string) => {
      const updatedSuggestions = suggestions.filter(s => s.id !== suggestionId);
      setSuggestions(updatedSuggestions);
      onSuggestionsChange?.(updatedSuggestions);
    };

    // Expose methods for parent to access suggestions
    React.useImperativeHandle(ref, () => ({
      getContent: () => documentEditorRef.current?.getContent(),
      getCursorPosition: () => documentEditorRef.current?.getCursorPosition(),
      insertText: (text: string) => documentEditorRef.current?.insertText(text),
      insertWithHighlight: (text: string) => documentEditorRef.current?.insertWithHighlight(text),
      getSuggestions: () => suggestions,
      acceptSuggestion: handleAcceptSuggestion,
      rejectSuggestion: handleRejectSuggestion
    }));

    return (
      <div className="relative">
        <DocumentEditor
          ref={documentEditorRef}
          onContentChange={handleContentChange}
        />
      </div>
    );
  }
);

export default InteractiveEditor;