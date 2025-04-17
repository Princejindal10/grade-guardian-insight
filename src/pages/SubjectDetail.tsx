
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGradeStore } from "@/lib/store";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateRequiredEndTermMarks } from "@/lib/gradeUtils";
import { EndtermRequirement, StudyAdvice } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Clock, Target } from "lucide-react";

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const student = useGradeStore((state) => state.student);
  const subjectMarks = useGradeStore((state) => state.subjectMarks);
  const updateSubjectMark = useGradeStore((state) => state.updateSubjectMark);
  const studyAdvice = useGradeStore((state) => state.studyAdvice);
  const addStudyAdvice = useGradeStore((state) => state.addStudyAdvice);
  
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [requiredEndTermMarks, setRequiredEndTermMarks] = useState<EndtermRequirement | null>(null);
  const [subjectAdvice, setSubjectAdvice] = useState<StudyAdvice | null>(null);
  const [subjectIndex, setSubjectIndex] = useState<number>(-1);
  
  const getDifficultyLevel = (targetGrade: string): "high" | "medium" | "low" => {
    switch (targetGrade) {
      case 'A+':
      case 'A':
        return 'high';
      case 'B+':
      case 'B':
        return 'medium';
      default:
        return 'low';
    }
  };

  const getEstimatedStudyHours = (targetGrade: string) => {
    switch (targetGrade) {
      case 'A+':
        return 15;
      case 'A':
        return 12;
      case 'B+':
        return 9;
      case 'B':
        return 7;
      default:
        return 5;
    }
  };

  const generateAdvice = (subject: string, targetGrade: string) => {
    const difficultyLevel = getDifficultyLevel(targetGrade);
    const studyHours = getEstimatedStudyHours(targetGrade);
    
    let adviceIntensity = '';
    let extraStrategies = [];
    
    if (difficultyLevel === 'high') {
      adviceIntensity = "To achieve an A+ grade, you'll need exceptional dedication and a comprehensive study approach.";
      extraStrategies = [
        "Create detailed mind maps for complex topics",
        "Practice with previous year papers extensively",
        "Form study groups with high-performing peers",
        "Schedule daily revision sessions",
        "Seek additional guidance from professors"
      ];
    } else if (difficultyLevel === 'medium') {
      adviceIntensity = "For a B grade, maintain consistent study habits and focus on core concepts.";
      extraStrategies = [
        "Regular revision of key topics",
        "Focus on important concepts",
        "Practice sample questions"
      ];
    } else {
      adviceIntensity = "Focus on understanding the fundamental concepts.";
      extraStrategies = [
        "Review basic concepts",
        "Practice essential problems"
      ];
    }

    let advice = "";
    let focusAreas = [];
    let studyStrategies = [];

    switch (subject.toLowerCase()) {
      case "design and analysis of algorithms":
        advice = `${adviceIntensity} For DAA, ${difficultyLevel === 'high' ? 
          "master advanced algorithm analysis and optimization techniques" : 
          "focus on understanding basic algorithm concepts"}`;
        focusAreas = difficultyLevel === 'high' ? [
          "Advanced algorithm analysis",
          "Complex optimization techniques",
          "Time and space complexity proofs",
          "Advanced dynamic programming",
          "Network flow algorithms"
        ] : [
          "Basic sorting algorithms",
          "Simple data structures",
          "Basic complexity analysis"
        ];
        break;
      case "computer networks":
        advice = `${adviceIntensity} For Computer Networks, ${difficultyLevel === 'high' ? 
          "dive deep into protocol specifications and network architectures" : 
          "focus on the fundamental networking concepts"}`;
        focusAreas = difficultyLevel === 'high' ? [
          "Advanced protocol analysis",
          "Network security concepts",
          "Complex routing algorithms",
          "Performance optimization"
        ] : [
          "OSI model layers",
          "Basic routing concepts",
          "Common protocols (TCP/IP)"
        ];
        break;
      case "software engineering":
        advice = `${adviceIntensity} For Software Engineering, ${difficultyLevel === 'high' ? 
          "master advanced design patterns and project management methodologies" : 
          "understand the software development lifecycle"}`;
        focusAreas = difficultyLevel === 'high' ? [
          "Advanced design patterns",
          "Project estimation techniques",
          "Risk management",
          "Software architecture"
        ] : [
          "Basic SDLC models",
          "Requirements gathering",
          "Simple testing methods"
        ];
        break;
      case "cloud computing":
        advice = `${adviceIntensity} For Cloud Computing, ${difficultyLevel === 'high' ? 
          "understand advanced cloud architectures and deployment models" : 
          "grasp the basic cloud service models"}`;
        focusAreas = difficultyLevel === 'high' ? [
          "Advanced cloud security",
          "Multi-cloud strategies",
          "Cost optimization techniques",
          "Cloud design patterns"
        ] : [
          "Basic cloud models (IaaS, PaaS, SaaS)",
          "Simple deployment methods",
          "Cloud providers overview"
        ];
        break;
      default:
        advice = adviceIntensity;
        focusAreas = ["Key concepts", "Basic principles"];
    }

    return {
      subject,
      advice,
      focusAreas,
      studyStrategies: [...studyStrategies, ...extraStrategies],
      difficultyLevel,
      estimatedStudyHours: studyHours
    };
  };
  
  useEffect(() => {
    if (!student) {
      navigate("/");
      return;
    }
    
    if (id === undefined) {
      navigate("/prediction");
      return;
    }
    
    const index = parseInt(id, 10);
    const subject = subjectMarks[index];
    
    if (!subject) {
      navigate("/prediction");
      return;
    }
    
    setSubjectIndex(index);
    setSelectedSubject(subject);
    
    // Calculate required end term marks
    const result = calculateRequiredEndTermMarks(subject);
    setRequiredEndTermMarks(result);
    
    // Find or generate study advice for this subject
    const existingAdvice = studyAdvice.find(a => a.subject === subject.subjectName);
    if (existingAdvice) {
      setSubjectAdvice(existingAdvice);
    } else {
      const newAdvice = generateAdvice(subject.subjectName, subject.targetGrade);
      addStudyAdvice(newAdvice);
      setSubjectAdvice(newAdvice);
    }
  }, [student, id, navigate, subjectMarks, studyAdvice, addStudyAdvice]);
  
  const handleInputChange = (
    field: keyof typeof selectedSubject,
    value: string | number
  ) => {
    if (!selectedSubject || subjectIndex === -1) return;
    
    if (typeof value === "string" && field !== "targetGrade") {
      value = parseFloat(value) || 0;
    }
    
    updateSubjectMark(subjectIndex, { [field]: value });
    
    // Update local state
    setSelectedSubject({
      ...selectedSubject,
      [field]: value
    });
  };
  
  const calculateRequired = () => {
    if (!selectedSubject) return;
    
    // Validate inputs
    if (selectedSubject.midtermMarks > selectedSubject.maxMidterm) {
      toast({
        title: "Invalid Marks",
        description: `Midterm marks cannot exceed ${selectedSubject.maxMidterm}`,
        variant: "destructive",
      });
      return;
    }
    
    if (selectedSubject.internalMarks > selectedSubject.maxInternal) {
      toast({
        title: "Invalid Marks",
        description: `Internal marks cannot exceed ${selectedSubject.maxInternal}`,
        variant: "destructive",
      });
      return;
    }
    
    // Calculate required end term marks with achievability check
    const result = calculateRequiredEndTermMarks(selectedSubject);
    
    updateSubjectMark(subjectIndex, { requiredEndtermMarks: result });
    setRequiredEndTermMarks(result);
    
    // Update the study advice based on the current target grade
    const newAdvice = generateAdvice(selectedSubject.subjectName, selectedSubject.targetGrade);
    addStudyAdvice(newAdvice);
    setSubjectAdvice(newAdvice);
    
    if (!result.achievable) {
      toast({
        title: "Warning: Grade May Not Be Achievable",
        description: result.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Calculation Complete",
        description: `You need ${Math.round(result.requiredMarks)} marks in the end term to achieve a grade of ${selectedSubject.targetGrade}. ${result.message}`,
      });
    }
  };
  
  if (!selectedSubject || !requiredEndTermMarks) return null;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{selectedSubject.subjectName}</h1>
          <p className="text-muted-foreground">
            Detailed breakdown of your subject performance and required marks.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Marks Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mid Term Marks</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      min="0"
                      value={selectedSubject.midtermMarks}
                      onChange={(e) => handleInputChange("midtermMarks", e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <span>out of</span>
                      <Input
                        type="number"
                        min="1"
                        value={selectedSubject.maxMidterm}
                        onChange={(e) => handleInputChange("maxMidterm", e.target.value)}
                        className="w-16"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Internal Marks</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      min="0"
                      value={selectedSubject.internalMarks}
                      onChange={(e) => handleInputChange("internalMarks", e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <span>out of</span>
                      <Input
                        type="number"
                        min="1"
                        value={selectedSubject.maxInternal}
                        onChange={(e) => handleInputChange("maxInternal", e.target.value)}
                        className="w-16"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>End Term Maximum</Label>
                  <Input
                    type="number"
                    min="1"
                    value={selectedSubject.maxEndterm}
                    onChange={(e) => handleInputChange("maxEndterm", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Target Grade</Label>
                  <Select
                    value={selectedSubject.targetGrade}
                    onValueChange={(value) => handleInputChange("targetGrade", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C+">C+</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={calculateRequired} 
                  className="w-full bg-edu-primary hover:bg-edu-accent"
                >
                  Calculate Required Marks
                </Button>
                
                <div className="p-4 bg-edu-light rounded-md w-full text-center mt-4">
                  <p className="font-medium">
                    You need{" "}
                    <span className="text-lg font-bold text-edu-primary">
                      {Math.round(requiredEndTermMarks.requiredMarks)}
                    </span>{" "}
                    out of {selectedSubject.maxEndterm} marks in the End Term to achieve a{" "}
                    <span className="font-bold">{selectedSubject.targetGrade}</span> grade.
                  </p>
                  
                  {!requiredEndTermMarks.achievable && (
                    <p className="text-destructive mt-2">
                      {requiredEndTermMarks.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {subjectAdvice && (
            <Card className={`bg-white shadow-sm ${
              subjectAdvice.difficultyLevel === 'high' ? 'border-l-4 border-l-red-400' :
              subjectAdvice.difficultyLevel === 'medium' ? 'border-l-4 border-l-yellow-400' :
              'border-l-4 border-l-green-400'
            }`}>
              <CardHeader className={`${
                subjectAdvice.difficultyLevel === 'high' ? 'bg-red-50' :
                subjectAdvice.difficultyLevel === 'medium' ? 'bg-yellow-50' :
                'bg-green-50'
              }`}>
                <CardTitle className="text-xl">Study Advice</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>Target: {selectedSubject.targetGrade}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{subjectAdvice.estimatedStudyHours}+ hours/week</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">{subjectAdvice.advice}</p>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-edu-primary flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Focus Areas:
                  </h3>
                  <ul className="list-disc list-inside mt-2">
                    {subjectAdvice.focusAreas.map((area, idx) => (
                      <li key={idx} className="text-sm">{area}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-edu-primary">Study Strategies:</h3>
                  <ul className="list-disc list-inside mt-2">
                    {subjectAdvice.studyStrategies.map((strategy, idx) => (
                      <li key={idx} className="text-sm">{strategy}</li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  onClick={() => navigate("/prediction")}
                  variant="outline"
                  className="mt-6 w-full"
                >
                  Back to All Subjects
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <footer className="bg-edu-dark text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Grade Guardian Insight | Helping students achieve academic excellence</p>
        </div>
      </footer>
    </div>
  );
};

export default SubjectDetail;
