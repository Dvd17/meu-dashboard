import { useMemo } from 'react';
import { Users, UserCheck, Clock, DollarSign } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useStudentStore } from '../store/useStudentStore';

export function DashboardStats() {
    const students = useStudentStore((state) => state.students);

    const stats = useMemo(() => {
        const active = students.filter((s) => s.status === 'active');
        const renewal = students.filter((s) => s.status === 'renewal');

        const calculateMRR = (student: typeof students[0]) => {
            const value = student.planValue || 0;
            switch (student.planType) {
                case 'bimonthly': return value / 2;
                case 'semiannual': return value / 6;
                case 'monthly':
                default: return value;
            }
        };

        const totalMRR = active.reduce((acc, curr) => acc + calculateMRR(curr), 0) +
            renewal.reduce((acc, curr) => acc + calculateMRR(curr), 0);

        return {
            total: students.length,
            active: active.length,
            renewal: renewal.length,
            revenue: totalMRR,
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
                title="MRR Estimado"
                value={`R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={DollarSign}
                description="Receita recorrente mensal"
            />
        </div>
    );
}
