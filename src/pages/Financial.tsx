import { DollarSign, CreditCard, Users, Calendar } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { StatsCard } from '../components/StatsCard';
import { useStudentStore } from '../store/useStudentStore';
import { useMemo, useState } from 'react';

export function Financial() {
    const students = useStudentStore((state) => state.students);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Calculate Real KPIs based on Entry Date (Sales)
    const financialData = useMemo(() => {
        // Group by month
        const monthlyData = new Array(12).fill(0).map((_, i) => ({
            name: new Date(0, i).toLocaleString('pt-BR', { month: 'short' }),
            monthIndex: i,
            revenue: 0,
            count: 0
        }));

        let totalYearRevenue = 0;
        let totalYearSales = 0;

        students.forEach(student => {
            if (!student.entryDate) return;
            const entryDate = new Date(student.entryDate);

            if (entryDate.getFullYear() === selectedYear) {
                const month = entryDate.getMonth();
                monthlyData[month].revenue += student.planValue;
                monthlyData[month].count += 1;
                totalYearRevenue += student.planValue;
                totalYearSales += 1;
            }
        });

        const activeStudents = students.filter(s => s.status === 'active');

        return {
            chartData: monthlyData,
            totalYearRevenue,
            totalYearSales,
            activeCount: activeStudents.length,
            avgTicket: totalYearSales > 0 ? totalYearRevenue / totalYearSales : 0
        };
    }, [students, selectedYear]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Financeiro (Vendas)</h1>
                    <p className="text-gray-400">Faturamento baseado na data de entrada do aluno.</p>
                </div>

                <div className="flex gap-2 items-center">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="bg-[#181818] border border-[#2a2a2a] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title={`Vendas em ${selectedYear}`}
                    value={`R$ ${financialData.totalYearRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    description="Receita de novas entradas"
                />
                <StatsCard
                    title="Ticket Médio (Entradas)"
                    value={`R$ ${financialData.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    icon={CreditCard}
                    description="Por novo aluno"
                />
                <StatsCard
                    title="Alunos Ativos Totais"
                    value={financialData.activeCount.toString()}
                    icon={Users}
                    description="Base total atual"
                />
            </div>

            <div className="bg-[#181818] p-6 rounded-xl shadow-sm border border-[#2a2a2a]">
                <h3 className="text-lg font-semibold text-white mb-6">Vendas Mensais ({selectedYear})</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financialData.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickFormatter={(value) => `R$${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: '#2a2a2a', opacity: 0.5 }}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #2a2a2a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#181818', color: '#fff' }}
                                itemStyle={{ color: '#60a5fa' }}
                                formatter={(value: number | undefined) => [`R$ ${value ? value.toFixed(2) : '0.00'}`, 'Receita']}
                            />
                            <Bar
                                dataKey="revenue"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
