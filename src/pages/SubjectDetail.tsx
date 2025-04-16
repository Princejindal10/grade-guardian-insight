
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGradeStore } from "@/lib/store";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calculateRequiredEndTermMarks } from "@/lib/gradeUtils";
import { EndtermRequirement } from "@/lib/types";

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = useGradeStore((state) => state.student);
  const subjectMarks = useGradeStore((state) => state.subjectMarks);
  
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [requiredEndTermMarks, setRequiredEndTermMarks] = useState<EndtermRequirement | null>(null);
  
  useEffect(() => {
    if (!student) {
      navigate("/");
      return;
    }
    
    const subject = subjectMarks.find((_, index) => index.toString() === id);
    
    if (!subject) {
      navigate("/dashboard");
      return;
    }
    
    setSelectedSubject(subject);
    
    // Calculate required end term marks
    const result = calculateRequiredEndTermMarks(subject);
    setRequiredEndTermMarks(result);
  }, [student, id, navigate, subjectMarks]);
  
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
        
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Current Marks</h3>
                <div className="space-y-2">
                  <p>Midterm: {selectedSubject.midtermMarks} / {selectedSubject.maxMidterm}</p>
                  <p>Internal: {selectedSubject.internalMarks} / {selectedSubject.maxInternal}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Target Grade</h3>
                <p>{selectedSubject.targetGrade}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold text-edu-primary mb-2">Required End Term Marks</h3>
              <p className="text-2xl font-bold">
                {Math.round(requiredEndTermMarks.requiredMarks)} / {selectedSubject.maxEndterm}
              </p>
              <p className="text-muted-foreground mt-2">
                {requiredEndTermMarks.achievable 
                  ? "You need to score these marks in the end-term exam to achieve your target grade."
                  : requiredEndTermMarks.message}
              </p>
              
              {!requiredEndTermMarks.achievable && (
                <p className="text-destructive mt-2">
                  Note: Based on your current performance, this grade target may be challenging to achieve.
                </p>
              )}
            </div>
            
            <div className="mt-6">
              <Button onClick={() => navigate("/study-advice")}>
                Get Study Advice
              </Button>
            </div>
          </CardContent>
        </Card>
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
