import { useState } from 'react';
import { 
  Target, 
  Smile, 
  Zap, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Eye,
  MessageCircle,
  Star,
  Clock,
  Brain
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface WritingAgent {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'needs-work' | 'critical';
  description: string;
  suggestions: string[];
  color: string;
}

const WritingAgents = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents: WritingAgent[] = [
    {
      id: 'clarity',
      name: 'Clarity',
      icon: Eye,
      score: 85,
      maxScore: 100,
      status: 'good',
      description: 'How clear and understandable your writing is',
      suggestions: [
        'Replace "amalgamation" with "combination" for clarity',
        'Break down the long sentence in paragraph 2',
        'Define technical terms like "trunk stiffness"'
      ],
      color: 'text-blue-500'
    },
    {
      id: 'engagement',
      name: 'Engagement',
      icon: Zap,
      score: 72,
      maxScore: 100,
      status: 'needs-work',
      description: 'How engaging and compelling your writing is',
      suggestions: [
        'Start with a compelling hook or statistic',
        'Add real-world examples of soccer players',
        'Use more vivid, concrete language'
      ],
      color: 'text-orange-500'
    },
    {
      id: 'delivery',
      name: 'Delivery',
      icon: Target,
      score: 90,
      maxScore: 100,
      status: 'excellent',
      description: 'How well you achieve your writing goals',
      suggestions: [
        'Excellent thesis statement',
        'Strong logical flow between paragraphs',
        'Consider adding a counterargument section'
      ],
      color: 'text-green-500'
    },
    {
      id: 'tone',
      name: 'Tone',
      icon: Smile,
      score: 88,
      maxScore: 100,
      status: 'good',
      description: 'Whether your tone matches your audience and purpose',
      suggestions: [
        'Academic tone is appropriate',
        'Maintain formal register throughout',
        'Avoid overly casual phrases'
      ],
      color: 'text-purple-500'
    },
    {
      id: 'correctness',
      name: 'Correctness',
      icon: CheckCircle2,
      score: 94,
      maxScore: 100,
      status: 'excellent',
      description: 'Grammar, spelling, and punctuation accuracy',
      suggestions: [
        'Minor comma splice in paragraph 3',
        'Consider parallel structure in lists',
        'Excellent overall grammar'
      ],
      color: 'text-green-600'
    },
    {
      id: 'citations',
      name: 'Citations',
      icon: BookOpen,
      score: 65,
      maxScore: 100,
      status: 'critical',
      description: 'Proper use of sources and academic citations',
      suggestions: [
        'Add in-text citations for claims',
        'Include a works cited section',
        'Use peer-reviewed sources'
      ],
      color: 'text-red-500'
    },
    {
      id: 'plagiarism',
      name: 'Originality',
      icon: Star,
      score: 98,
      maxScore: 100,
      status: 'excellent',
      description: 'Original content and proper attribution',
      suggestions: [
        'Excellent originality score',
        'No plagiarism detected',
        'Strong personal analysis'
      ],
      color: 'text-blue-600'
    },
    {
      id: 'readability',
      name: 'Readability',
      icon: Users,
      score: 78,
      maxScore: 100,
      status: 'good',
      description: 'How easy your text is to read and understand',
      suggestions: [
        'Vary sentence length for better flow',
        'Use transition words between ideas',
        'Consider shorter paragraphs'
      ],
      color: 'text-indigo-500'
    },
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      icon: Brain,
      score: 82,
      maxScore: 100,
      status: 'good',
      description: 'Appropriate word choice and variety',
      suggestions: [
        'Good academic vocabulary usage',
        'Avoid repetitive word choices',
        'Use more precise verbs'
      ],
      color: 'text-cyan-500'
    },
    {
      id: 'fluency',
      name: 'Fluency',
      icon: TrendingUp,
      score: 86,
      maxScore: 100,
      status: 'good',
      description: 'Smooth flow and natural rhythm',
      suggestions: [
        'Good sentence variety',
        'Improve transitions between paragraphs',
        'Strong overall flow'
      ],
      color: 'text-emerald-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'needs-work': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle2 className="h-3 w-3" />;
      case 'good': return <CheckCircle2 className="h-3 w-3" />;
      case 'needs-work': return <AlertTriangle className="h-3 w-3" />;
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 border-b border-border">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <Brain className="h-4 w-4" />
        Writing Assistants
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {agents.map((agent) => (
          <Card 
            key={agent.id}
            className={`p-3 cursor-pointer transition-all border ${
              selectedAgent === agent.id 
                ? 'ring-2 ring-accent shadow-md' 
                : 'hover:shadow-sm'
            }`}
            onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <agent.icon className={`h-4 w-4 ${agent.color}`} />
                <span className="text-sm font-medium">{agent.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold">{agent.score}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-1 py-0 h-5 ${getStatusColor(agent.status)}`}
                >
                  {getStatusIcon(agent.status)}
                </Badge>
              </div>
            </div>
            <Progress 
              value={agent.score} 
              className="h-1.5" 
            />
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      {selectedAgent && (
        <Card className="p-4 bg-muted/30">
          {(() => {
            const agent = agents.find(a => a.id === selectedAgent);
            if (!agent) return null;
            
            return (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <agent.icon className={`h-5 w-5 ${agent.color}`} />
                    <h4 className="font-semibold">{agent.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(agent.status)}`}
                    >
                      {getStatusIcon(agent.status)}
                      {agent.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold">
                    {agent.score}/{agent.maxScore}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {agent.description}
                </p>
                
                <div>
                  <h5 className="text-sm font-medium mb-2">Suggestions:</h5>
                  <ul className="space-y-1">
                    {agent.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </Card>
      )}
      
      {/* Overall Score */}
      <Card className="p-4 mt-4 bg-accent/5 border-accent/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-accent">Overall Writing Score</h4>
            <p className="text-sm text-muted-foreground">Based on all writing assistants</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">
              {Math.round(agents.reduce((sum, agent) => sum + agent.score, 0) / agents.length)}
            </div>
            <p className="text-xs text-muted-foreground">out of 100</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WritingAgents;