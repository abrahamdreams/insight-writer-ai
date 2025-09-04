import { MessageSquare, HelpCircle, AlertTriangle, Target, Book, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Reaction {
  id: string;
  type: 'question' | 'suggestion' | 'concern';
  icon: any;
  number: number;
  text: string;
  category: 'evidence' | 'counterarguments' | 'specificity' | 'implementation' | 'integration';
}

const ReaderReactions = () => {
  const reactions: Reaction[] = [
    {
      id: '1',
      type: 'concern',
      icon: AlertTriangle,
      number: 2,
      text: 'Overlooking potential risks - crucial to avoid negative impacts on performance.',
      category: 'evidence'
    },
    {
      id: '2',
      type: 'suggestion',
      icon: Target,
      number: 3,
      text: 'Integration with other training modalities maximizes athletic potential and career longevity.',
      category: 'integration'
    },
    {
      id: '3',
      type: 'question',
      icon: HelpCircle,
      number: null,
      text: 'Evidence · What empirical studies or data support the claims about weightlifting\'s impact on soccer performance?',
      category: 'evidence'
    },
    {
      id: '4',
      type: 'question',
      icon: HelpCircle,
      number: null,
      text: 'Counterarguments · Are there any drawbacks or controversies regarding weightlifting for soccer players that should be considered?',
      category: 'counterarguments'
    },
    {
      id: '5',
      type: 'question',
      icon: HelpCircle,
      number: null,
      text: 'Specificity · How do weightlifting protocols differ for various positions or levels of soccer athletes?',
      category: 'specificity'
    },
    {
      id: '6',
      type: 'question',
      icon: HelpCircle,
      number: null,
      text: 'Implementation · What are examples of effective weightlifting routines or periodization strategies for soccer players?',
      category: 'implementation'
    }
  ];

  const getReactionColor = (type: string) => {
    switch (type) {
      case 'question': return 'text-blue-600 bg-blue-50';
      case 'suggestion': return 'text-green-600 bg-green-50';
      case 'concern': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="w-80 bg-card border-border h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-lg">Reader Reactions</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Anticipated questions and feedback from academic readers
        </p>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto">
        {reactions.map((reaction) => {
          const Icon = reaction.icon;
          return (
            <div 
              key={reaction.id}
              className={`p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${getReactionColor(reaction.type)}`}
            >
              <div className="flex items-start gap-3">
                {reaction.number && (
                  <Badge variant="secondary" className="text-xs min-w-[20px] h-5 flex items-center justify-center">
                    {reaction.number}
                  </Badge>
                )}
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  {reaction.text}
                </p>
              </div>
            </div>
          );
        })}

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Book className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Professor might ask</span>
          </div>
          
          <div className="space-y-2">
            <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Evidence</span>
              </div>
              <p className="text-xs leading-relaxed">
                What empirical studies or data support the claims about weightlifting's impact on soccer performance?
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReaderReactions;