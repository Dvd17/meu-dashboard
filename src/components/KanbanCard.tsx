import { useState } from 'react';
import type { Student } from '../types';
import { Calendar, ExternalLink, Clock, GripVertical, Pencil, AlertCircle, FileText } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { cn } from '../lib/utils';
import { EditLinkModal } from './EditLinkModal';
import { AnamnesisViewerModal } from './AnamnesisViewerModal';
import { getRenewalStatus } from '../utils/dateUtils';

interface KanbanCardProps {
    student: Student;
    index: number;
}

export function KanbanCard({ student, index }: KanbanCardProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAnamnesisModalOpen, setIsAnamnesisModalOpen] = useState(false);

    const statusColors = {
        active: 'bg-green-900/30 text-green-400 border-green-800',
        inactive: 'bg-[#2a2a2a] text-gray-400 border-[#333]',
        renewal: 'bg-amber-900/30 text-amber-400 border-amber-800',
    };

    const protocolIcons = {
        training: { icon: '🏋️', label: 'Treino', color: 'bg-blue-900/30 text-blue-400 border-blue-800' },
        diet: { icon: '🥗', label: 'Dieta', color: 'bg-green-900/30 text-green-400 border-green-800' },
        both: { icon: '🔥', label: 'Treino + Dieta', color: 'bg-purple-900/30 text-purple-400 border-purple-800' }
    };

    const statusLabels = {
        active: 'Ativo',
        inactive: 'Inativo',
        renewal: 'Renovação',
    };

    const renewalStatus = getRenewalStatus(student.renewalDate);
    const isExpired = renewalStatus === 'expired';
    const isWarning = renewalStatus === 'warning';

    return (
        <>
            <Draggable draggableId={student.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                            "bg-[#181818] p-4 rounded-xl shadow-sm border border-[#2a2a2a] mb-3 group hover:shadow-md transition-all active:cursor-grabbing",
                            snapshot.isDragging ? "shadow-xl rotate-2 scale-105 z-50 border-blue-500" : "",
                            (isExpired || isWarning) && "border-l-4",
                            isExpired && "border-l-red-500",
                            isWarning && "border-l-orange-500"
                        )}
                        style={provided.draggableProps.style}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", statusColors[student.status])}>
                                        {statusLabels[student.status]}
                                    </span>
                                    {student.protocolType && (
                                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border", protocolIcons[student.protocolType]?.color)}>
                                            <span>{protocolIcons[student.protocolType]?.icon}</span>
                                            <span className="hidden sm:inline">{protocolIcons[student.protocolType]?.label}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <GripVertical className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <h3 className="font-semibold text-white mb-1.5">{student.name}</h3>

                        <div className="space-y-2 text-xs text-gray-400 pt-2 border-t border-[#2a2a2a]">
                            <div className={cn("flex items-center gap-2", (isExpired || isWarning) && "text-red-400 font-medium")}>
                                {isExpired || isWarning ? <AlertCircle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                                <span>Renova: {new Date(student.renewalDate).toLocaleDateString('pt-BR')}</span>
                            </div>

                            <div className="flex items-center gap-2" title={`Última atualização: ${new Date(student.lastUpdate).toLocaleString('pt-BR')}`}>
                                <Clock className="h-3.5 w-3.5" />
                                <span>Atualizado: {new Date(student.lastUpdate).toLocaleDateString('pt-BR')}</span>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                    setIsEditModalOpen(true);
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-[#2a2a2a] rounded-md transition-colors"
                                title="Editar Notion Link"
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </button>
                            {student.anamnesis && (
                                <button
                                    onClick={() => setIsAnamnesisModalOpen(true)}
                                    className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-[#2a2a2a] rounded-md transition-colors"
                                    title="Ver Anamnese"
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    <FileText className="h-3.5 w-3.5" />
                                </button>
                            )}
                            {student.notionUrl && (
                                <a
                                    href={student.notionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-[#2a2a2a] rounded-md transition-colors"
                                    title="Abrir no Notion"
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </Draggable>

            <EditLinkModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                studentId={student.id}
                currentUrl={student.notionUrl || ''}
            />

            <AnamnesisViewerModal
                isOpen={isAnamnesisModalOpen}
                onClose={() => setIsAnamnesisModalOpen(false)}
                student={student}
            />
        </>
    );
}
