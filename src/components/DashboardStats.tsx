import { useMemo } from 'react';
import { Users, UserCheck, Clock, DollarSign } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useStudentStore } from '../store/useStudentStore';

export function DashboardStats() {
    const students = useStudentStore((state) => state.students);

    const stats = useMemo(() => {
        const active = students.filter((s) => s.status === 'active');
        const renewal = students.filter((s) => s.status === 'renewal');
        const totalValue = active.reduce((acc, curr) => acc + curr.planValue, 0) +
            renewal.reduce((acc, curr) => acc + curr.planValue, 0);

        return {
            total: students.length,
            active: active.length,
            renewal: renewal.length,
            revenue: totalValue,
        };
    }, [students]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
                title="Total de Alunos"
                value={stats.total}
                icon={Users}
                description="Todos os alunos cadastrados"
            />
            <StatsCard
                title="Alunos Ativos"
                value={stats.active}
                icon={UserCheck}
                description="Em dia com a consultoria"
            />
            <StatsCard
                title="Em Renovação"
                value={stats.renewal}
                icon={Clock}
                description="Precisam renovar em breve"
            />
            <StatsCard
                title="Faturamento Mensal"
                value={`R$ ${stats.revenue.toLocaleString('pt-BR')}`}
                icon={DollarSign}
                description="Receita recorrente atual"
            />
        </div>
    );
}
