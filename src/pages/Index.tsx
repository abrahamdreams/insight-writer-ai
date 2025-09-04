import { useState, useRef } from 'react';
import Header from '@/components/Header';
import DocumentEditor from '@/components/DocumentEditor';
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
        />
        
        {/* Usage Counter */}
        <div className="px-6 py-2 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <UsageCounter onUpgradeClick={() => setShowPricing(true)} />
          </div>
        </div>
        
        <div className="flex flex-1">
          <DocumentEditor 
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
          <ReaderReactions />
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
