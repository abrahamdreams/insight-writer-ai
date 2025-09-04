import { Crown, Zap, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
      <Card className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500 rounded-full">
            <Crown className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-yellow-900">Premium Plan</h4>
              <Badge variant="secondary" className="bg-yellow-200 text-yellow-800 text-xs">
                Active
              </Badge>
            </div>
            <p className="text-sm text-yellow-700">
              Unlimited AI interactions • {totalAiUses} total uses
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const isLowUsage = aiUsesLeft <= 2;
  const isOutOfUses = aiUsesLeft === 0;

  return (
    <Card className={`p-3 border transition-all ${
      isOutOfUses 
        ? 'bg-red-50 border-red-200' 
        : isLowUsage 
          ? 'bg-orange-50 border-orange-200'
          : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${
          isOutOfUses 
            ? 'bg-red-500' 
            : isLowUsage 
              ? 'bg-orange-500'
              : 'bg-blue-500'
        }`}>
          {isOutOfUses ? (
            <AlertTriangle className="h-4 w-4 text-white" />
          ) : (
            <Zap className="h-4 w-4 text-white" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className={`font-medium ${
              isOutOfUses 
                ? 'text-red-900' 
                : isLowUsage 
                  ? 'text-orange-900'
                  : 'text-blue-900'
            }`}>
              {isOutOfUses ? 'No AI uses left' : `${aiUsesLeft} AI uses left`}
            </h4>
            <Badge variant="secondary" className="text-xs">
              Free Plan
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className={`text-sm ${
              isOutOfUses 
                ? 'text-red-700' 
                : isLowUsage 
                  ? 'text-orange-700'
                  : 'text-blue-700'
            }`}>
              {isOutOfUses 
                ? 'Upgrade to continue using AI features'
                : `${totalAiUses}/5 free uses consumed`
              }
            </p>
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
        </div>
      </div>
    </Card>
  );
};

export default UsageCounter;