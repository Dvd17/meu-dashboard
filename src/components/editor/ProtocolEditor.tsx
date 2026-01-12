import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useProtocolStore } from '../../store/useProtocolStore';
import { TrainingBlock } from './blocks/TrainingBlock';
import { MealBlock } from './blocks/MealBlock';
import { BaseBlock } from './blocks/BaseBlock';
import { Toolbar } from './Toolbar';
import { Plus, Trash, GripHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { BlockType } from '../../types/protocol';

export function ProtocolEditor() {
    const {
        currentProtocol,
        setTitle,
        addSection,
        removeSection,
        addBlock,
        reorderBlocks,
        updateBlock,
        removeBlock,
        saveAsTemplate
    } = useProtocolStore();

    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const sectionId = result.source.droppableId;
        reorderBlocks(sectionId, result.source.index, result.destination.index);
    };

    const handleAddBlockToActive = (type: BlockType) => {
        // Adds to the first section if none focused, or the active section
        // For simplicity, defaulting to the first section if activeSectionId is null or invalid
        const targetSection = activeSectionId ? activeSectionId : currentProtocol.sections[0]?.id;

        if (targetSection) {
            addBlock(targetSection, type);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-32">
            <div className="max-w-4xl mx-auto px-4 py-12">

                {/* Header */}
                <div className="mb-12 text-center space-y-2">
                    <input
                        type="text"
                        value={currentProtocol.title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-4xl font-bold text-gray-900 text-center bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300"
                        placeholder="Nome do Protocolo"
                    />
                    <p className="text-gray-400 text-sm">
                        Última edição: {new Date(currentProtocol.updatedAt).toLocaleTimeString()}
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {currentProtocol.sections.map((section) => (
                            <div
                                key={section.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                onClick={() => setActiveSectionId(section.id)}
                            >
                                {/* Section Header */}
                                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <GripHorizontal className="h-4 w-4 text-gray-300 cursor-grab" />
                                        <input
                                            value={section.title}
                                            // Quick fix: Update section title needs store action (not added yet to plan but needed)
                                            // For now just display
                                            readOnly
                                            className="font-semibold text-gray-700 bg-transparent focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeSection(section.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Blocks Droppable Area */}
                                <Droppable droppableId={section.id}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="p-4 min-h-[100px] bg-[#FAFAFA]/50"
                                        >
                                            {section.blocks.map((block, index) => {
                                                if (block.type === 'training') {
                                                    return <TrainingBlock key={block.id} sectionId={section.id} block={block} index={index} />
                                                }
                                                if (block.type === 'meal') {
                                                    return <MealBlock key={block.id} sectionId={section.id} block={block} index={index} />
                                                }
                                                // Text Block Fallback inline implementation for speed
                                                return (
                                                    <BaseBlock
                                                        key={block.id}
                                                        id={block.id}
                                                        index={index}
                                                        onRemove={() => removeBlock(section.id, block.id)}
                                                        title="Observações"
                                                        colorAccent="#3b82f6"
                                                    >
                                                        <textarea
                                                            value={block.content}
                                                            onChange={(e) => updateBlock(section.id, block.id, { content: e.target.value })}
                                                            className="w-full bg-transparent border-none focus:ring-0 resize-none h-24 text-gray-600"
                                                            placeholder="Digite suas observações aqui..."
                                                        />
                                                    </BaseBlock>
                                                )
                                            })}
                                            {provided.placeholder}

                                            {section.blocks.length === 0 && (
                                                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                                                    Nenhum conteúdo neste dia. <br /> Use a barra inferior para adicionar.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </DragDropContext>

                    <button
                        onClick={() => addSection(`Dia ${currentProtocol.sections.length + 1}`)}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-medium hover:border-indigo-400 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Adicionar Novo Dia/Seção
                    </button>
                </div>
            </div>

            <Toolbar
                onAddBlock={handleAddBlockToActive}
                onSaveTemplate={saveAsTemplate}
                onExportPdf={() => alert("Gerar PDF - Funcionalidade em breve")}
            />
        </div>
    );
}
