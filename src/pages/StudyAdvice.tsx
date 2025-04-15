
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGradeStore } from "@/lib/store";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StudyAdvice = () => {
  const navigate = useNavigate();
  const student = useGradeStore((state) => state.student);
  const studyAdvice = useGradeStore((state) => state.studyAdvice);
  
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
          <h1 className="text-3xl font-bold mb-2">Personalized Study Advice</h1>
          <p className="text-muted-foreground">
            Get tailored recommendations to improve your academic performance.
          </p>
        </div>
        
        {studyAdvice.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              No study advice available. Complete your grade prediction first.
            </p>
            <Button onClick={() => navigate("/prediction")}>
              Go to Grade Prediction
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {studyAdvice.map((advice, index) => (
              <Card key={index} className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{advice.subject}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{advice.advice}</p>
                  
                  <div className="mb-2">
                    <h3 className="font-semibold text-edu-primary">Focus Areas:</h3>
                    <ul className="list-disc list-inside">
                      {advice.focusAreas.map((area, idx) => (
                        <li key={idx} className="text-sm">{area}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-edu-primary">Study Strategies:</h3>
                    <ul className="list-disc list-inside">
                      {advice.studyStrategies.map((strategy, idx) => (
                        <li key={idx} className="text-sm">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <footer className="bg-edu-dark text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Grade Guardian Insight | Helping students achieve academic excellence</p>
        </div>
      </footer>
    </div>
  );
};

export default StudyAdvice;

