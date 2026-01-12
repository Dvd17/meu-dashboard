import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Protocol, ProtocolBlock, BlockType } from '../types/protocol';

interface ProtocolState {
    currentProtocol: Protocol;

    // Actions
    setTitle: (title: string) => void;
    addSection: (title: string) => void;
    removeSection: (sectionId: string) => void;

    addBlock: (sectionId: string, type: BlockType) => void;
    updateBlock: (sectionId: string, blockId: string, data: Partial<ProtocolBlock>) => void;
    removeBlock: (sectionId: string, blockId: string) => void;
    reorderBlocks: (sectionId: string, startIndex: number, endIndex: number) => void;

    resetProtocol: () => void;
    saveAsTemplate: () => void;
}

const initialProtocol: Protocol = {
    id: uuidv4(),
    title: 'Novo Protocolo Sem Título',
    sections: [
        {
            id: uuidv4(),
            title: 'Dia 1',
            blocks: []
        }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isTemplate: false
};

export const useProtocolStore = create<ProtocolState>((set, get) => ({
    currentProtocol: initialProtocol,

    setTitle: (title) => set((state) => ({
        currentProtocol: { ...state.currentProtocol, title, updatedAt: new Date().toISOString() }
    })),

    addSection: (title) => set((state) => ({
        currentProtocol: {
            ...state.currentProtocol,
            sections: [
                ...state.currentProtocol.sections,
                { id: uuidv4(), title, blocks: [] }
            ],
            updatedAt: new Date().toISOString()
        }
    })),

    removeSection: (sectionId) => set((state) => ({
        currentProtocol: {
            ...state.currentProtocol,
            sections: state.currentProtocol.sections.filter(s => s.id !== sectionId),
            updatedAt: new Date().toISOString()
        }
    })),

    addBlock: (sectionId, type) => set((state) => {
        const newBlock = createBlock(type);
        return {
            currentProtocol: {
                ...state.currentProtocol,
                sections: state.currentProtocol.sections.map(section => {
                    if (section.id === sectionId) {
                        return { ...section, blocks: [...section.blocks, newBlock] };
                    }
                    return section;
                }),
                updatedAt: new Date().toISOString()
            }
        };
    }),

    updateBlock: (sectionId, blockId, data) => set((state) => ({
        currentProtocol: {
            ...state.currentProtocol,
            sections: state.currentProtocol.sections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        blocks: section.blocks.map(block =>
                            block.id === blockId ? { ...block, ...data } as ProtocolBlock : block
                        )
                    };
                }
                return section;
            }),
            updatedAt: new Date().toISOString()
        }
    })),

    removeBlock: (sectionId, blockId) => set((state) => ({
        currentProtocol: {
            ...state.currentProtocol,
            sections: state.currentProtocol.sections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        blocks: section.blocks.filter(b => b.id !== blockId)
                    };
                }
                return section;
            }),
            updatedAt: new Date().toISOString()
        }
    })),

    reorderBlocks: (sectionId, startIndex, endIndex) => set((state) => {
        const sections = [...state.currentProtocol.sections];
        const sectionIndex = sections.findIndex(s => s.id === sectionId);

        if (sectionIndex === -1) return {};

        const section = sections[sectionIndex];
        const blocks = [...section.blocks];
        const [removed] = blocks.splice(startIndex, 1);
        blocks.splice(endIndex, 0, removed);

        sections[sectionIndex] = { ...section, blocks };

        return {
            currentProtocol: {
                ...state.currentProtocol,
                sections,
                updatedAt: new Date().toISOString()
            }
        };
    }),

    resetProtocol: () => set({ currentProtocol: { ...initialProtocol, id: uuidv4() } }),

    saveAsTemplate: () => {
        // Mock save functionality
        console.log('Saving as template:', get().currentProtocol);
        alert('Protocolo salvo como modelo com sucesso!'); // In a real app, use a toast
    }
}));

function createBlock(type: BlockType): ProtocolBlock {
    const base = { id: uuidv4() };

    switch (type) {
        case 'training':
            return {
                ...base,
                type: 'training',
                title: 'Novo Treino',
                exercises: []
            };
        case 'meal':
            return {
                ...base,
                type: 'meal',
                title: 'Nova Refeição',
                items: []
            };
        case 'text':
        default:
            return {
                ...base,
                type: 'text',
                content: ''
            };
    }
}
