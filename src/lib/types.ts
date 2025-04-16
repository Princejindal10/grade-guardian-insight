// Define types for our grade predictor application

export interface Student {
  name: string;
  rollNumber?: string;
  email?: string;
  semester: number;
  currentCGPA: number;
  targetGPA: number | null;
  password?: string;
}

export interface SubjectGrade {
  subjectName: string;
  credits: number;
  requiredGrade: string;
  requiredScore: number;
}

export interface EndtermRequirement {
  requiredMarks: number;
  achievable: boolean;
  message: string;
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
  requiredEndtermMarks: number | EndtermRequirement | null;
}

export interface GradePoint {
  grade: string;
  points: number;
  minPercentage: number;
}

export type GradeDistribution = GradePoint[];

export interface Subject {
  name: string;
  credits: number;
  code?: string;
}

// Standard subjects - fixed to the 4 required subjects
export const standardSubjects: Subject[] = [
  { name: "Design and Analysis of Algorithms", credits: 4, code: "CS301" },
  { name: "Computer Networks", credits: 4, code: "CS302" },
  { name: "Software Engineering", credits: 3, code: "CS303" },
  { name: "Cloud Computing", credits: 3, code: "CS304" }
];

export interface StudyAdvice {
  subject: string;
  advice: string;
  focusAreas: string[];
  studyStrategies: string[];
  difficultyLevel: 'high' | 'medium' | 'low';
  estimatedStudyHours: number;
}
