import { DashboardStats } from '../components/DashboardStats';
import { KanbanBoard } from '../components/KanbanBoard';

export function Dashboard() {
    return (
        <div className="flex flex-col h-full gap-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Dashboard Geral</h1>
                <p className="text-gray-400">Visão geral dos seus alunos e pendências.</p>
            </div>

            <DashboardStats />

            <div className="flex-1 min-h-0">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">Acompanhamento de Alunos</h2>
                </div>
                <KanbanBoard />
            </div>
        </div>
    );
}
