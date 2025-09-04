import { useState, useRef } from 'react';
import Header from '@/components/Header';
import DocumentEditor from '@/components/DocumentEditor';
import ExpertReview from '@/components/ExpertReview';

const Index = () => {
  const [documentContent, setDocumentContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const documentEditorRef = useRef<{ getContent: () => string; getCursorPosition: () => number; insertText: (text: string) => void } | null>(null);

  const handleInsertText = (text: string) => {
    if (documentEditorRef.current) {
      documentEditorRef.current.insertText(text);
    }
  };

  const handleContentChange = (content: string, cursor: number) => {
    setDocumentContent(content);
    setCursorPosition(cursor);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        <DocumentEditor 
          ref={documentEditorRef}
          onContentChange={handleContentChange}
        />
        <ExpertReview 
          contentProps={{
            content: documentContent,
            cursorPosition: cursorPosition,
            onInsertText: handleInsertText
          }}
        />
      </div>
    </div>
  );
};

export default Index;
