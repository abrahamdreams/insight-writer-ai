import { useState } from 'react';
import { GraduationCap, TrendingUp, X, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface GradePrediction {
  score: number;
  feedback: string;
  categories: Array<{
    name: string;
    score: number;
    checked: boolean;
  }>;
  instructor: {
    name: string;
    initials: string;
  };
}

interface AIGraderProps {
  essayContent: string;
}

const AIGrader = ({ essayContent }: AIGraderProps) => {
  const [showGrader, setShowGrader] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [prediction, setPrediction] = useState<GradePrediction | null>(null);
  const [instructorName, setInstructorName] = useState('');
  const [school, setSchool] = useState('');
  const [className, setClassName] = useState('');
  const [rubricText, setRubricText] = useState('');
  const [predicting, setPredicting] = useState(false);
  const { toast } = useToast();

  const predictGrade = async () => {
    setPredicting(true);
    
    // Simulate AI grade prediction
    setTimeout(() => {
      const mockPrediction: GradePrediction = {
        score: Math.floor(Math.random() * 15) + 80, // 80-95 range
        feedback: "Good news! You're on the right track—focus on making your argument more specific and well-supported.",
        categories: [
          { name: "Clarity & structure", score: 4, checked: true },
          { name: "Evidence quality", score: 2, checked: false },
          { name: "Argument strength", score: 3, checked: false },
          { name: "Citation format", score: 4, checked: false },
          { name: "Grammar & style", score: 5, checked: false },
        ],
        instructor: {
          name: instructorName || "Prof. Farnsworth",
          initials: instructorName ? instructorName.split(' ').map(n => n[0]).join('').toUpperCase() : "PF"
        }
      };
      
      setPrediction(mockPrediction);
      setPredicting(false);
      setShowSetup(false);
      setShowGrader(true);
      
      toast({
        title: "Grade predicted",
        description: `Predicted score: ${mockPrediction.score}/100`,
      });
    }, 2000);
  };

  const setupForm = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="instructor">Instructor name</Label>
        <Input
          id="instructor"
          value={instructorName}
          onChange={(e) => setInstructorName(e.target.value)}
          placeholder="Ex. Jane Li"
          className="mt-1"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="school">School</Label>
          <Input
            id="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Ex. MIT"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="class">Class</Label>
          <Input
            id="class"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Ex. GEOG 215"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label>Upload rubric or assignment guidelines</Label>
        <p className="text-sm text-muted-foreground mb-3">TXT, DOC(X), or PDF up to 10 MB.</p>
        
        <Button variant="outline" className="w-full mb-3">
          <Upload className="h-4 w-4 mr-2" />
          Upload file
        </Button>
        
        <div className="text-center text-sm text-muted-foreground mb-3">
          Don't have a file? <span className="text-accent underline cursor-pointer">Paste text instead</span>
        </div>
        
        <Textarea
          value={rubricText}
          onChange={(e) => setRubricText(e.target.value)}
          placeholder="Paste your rubric or assignment guidelines here..."
          className="min-h-24"
        />
      </div>
    </div>
  );

  return (
    <>
      <Button 
        onClick={() => setShowSetup(true)}
        className="gap-2 bg-expert-accent hover:bg-expert-accent/90"
      >
        <GraduationCap className="h-4 w-4" />
        AI Grader
      </Button>

      {/* Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-expert-accent" />
              Add rubric and instructor
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              AI Grader will give feedback tailored to the assignment you provide.
            </p>
          </DialogHeader>
          
          {setupForm()}
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={predictGrade}
              disabled={predicting}
              className="flex-1 bg-expert-accent hover:bg-expert-accent/90"
            >
              {predicting ? "Predicting..." : "Predict your grade"}
            </Button>
            <Button variant="outline" onClick={() => setShowSetup(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Grade Prediction Dialog */}
      <Dialog open={showGrader} onOpenChange={setShowGrader}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-expert-accent" />
              AI Grader
            </DialogTitle>
          </DialogHeader>

          {prediction && (
            <div className="space-y-6">
              <Card className="p-6 bg-suggestion-bg">
                <h3 className="text-lg font-semibold mb-4">
                  Before you turn it in, predict your instructor's feedback
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Predicted grade</span>
                    <div className="text-2xl font-bold">
                      {prediction.score} <span className="text-muted-foreground font-normal">/ 100</span>
                    </div>
                  </div>
                  
                  <Progress value={prediction.score} className="h-3" />
                  
                  <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                    <div className="w-10 h-10 bg-expert-accent rounded-full flex items-center justify-center text-white font-medium">
                      {prediction.instructor.initials}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">
                        {prediction.instructor.name} may say:
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Based on your assignment info.
                      </p>
                      <p className="text-sm">{prediction.feedback}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Filter by category</p>
                    <div className="space-y-2">
                      {prediction.categories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded border-2 ${category.checked ? 'bg-expert-accent border-expert-accent' : 'border-muted-foreground'}`}>
                              {category.checked && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />}
                            </div>
                            <span className="text-sm">{category.name}</span>
                          </div>
                          <Badge variant="secondary">{category.score}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Add your rubric and instructor to get feedback specific to your assignment.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                      setShowGrader(false);
                      setShowSetup(true);
                    }}
                    className="flex-1 bg-expert-accent hover:bg-expert-accent/90"
                  >
                    Add rubric and instructor
                  </Button>
                  <Button variant="outline" onClick={() => setShowGrader(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIGrader;