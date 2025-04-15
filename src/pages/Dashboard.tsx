
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGradeStore } from "@/lib/store";
import NavBar from "@/components/NavBar";
import GradeCalculator from "@/components/GradeCalculator";

const Dashboard = () => {
  const navigate = useNavigate();
  const student = useGradeStore((state) => state.student);
  
  // Redirect to homepage if no student data
  useEffect(() => {
    if (!student) {
      navigate("/");
    }
  }, [student, navigate]);
  
  if (!student) return null;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {student.name}</h1>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="bg-white p-4 rounded-md shadow-sm flex items-center">
              <div className="text-edu-primary font-medium">Current CGPA:</div>
              <div className="ml-2 font-bold text-lg">{student.currentCGPA.toFixed(2)}</div>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm flex items-center">
              <div className="text-edu-primary font-medium">Semester:</div>
              <div className="ml-2 font-bold text-lg">{student.semester}</div>
            </div>
            
            {student.targetGPA && (
              <div className="bg-white p-4 rounded-md shadow-sm flex items-center">
                <div className="text-edu-primary font-medium">Target GPA:</div>
                <div className="ml-2 font-bold text-lg">{student.targetGPA.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
        
        <GradeCalculator />
      </main>
      
      <footer className="bg-edu-dark text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Grade Guardian Insight | Helping students achieve academic excellence</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
