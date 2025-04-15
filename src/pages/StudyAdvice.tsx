
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGradeStore } from "@/lib/store";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { historicalStudentData } from "@/lib/gradeUtils";

const StudyAdvice = () => {
  const navigate = useNavigate();
  const student = useGradeStore((state) => state.student);
  const studyAdvice = useGradeStore((state) => state.studyAdvice);
  const subjectMarks = useGradeStore((state) => state.subjectMarks);
  const addStudyAdvice = useGradeStore((state) => state.addStudyAdvice);
  
  // Helper function to generate study advice
  const generateStudyAdvice = (subject: string, currentMidterm: number, currentInternal: number) => {
    // Find similar performing students
    let relatedData;
    switch (subject.toLowerCase()) {
      case "design and analysis of algorithms":
        relatedData = historicalStudentData.filter(s => 
          Math.abs(s.daa.midterm - currentMidterm) <= 7 && Math.abs(s.daa.internal - currentInternal) <= 7
        );
        break;
      case "computer networks":
        relatedData = historicalStudentData.filter(s => 
          Math.abs(s.cn.midterm - currentMidterm) <= 7 && Math.abs(s.cn.internal - currentInternal) <= 7
        );
        break;
      case "software engineering":
        relatedData = historicalStudentData.filter(s => 
          Math.abs(s.se.midterm - currentMidterm) <= 7 && Math.abs(s.se.internal - currentInternal) <= 7
        );
        break;
      case "cloud computing":
        relatedData = historicalStudentData.filter(s => 
          Math.abs(s.cc.midterm - currentMidterm) <= 7 && Math.abs(s.cc.internal - currentInternal) <= 7
        );
        break;
      default:
        relatedData = [];
    }

    // Generate advice based on subject
    let advice = "";
    let focusAreas = [];
    let studyStrategies = [];

    switch (subject.toLowerCase()) {
      case "design and analysis of algorithms":
        advice = "Focus on algorithm complexity and optimization techniques.";
        focusAreas = [
          "Time and space complexity analysis",
          "Divide and conquer algorithms",
          "Dynamic programming problems",
          "Graph algorithms"
        ];
        studyStrategies = [
          "Practice solving algorithmic problems regularly",
          "Implement algorithms by hand to understand their inner workings",
          "Focus on optimization techniques for the final exam",
          "Review sorting and searching algorithms thoroughly"
        ];
        break;
      case "computer networks":
        advice = "Prioritize understanding network protocols and architecture.";
        focusAreas = [
          "TCP/IP protocol suite",
          "Network layer routing",
          "Network security concepts",
          "Wireless networking principles"
        ];
        studyStrategies = [
          "Study protocol diagrams and packet flow",
          "Practice subnetting problems",
          "Learn the OSI model thoroughly",
          "Use network simulation tools to visualize concepts"
        ];
        break;
      case "software engineering":
        advice = "Understand software development methodologies and project management.";
        focusAreas = [
          "Software development life cycle",
          "Requirements engineering",
          "Software design patterns",
          "Testing methodologies"
        ];
        studyStrategies = [
          "Create diagrams for software architecture concepts",
          "Practice writing use cases and user stories",
          "Study agile and waterfall methodologies",
          "Understand software quality metrics"
        ];
        break;
      case "cloud computing":
        advice = "Master virtualization concepts and cloud service models.";
        focusAreas = [
          "Virtualization technologies",
          "Cloud deployment models (IaaS, PaaS, SaaS)",
          "Cloud security considerations",
          "Containerization and orchestration"
        ];
        studyStrategies = [
          "Get hands-on experience with a cloud provider",
          "Study scalability and elasticity concepts",
          "Practice creating virtual networks",
          "Understand containerization with Docker"
        ];
        break;
      default:
        advice = "Focus on core concepts and practice regularly.";
        focusAreas = ["Key theories", "Practical applications", "Exam format topics"];
        studyStrategies = ["Regular review", "Practice tests", "Group study sessions"];
    }

    return {
      subject,
      advice,
      focusAreas,
      studyStrategies
    };
  };
  
  // Generate study advice if needed
  useEffect(() => {
    if (student && subjectMarks.length > 0 && studyAdvice.length === 0) {
      // Generate advice for each subject
      subjectMarks.forEach(subject => {
        const newAdvice = generateStudyAdvice(
          subject.subjectName,
          subject.midtermMarks,
          subject.internalMarks
        );
        addStudyAdvice(newAdvice);
      });
    }
  }, [student, subjectMarks, studyAdvice.length, addStudyAdvice]);
  
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
                <CardHeader className="bg-edu-light">
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
