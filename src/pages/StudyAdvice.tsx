
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGradeStore } from "@/lib/store";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { historicalStudentData } from "@/lib/gradeUtils";
import { Clock, Target, BookOpen } from "lucide-react";

const StudyAdvice = () => {
  const navigate = useNavigate();
  const student = useGradeStore((state) => state.student);
  const studyAdvice = useGradeStore((state) => state.studyAdvice);
  const subjectMarks = useGradeStore((state) => state.subjectMarks);
  const addStudyAdvice = useGradeStore((state) => state.addStudyAdvice);
  
  const getDifficultyLevel = (targetGrade: string) => {
    switch (targetGrade) {
      case 'A+':
      case 'A':
        return 'high';
      case 'B+':
      case 'B':
        return 'medium';
      default:
        return 'low';
    }
  };

  const getEstimatedStudyHours = (targetGrade: string) => {
    switch (targetGrade) {
      case 'A+':
        return 15;
      case 'A':
        return 12;
      case 'B+':
        return 9;
      case 'B':
        return 7;
      default:
        return 5;
    }
  };

  const generateAdvice = (subject: string, currentMidterm: number, currentInternal: number, targetGrade: string) => {
    const difficultyLevel = getDifficultyLevel(targetGrade);
    const studyHours = getEstimatedStudyHours(targetGrade);
    
    let adviceIntensity = '';
    let extraStrategies = [];
    
    if (difficultyLevel === 'high') {
      adviceIntensity = "To achieve an A+ grade, you'll need exceptional dedication and a comprehensive study approach.";
      extraStrategies = [
        "Create detailed mind maps for complex topics",
        "Practice with previous year papers extensively",
        "Form study groups with high-performing peers",
        "Schedule daily revision sessions",
        "Seek additional guidance from professors"
      ];
    } else if (difficultyLevel === 'medium') {
      adviceIntensity = "For a B grade, maintain consistent study habits and focus on core concepts.";
      extraStrategies = [
        "Regular revision of key topics",
        "Focus on important concepts",
        "Practice sample questions"
      ];
    } else {
      adviceIntensity = "Focus on understanding the fundamental concepts.";
      extraStrategies = [
        "Review basic concepts",
        "Practice essential problems"
      ];
    }

    // Generate subject-specific advice
    let advice = "";
    let focusAreas = [];
    let studyStrategies = [];

    switch (subject.toLowerCase()) {
      case "design and analysis of algorithms":
        advice = `${adviceIntensity} For DAA, ${difficultyLevel === 'high' ? 
          "master advanced algorithm analysis and optimization techniques" : 
          "focus on understanding basic algorithm concepts"}`;
        focusAreas = difficultyLevel === 'high' ? [
          "Advanced algorithm analysis",
          "Complex optimization techniques",
          "Time and space complexity proofs",
          "Advanced dynamic programming",
          "Network flow algorithms"
        ] : [
          "Basic sorting algorithms",
          "Simple data structures",
          "Basic complexity analysis"
        ];
        break;
      // ... similar cases for other subjects with personalized content
      default:
        advice = adviceIntensity;
        focusAreas = ["Key concepts", "Basic principles"];
    }

    return {
      subject,
      advice,
      focusAreas,
      studyStrategies: [...studyStrategies, ...extraStrategies],
      difficultyLevel,
      estimatedStudyHours: studyHours
    };
  };

  useEffect(() => {
    if (!student) {
      navigate("/");
      return;
    }

    if (student && subjectMarks.length > 0 && studyAdvice.length === 0) {
      subjectMarks.forEach(subject => {
        const newAdvice = generateAdvice(
          subject.subjectName,
          subject.midtermMarks,
          subject.internalMarks,
          subject.targetGrade
        );
        addStudyAdvice(newAdvice);
      });
    }
  }, [student, subjectMarks, studyAdvice.length, addStudyAdvice, navigate]);

  if (!student) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Personalized Study Advice</h1>
          <p className="text-muted-foreground">
            Tailored recommendations based on your target grades and current performance.
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
                <CardHeader className={`${
                  advice.difficultyLevel === 'high' ? 'bg-red-50' :
                  advice.difficultyLevel === 'medium' ? 'bg-yellow-50' :
                  'bg-green-50'
                }`}>
                  <CardTitle className="text-xl">{advice.subject}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4" />
                    <span>Target: {subjectMarks[index]?.targetGrade}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{advice.estimatedStudyHours}+ hours/week</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{advice.advice}</p>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-edu-primary flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Focus Areas:
                    </h3>
                    <ul className="list-disc list-inside mt-2">
                      {advice.focusAreas.map((area, idx) => (
                        <li key={idx} className="text-sm">{area}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-edu-primary">Study Strategies:</h3>
                    <ul className="list-disc list-inside mt-2">
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
