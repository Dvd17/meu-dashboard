import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Student, KanbanStatus, StudentStatus, Anamnesis } from '../types';
import { INITIAL_STUDENTS } from '../services/mockData';

interface StudentState {
    students: Student[];
    searchTerm: string;
    statusFilter: StudentStatus | 'all';

    // Actions
    setStudents: (students: Student[]) => void;
    updateStudent: (updatedStudent: Student) => void;
    moveStudent: (studentId: string, newStatus: KanbanStatus) => void;
    addStudent: (student: Omit<Student, 'id'>) => void;
    removeStudent: (studentId: string) => void;
    updateNotionLink: (studentId: string, newUrl: string) => void;
    // Anamnesis Actions
    generateAnamnesisLink: (studentId: string) => string;
    submitAnamnesis: (token: string, data: Anamnesis) => boolean;
    getStudentByToken: (token: string) => Student | undefined;

    setSearchTerm: (term: string) => void;
    setStatusFilter: (filter: StudentStatus | 'all') => void;

    // Computed (Selectors conceptually, but helper functions provided)
    getFilteredStudents: () => Student[];
    getStats: () => { total: number; active: number; renewal: number; revenue: number };
}

export const useStudentStore = create<StudentState>()(
    persist(
        (set, get) => ({
            students: INITIAL_STUDENTS,
            searchTerm: '',
            statusFilter: 'all',

            setStudents: (students) => set({ students }),

            updateStudent: (updatedStudent) =>
                set((state) => ({
                    students: state.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
                })),

            removeStudent: (studentId) =>
                set((state) => ({
                    students: state.students.filter((s) => s.id !== studentId),
                })),

            moveStudent: (studentId, newStatus) =>
                set((state) => ({
                    students: state.students.map((s) =>
                        s.id === studentId ? { ...s, kanbanStatus: newStatus } : s
                    ),
                })),

            updateNotionLink: (studentId, newUrl) =>
                set((state) => ({
                    students: state.students.map((s) =>
                        s.id === studentId ? { ...s, notionUrl: newUrl } : s
                    ),
                })),

            generateAnamnesisLink: (studentId) => {
                const token = crypto.randomUUID();
                set((state) => ({
                    students: state.students.map((s) =>
                        s.id === studentId ? { ...s, anamnesisToken: s.anamnesisToken || token } : s
                    ),
                }));
                // Return the existing one if already present, or the new one
                const student = get().students.find(s => s.id === studentId);
                return student?.anamnesisToken || token;
            },

            submitAnamnesis: (token, data) => {
                const student = get().students.find(s => s.anamnesisToken === token);
                if (!student) return false;

                set((state) => ({
                    students: state.students.map((s) =>
                        s.anamnesisToken === token ? {
                            ...s,
                            anamnesis: data,
                            anamnesisSubmittedAt: new Date().toISOString()
                        } : s
                    ),
                }));
                return true;
            },

            getStudentByToken: (token) => {
                return get().students.find(s => s.anamnesisToken === token);
            },

            addStudent: (studentData) =>
                set((state) => ({
                    students: [
                        ...state.students,
                        {
                            id: crypto.randomUUID(),
                            ...studentData,
                        },
                    ],
                })),

            setSearchTerm: (term) => set({ searchTerm: term }),
            setStatusFilter: (filter) => set({ statusFilter: filter }),

            getFilteredStudents: () => {
                const { students, searchTerm, statusFilter } = get();
                return students.filter((student) => {
                    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesFilter = statusFilter === 'all' || student.status === statusFilter;
                    return matchesSearch && matchesFilter;
                });
            },

            getStats: () => {
                const { students } = get();
                const active = students.filter((s) => s.status === 'active');
                const renewal = students.filter((s) => s.status === 'renewal');
                const totalValue = active.reduce((acc, curr) => acc + curr.planValue, 0) +
                    renewal.reduce((acc, curr) => acc + curr.planValue, 0);

                return {
                    total: students.length,
                    active: active.length,
                    renewal: renewal.length,
                    revenue: totalValue,
                };
            },
        }),
        {
            name: 'consultoria-student-storage', // key in localStorage
        }
    )
);
