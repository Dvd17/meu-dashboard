import { Search } from 'lucide-react';
import { useStudentStore } from '../store/useStudentStore';
import type { StudentStatus } from '../types';
import { cn } from '../lib/utils';

export function KanbanFilters() {
    const { searchTerm, setSearchTerm, statusFilter, setStatusFilter } = useStudentStore();

    const statusOptions: { value: StudentStatus | 'all'; label: string }[] = [
        { value: 'all', label: 'Todos' },
        { value: 'active', label: 'Ativos' },
        { value: 'renewal', label: 'Em Renovação' },
        { value: 'inactive', label: 'Inativos' },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar aluno por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                {statusOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setStatusFilter(option.value)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                            statusFilter === option.value
                                ? "bg-indigo-600 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
