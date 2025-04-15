import { useState } from "react";
import { useGradeStore } from "@/lib/store";
import { calculateRequiredGrades } from "@/lib/gradeUtils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "@/components/ui/use-toast";
import GradeCard from "./GradeCard";
import { standardSubjects } from "@/lib/types";

const GradeCalculator = () => {
  const { toast } = useToast();
  const student = useGradeStore((state) => state.student);
  const setTargetGPA = useGradeStore((state) => state.setTargetGPA);
  const setSubjects = useGradeStore((state) => state.setSubjects);
  
  const [targetGPA, setTargetGPALocal] = useState<string>(
    student?.targetGPA?.toString() || ""
  );
  
  const [subjects, setSubjectsLocal] = useState(standardSubjects.map(subject => ({
    name: subject.name,
    credits: subject.credits
  })));
  
  const [calculatedGrades, setCalculatedGrades] = useState<any[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  
  const handleTargetGPAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetGPALocal(e.target.value);
  };
  
  const handleSubjectChange = (
    index: number,
    field: "name" | "credits",
    value: string
  ) => {
    const updatedSubjects = [...subjects];
    
    if (field === "credits") {
      const creditsValue = parseInt(value, 10);
      updatedSubjects[index] = {
        ...updatedSubjects[index],
        [field]: isNaN(creditsValue) ? 0 : creditsValue,
      };
    } else {
      updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    }
    
    setSubjectsLocal(updatedSubjects);
  };
  
  const handleCalculate = () => {
    const gpaValue = parseFloat(targetGPA);
    
    if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 10) {
      toast({
        title: "Invalid Target GPA",
        description: "Please enter a valid GPA between 0 and 10",
        variant: "destructive",
      });
      return;
    }
    
    if (!student) {
      toast({
        title: "Error",
        description: "Student information not found",
        variant: "destructive",
      });
      return;
    }
    
    // Check if credits are valid
    const hasInvalidCredits = subjects.some(
      (subject) => subject.credits <= 0 || subject.credits > 6
    );
    if (hasInvalidCredits) {
      toast({
        title: "Invalid Credits",
        description: "Credits should be between 1 and 6",
        variant: "destructive",
      });
      return;
    }
    
    // Save target GPA
    setTargetGPA(gpaValue);
    
    // Calculate required grades
    const results = calculateRequiredGrades(
      student.currentCGPA,
      gpaValue,
      subjects
    );
    
    setCalculatedGrades(results);
    setSubjects(results);
    setHasCalculated(true);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Set Target GPA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="targetGPA">Target GPA for this semester</Label>
              <div className="flex space-x-2">
                <Input
                  id="targetGPA"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={targetGPA}
                  onChange={handleTargetGPAChange}
                  placeholder="Enter target GPA (0-10)"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={index} className="flex space-x-4 items-center">
                <div className="flex-1">
                  <Label>Subject Name</Label>
                  <Input
                    value={subject.name}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="w-24">
                  <Label>Credits</Label>
                  <Input
                    type="number"
                    min="1"
                    max="6"
                    value={subject.credits}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            ))}
            
            <Button 
              onClick={handleCalculate}
              className="w-full bg-edu-primary hover:bg-edu-accent"
            >
              Calculate Required Grades
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasCalculated && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Required Grades for Target GPA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculatedGrades.map((grade, index) => (
              <GradeCard key={index} gradeInfo={grade} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeCalculator;
