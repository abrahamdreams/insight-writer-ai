import { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploadedAt: Date;
}

interface HeaderDocumentUploadProps {
  documents: UploadedDocument[];
  onDocumentsChange: (documents: UploadedDocument[]) => void;
}

const HeaderDocumentUpload = ({ documents, onDocumentsChange }: HeaderDocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} - Maximum file size is 5MB`,
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 relative">
          <Upload className="h-4 w-4" />
          Upload docs
          {documents.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 text-xs">
              {documents.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Upload Context Documents</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Upload assignment guidelines, rubrics, or reference materials
            </p>
          </div>

          {/* Upload Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Processing...' : 'Choose Files'}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.md"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Uploaded Documents */}
          {documents.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploaded</span>
                <Badge variant="secondary">{documents.length}</Badge>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <File className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{doc.name}</p>
                        <p className="text-muted-foreground">{formatFileSize(doc.size)}</p>
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
                ))}
              </div>
            </div>
          )}

          {documents.length > 0 && (
            <div className="p-2 bg-accent/10 rounded text-xs text-accent">
              AI feedback will reference your uploaded materials
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HeaderDocumentUpload;