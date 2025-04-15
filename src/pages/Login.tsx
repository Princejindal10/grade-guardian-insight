
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }
    
    const success = login(formData.email, formData.password);
    
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome back to GradePro!",
      });
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-edu-light flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-edu-dark">
            Grade <span className="text-edu-primary">Pro</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sign in to access your personalized grade prediction and academic insights.
          </p>
        </div>
        
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your GradePro account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter your password"
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
              
              {error && <p className="text-destructive text-sm">{error}</p>}
              
              <Button type="submit" className="w-full bg-edu-primary hover:bg-edu-accent">
                Log In
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{" "}
              <button 
                onClick={() => navigate("/")} 
                className="text-edu-primary hover:underline"
                type="button"
              >
                Sign up
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-edu-dark py-6 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 GradePro | Helping students achieve academic excellence</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
