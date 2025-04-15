
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGradeStore } from "@/lib/store";
import NavBar from "@/components/NavBar";
import MarksPrediction from "@/components/MarksPrediction";

const Prediction = () => {
  const navigate = useNavigate();
  const student = useGradeStore((state) => state.student);
  const subjects = useGradeStore((state) => state.subjects);
  
  // Redirect to homepage if no student data
  useEffect(() => {
    if (!student) {
      navigate("/");
    } else if (subjects.length === 0) {
      navigate("/dashboard");
    }
  }, [student, subjects, navigate]);
  
  if (!student || subjects.length === 0) return null;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Marks Prediction</h1>
          <p className="text-muted-foreground">
            Enter your current marks to calculate the required end-term scores to achieve your target grades.
          </p>
        </div>
        
        <MarksPrediction />
      </main>
      
      <footer className="bg-edu-dark text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Grade Guardian Insight | Helping students achieve academic excellence</p>
        </div>
      </footer>
    </div>
  );
};

export default Prediction;
