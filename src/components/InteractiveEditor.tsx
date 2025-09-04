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
          text: '\n\nResearch by Faigenbaum et al. (2009) demonstrates that youth athletes who engaged in supervised resistance training showed 13% improvement in sprint performance and 7% increase in vertical jump height.',
          suggestion: 'Add concrete research evidence: "Research by Faigenbaum et al. (2009) demonstrates that youth athletes who engaged in supervised resistance training showed 13% improvement in sprint performance."',
          position: cursor,
          confidence: 0.92
        });
      }

      if (content.toLowerCase().includes('injury prevention')) {
        const injuryIndex = content.toLowerCase().indexOf('injury prevention');
        newSuggestions.push({
          id: 'mcgill-1',
          type: 'expert',
          expert: 'Stuart McGill',
          text: ' According to McGill\'s spine biomechanics research (2016), exercises emphasizing core endurance rather than maximum strength demonstrate superior injury prevention outcomes, reducing lower back injury rates by up to 23% in athletic populations.',
          suggestion: 'Strengthen with biomechanics evidence: "According to McGill\'s research on spine biomechanics, exercises that enhance core endurance rather than maximum strength show superior injury prevention outcomes."',
          position: injuryIndex + 18, // After "injury prevention"
          confidence: 0.88
        });
      }

      if (content.toLowerCase().includes('strength') && content.toLowerCase().includes('power')) {
        const strengthIndex = content.toLowerCase().indexOf('strength');
        newSuggestions.push({
          id: 'boyle-1',
          type: 'expert',
          expert: 'Mike Boyle',
          text: ' Studies indicate 15-20% improvements in vertical jump height and 8-12% increases in sprint acceleration following 8-week periodized strength programs (Ronnestad & Kvamme, 2006).',
          suggestion: 'Add performance metrics: "Studies indicate 15-20% improvements in vertical jump height and 8-12% increases in sprint acceleration following 8-week periodized strength programs."',
          position: strengthIndex + 8, // After "strength"
          confidence: 0.85
        });
      }

      // Comparison suggestions
      if (content.toLowerCase().includes('weightlifting') && !content.toLowerCase().includes('powerlifting')) {
        const comparisonIndex = content.length; // End of document
        newSuggestions.push({
          id: 'comparison-1',
          type: 'improvement',
          text: '\n\nComparison with Powerlifting:\n\nWhile both weightlifting and powerlifting involve resistance training, their applications to soccer performance differ significantly. Weightlifting emphasizes explosive, multi-joint movements that mirror soccer-specific actions, whereas powerlifting focuses on maximal strength in three specific lifts. For soccer athletes, weightlifting\'s emphasis on speed and power development provides more direct performance transfer than powerlifting\'s pure strength focus.',
          suggestion: 'Add comparison with powerlifting. Click to insert detailed explanation.',
          position: comparisonIndex,
          confidence: 0.78
        });
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
      rejectSuggestion: handleRejectSuggestion,
      previewSuggestion: (position: number) => {
        if (documentEditorRef.current) {
          documentEditorRef.current.focusAtPosition(position);
        }
      }
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