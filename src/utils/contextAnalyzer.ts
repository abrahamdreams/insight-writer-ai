interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploadedAt: Date;
}

export class ContextAnalyzer {
  static analyzeDocuments(documents: UploadedDocument[]): string {
    if (documents.length === 0) {
      return "No additional context documents provided.";
    }

    const analysis = documents.map(doc => {
      const fileType = this.getFileTypeDescription(doc.type);
      return `- ${doc.name} (${fileType}): Contains contextual information for academic guidance`;
    }).join('\n');

    return `Context from ${documents.length} uploaded document(s):\n${analysis}`;
  }

  static extractKeyRequirements(documents: UploadedDocument[]): string[] {
    const requirements: string[] = [];
    
    documents.forEach(doc => {
      if (doc.name.toLowerCase().includes('rubric') || doc.name.toLowerCase().includes('grading')) {
        requirements.push('Assessment criteria and grading rubric considerations');
      }
      if (doc.name.toLowerCase().includes('assignment') || doc.name.toLowerCase().includes('instruction')) {
        requirements.push('Specific assignment instructions and expectations');
      }
      if (doc.name.toLowerCase().includes('source') || doc.name.toLowerCase().includes('reference')) {
        requirements.push('Required sources and citation guidelines');
      }
      if (doc.name.toLowerCase().includes('note') || doc.name.toLowerCase().includes('feedback')) {
        requirements.push('Teacher notes and feedback integration');
      }
    });

    return requirements.length > 0 ? requirements : ['General academic writing guidelines'];
  }

  static generateContextualPrompt(documents: UploadedDocument[], essayContent: string): string {
    if (documents.length === 0) {
      return `Provide academic feedback on this essay: ${essayContent.substring(0, 500)}...`;
    }

    const context = this.analyzeDocuments(documents);
    const requirements = this.extractKeyRequirements(documents);
    
    return `
    Please provide academic feedback on this essay, considering the following uploaded context materials:
    
    ${context}
    
    Key requirements to address:
    ${requirements.map(req => `- ${req}`).join('\n')}
    
    Essay content: ${essayContent.substring(0, 500)}...
    
    Provide specific, actionable feedback that aligns with the uploaded materials and academic standards.
    `;
  }

  private static getFileTypeDescription(mimeType: string): string {
    switch (mimeType) {
      case 'application/pdf':
        return 'PDF Document';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'Word Document';
      case 'text/plain':
        return 'Text File';
      case 'text/markdown':
        return 'Markdown File';
      default:
        return 'Document';
    }
  }
}