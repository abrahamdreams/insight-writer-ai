import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface VoiceDictationProps {
  onTextReceived: (text: string) => void;
  isEnabled: boolean;
}

const VoiceDictation = ({ onTextReceived, isEnabled }: VoiceDictationProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Voice dictation started",
          description: "Start speaking to dictate your content",
        });
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }

        setTranscript(interimTranscript);
        
        if (finalTranscript) {
          onTextReceived(finalTranscript);
          setTranscript('');
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = 'Speech recognition error occurred';
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone permissions.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again.';
            break;
          case 'network':
            errorMessage = 'Network error occurred during speech recognition.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        toast({
          title: "Voice dictation error",
          description: errorMessage,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
        setTranscript('');
      };
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTextReceived, toast]);

  const startListening = async () => {
    if (!recognitionRef.current || !isSupported) return;

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.start();
    } catch (error) {
      toast({
        title: "Microphone access required",
        description: "Please allow microphone access to use voice dictation",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        disabled
        title="Speech recognition not supported in this browser"
      >
        <MicOff className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isListening ? "default" : "ghost"}
        size="sm"
        className={`h-8 w-8 p-0 ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
        onClick={toggleListening}
        disabled={!isEnabled}
        title={isListening ? "Stop voice dictation" : "Start voice dictation"}
      >
        {isListening ? (
          <Mic className="h-4 w-4 text-white" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      
      {isListening && (
        <div className="flex items-center gap-2">
          <Volume2 className="h-3 w-3 text-red-500 animate-pulse" />
          <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-700">
            Listening...
          </Badge>
        </div>
      )}
      
      {transcript && (
        <div className="max-w-48 truncate">
          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
            "{transcript}"
          </Badge>
        </div>
      )}
    </div>
  );
};

export default VoiceDictation;