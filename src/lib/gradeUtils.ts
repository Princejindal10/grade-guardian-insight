
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

// Extended historical student data for more accurate predictions
export const historicalStudentData = [
  // StudentID DAA_Midt DAA_Inter DAA_Endt CN_Midte CN_Intern CN_Endterm SE_Midterm SE_Internal SE_Endterm CC_Midterm CC_Internal CC_Endterm DAA_Total CN_Total SE_Total CC_Total DAA_Grade CN_Grade SE_Grade CC_Grade
  { id: 1, daa: { midterm: 23, internal: 18, endterm: 20, total: 61, grade: "C" }, cn: { midterm: 27, internal: 17, endterm: 26, total: 70, grade: "B+" }, se: { midterm: 11, internal: 19, endterm: 24, total: 54, grade: "F" }, cc: { midterm: 12, internal: 14, endterm: 32, total: 58, grade: "F" } },
  { id: 2, daa: { midterm: 27, internal: 13, endterm: 26, total: 66, grade: "C+" }, cn: { midterm: 24, internal: 26, endterm: 24, total: 74, grade: "A" }, se: { midterm: 24, internal: 28, endterm: 37, total: 89, grade: "A+" }, cc: { midterm: 29, internal: 29, endterm: 29, total: 87, grade: "A+" } },
  // Add more historical data here...
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
  // Calculate total credits
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
  
  // Calculate weighted grades based on credits
  return subjects.map((subject) => {
    // Weight the grade based on subject credits and importance
    // Higher credit subjects might need higher grades to achieve overall target GPA
    const creditWeight = subject.credits / totalCredits;
    
    // Adjust the grade based on credits - higher credits need slightly higher grades
    const creditAdjustment = subject.credits >= 4 ? 0.5 : 0;
    
    // Calculate adjusted target for this subject based on its credit importance
    const subjectTargetGPA = Math.min(targetGPA * (1 + creditWeight * 0.2) + creditAdjustment, 10);
    
    // Get the appropriate grade based on the adjusted target GPA
    const suggestedGrade = getGradeForGPA(subjectTargetGPA);
    const minPercentage = getMinPercentageForGrade(suggestedGrade);
    
    return {
      subjectName: subject.name,
      credits: subject.credits,
      requiredGrade: suggestedGrade,
      requiredScore: minPercentage
    };
  });
}

// Map GPA to grade using the grade distribution
function getGradeForGPA(gpa: number): string {
  if (gpa >= 9.5) return "A+";
  if (gpa >= 8.5) return "A";
  if (gpa >= 7.5) return "B+";
  if (gpa >= 6.5) return "B";
  if (gpa >= 5.5) return "C+";
  if (gpa >= 4.5) return "C";
  if (gpa >= 3.5) return "D";
  return "F";
}

// Suggest grade based on historical data
function suggestGradeBasedOnHistoricalData(subjectName: string, targetGPA: number): string {
  // This function is not directly used anymore as we're using getGradeForGPA instead
  const availableGrades = ["A+", "A", "B+", "B", "C+", "C", "D", "F"];
  const gpaPoints = getPointsFromGrade(availableGrades[Math.min(Math.floor(targetGPA * 0.8), 7)]);
  
  return availableGrades[Math.min(Math.floor(targetGPA * 0.8), 7)];
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
