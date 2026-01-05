import { X, Calendar, User, Activity, Dumbbell, Utensils, FileText } from 'lucide-react';
import type { Student } from '../types';

interface AnamnesisViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student | null;
}

export function AnamnesisViewerModal({ isOpen, onClose, student }: AnamnesisViewerModalProps) {
    if (!isOpen || !student || !student.anamnesis) return null;

    const { anamnesis } = student;

    // Helper map for display
    const experienceMap = {
        beginner: 'Iniciante',
        intermediate: 'Intermediário',
        advanced: 'Avançado'
    };

    const sexMap = {
        male: 'Masculino',
        female: 'Feminino'
    };

    const InfoCard = ({ label, value }: { label: string, value?: string | number }) => (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</span>
            <p className="text-gray-900 dark:text-gray-200 whitespace-pre-wrap text-sm">{value || '-'}</p>
        </div>
    );

    const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="flex items-center gap-2 mb-3 mt-2">
            <Icon className="h-4 w-4 text-indigo-500" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{title}</h4>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#121212] rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col border border-gray-800">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#121212] z-10">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                            Anamnesis: {anamnesis.fullName || student.name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 pl-4">
                            <Calendar className="h-3 w-3" />
                            Enviada em {student.anamnesisSubmittedAt ? new Date(student.anamnesisSubmittedAt).toLocaleDateString('pt-BR') : 'N/A'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Personal */}
                    <section>
                        <SectionTitle icon={User} title="Dados Pessoais" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <InfoCard label="Idade" value={anamnesis.age} />
                            <InfoCard label="Sexo" value={sexMap[anamnesis.sex]} />
                            <InfoCard label="Peso" value={`${anamnesis.weight} kg`} />
                            <InfoCard label="Altura" value={`${anamnesis.height} cm`} />
                            <div className="col-span-2 md:col-span-2"><InfoCard label="WhatsApp" value={anamnesis.whatsapp} /></div>
                            <div className="col-span-2 md:col-span-2"><InfoCard label="Email" value={anamnesis.email} /></div>
                        </div>
                    </section>

                    {/* Health */}
                    <section>
                        <SectionTitle icon={Activity} title="Saúde" />
                        <div className="grid grid-cols-1 gap-3">
                            <InfoCard label="Patologias" value={anamnesis.pathology} />
                            <InfoCard label="Lesões / Cirurgias" value={anamnesis.injuries} />
                            <InfoCard label="Medicações" value={anamnesis.medications} />
                        </div>
                    </section>

                    {/* Training */}
                    <section>
                        <SectionTitle icon={Dumbbell} title="Treino" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                                <InfoCard label="Nível" value={experienceMap[anamnesis.experienceLevel]} />
                            </div>
                            <InfoCard label="Disponibilidade / Local" value={anamnesis.trainingAvailability} />
                            <InfoCard label="Treino Atual" value={anamnesis.currentTraining} />
                        </div>
                    </section>

                    {/* Nutrition */}
                    <section>
                        <SectionTitle icon={Utensils} title="Nutrição & Objetivos" />
                        <div className="space-y-3">
                            <InfoCard label="Objetivo Principal" value={anamnesis.aestheticGoals} />
                            <InfoCard label="Histórico Alimentar" value={anamnesis.dietaryHistory} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <InfoCard label="Restrições" value={anamnesis.restrictions} />
                                <InfoCard label="Dificuldades" value={anamnesis.difficulties} />
                            </div>
                            <InfoCard label="Suplementação" value={anamnesis.supplements} />
                        </div>
                    </section>

                    {/* Notes */}
                    <section>
                        <SectionTitle icon={FileText} title="Observações" />
                        <InfoCard label="Notas Finais" value={anamnesis.finalNotes} />
                    </section>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f0f] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
