import { FileText, Share, MoreHorizontal, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Left side - Document info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Untitled doc</span>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <Star className="h-4 w-4" />
          Get Pro
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Feedback
        </Button>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </header>
  );
};

export default Header;