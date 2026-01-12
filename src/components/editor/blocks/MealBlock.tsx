import { Utensils, Plus, Trash2 } from 'lucide-react';
import { BaseBlock } from './BaseBlock';
import type { MealBlock as MealBlockType } from '../../../types/protocol';
import { useProtocolStore } from '../../../store/useProtocolStore';
import { v4 as uuidv4 } from 'uuid';

interface MealBlockProps {
    sectionId: string;
    block: MealBlockType;
    index: number;
}

export function MealBlock({ sectionId, block, index }: MealBlockProps) {
    const { updateBlock, removeBlock } = useProtocolStore();

    const handleUpdateTitle = (title: string) => {
        updateBlock(sectionId, block.id, { title });
    };

    const handleUpdateMacros = (field: string, value: number) => {
        const currentMacros = block.macros || { protein: 0, carbs: 0, fats: 0, calories: 0 };
        updateBlock(sectionId, block.id, {
            macros: { ...currentMacros, [field]: value }
        });
    };

    const handleAddItem = () => {
        const newItem = {
            id: uuidv4(),
            name: '',
            quantidade: '100g',
        };
        updateBlock(sectionId, block.id, { items: [...block.items, newItem] });
    };

    const handleUpdateItem = (itemId: string, field: string, value: string) => {
        const updatedItems = block.items.map(item =>
            item.id === itemId ? { ...item, [field]: value } : item
        );
        updateBlock(sectionId, block.id, { items: updatedItems });
    };

    const handleRemoveItem = (itemId: string) => {
        const updatedItems = block.items.filter(item => item.id !== itemId);
        updateBlock(sectionId, block.id, { items: updatedItems });
    };

    return (
        <BaseBlock
            id={block.id}
            index={index}
            onRemove={() => removeBlock(sectionId, block.id)}
            icon={<Utensils className="h-4 w-4 text-emerald-500" />}
            colorAccent="#10b981" // emerald-500
        >
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={block.title}
                        onChange={(e) => handleUpdateTitle(e.target.value)}
                        className="flex-1 text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-800"
                        placeholder="Nome da Refeição (ex: Café da Manhã)"
                    />
                    <input
                        type="time"
                        value={block.time || ''}
                        onChange={(e) => updateBlock(sectionId, block.id, { time: e.target.value })}
                        className="text-sm text-gray-500 border border-gray-200 rounded px-2 py-1 focus:border-emerald-500 focus:outline-none"
                    />
                </div>

                <div className="space-y-2 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    {block.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                                placeholder="Alimento (ex: Aveia)"
                                className="flex-1 bg-white border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
                            />
                            <input
                                type="text"
                                value={item.quantidade}
                                onChange={(e) => handleUpdateItem(item.id, 'quantidade', e.target.value)}
                                placeholder="Qtd"
                                className="w-20 bg-white border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none text-center"
                            />
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={handleAddItem}
                        className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors mt-2"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Adicionar Alimento
                    </button>
                </div>

                {/* Macro Summary Mini Form */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100">
                    <div>
                        <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Prot (g)</label>
                        <input
                            type="number"
                            value={block.macros?.protein || ''}
                            onChange={(e) => handleUpdateMacros('protein', Number(e.target.value))}
                            className="w-full text-sm font-medium text-gray-600 bg-transparent focus:outline-none"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Carb (g)</label>
                        <input
                            type="number"
                            value={block.macros?.carbs || ''}
                            onChange={(e) => handleUpdateMacros('carbs', Number(e.target.value))}
                            className="w-full text-sm font-medium text-gray-600 bg-transparent focus:outline-none"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Gord (g)</label>
                        <input
                            type="number"
                            value={block.macros?.fats || ''}
                            onChange={(e) => handleUpdateMacros('fats', Number(e.target.value))}
                            className="w-full text-sm font-medium text-gray-600 bg-transparent focus:outline-none"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Kcal</label>
                        <input
                            type="number"
                            value={block.macros?.calories || ''}
                            onChange={(e) => handleUpdateMacros('calories', Number(e.target.value))}
                            className="w-full text-sm font-medium text-gray-600 bg-transparent focus:outline-none"
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>
        </BaseBlock>
    )
}
