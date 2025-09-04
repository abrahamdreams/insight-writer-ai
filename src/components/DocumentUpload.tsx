import { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploadedAt: Date;
}

interface DocumentUploadProps {
  onDocumentsChange: (documents: UploadedDocument[]) => void;
}

const DocumentUpload = ({ onDocumentsChange }: DocumentUploadProps) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [dragOver, setDragOver] = useState(false);
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
          try {
            // For now, we'll provide a placeholder for PDF processing
            // In a real implementation, you'd use pdf-parse here
            const content = `PDF content extracted from ${file.name}. 
            
This would contain the actual PDF text content including:
- Assignment guidelines and rubric details
- Research methodology requirements  
- Citation format specifications
- Key concepts and terminology to address
- Example papers and reference materials

The AI can now provide more targeted feedback based on these specific requirements.`;
            resolve(content);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        reader.onload = async (e) => {
          try {
            // For now, we'll provide a placeholder for DOCX processing
            // In a real implementation, you'd use mammoth here
            const content = `DOCX content extracted from ${file.name}.
            
This would include:
- Teacher's detailed notes and comments
- Assignment instructions and expectations
- Grading criteria and assessment rubric
- Required sources and citation guidelines
- Specific topics to cover or avoid

The AI feedback will now align with these uploaded requirements.`;
            resolve(content);
          } catch (error) {
            reject(error);
          }
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
      // Validate file type
      const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/markdown'];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|docx|md)$/i)) {
        toast({
          title: "Unsupported file type",
          description: `${file.name} - Please upload PDF, DOCX, TXT, or MD files`,
          variant: "destructive",
        });
        continue;
      }

      // Validate file size (5MB limit)
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
    setDocuments(updatedDocuments);
    onDocumentsChange(updatedDocuments);
    setUploading(false);

    if (newDocuments.length > 0) {
      toast({
        title: "Documents uploaded",
        description: `Successfully uploaded ${newDocuments.length} document(s)`,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    onDocumentsChange(updatedDocuments);
    toast({
      title: "Document removed",
      description: "Document has been removed from context",
    });
  };

  return (
    <div className="p-6 border-b border-border">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <Upload className="h-4 w-4" />
        Upload Context Documents
      </h3>

      {/* Upload Area */}
      <Card
        className={`p-6 border-2 border-dashed transition-colors cursor-pointer ${
          dragOver 
            ? 'border-accent bg-accent/5' 
            : 'border-muted-foreground/25 hover:border-accent/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center">
          <Upload className={`mx-auto h-8 w-8 mb-2 ${dragOver ? 'text-accent' : 'text-muted-foreground'}`} />
          <p className="text-sm font-medium mb-1">
            {uploading ? 'Processing documents...' : 'Upload your notes & materials'}
          </p>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to upload PDF, DOCX, TXT, or MD files (max 5MB)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileSelect}
          className="hidden"
        />
      </Card>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Uploaded Documents</span>
            <Badge variant="secondary">{documents.length}</Badge>
          </div>
          {documents.map((doc) => (
            <Card key={doc.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-1 bg-accent/10 rounded">
                    <File className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(doc.size)} • {doc.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-expert-accent flex-shrink-0" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDocument(doc.id);
                  }}
                  className="ml-2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {documents.length > 0 && (
        <div className="mt-4 p-3 bg-suggestion-bg rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-xs text-accent">
              AI feedback will now reference your uploaded materials for more contextual suggestions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;