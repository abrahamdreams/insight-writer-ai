import { useState, useEffect, createContext, useContext } from 'react';

interface FreemiumContextType {
  aiUsesLeft: number;
  totalAiUses: number;
  documentsUploaded: number;
  isPremium: boolean;
  useAiInteraction: () => boolean;
  resetUsage: () => void;
  upgradeToPremium: () => void;
}

const FreemiumContext = createContext<FreemiumContextType | undefined>(undefined);

export const FreemiumProvider = ({ children }: { children: React.ReactNode }) => {
  const [aiUsesLeft, setAiUsesLeft] = useState(5);
  const [totalAiUses, setTotalAiUses] = useState(0);
  const [documentsUploaded, setDocumentsUploaded] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('freemium-data');
    if (saved) {
      const data = JSON.parse(saved);
      setAiUsesLeft(data.aiUsesLeft || 5);
      setTotalAiUses(data.totalAiUses || 0);
      setDocumentsUploaded(data.documentsUploaded || 0);
      setIsPremium(data.isPremium || false);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const data = {
      aiUsesLeft,
      totalAiUses,
      documentsUploaded,
      isPremium
    };
    localStorage.setItem('freemium-data', JSON.stringify(data));
  }, [aiUsesLeft, totalAiUses, documentsUploaded, isPremium]);

  const useAiInteraction = () => {
    if (isPremium) return true;
    
    if (aiUsesLeft > 0) {
      setAiUsesLeft(prev => prev - 1);
      setTotalAiUses(prev => prev + 1);
      return true;
    }
    return false;
  };

  const resetUsage = () => {
    setAiUsesLeft(5);
    setTotalAiUses(0);
    setDocumentsUploaded(0);
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
  };

  return (
    <FreemiumContext.Provider value={{
      aiUsesLeft,
      totalAiUses,
      documentsUploaded,
      isPremium,
      useAiInteraction,
      resetUsage,
      upgradeToPremium
    }}>
      {children}
    </FreemiumContext.Provider>
  );
};

export const useFreemiumLimits = () => {
  const context = useContext(FreemiumContext);
  if (!context) {
    throw new Error('useFreemiumLimits must be used within FreemiumProvider');
  }
  return context;
};