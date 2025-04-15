
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SubjectGrade } from "@/lib/types";

interface GradeCardProps {
  gradeInfo: SubjectGrade;
}

const GradeCard = ({ gradeInfo }: GradeCardProps) => {
  const { subjectName, credits, requiredGrade, requiredScore } = gradeInfo;

  // Determine the background color based on the grade
  const getGradeColor = () => {
    switch (requiredGrade) {
      case 'A+':
        return 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white';
      case 'A':
        return 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white';
      case 'B+':
        return 'bg-gradient-to-br from-green-500 to-teal-500 text-white';
      case 'B':
        return 'bg-gradient-to-br from-teal-400 to-green-400 text-white';
      case 'C+':
        return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white';
      case 'C':
        return 'bg-gradient-to-br from-orange-400 to-amber-400 text-white';
      case 'D':
        return 'bg-gradient-to-br from-red-400 to-orange-400 text-white';
      case 'F':
        return 'bg-gradient-to-br from-red-600 to-red-500 text-white';
      default:
        return 'bg-gradient-to-br from-gray-500 to-slate-500 text-white';
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-transparent hover:border-edu-accent transition-all duration-300">
      <CardHeader className={`${getGradeColor()} py-4`}>
        <CardTitle className="text-center font-bold text-2xl">
          {requiredGrade}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subject:</span>
            <span className="font-medium">{subjectName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Credits:</span>
            <span className="font-medium">{credits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Min Score Required:</span>
            <span className="font-medium">{requiredScore}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeCard;
