export type BlockType = 'text' | 'training' | 'meal';

export interface BaseBlock {
    id: string;
    type: BlockType;
    content?: string; // For text blocks or general notes
}

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: string;
    rpe?: string;
    rest?: string;
    notes?: string;
}

export interface TrainingBlock extends BaseBlock {
    type: 'training';
    title: string; // e.g., "Leg Day"
    exercises: Exercise[];
}

export interface MealItem {
    id: string;
    name: string;
    unidade?: string;
    quantidade: string;
}

export interface MealBlock extends BaseBlock {
    type: 'meal';
    title: string; // e.g., "Breakfast"
    time?: string;
    items: MealItem[];
    macros?: {
        protein: number;
        carbs: number;
        fats: number;
        calories: number;
    };
}

export interface TextBlock extends BaseBlock {
    type: 'text';
    content: string;
}

export type ProtocolBlock = TrainingBlock | MealBlock | TextBlock;

export interface ProtocolSection {
    id: string;
    title: string; // e.g., "Monday", "Phase 1"
    blocks: ProtocolBlock[];
}

export interface Protocol {
    id: string;
    title: string;
    description?: string;
    authorId?: string;
    sections: ProtocolSection[];
    createdAt: string;
    updatedAt: string;
    isTemplate: boolean;
}
