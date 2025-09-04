import { useState, useRef } from 'react';
import { Upload, File, X, ChevronDown, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFreemiumLimits } from '@/hooks/useFreemiumLimits';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploadedAt: Date;
}

interface ExpertReviewDocumentUploadProps {
  documents: UploadedDocument[];
  onDocumentsChange: (documents: UploadedDocument[]) => void;
  onPaywallTrigger?: (trigger: 'ai-limit' | 'document-limit') => void;
}

const ExpertReviewDocumentUpload = ({ documents, onDocumentsChange, onPaywallTrigger }: ExpertReviewDocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isPremium } = useFreemiumLimits();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      if (file.type === 'text/plain' || file.type === 'text/markdown') {
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        reader.onload = async (e) => {
          const content = `PDF content extracted from ${file.name}. This would contain assignment guidelines, rubric details, and research requirements.`;
          resolve(content);
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        reader.onload = async (e) => {
          const content = `DOCX content extracted from ${file.name}. This would include teacher's notes, assignment instructions, and grading criteria.`;
          resolve(content);
        };
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('Unsupported file type'));
      }
    });
  };

  const handleFiles = async (files: FileList) => {
    // Check freemium limits for document uploads
    if (!isPremium && documents.length >= 1) {
      onPaywallTrigger?.('document-limit');
      return;
    }

    setUploading(true);
    const newDocuments: UploadedDocument[] = [];

    for (const file of Array.from(files)) {
      const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/markdown'];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|docx|md)$/i)) {
        toast({
          title: "Unsupported file type",
          description: `${file.name} - Please upload PDF, DOCX, TXT, or MD files`,
          variant: "destructive",
        });
        continue;
      }

      // Validate file size (Free: 5MB, Premium: 50MB)
      const maxSize = isPremium ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      const sizeLabel = isPremium ? '50MB' : '5MB';
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} - Maximum file size is ${sizeLabel}`,
          variant: "destructive",
        });
        continue;
      }

      try {
        const content = await extractTextFromFile(file);
        const document: UploadedDocument = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          content,
          uploadedAt: new Date(),
        };
        newDocuments.push(document);
      } catch (error) {
        toast({
          title: "Upload failed",
          description: `Failed to process ${file.name}`,
          variant: "destructive",
        });
      }
    }

    const updatedDocuments = [...documents, ...newDocuments];
    onDocumentsChange(updatedDocuments);
    setUploading(false);

    if (newDocuments.length > 0) {
      toast({
        title: "Documents uploaded",
        description: `Successfully uploaded ${newDocuments.length} document(s)`,
      });
      setIsOpen(true); // Expand to show uploaded docs
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    onDocumentsChange(updatedDocuments);
    toast({
      title: "Document removed",
      description: "Document has been removed from context",
    });
  };

  return (
    <div className="p-4 border-b border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="font-medium">Upload docs</span>
              {documents.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 text-xs">
                  {documents.length}
                </Badge>
              )}
              {!isPremium && (
                <Badge variant="outline" className="ml-1 h-5 text-xs border-orange-300 text-orange-600">
                  {documents.length}/1
                </Badge>
              )}
              {isPremium && (
                <Crown className="h-3 w-3 text-yellow-500" />
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
              </Button>
            </CollapsibleTrigger>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Processing...' : 'Choose Files'}
          </Button>
        </div>

        <CollapsibleContent className="mt-3">
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {isPremium 
                ? 'Upload assignment guidelines, rubrics, or reference materials (up to 50MB each)'
                : 'Upload 1 document up to 10 pages (5MB max) • Upgrade for unlimited uploads'
              }
            </p>

            {/* Uploaded Documents */}
            {documents.length > 0 && (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <Card key={doc.id} className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(doc.size)} • {doc.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {documents.length > 0 && (
              <div className={`p-2 rounded text-xs ${isPremium 
                ? 'bg-accent/10 text-accent' 
                : 'bg-orange-50 text-orange-600 border border-orange-200'
              }`}>
                {isPremium 
                  ? 'AI feedback will reference your uploaded materials'
                  : `Free plan: ${documents.length}/1 documents used • Upgrade for unlimited uploads`
                }
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ExpertReviewDocumentUpload;