import { useState, useRef } from 'react';
import Header from '@/components/Header';
import InteractiveEditor from '@/components/InteractiveEditor';
import ExpertReview from '@/components/ExpertReview';
import ReaderReactions from '@/components/ReaderReactions';
import { FreemiumProvider } from '@/hooks/useFreemiumLimits';
import UsageCounter from '@/components/UsageCounter';
import PaywallModal from '@/components/PaywallModal';
import PricingModal from '@/components/PricingModal';

const Index = () => {
  const [documentContent, setDocumentContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallTrigger, setPaywallTrigger] = useState<'ai-limit' | 'document-limit'>('ai-limit');
  const [showPricing, setShowPricing] = useState(false);
  const [showReaderReactions, setShowReaderReactions] = useState(false);
  const documentEditorRef = useRef<{ getContent: () => string; getCursorPosition: () => number; insertText: (text: string) => void; insertWithHighlight: (text: string) => void } | null>(null);

  const handleInsertText = (text: string) => {
    if (documentEditorRef.current) {
      documentEditorRef.current.insertText(text);
    }
  };

  const handleContentChange = (content: string, cursor: number) => {
    setDocumentContent(content);
    setCursorPosition(cursor);
  };

  const handlePaywallTrigger = (trigger: 'ai-limit' | 'document-limit') => {
    setPaywallTrigger(trigger);
    setShowPaywall(true);
  };

  const handleUpgrade = () => {
    // Mock upgrade - in real app this would integrate with Stripe
    alert('🎉 Upgrade to Premium! (This is a demo - no actual payment processed)');
    setShowPaywall(false);
    setShowPricing(false);
  };

  return (
    <FreemiumProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header 
          onPricingClick={() => setShowPricing(true)}
          onReaderReactionsClick={() => setShowReaderReactions(!showReaderReactions)}
          showReaderReactions={showReaderReactions}
        />
        
        <div className="flex flex-1 relative">
          <InteractiveEditor 
            ref={documentEditorRef}
            onContentChange={handleContentChange}
          />
          <ExpertReview 
            contentProps={{
              content: documentContent,
              cursorPosition: cursorPosition,
              onInsertText: handleInsertText,
              onInsertWithHighlight: documentEditorRef.current?.insertWithHighlight,
              onPaywallTrigger: handlePaywallTrigger
            }}
            uploadedDocuments={uploadedDocuments}
            onDocumentsChange={setUploadedDocuments}
            onPaywallTrigger={handlePaywallTrigger}
          />
          
          {/* Reader Reactions - Slide in from right */}
          <div className={`transition-all duration-300 ease-in-out ${
            showReaderReactions 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-full opacity-0 pointer-events-none'
          } absolute right-0 top-0 h-full z-10 bg-background border-l border-border shadow-lg`}>
            <ReaderReactions onClose={() => setShowReaderReactions(false)} />
          </div>
        </div>

        {/* Modals */}
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          onUpgrade={handleUpgrade}
          trigger={paywallTrigger}
        />
        
        <PricingModal
          isOpen={showPricing}
          onClose={() => setShowPricing(false)}
          onUpgrade={handleUpgrade}
        />
      </div>
    </FreemiumProvider>
  );
};

export default Index;
