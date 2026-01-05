export type StudentStatus = 'active' | 'inactive' | 'renewal';
export type KanbanStatus = 'new_student' | 'in_development' | 'pending_update' | 'finished';


export interface Anamnesis {
    // Personal Info
    fullName: string;
    email: string;
    whatsapp: string;
    age: string;
    sex: 'male' | 'female';
    weight: string;
    height: string;

    // Health
    pathology: string; // "Possui alguma patologia?"
    injuries: string; // "Lesões ou cirurgias"
    medications: string; // "Medicações"

    // Training
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    trainingAvailability: string; // "Tempo disponível / Onde treina"
    currentTraining: string; // "Tipo de treino atual"

    // Nutrition & Goals
    dietaryHistory: string; // "O que costuma comer?"
    restrictions: string; // "Alergias/Restrições"
    aestheticGoals: string;
    difficulties: string;
    currentDiet: string; // "Alimentação atual"
    supplements: string;

    finalNotes: string;
}

export interface Student {
    id: string;
    name: string;
    status: StudentStatus; // For membership status
    kanbanStatus: KanbanStatus; // For workflow column
    lastUpdate: string;
    notionUrl?: string; // Integration link
    renewalDate: string;
    entryDate: string; // New field for financial reporting
    planValue: number; // For dashboard revenue
    planType?: 'monthly' | 'bimonthly' | 'semiannual'; // New field for auto-renewal
    protocolType?: 'training' | 'diet' | 'both'; // New field for visual cues

    // Anamnesis Integration
    anamnesisToken?: string;
    anamnesis?: Anamnesis;
    anamnesisSubmittedAt?: string;
}
