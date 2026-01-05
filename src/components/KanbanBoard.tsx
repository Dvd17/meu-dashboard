
import { useMemo } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { KanbanFilters } from './KanbanFilters';
import { useStudentStore } from '../store/useStudentStore';
import type { KanbanStatus } from '../types';

export function KanbanBoard() {
    const students = useStudentStore((state) => state.students);
    const searchTerm = useStudentStore((state) => state.searchTerm);
    const statusFilter = useStudentStore((state) => state.statusFilter);
    const moveStudent = useStudentStore((state) => state.moveStudent);

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = statusFilter === 'all' || student.status === statusFilter;
            return matchesSearch && matchesFilter;
        });
    }, [students, searchTerm, statusFilter]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as KanbanStatus;
        moveStudent(draggableId, newStatus);
    };

    const columns: { id: KanbanStatus, title: string }[] = [
        { id: 'new_student', title: 'Novo Aluno' },
        { id: 'in_development', title: 'Em Desenvolvimento' },
        { id: 'pending_update', title: 'Atualização Pendente' },
        { id: 'finished', title: 'Finalizado' },
    ];

    return (
        <div className="flex flex-col h-full">
            <KanbanFilters />

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col md:flex-row h-full gap-6 pb-4 items-start">
                        {columns.map(col => (
                            <KanbanColumn
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                students={filteredStudents.filter(s => s.kanbanStatus === col.id)}
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}
