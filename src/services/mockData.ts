import type { Student } from '../types';

export const INITIAL_STUDENTS: Student[] = [
    {
        id: '1',
        name: 'João Silva',
        status: 'active',
        kanbanStatus: 'pending_update', // was update_workout
        lastUpdate: '2025-12-28',
        notionUrl: 'https://notion.so/joao-silva',
        renewalDate: '2026-01-20',
        entryDate: '2025-11-15',
        planValue: 150,
        protocolType: 'training',
        planType: 'monthly',
        anamnesisSubmittedAt: '2025-11-14T10:00:00Z',
        anamnesis: {
            fullName: 'João Silva',
            email: 'joao.silva@email.com',
            whatsapp: '11999999999',
            age: '28',
            sex: 'male',
            weight: '82',
            height: '178',
            pathology: 'Não possui',
            injuries: 'Lesão no ombro direito há 2 anos',
            medications: 'Nenhuma',
            experienceLevel: 'intermediate',
            trainingAvailability: '5x na semana, Smart Fit',
            currentTraining: 'ABCDE',
            dietaryHistory: 'Come bem, mas erra no fds',
            restrictions: 'Intolerância leve a lactose',
            aestheticGoals: 'Hipertrofia e definição',
            difficulties: 'Manter a dieta no fim de semana',
            currentDiet: '3 refeições sólidas + whey',
            supplements: 'Creatina, Whey',
            finalNotes: 'Focado em melhorar o shape para o verão'
        }
    },
    {
        id: '2',
        name: 'Maria Santos',
        status: 'renewal',
        kanbanStatus: 'in_development', // was pending_response
        lastUpdate: '2025-12-25',
        notionUrl: 'https://notion.so/maria-santos',
        renewalDate: '2025-12-30',
        entryDate: '2025-10-10',
        planValue: 200,
        protocolType: 'diet',
        planType: 'bimonthly'
    },
    {
        id: '3',
        name: 'Carlos Oliveira',
        status: 'active',
        kanbanStatus: 'finished',
        lastUpdate: '2025-12-29',
        notionUrl: '',
        renewalDate: '2026-02-15',
        entryDate: '2025-12-05',
        planValue: 150,
        protocolType: 'both',
        planType: 'monthly'
    },
    {
        id: '4',
        name: 'Ana Costa',
        status: 'inactive',
        kanbanStatus: 'finished',
        lastUpdate: '2025-11-20',
        notionUrl: '',
        renewalDate: '2025-11-20',
        entryDate: '2025-09-01',
        planValue: 100,
        protocolType: 'training',
        planType: 'monthly'
    }
];

const STORAGE_KEY = 'consultoria_students';

export const mockService = {
    getStudents: (): Student[] => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
            return INITIAL_STUDENTS;
        }
        return JSON.parse(stored);
    },

    updateStudent: (student: Student) => {
        const students = mockService.getStudents();
        const newStudents = students.map(s => s.id === student.id ? student : s);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStudents));
        return newStudents;
    },

    getStats: () => {
        const students = mockService.getStudents();
        const active = students.filter(s => s.status === 'active');
        const renewal = students.filter(s => s.status === 'renewal');
        const totalValue = active.reduce((acc, curr) => acc + curr.planValue, 0) +
            renewal.reduce((acc, curr) => acc + curr.planValue, 0);

        return {
            total: students.length,
            active: active.length,
            renewal: renewal.length,
            revenue: totalValue
        };
    }
};
