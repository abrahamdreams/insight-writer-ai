import { Crown, X, Check, Star, Zap, Upload, Shield, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  isPremium?: boolean;
}

const PricingModal = ({ isOpen, onClose, onUpgrade, isPremium = false }: PricingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-card border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Choose Your Plan</h2>
              <p className="text-muted-foreground">Unlock the full potential of AI-powered academic writing</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Free Plan */}
            <Card className="p-6 border-2 relative">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Free Plan</h3>
                <div className="text-4xl font-bold mb-2">$0</div>
                <p className="text-muted-foreground">Perfect for trying out our platform</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">5 AI Interactions</p>
                    <p className="text-sm text-muted-foreground">Get started with AI-powered suggestions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-100 rounded">
                    <Upload className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">1 Document Upload</p>
                    <p className="text-sm text-muted-foreground">Upload assignment guidelines (up to 10 pages)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-purple-100 rounded">
                    <Check className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Basic Features</p>
                    <p className="text-sm text-muted-foreground">Access to core writing tools</p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                disabled
              >
                Current Plan
              </Button>
            </Card>

            {/* Premium Plan */}
            <Card className="p-6 border-2 border-blue-600 relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
              
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-semibold">Premium Plan</h3>
                </div>
                <div className="text-4xl font-bold mb-2">$9.99</div>
                <p className="text-muted-foreground">per month • Cancel anytime</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Unlimited AI Interactions</p>
                    <p className="text-sm text-muted-foreground">No limits on AI suggestions and feedback</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-100 rounded">
                    <Upload className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Unlimited Document Uploads</p>
                    <p className="text-sm text-muted-foreground">Upload files up to 50MB each</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-purple-100 rounded">
                    <Crown className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Advanced AI Features</p>
                    <p className="text-sm text-muted-foreground">Pro suggestions, citations, and analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-orange-100 rounded">
                    <Shield className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Priority Support</p>
                    <p className="text-sm text-muted-foreground">Get help when you need it most</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-pink-100 rounded">
                    <MessageCircle className="h-4 w-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-medium">Expert Review Panel</p>
                    <p className="text-sm text-muted-foreground">Access to all expert feedback modes</p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={onUpgrade}
                disabled={isPremium}
              >
                {isPremium ? (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Current Plan
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2">What file types are supported?</h4>
                <p className="text-sm text-muted-foreground">
                  We support PDF, DOCX, TXT, and MD files. Premium users can upload larger files and more documents.
                </p>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2">How does the AI help with writing?</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI provides real-time suggestions for citations, thesis improvement, clarity enhancements, and academic structure.
                </p>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2">Is my data secure?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely. Your documents and data are encrypted and never shared with third parties. We prioritize your privacy.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PricingModal;