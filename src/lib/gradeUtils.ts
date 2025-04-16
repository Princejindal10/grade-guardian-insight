import { EndtermRequirement, GradeDistribution, SubjectGrade, SubjectMarks } from "./types";

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

// Extended historical student data with relative grading patterns
export const historicalStudentData = [
  { 
    id: 1, 
    daa: { midterm: 25, internal: 28, endterm: 35, total: 88, grade: "A+" },
    cn: { midterm: 27, internal: 26, endterm: 32, total: 85, grade: "A" },
    se: { midterm: 22, internal: 25, endterm: 30, total: 77, grade: "B+" },
    cc: { midterm: 20, internal: 24, endterm: 28, total: 72, grade: "B" }
  },
  { 
    id: 2, 
    daa: { midterm: 28, internal: 27, endterm: 34, total: 89, grade: "A+" },
    cn: { midterm: 26, internal: 25, endterm: 33, total: 84, grade: "A" },
    se: { midterm: 24, internal: 23, endterm: 29, total: 76, grade: "B+" },
    cc: { midterm: 23, internal: 22, endterm: 27, total: 72, grade: "B" }
  },
  { 
    id: 3, 
    daa: { midterm: 23, internal: 26, endterm: 32, total: 81, grade: "A" },
    cn: { midterm: 24, internal: 24, endterm: 30, total: 78, grade: "B+" },
    se: { midterm: 22, internal: 24, endterm: 28, total: 74, grade: "B" },
    cc: { midterm: 21, internal: 23, endterm: 26, total: 70, grade: "B" }
  },
  { 
    id: 4, 
    daa: { midterm: 21, internal: 24, endterm: 30, total: 75, grade: "B+" },
    cn: { midterm: 22, internal: 23, endterm: 29, total: 74, grade: "B" },
    se: { midterm: 20, internal: 22, endterm: 27, total: 69, grade: "C+" },
    cc: { midterm: 19, internal: 21, endterm: 25, total: 65, grade: "C+" }
  },
  { 
    id: 5, 
    daa: { midterm: 19, internal: 22, endterm: 28, total: 69, grade: "C+" },
    cn: { midterm: 20, internal: 21, endterm: 27, total: 68, grade: "C+" },
    se: { midterm: 18, internal: 20, endterm: 25, total: 63, grade: "C" },
    cc: { midterm: 17, internal: 19, endterm: 24, total: 60, grade: "C" }
  }
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

// Calculate required grades with relative grading
export function calculateRequiredGrades(
  currentCGPA: number,
  targetGPA: number,
  subjects: Array<{ name: string; credits: number }>
): SubjectGrade[] {
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
  
  return subjects.map((subject) => {
    const creditWeight = subject.credits / totalCredits;
    const creditAdjustment = subject.credits >= 4 ? 0.5 : 0;
    const subjectTargetGPA = Math.min(targetGPA * (1 + creditWeight * 0.2) + creditAdjustment, 10);
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

// Map GPA to grade using relative grading scale
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

// Function to check if target grade is achievable
export function isGradeAchievable(
  midtermMarks: number,
  internalMarks: number,
  maxMidterm: number,
  maxInternal: number,
  maxEndterm: number,
  targetGrade: string
): { achievable: boolean; message: string } {
  const totalMaxMarks = maxMidterm + maxInternal + maxEndterm;
  const currentMarks = midtermMarks + internalMarks;
  const currentPercentage = (currentMarks / (maxMidterm + maxInternal)) * 100;
  const requiredPercentage = getMinPercentageForGrade(targetGrade);
  
  // Calculate maximum possible percentage if student gets full marks in endterm
  const maxPossibleMarks = currentMarks + maxEndterm;
  const maxPossiblePercentage = (maxPossibleMarks / totalMaxMarks) * 100;
  
  if (maxPossiblePercentage < requiredPercentage) {
    return {
      achievable: false,
      message: `Even with full marks in end term (${maxEndterm}), you can only reach ${maxPossiblePercentage.toFixed(1)}%, which is below the required ${requiredPercentage}% for ${targetGrade} grade.`
    };
  }
  
  // Check if current performance is significantly below target
  if (currentPercentage < requiredPercentage - 30) {
    return {
      achievable: false,
      message: `Your current performance (${currentPercentage.toFixed(1)}%) is significantly below the required level for ${targetGrade} grade (${requiredPercentage}%). Consider setting a more realistic target.`
    };
  }
  
  return { 
    achievable: true, 
    message: "Target grade is achievable with good performance in end term." 
  };
}

// Calculate required end term marks using relative grading and historical data
export function calculateRequiredEndTermMarks(
  subjectMarks: SubjectMarks
): EndtermRequirement {
  const { midtermMarks, internalMarks, maxMidterm, maxInternal, maxEndterm, targetGrade, subjectName } = subjectMarks;

  // First check if the target grade is achievable
  const achievabilityCheck = isGradeAchievable(
    midtermMarks,
    internalMarks,
    maxMidterm,
    maxInternal,
    maxEndterm,
    targetGrade
  );

  if (!achievabilityCheck.achievable) {
    return {
      requiredMarks: maxEndterm,
      achievable: false,
      message: achievabilityCheck.message
    };
  }

  // If achievable, calculate required marks using existing logic with historical data
  const similarPerformances = historicalStudentData.filter(student => {
    const subjectData = getSubjectData(student, subjectName.toLowerCase());
    if (!subjectData) return false;

    const midtermPercentage = (midtermMarks / maxMidterm) * 100;
    const internalPercentage = (internalMarks / maxInternal) * 100;
    const historicalMidtermPercentage = (subjectData.midterm / 30) * 100;
    const historicalInternalPercentage = (subjectData.internal / 30) * 100;

    return Math.abs(midtermPercentage - historicalMidtermPercentage) <= 5 &&
           Math.abs(internalPercentage - historicalInternalPercentage) <= 5;
  });

  if (similarPerformances.length > 0) {
    const targetPerformances = similarPerformances.filter(student => 
      getSubjectData(student, subjectName.toLowerCase())?.grade === targetGrade
    );

    if (targetPerformances.length > 0) {
      const avgEndterm = targetPerformances.reduce((sum, student) => {
        const subjectData = getSubjectData(student, subjectName.toLowerCase());
        return sum + (subjectData?.endterm || 0);
      }, 0) / targetPerformances.length;

      const scaledEndterm = (avgEndterm / 40) * maxEndterm;
      
      return {
        requiredMarks: Math.min(scaledEndterm, maxEndterm),
        achievable: true,
        message: "Based on historical data, this target appears achievable."
      };
    }
  }

  // Fallback calculation if no historical data matches
  const totalRequired = getMinPercentageForGrade(targetGrade) / 100 * (maxMidterm + maxInternal + maxEndterm);
  const currentTotal = midtermMarks + internalMarks;
  const requiredEndterm = Math.max(0, totalRequired - currentTotal);
  
  return {
    requiredMarks: Math.min(requiredEndterm, maxEndterm),
    achievable: requiredEndterm <= maxEndterm,
    message: "Calculation based on minimum percentage requirements."
  };
}

// Helper function to get subject data from historical record
function getSubjectData(student: any, subjectName: string) {
  switch (subjectName) {
    case "design and analysis of algorithms":
      return student.daa;
    case "computer networks":
      return student.cn;
    case "software engineering":
      return student.se;
    case "cloud computing":
      return student.cc;
    default:
      return null;
  }
}
