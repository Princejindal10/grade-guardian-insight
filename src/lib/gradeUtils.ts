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

// Historical student data for more accurate predictions
export const historicalStudentData = [
  // StudentID DAA_Midt DAA_Inter DAA_Endt CN_Midte CN_Intern CN_Endterm SE_Midterm SE_Internal SE_Endterm CC_Midterm CC_Internal CC_Endterm DAA_Total CN_Total SE_Total CC_Total DAA_Grade CN_Grade SE_Grade CC_Grade
  { id: 1, daa: { midterm: 23, internal: 18, endterm: 20, total: 61, grade: "C" }, cn: { midterm: 27, internal: 17, endterm: 26, total: 70, grade: "B+" }, se: { midterm: 11, internal: 19, endterm: 24, total: 54, grade: "F" }, cc: { midterm: 12, internal: 14, endterm: 32, total: 58, grade: "F" } },
  { id: 2, daa: { midterm: 27, internal: 13, endterm: 26, total: 66, grade: "C+" }, cn: { midterm: 24, internal: 26, endterm: 24, total: 74, grade: "A" }, se: { midterm: 24, internal: 28, endterm: 37, total: 89, grade: "A+" }, cc: { midterm: 29, internal: 29, endterm: 29, total: 87, grade: "A+" } },
  // Additional records would be added here
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

// Use historical data to predict required marks with improved accuracy
function predictBasedOnHistoricalData(subject: string, midterm: number, internal: number, targetGrade: string): number {
  // Look for similar students in the historical data
  let similarStudents = [];
  
  switch (subject.toLowerCase()) {
    case "design and analysis of algorithms":
      similarStudents = historicalStudentData.filter(student => 
        Math.abs(student.daa.midterm - midterm) <= 5 && 
        Math.abs(student.daa.internal - internal) <= 5 &&
        student.daa.grade === targetGrade
      );
      if (similarStudents.length > 0) {
        return similarStudents.reduce((sum, student) => sum + student.daa.endterm, 0) / similarStudents.length;
      }
      break;
      
    case "computer networks":
      similarStudents = historicalStudentData.filter(student => 
        Math.abs(student.cn.midterm - midterm) <= 5 && 
        Math.abs(student.cn.internal - internal) <= 5 &&
        student.cn.grade === targetGrade
      );
      if (similarStudents.length > 0) {
        return similarStudents.reduce((sum, student) => sum + student.cn.endterm, 0) / similarStudents.length;
      }
      break;
      
    case "software engineering":
      similarStudents = historicalStudentData.filter(student => 
        Math.abs(student.se.midterm - midterm) <= 5 && 
        Math.abs(student.se.internal - internal) <= 5 &&
        student.se.grade === targetGrade
      );
      if (similarStudents.length > 0) {
        return similarStudents.reduce((sum, student) => sum + student.se.endterm, 0) / similarStudents.length;
      }
      break;
      
    case "cloud computing":
      similarStudents = historicalStudentData.filter(student => 
        Math.abs(student.cc.midterm - midterm) <= 5 && 
        Math.abs(student.cc.internal - internal) <= 5 &&
        student.cc.grade === targetGrade
      );
      if (similarStudents.length > 0) {
        return similarStudents.reduce((sum, student) => sum + student.cc.endterm, 0) / similarStudents.length;
      }
      break;
  }
  
  // If no similar students found, return null and fall back to the formula
  return null;
}

// Calculate required end term marks to achieve a target grade
export function calculateRequiredEndTermMarks(
  subjectMarks: SubjectMarks
): number {
  const { midtermMarks, internalMarks, maxMidterm, maxInternal, maxEndterm, targetGrade, subjectName } = subjectMarks;
  
  // First try to predict using historical data
  const historicalPrediction = predictBasedOnHistoricalData(
    subjectName,
    midtermMarks, 
    internalMarks, 
    targetGrade
  );
  
  // If we have a historical prediction, use it
  if (historicalPrediction !== null) {
    return Math.min(historicalPrediction, maxEndterm);
  }
  
  // Otherwise, fall back to formula-based prediction
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
