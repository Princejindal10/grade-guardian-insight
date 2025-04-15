
import { create } from 'zustand'
import { Student, SubjectGrade, SubjectMarks } from './types'

interface GradeState {
  student: Student | null;
  subjects: SubjectGrade[];
  subjectMarks: SubjectMarks[];
  setStudent: (student: Student) => void;
  setTargetGPA: (gpa: number) => void;
  setSubjects: (subjects: SubjectGrade[]) => void;
  setSubjectMarks: (marks: SubjectMarks[]) => void;
  updateSubjectMark: (index: number, marks: Partial<SubjectMarks>) => void;
}

export const useGradeStore = create<GradeState>((set) => ({
  student: null,
  subjects: [],
  subjectMarks: [],
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
  })
}));
