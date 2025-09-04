import { useState } from 'react';
import { Search, CheckCircle2, AlertCircle, XCircle, ExternalLink, Copy, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Claim {
  id: string;
  text: string;
  type: 'supported' | 'debated' | 'contradicted';
  position: { start: number; end: number };
  sources?: Source[];
}

interface Source {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  citationAPA: string;
  citationMLA: string;
}

const CitationFinder = () => {
  const [claims] = useState<Claim[]>([
    {
      id: '1',
      text: 'Weightlifting improves muscular strength and power',
      type: 'supported',
      position: { start: 450, end: 502 },
      sources: [
        {
          id: 's1',
          title: 'Effects of resistance training on the physical capacities of adolescent soccer players',
          url: 'https://pubmed.ncbi.nlm.nih.gov/17194231/',
          domain: 'pubmed.ncbi.nlm.nih.gov',
          snippet: 'The study found that a combined heavy-resistance and running-speed training program significantly improved strength, running velocity, and vertical-jump performance in soccer players.',
          citationAPA: 'Christou, M., Smilios, I., Sotiropoulos, K., Volaklis, K., Pilianidis, T., & Tokmakidis, S. P. (2006). Effects of resistance training on the physical capacities of adolescent soccer players. Journal of Strength and Conditioning Research, 20(4), 783-791.',
          citationMLA: 'Christou, Marios, et al. "Effects of resistance training on the physical capacities of adolescent soccer players." Journal of Strength and Conditioning Research 20.4 (2006): 783-791.'
        },
        {
          id: 's2',
          title: 'Strength training adaptations in soccer players',
          url: 'https://researchgate.net/publication/123456789',
          domain: 'researchgate.net',
          snippet: 'Research demonstrates that resistance training protocols enhance power output and muscular strength in competitive soccer athletes.',
          citationAPA: 'Silva, J. R., Nassis, G. P., & Rebelo, A. (2015). Strength training adaptations in soccer players. Sports Medicine, 45(9), 1255-1273.',
          citationMLA: 'Silva, João R., et al. "Strength training adaptations in soccer players." Sports Medicine 45.9 (2015): 1255-1273.'
        }
      ]
    },
    {
      id: '2',
      text: 'manifest as accelerated sprinting, superior vertical jumps',
      type: 'supported',
      position: { start: 510, end: 565 },
      sources: []
    },
    {
      id: '3',
      text: 'Strength training increases the resilience of muscles, ligaments, and tendons',
      type: 'supported',
      position: { start: 890, end: 970 },
      sources: []
    },
    {
      id: '4',
      text: 'reducing the likelihood of strains, tears, and other musculoskeletal injuries',
      type: 'supported',
      position: { start: 972, end: 1048 },
      sources: []
    },
    {
      id: '5',
      text: 'improving core stability through weightlifting enhances trunk stiffness',
      type: 'supported',
      position: { start: 1200, end: 1270 },
      sources: []
    },
    {
      id: '6',
      text: 'Enhanced lower body strength contributes to more powerful kicks',
      type: 'supported',
      position: { start: 1650, end: 1710 },
      sources: []
    },
    {
      id: '7',
      text: 'allowing for better ball control and more precise movements',
      type: 'supported',
      position: { start: 1850, end: 1910 },
      sources: []
    },
    {
      id: '8',
      text: 'improved core stability aids in balance and coordination',
      type: 'supported',
      position: { start: 1920, end: 1975 },
      sources: []
    }
  ]);

  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [citationStyle, setCitationStyle] = useState<'APA' | 'MLA'>('APA');
  const [showSourceDialog, setShowSourceDialog] = useState(false);
  const { toast } = useToast();

  const supportedCount = claims.filter(c => c.type === 'supported').length;
  const debatedCount = claims.filter(c => c.type === 'debated').length;
  const contradictedCount = claims.filter(c => c.type === 'contradicted').length;
  const citedCount = 0; // Mock for now

  const getClaimIcon = (type: string) => {
    switch (type) {
      case 'supported': return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'debated': return <AlertCircle className="h-3 w-3 text-orange-500" />;
      case 'contradicted': return <XCircle className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

  const insertCitation = (source: Source) => {
    // Mock citation insertion
    toast({
      title: "Citation inserted",
      description: "In-text citation has been added to your document",
    });
    setShowSourceDialog(false);
  };

  const copyCitation = (source: Source) => {
    const citation = citationStyle === 'APA' ? source.citationAPA : source.citationMLA;
    navigator.clipboard.writeText(citation);
    toast({
      title: "Citation copied",
      description: "Full citation copied to clipboard",
    });
  };

  const openSourceDialog = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowSourceDialog(true);
  };

  return (
    <>
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Search className="h-3 w-3 text-expert-accent" />
          Citation Finder
        </h3>
        
        <p className="text-xs text-muted-foreground mb-4">
          I found claims that may need citations plus potential sources. Check the claims and sources for accuracy.
        </p>

        <div className="space-y-3">
          {/* Citation Stats */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Claims cited</span>
            <span className="font-bold">{citedCount} / {claims.length}</span>
          </div>

          {/* Claims to Cite */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Claims to cite</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-xs">All claims</span>
                <Badge variant="secondary" className="text-xs">{claims.length}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 hover:bg-muted/30 rounded cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs">Supported</span>
                </div>
                <Badge variant="secondary" className="text-xs">{supportedCount}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 hover:bg-muted/30 rounded cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span className="text-xs">Debated</span>
                </div>
                <Badge variant="secondary" className="text-xs">{debatedCount}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 hover:bg-muted/30 rounded cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-xs">Contradicted</span>
                </div>
                <Badge variant="secondary" className="text-xs">{contradictedCount}</Badge>
              </div>
            </div>
          </div>

          {/* Sample Claims */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Recent claims</h4>
            <div className="space-y-1">
              {claims.slice(0, 3).map((claim) => (
                <div 
                  key={claim.id}
                  className="p-2 bg-card border rounded text-xs hover:shadow-sm cursor-pointer"
                  onClick={() => claim.sources && claim.sources.length > 0 && openSourceDialog(claim)}
                >
                  <div className="flex items-start gap-2">
                    {getClaimIcon(claim.type)}
                    <span className="flex-1 text-muted-foreground leading-relaxed">
                      {claim.text.length > 50 ? `${claim.text.substring(0, 50)}...` : claim.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citation Style */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Citation style</h4>
            <Select value={citationStyle} onValueChange={(value: 'APA' | 'MLA') => setCitationStyle(value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APA">APA</SelectItem>
                <SelectItem value="MLA">MLA</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
                <SelectItem value="Harvard">Harvard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Source Dialog */}
      <Dialog open={showSourceDialog} onOpenChange={setShowSourceDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-sm flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 rounded text-accent">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-xs font-medium">Supported claim</span>
                  </div>
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  All sources report that weightlifting or resistance training improves muscular strength, power, sprinting, vertical jump, and body control, directly supporting the claim.
                </p>
              </div>
            </div>
          </DialogHeader>

          {selectedClaim?.sources && selectedClaim.sources.length > 0 && (
            <div className="space-y-4">
              {/* Source Pills */}
              <div className="flex flex-wrap gap-2">
                {selectedClaim.sources.map((source) => (
                  <Badge key={source.id} variant="outline" className="text-xs">
                    {source.domain}
                  </Badge>
                ))}
              </div>

              {/* Main Source */}
              <Card className="p-4 border-accent/20 bg-accent/5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge className="bg-expert-accent text-white text-xs px-2 py-1">
                      Supported
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-1">
                      {selectedClaim.sources[0].title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {selectedClaim.sources[0].snippet}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => insertCitation(selectedClaim.sources![0])}
                      className="bg-expert-accent hover:bg-expert-accent/90 text-xs h-8"
                    >
                      Insert in-text citation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm" 
                      onClick={() => copyCitation(selectedClaim.sources![0])}
                      className="text-xs h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy full citation
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSourceDialog(false)}
                      className="text-xs h-8"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CitationFinder;