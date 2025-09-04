import { Crown, Zap, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFreemiumLimits } from '@/hooks/useFreemiumLimits';

interface UsageCounterProps {
  onUpgradeClick: () => void;
}

const UsageCounter = ({ onUpgradeClick }: UsageCounterProps) => {
  const { aiUsesLeft, totalAiUses, isPremium } = useFreemiumLimits();

  if (isPremium) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Crown className="h-3 w-3 mr-1" />
          Premium
        </Badge>
        <span className="text-xs text-muted-foreground">
          {totalAiUses} total uses
        </span>
      </div>
    );
  }

  const isLowUsage = aiUsesLeft <= 2;
  const isOutOfUses = aiUsesLeft === 0;

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isOutOfUses ? "destructive" : isLowUsage ? "secondary" : "outline"}
        className={`${
          isOutOfUses 
            ? 'bg-red-100 text-red-800 border-red-300' 
            : isLowUsage 
              ? 'bg-orange-100 text-orange-800 border-orange-300'
              : 'bg-blue-100 text-blue-800 border-blue-300'
        }`}
      >
        {isOutOfUses ? (
          <AlertTriangle className="h-3 w-3 mr-1" />
        ) : (
          <Zap className="h-3 w-3 mr-1" />
        )}
        {aiUsesLeft} AI uses left
      </Badge>
      
      {(isLowUsage || isOutOfUses) && (
        <Button 
          size="sm" 
          onClick={onUpgradeClick}
          className="h-6 px-2 text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Upgrade
        </Button>
      )}
    </div>
  );
};

export default UsageCounter;