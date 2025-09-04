import { Crown, X, Check, Zap, Upload, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  trigger: 'ai-limit' | 'document-limit';
}

const PaywallModal = ({ isOpen, onClose, onUpgrade, trigger }: PaywallModalProps) => {
  if (!isOpen) return null;

  const getModalContent = () => {
    if (trigger === 'ai-limit') {
      return {
        icon: <Zap className="h-6 w-6 text-white" />,
        title: "You've reached your AI interaction limit",
        description: "You've used all 5 free AI suggestions. Upgrade to Premium for unlimited access to our intelligent writing assistant.",
        feature: "AI Suggestions"
      };
    } else {
      return {
        icon: <Upload className="h-6 w-6 text-white" />,
        title: "Document upload limit reached",
        description: "Free users can upload 1 document (up to 10 pages). Upgrade to Premium for unlimited document uploads and larger file sizes.",
        feature: "Document Uploads"
      };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                {content.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold">Upgrade to Premium</h2>
                <p className="text-sm text-muted-foreground">Unlock unlimited access</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Free Plan */}
            <Card className="p-4 border-2">
              <div className="text-center mb-4">
                <h4 className="font-semibold">Free Plan</h4>
                <div className="text-2xl font-bold">$0</div>
                <p className="text-sm text-muted-foreground">Limited features</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>5 AI interactions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>1 document upload</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Up to 10 pages per doc</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span>No priority support</span>
                </div>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="p-4 border-2 border-blue-600 relative">
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600">
                Recommended
              </Badge>
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <h4 className="font-semibold">Premium Plan</h4>
                </div>
                <div className="text-2xl font-bold">$9.99</div>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Unlimited AI interactions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Unlimited document uploads</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Files up to 50MB</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Priority support</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Advanced AI features</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 bg-muted/20 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Maybe later
          </Button>
          <div className="flex gap-2">
            <Button 
              onClick={onUpgrade}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaywallModal;