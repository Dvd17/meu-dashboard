import { Dumbbell, Plus, Trash2 } from 'lucide-react';
import { BaseBlock } from './BaseBlock';
import type { TrainingBlock as TrainingBlockType } from '../../../types/protocol';
import { useProtocolStore } from '../../../store/useProtocolStore';
import { v4 as uuidv4 } from 'uuid';

interface TrainingBlockProps {
    sectionId: string;
    block: TrainingBlockType;
    index: number;
}

export function TrainingBlock({ sectionId, block, index }: TrainingBlockProps) {
    const { updateBlock, removeBlock } = useProtocolStore();

    const handleUpdateTitle = (title: string) => {
        updateBlock(sectionId, block.id, { title });
    };

    const handleAddExercise = () => {
        const newExercise = {
            id: uuidv4(),
            name: '',
            sets: 3,
            reps: '12',
            notes: ''
        };
        updateBlock(sectionId, block.id, { exercises: [...block.exercises, newExercise] });
    };

    const handleUpdateExercise = (exerciseId: string, field: string, value: any) => {
        const updatedExercises = block.exercises.map(ex =>
            ex.id === exerciseId ? { ...ex, [field]: value } : ex
        );
        updateBlock(sectionId, block.id, { exercises: updatedExercises });
    };

    const handleRemoveExercise = (exerciseId: string) => {
        const updatedExercises = block.exercises.filter(ex => ex.id !== exerciseId);
        updateBlock(sectionId, block.id, { exercises: updatedExercises });
    };

    return (
        <BaseBlock
            id={block.id}
            index={index}
            onRemove={() => removeBlock(sectionId, block.id)}
            icon={<Dumbbell className="h-4 w-4 text-indigo-500" />}
            title={block.title}
        >
            <div className="space-y-4">
                {/* Title Edit (Optional override of generic header title if needed specific styling) */}
                <input
                    type="text"
                    value={block.title}
                    onChange={(e) => handleUpdateTitle(e.target.value)}
                    className="w-full text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-800"
                    placeholder="Nome do Treino (ex: Treino A - Peito)"
                />

                <div className="space-y-2">
                    {block.exercises.map((exercise) => (
                        <div key={exercise.id} className="grid grid-cols-12 gap-2 items-start py-2 group/exercise hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                            <div className="col-span-12 sm:col-span-5">
                                <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5 block">Exercício</label>
                                <input
                                    type="text"
                                    value={exercise.name}
                                    onChange={(e) => handleUpdateExercise(exercise.id, 'name', e.target.value)}
                                    placeholder="Nome do exercício"
                                    className="w-full bg-transparent border-b border-gray-200 focus:border-indigo-500 text-sm py-1 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="col-span-3 sm:col-span-2">
                                <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5 block">Séries</label>
                                <input
                                    type="number"
                                    value={exercise.sets}
                                    onChange={(e) => handleUpdateExercise(exercise.id, 'sets', Number(e.target.value))}
                                    className="w-full bg-transparent border-b border-gray-200 focus:border-indigo-500 text-sm py-1 focus:outline-none text-center"
                                />
                            </div>
                            <div className="col-span-3 sm:col-span-2">
                                <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5 block">Reps</label>
                                <input
                                    type="text"
                                    value={exercise.reps}
                                    onChange={(e) => handleUpdateExercise(exercise.id, 'reps', e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-200 focus:border-indigo-500 text-sm py-1 focus:outline-none text-center"
                                />
                            </div>
                            <div className="col-span-5 sm:col-span-2">
                                <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5 block">Obs/RPE</label>
                                <input
                                    type="text"
                                    value={exercise.notes || ''}
                                    onChange={(e) => handleUpdateExercise(exercise.id, 'notes', e.target.value)}
                                    placeholder="..."
                                    className="w-full bg-transparent border-b border-gray-200 focus:border-indigo-500 text-sm py-1 focus:outline-none"
                                />
                            </div>
                            <div className="col-span-1 flex items-end justify-center pb-2">
                                <button
                                    onClick={() => handleRemoveExercise(exercise.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddExercise}
                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors mt-2"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar Exercício
                </button>
            </div>
        </BaseBlock>
    );
}
