import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import type { Student, KanbanStatus } from '../types';
import { cn } from '../lib/utils';

interface KanbanColumnProps {
    id: KanbanStatus;
    title: string;
    students: Student[];
}

export function KanbanColumn({ id, title, students }: KanbanColumnProps) {
    return (
        <div className="flex-1 min-w-[300px] flex flex-col bg-[#121212] rounded-xl border border-[#2a2a2a] h-full">
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between sticky top-0 bg-inherit rounded-t-xl z-10">
                <h3 className="font-semibold text-gray-200">{title}</h3>
                <span className="bg-[#1f1f1f] text-gray-400 px-2 py-0.5 rounded-full text-xs font-medium">
                    {students.length}
                </span>
            </div>

            <div className="flex-1 p-2 overflow-y-auto">
                <Droppable droppableId={id}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                                "min-h-[150px] transition-colors rounded-lg",
                                snapshot.isDraggingOver && "bg-blue-900/10"
                            )}
                        >
                            {students.map((student, index) => (
                                <KanbanCard key={student.id} student={student} index={index} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
}
