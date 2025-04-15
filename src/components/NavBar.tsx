
import { Link, useLocation } from "react-router-dom";
import { useGradeStore } from "@/lib/store";
import { BookOpen } from "lucide-react";
import { Button } from "./ui/button";

const NavBar = () => {
  const location = useLocation();
  const student = useGradeStore((state) => state.student);
  
  return (
    <nav className="bg-edu-primary text-white shadow-md w-full p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-white no-underline">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold text-xl">Grade Guardian</span>
        </Link>
        
        {student && (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-4">
              <Link to="/dashboard">
                <Button 
                  variant={location.pathname === "/dashboard" ? "secondary" : "ghost"} 
                  className="text-white hover:text-white hover:bg-edu-accent"
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/prediction">
                <Button 
                  variant={location.pathname === "/prediction" ? "secondary" : "ghost"} 
                  className="text-white hover:text-white hover:bg-edu-accent"
                >
                  Marks Prediction
                </Button>
              </Link>
            </div>
            
            <div className="px-4 py-2 rounded-full bg-edu-accent text-sm font-medium">
              {student.name}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
