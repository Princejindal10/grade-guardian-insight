
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGradeStore } from "@/lib/store";
import { Student } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

const SignupForm = () => {
  const navigate = useNavigate();
  const setStudent = useGradeStore((state) => state.setStudent);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    semester: string;
    cgpa: string;
  }>({
    name: "",
    semester: "",
    cgpa: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }
    
    const semester = parseInt(formData.semester, 10);
    if (isNaN(semester) || semester < 1 || semester > 12) {
      setError("Please enter a valid semester (1-12)");
      return;
    }
    
    const cgpa = parseFloat(formData.cgpa);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      setError("Please enter a valid CGPA (0-10)");
      return;
    }
    
    // Create student object
    const student: Student = {
      name: formData.name.trim(),
      semester: semester,
      currentCGPA: cgpa,
      targetGPA: null,
    };
    
    // Save student data and navigate to dashboard
    setStudent(student);
    navigate("/dashboard");
  };
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome to Grade Guardian</CardTitle>
        <CardDescription className="text-center">
          Enter your details to get started with grade predictions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="semester">Current Semester</Label>
            <Input
              id="semester"
              name="semester"
              type="number"
              min="1"
              max="12"
              placeholder="Enter semester (1-12)"
              value={formData.semester}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cgpa">Current CGPA</Label>
            <Input
              id="cgpa"
              name="cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="Enter your current CGPA"
              value={formData.cgpa}
              onChange={handleChange}
            />
          </div>
          
          {error && <p className="text-destructive text-sm">{error}</p>}
          
          <Button type="submit" className="w-full bg-edu-primary hover:bg-edu-accent">
            Continue
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to use this tool to improve your academic performance
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
