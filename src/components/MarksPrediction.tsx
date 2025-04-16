import { useState, useEffect } from "react";
import { useGradeStore } from "@/lib/store";
import { EndtermRequirement, SubjectMarks } from "@/lib/types";
import { calculateRequiredEndTermMarks, getGradeFromPercentage } from "@/lib/gradeUtils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/components/ui/use-toast";

const MarksPrediction = () => {
  const { toast } = useToast();
  const subjects = useGradeStore((state) => state.subjects);
  const subjectMarks = useGradeStore((state) => state.subjectMarks);
  const setSubjectMarks = useGradeStore((state) => state.setSubjectMarks);
  const updateSubjectMark = useGradeStore((state) => state.updateSubjectMark);
  
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Only initialize if there are no existing marks
    if (!initialized && subjects.length > 0 && subjectMarks.length === 0) {
      const initialMarks: SubjectMarks[] = subjects.map((subject) => ({
        subjectName: subject.subjectName,
        credits: subject.credits,
        midtermMarks: 0,
        internalMarks: 0,
        maxMidterm: 30,
        maxInternal: 30,
        maxEndterm: 40,
        targetGrade: subject.requiredGrade,
        requiredEndtermMarks: null,
      }));
      
      setSubjectMarks(initialMarks);
      setInitialized(true);
    }
  }, [subjects, subjectMarks, setSubjectMarks, initialized]);
  
  const handleInputChange = (
    index: number,
    field: keyof SubjectMarks,
    value: string | number
  ) => {
    if (typeof value === "string" && field !== "targetGrade") {
      value = parseFloat(value) || 0;
    }
    
    updateSubjectMark(index, { [field]: value });
  };
  
  const calculateRequired = (index: number) => {
    const subject = subjectMarks[index];
    
    // Validate inputs
    if (subject.midtermMarks > subject.maxMidterm) {
      toast({
        title: "Invalid Marks",
        description: `Midterm marks cannot exceed ${subject.maxMidterm}`,
        variant: "destructive",
      });
      return;
    }
    
    if (subject.internalMarks > subject.maxInternal) {
      toast({
        title: "Invalid Marks",
        description: `Internal marks cannot exceed ${subject.maxInternal}`,
        variant: "destructive",
      });
      return;
    }
    
    // Calculate required end term marks with achievability check
    const result = calculateRequiredEndTermMarks(subject);
    
    updateSubjectMark(index, { requiredEndtermMarks: result });
    
    if (!result.achievable) {
      toast({
        title: "Warning: Grade May Not Be Achievable",
        description: result.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Calculation Complete",
        description: `You need ${Math.round(result.requiredMarks)} marks in the end term to achieve a grade of ${subject.targetGrade} in ${subject.subjectName}. ${result.message}`,
      });
    }
  };
  
  const calculateAll = () => {
    let hasErrors = false;
    
    subjectMarks.forEach((subject, index) => {
      if (subject.midtermMarks > subject.maxMidterm) {
        toast({
          title: "Invalid Marks",
          description: `Midterm marks for ${subject.subjectName} cannot exceed ${subject.maxMidterm}`,
          variant: "destructive",
        });
        hasErrors = true;
      }
      
      if (subject.internalMarks > subject.maxInternal) {
        toast({
          title: "Invalid Marks",
          description: `Internal marks for ${subject.subjectName} cannot exceed ${subject.maxInternal}`,
          variant: "destructive",
        });
        hasErrors = true;
      }
    });
    
    if (hasErrors) return;
    
    // Calculate all subjects
    const updatedMarks = subjectMarks.map((subject) => {
      const result = calculateRequiredEndTermMarks(subject);
      return { ...subject, requiredEndtermMarks: result };
    });
    
    setSubjectMarks(updatedMarks);
    
    toast({
      title: "All Calculations Complete",
      description: "Required end term marks have been calculated for all subjects",
    });
  };
  
  if (subjectMarks.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">No subjects found</h2>
        <p className="text-muted-foreground mt-2">
          Please go to the Dashboard to set up your subjects and target GPA first.
        </p>
      </div>
    );
  }
  
  const getRequiredMarksDisplay = (subject: SubjectMarks) => {
    if (subject.requiredEndtermMarks === null) {
      return null;
    }
    
    if (typeof subject.requiredEndtermMarks === 'number') {
      return Math.round(subject.requiredEndtermMarks);
    }
    
    return Math.round(subject.requiredEndtermMarks.requiredMarks);
  };
  
  const isTargetAchievable = (subject: SubjectMarks) => {
    if (subject.requiredEndtermMarks === null) {
      return true;
    }
    
    if (typeof subject.requiredEndtermMarks === 'number') {
      return subject.requiredEndtermMarks <= subject.maxEndterm;
    }
    
    return subject.requiredEndtermMarks.achievable;
  };
  
  const getAchievabilityMessage = (subject: SubjectMarks) => {
    if (subject.requiredEndtermMarks === null) {
      return "";
    }
    
    if (typeof subject.requiredEndtermMarks === 'number') {
      return subject.requiredEndtermMarks > subject.maxEndterm 
        ? "Note: This target may not be achievable with your current marks."
        : "";
    }
    
    return !subject.requiredEndtermMarks.achievable 
      ? subject.requiredEndtermMarks.message
      : "";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Marks Prediction</h2>
        <Button onClick={calculateAll} className="bg-edu-primary hover:bg-edu-accent">
          Calculate All
        </Button>
      </div>
      
      <div className="space-y-6">
        {subjectMarks.map((subject, index) => (
          <Card key={index} className="border-2 hover:border-edu-accent transition-all duration-300">
            <CardHeader className="bg-edu-light">
              <CardTitle>{subject.subjectName}</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mid Term Marks</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      min="0"
                      value={subject.midtermMarks}
                      onChange={(e) => handleInputChange(index, "midtermMarks", e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <span>out of</span>
                      <Input
                        type="number"
                        min="1"
                        value={subject.maxMidterm}
                        onChange={(e) => handleInputChange(index, "maxMidterm", e.target.value)}
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
                      value={subject.internalMarks}
                      onChange={(e) => handleInputChange(index, "internalMarks", e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <span>out of</span>
                      <Input
                        type="number"
                        min="1"
                        value={subject.maxInternal}
                        onChange={(e) => handleInputChange(index, "maxInternal", e.target.value)}
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
                    value={subject.maxEndterm}
                    onChange={(e) => handleInputChange(index, "maxEndterm", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Target Grade</Label>
                  <Select
                    value={subject.targetGrade}
                    onValueChange={(value) => handleInputChange(index, "targetGrade", value)}
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
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-4">
              <Button 
                onClick={() => calculateRequired(index)} 
                className="w-full bg-edu-primary hover:bg-edu-accent"
              >
                Calculate Required Marks
              </Button>
              
              {subject.requiredEndtermMarks !== null && (
                <div className="p-4 bg-edu-light rounded-md w-full text-center">
                  <p className="font-medium">
                    You need{" "}
                    <span className="text-lg font-bold text-edu-primary">
                      {getRequiredMarksDisplay(subject)}
                    </span>{" "}
                    out of {subject.maxEndterm} marks in the End Term to achieve a{" "}
                    <span className="font-bold">{subject.targetGrade}</span> grade.
                  </p>
                  
                  {!isTargetAchievable(subject) && (
                    <p className="text-destructive mt-2">
                      {getAchievabilityMessage(subject)}
                    </p>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarksPrediction;
