import { Badge } from '@/components/ui/badge';

interface ExpertCommentProps {
  name: string;
  role: string;
  avatar: string;
  color: string;
  suggestion: string;
}

const ExpertComment = ({ name, role, avatar, color, suggestion }: ExpertCommentProps) => {
  return (
    <div className="p-4 bg-card rounded-lg border border-border hover:shadow-sm transition-shadow cursor-pointer">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}>
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{name}</span>
            <Badge variant="outline" className="text-xs">1</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{role}</p>
          <p className="text-sm leading-relaxed">{suggestion}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpertComment;