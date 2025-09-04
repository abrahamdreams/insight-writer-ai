import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { FileText, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIGrader from './AIGrader';
import VoiceDictation from './VoiceDictation';

interface DocumentEditorProps {
  onContentChange?: (content: string, cursorPosition: number) => void;
}

interface DocumentEditorRef {
  getContent: () => string;
  getCursorPosition: () => number;
  insertText: (text: string) => void;
  insertWithHighlight: (text: string) => void;
  focusAtPosition: (position: number) => void;
}

const DocumentEditor = forwardRef<DocumentEditorRef, DocumentEditorProps>(({ onContentChange }, ref) => {
  const [title, setTitle] = useState("The Effects of Weightlifting on Performance Athletes in Soccer");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showHighlight, setShowHighlight] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState({ start: 0, end: 0 });
  const [content, setContent] = useState(`Introduction

Soccer is a sport that necessitates a unique amalgamation of endurance, speed, agility, and strength. As the game has evolved, training methodologies have similarly advanced, with weightlifting emerging as an increasingly integral component in the development of elite soccer athletes. This essay examines the effects of weightlifting on performance athletes in soccer, analyzing its impact on physical capabilities, injury prevention, and on-field performance.

Physical Benefits of Weightlifting

A principal effect of weightlifting for soccer players is the enhancement of physical attributes requisite for high-level performance. Weightlifting improves muscular strength and power, which manifest as accelerated sprinting, superior vertical jumps, and refined body control. Compound movements, including squats, deadlifts, and lunges, target essential muscle groups utilized in soccer, thereby strengthening the lower body and core. Increased strength is particularly advantageous during tackles, aerial duels, and when shielding the ball from opponents.

Injury Prevention and Longevity

Weightlifting not only enhances performance but also contributes to injury prevention. Strength training increases the resilience of muscles, ligaments, and tendons, reducing the likelihood of strains, tears, and other musculoskeletal injuries. A well-structured weightlifting program can address muscular imbalances and improve joint stability, which are common sources of injury in soccer players. Crucially, improving core stability through weightlifting enhances trunk stiffness, which plays a vital role in shielding the spine from excessive shear forces often encountered during cutting maneuvers. By mitigating these biomechanical risks, athletes who incorporate weightlifting into their routine often experience improved durability and longer careers.

Improved On-Field Performance

The translation of gym gains to the soccer pitch is evident in various aspects of play. Increased strength and power allow players to accelerate more rapidly, maintain higher running speeds, and execute explosive movements such as jumping for headers or making quick directional changes. Enhanced lower body strength contributes to more powerful kicks, enabling players to strike the ball with greater force and accuracy. Additionally, improved core stability aids in balance and coordination, allowing for better ball control and more precise movements during complex soccer-specific actions.`);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const formatOptions = [
    { icon: Bold, label: 'Bold' },
    { icon: Italic, label: 'Italic' },
    { icon: Underline, label: 'Underline' },
    { icon: AlignLeft, label: 'Align Left' },
    { icon: AlignCenter, label: 'Align Center' },
    { icon: AlignRight, label: 'Align Right' }
  ];

  const handleVoiceText = (text: string) => {
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      setContent(newContent);
      setCursorPosition(start + text.length);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.setSelectionRange(start + text.length, start + text.length);
        textarea.focus();
      }, 0);
    } else {
      // Fallback: append to end
      setContent(prev => prev + text);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const newCursorPosition = e.target.selectionStart;
    setContent(newContent);
    setCursorPosition(newCursorPosition);
    onContentChange?.(newContent, newCursorPosition);
  };

  const handleInsertText = (text: string) => {
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      setContent(newContent);
      setCursorPosition(start + text.length);
      onContentChange?.(newContent, start + text.length);
      
      setTimeout(() => {
        textarea.setSelectionRange(start + text.length, start + text.length);
        textarea.focus();
      }, 0);
    }
  };

  const handleInsertWithHighlight = (text: string) => {
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      setContent(newContent);
      setCursorPosition(start + text.length);
      onContentChange?.(newContent, start + text.length);
      
      // Show highlight effect for inserted text
      setHighlightPosition({ start, end: start + text.length });
      setShowHighlight(true);
      setTimeout(() => setShowHighlight(false), 2000);
      
      setTimeout(() => {
        textarea.setSelectionRange(start + text.length, start + text.length);
        textarea.focus();
      }, 0);
    }
  };

  const handleFocusAtPosition = (position: number) => {
    const textarea = contentRef.current;
    if (textarea) {
      // Focus the textarea and set cursor position
      textarea.focus();
      textarea.setSelectionRange(position, position);
      setCursorPosition(position);
      
      // Highlight area around the position (±50characters for context)
      const contextStart = Math.max(0, position - 50);
      const contextEnd = Math.min(content.length, position + 50);
      setHighlightPosition({ start: contextStart, end: contextEnd });
      setShowHighlight(true);
      
      // Remove highlight after 3 seconds
      setTimeout(() => setShowHighlight(false), 3000);
      
      // Scroll to position - improved scrolling logic
      const lines = content.substring(0, position).split('\n').length;
      const lineHeight = 28; // More accurate line height
      const scrollTop = Math.max(0, (lines - 5) * lineHeight); // Show 5 lines above for context
      textarea.scrollTop = scrollTop;
      
      console.log(`Highlighted position ${position}, context: ${contextStart}-${contextEnd}, lines: ${lines}`);
    }
  };

  useImperativeHandle(ref, () => ({
    getContent: () => content,
    getCursorPosition: () => cursorPosition,
    insertText: handleInsertText,
    insertWithHighlight: handleInsertWithHighlight,
    focusAtPosition: handleFocusAtPosition
  }));

  useEffect(() => {
    // Initial content sync
    onContentChange?.(content, cursorPosition);
  }, []);

  return (
    <div className="flex-1 bg-editor-bg min-h-screen">
      <div className="max-w-4xl mx-auto p-8">
        {/* Document Header */}
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-6 w-6 text-accent" />
          <span className="text-muted-foreground">Untitled doc</span>
        </div>

        {/* Document Container */}
        <div className="bg-card rounded-lg shadow-[var(--document-shadow)] min-h-[800px]">
          {/* Toolbar */}
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {formatOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-muted"
                  >
                    <option.icon className="h-4 w-4" />
                  </Button>
                ))}
                
                <div className="h-6 w-px bg-border mx-2" />
                
                <VoiceDictation 
                  onTextReceived={handleVoiceText}
                  isEnabled={true}
                />
              </div>
              
              <AIGrader essayContent={content} />
            </div>
          </div>

          {/* Document Content */}
          <div className="p-12">
            {/* Title */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold mb-8 bg-transparent border-none outline-none resize-none"
              placeholder="Document title..."
            />

            {/* Content */}
            <textarea
              ref={contentRef}
              value={content}
              onChange={handleContentChange}
              onSelect={(e) => {
                const newCursorPosition = (e.target as HTMLTextAreaElement).selectionStart;
                setCursorPosition(newCursorPosition);
                onContentChange?.(content, newCursorPosition);
              }}
              className={`w-full min-h-[600px] bg-transparent border-none outline-none resize-none leading-relaxed text-foreground font-[400] text-base tracking-wide transition-all duration-500 ${
                showHighlight ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
              }`}
              placeholder="Start writing your document..."
              style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif',
                background: showHighlight ? 
                  `linear-gradient(to right, 
                    transparent 0%, 
                    transparent ${Math.max(0, (highlightPosition.start / Math.max(content.length, 1)) * 100)}%, 
                    rgba(59, 130, 246, 0.15) ${Math.max(0, (highlightPosition.start / Math.max(content.length, 1)) * 100)}%, 
                    rgba(59, 130, 246, 0.15) ${Math.min(100, (highlightPosition.end / Math.max(content.length, 1)) * 100)}%, 
                    transparent ${Math.min(100, (highlightPosition.end / Math.max(content.length, 1)) * 100)}%, 
                    transparent 100%)` : 'transparent'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default DocumentEditor;