
// Define types for our grade predictor application

export interface Student {
  name: string;
  semester: number;
  currentCGPA: number;
  targetGPA: number | null;
}

export interface SubjectGrade {
  subjectName: string;
  credits: number;
  requiredGrade: string;
  requiredScore: number;
}

export interface SubjectMarks {
  subjectName: string;
  credits: number;
  midtermMarks: number;
  internalMarks: number;
  maxMidterm: number;
  maxInternal: number;
  maxEndterm: number;
  targetGrade: string;
  requiredEndtermMarks: number | null;
}

export interface GradePoint {
  grade: string;
  points: number;
  minPercentage: number;
}

export type GradeDistribution = GradePoint[];
