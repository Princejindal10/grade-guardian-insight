
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Student, SubjectGrade, SubjectMarks, Subject, StudyAdvice, standardSubjects } from './types'

interface AuthState {
  isAuthenticated: boolean;
  currentUser: Student | null;
  login: (email: string, password: string) => boolean;
  signup: (student: Student) => void;
  logout: () => void;
}

interface GradeState {
  student: Student | null;
  subjects: SubjectGrade[];
  subjectMarks: SubjectMarks[];
  studyAdvice: StudyAdvice[];
  availableSubjects: Subject[];
  setStudent: (student: Student) => void;
  setTargetGPA: (gpa: number) => void;
  setSubjects: (subjects: SubjectGrade[]) => void;
  setSubjectMarks: (marks: SubjectMarks[]) => void;
  updateSubjectMark: (index: number, marks: Partial<SubjectMarks>) => void;
  addStudyAdvice: (advice: StudyAdvice) => void;
}

// Mock user database for demo purposes
// In a real application, this would be stored in a backend database
const users: Student[] = [];

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  login: (email, password) => {
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      set({ isAuthenticated: true, currentUser: user });
      return true;
    }
    
    return false;
  },
  signup: (student) => {
    // Check if user with email already exists
    if (users.some(u => u.email === student.email)) {
      throw new Error("User with this email already exists");
    }
    
    // Add new user
    users.push(student);
    set({ isAuthenticated: true, currentUser: student });
  },
  logout: () => set({ isAuthenticated: false, currentUser: null })
}));

export const useGradeStore = create<GradeState>()(
  persist(
    (set) => ({
      student: null,
      subjects: [],
      subjectMarks: [],
      studyAdvice: [],
      availableSubjects: standardSubjects,
      setStudent: (student) => set({ student }),
      setTargetGPA: (gpa) => set((state) => {
        if (!state.student) return state;
        return {
          student: {
            ...state.student,
            targetGPA: gpa
          }
        };
      }),
      setSubjects: (subjects) => set({ subjects }),
      setSubjectMarks: (subjectMarks) => set({ subjectMarks }),
      updateSubjectMark: (index, marks) => set((state) => {
        const newMarks = [...state.subjectMarks];
        newMarks[index] = { ...newMarks[index], ...marks };
        return { subjectMarks: newMarks };
      }),
      addStudyAdvice: (advice) => set((state) => ({
        studyAdvice: [...state.studyAdvice, advice]
      }))
    }),
    {
      name: "gradepro-storage",
      partialize: (state) => ({
        student: state.student,
        subjects: state.subjects,
        subjectMarks: state.subjectMarks,
        studyAdvice: state.studyAdvice
      }),
    }
  )
);
