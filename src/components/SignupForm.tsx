
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useGradeStore } from "@/lib/store";
import { Student } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const SignupForm = () => {
  const navigate = useNavigate();
  const setStudent = useGradeStore((state) => state.setStudent);
  const signup = useAuthStore((state) => state.signup);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<{
    name: string;
    rollNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    semester: string;
    cgpa: string;
  }>({
    name: "",
    rollNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    
    if (!formData.rollNumber.trim()) {
      setError("Please enter your roll number");
      return;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
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
      rollNumber: formData.rollNumber.trim(),
      email: formData.email.trim(),
      password: formData.password,
      semester: semester,
      currentCGPA: cgpa,
      targetGPA: null,
    };
    
    try {
      // Register user
      signup(student);
      
      // Save student data and navigate to dashboard
      setStudent(student);
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to GradePro. Let's set your academic goals.",
      });
      
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome to GradePro</CardTitle>
        <CardDescription className="text-center">
          Sign up to start predicting and improving your grades
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
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              name="rollNumber"
              placeholder="Enter your roll number"
              value={formData.rollNumber}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
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
            Sign Up
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center w-full">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/login")} 
              className="text-edu-primary hover:underline"
              type="button"
            >
              Log in
            </button>
          </p>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to use this tool to improve your academic performance
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
