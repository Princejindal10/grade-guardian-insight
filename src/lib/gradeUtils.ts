
import { GradeDistribution, SubjectGrade, SubjectMarks } from "./types";

// Standard grade distribution
export const gradeDistribution: GradeDistribution = [
  { grade: "A+", points: 10, minPercentage: 90 },
  { grade: "A", points: 9, minPercentage: 80 },
  { grade: "B+", points: 8, minPercentage: 70 },
  { grade: "B", points: 7, minPercentage: 60 },
  { grade: "C+", points: 6, minPercentage: 50 },
  { grade: "C", points: 5, minPercentage: 40 },
  { grade: "D", points: 4, minPercentage: 30 },
  { grade: "F", points: 0, minPercentage: 0 },
];

// Get grade from percentage
export function getGradeFromPercentage(percentage: number): string {
  for (const gradePoint of gradeDistribution) {
    if (percentage >= gradePoint.minPercentage) {
      return gradePoint.grade;
    }
  }
  return "F";
}

// Get grade point from grade
export function getPointsFromGrade(grade: string): number {
  const gradePoint = gradeDistribution.find((gp) => gp.grade === grade);
  return gradePoint ? gradePoint.points : 0;
}

// Get minimum percentage required for a grade
export function getMinPercentageForGrade(grade: string): number {
  const gradePoint = gradeDistribution.find((gp) => gp.grade === grade);
  return gradePoint ? gradePoint.minPercentage : 0;
}

// Calculate required grades for subjects to achieve target GPA
export function calculateRequiredGrades(
  currentCGPA: number,
  targetGPA: number,
  subjects: Array<{ name: string; credits: number }>
): SubjectGrade[] {
  // This is a simplified calculation
  // For a real implementation, you would need more sophisticated logic
  
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
  const requiredGradePoints = targetGPA;
  
  return subjects.map((subject) => {
    // Simplified logic to distribute the required grade points across subjects
    // In a real implementation, you'd consider the current CGPA and how it affects what's needed
    const gradePoint = Math.min(10, Math.max(4, Math.round(requiredGradePoints)));
    
    // Find the grade corresponding to this grade point
    const grade = gradeDistribution.find((g) => g.points === gradePoint)?.grade || "B";
    const minPercentage = getMinPercentageForGrade(grade);
    
    return {
      subjectName: subject.name,
      credits: subject.credits,
      requiredGrade: grade,
      requiredScore: minPercentage
    };
  });
}

// Calculate required end term marks to achieve a target grade
export function calculateRequiredEndTermMarks(
  subjectMarks: SubjectMarks
): number {
  const { midtermMarks, internalMarks, maxMidterm, maxInternal, maxEndterm, targetGrade } = subjectMarks;
  
  // Calculate total percentage so far
  const currentMarks = midtermMarks + internalMarks;
  const maxCurrentMarks = maxMidterm + maxInternal;
  const currentPercentage = (currentMarks / maxCurrentMarks) * 100;
  
  // Calculate required percentage for the target grade
  const requiredPercentage = getMinPercentageForGrade(targetGrade);
  
  // Calculate total marks needed for the course
  const totalMaxMarks = maxMidterm + maxInternal + maxEndterm;
  const totalMarksNeeded = (requiredPercentage / 100) * totalMaxMarks;
  
  // Calculate required end term marks
  const requiredEndTermMarks = Math.max(0, totalMarksNeeded - currentMarks);
  
  // Ensure the required marks don't exceed the maximum possible
  return Math.min(requiredEndTermMarks, maxEndterm);
}
