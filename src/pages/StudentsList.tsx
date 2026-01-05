import { Search, Plus, ExternalLink, Link as LinkIcon, AlertCircle, FileText, CheckCircle, Pencil, Trash } from 'lucide-react';
import { useStudentStore } from '../store/useStudentStore';
import { StudentModal } from '../components/StudentModal';
import { AnamnesisViewerModal } from '../components/AnamnesisViewerModal';
import { cn } from '../lib/utils';
import { getRenewalStatus } from '../utils/dateUtils';
import type { Student } from '../types';
import { useState } from 'react';

export function StudentsList() {
    const { students, searchTerm, setSearchTerm, removeStudent, generateAnamnesisLink } = useStudentStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [viewAnamnesisStudent, setViewAnamnesisStudent] = useState<Student | null>(null);

    const filtered = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (student?: Student) => {
        if (student) {
            setStudentToEdit(student);
        } else {
            setStudentToEdit(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setStudentToEdit(null);
    };

    const handleDeleteStudent = (id: string, name: string) => {
        if (window.confirm(`Tem certeza que deseja excluir o aluno "${name}"? Essa ação não pode ser desfeita.`)) {
            removeStudent(id);
        }
    };

    const formattedLink = (token?: string) => {
        if (!token) return '';
        return `${window.location.origin}/anamnese/${token}`;
    };

    const handleCopyAnamnesisLink = (student: Student) => {
        const token = generateAnamnesisLink(student.id);
        const link = formattedLink(token);
        navigator.clipboard.writeText(link);
        alert('Link copiado para a área de transferência!');
    };

    const statusColors = {
        active: 'bg-green-900/30 text-green-400 border-green-800',
        inactive: 'bg-[#2a2a2a] text-gray-400 border-[#333]',
        renewal: 'bg-amber-900/30 text-amber-400 border-amber-800',
    };

    const statusLabels = {
        active: 'Ativo',
        inactive: 'Inativo',
        renewal: 'Renovação',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Meus Alunos</h1>
                    <p className="text-gray-400">Gerencie todos os seus alunos cadastrados.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-900/20 mr-2"
                >
                    <Plus className="h-5 w-5" />
                    Novo Aluno
                </button>
            </div>

            <div className="bg-[#181818] rounded-xl shadow-sm border border-[#2a2a2a] overflow-hidden">
                <div className="p-4 border-b border-[#2a2a2a]">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar aluno..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#2a2a2a] bg-[#121212] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#121212] text-gray-400 font-medium border-b border-[#2a2a2a]">
                            <tr>
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Anamnese</th>
                                <th className="px-6 py-4">Valor do Plano</th>
                                <th className="px-6 py-4">Data de Entrada</th>
                                <th className="px-6 py-4">Renovação</th>
                                <th className="px-6 py-4">Última Atualização</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                            {filtered.map((student) => {
                                const renewalStatus = getRenewalStatus(student.renewalDate);
                                const isAlert = renewalStatus === 'expired' || renewalStatus === 'warning';
                                const hasAnamnesis = !!student.anamnesis;

                                return (
                                    <tr key={student.id} className="hover:bg-[#1f1f1f] transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{student.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", statusColors[student.status])}>
                                                {statusLabels[student.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {hasAnamnesis ? (
                                                <button
                                                    onClick={() => setViewAnamnesisStudent(student)}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors border border-green-900/50"
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    Concluída
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleCopyAnamnesisLink(student)}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white transition-colors border border-[#333]"
                                                    title="Copiar Link de Anamnese"
                                                >
                                                    <LinkIcon className="h-3.5 w-3.5" />
                                                    Gerar Link
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            R$ {student.planValue.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {student.entryDate ? new Date(student.entryDate).toLocaleDateString('pt-BR') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <div className="flex items-center gap-2">
                                                {isAlert && <AlertCircle className="h-4 w-4 text-red-500" />}
                                                <span className={cn(isAlert && "text-red-400 font-medium")}>
                                                    {new Date(student.renewalDate).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {new Date(student.lastUpdate).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {hasAnamnesis && (
                                                    <button
                                                        onClick={() => setViewAnamnesisStudent(student)}
                                                        className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                                                        title="Ver Anamnese Completa"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {!hasAnamnesis && (
                                                    <button
                                                        onClick={() => handleCopyAnamnesisLink(student)}
                                                        className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                                                        title="Copiar Link de Anamnese"
                                                    >
                                                        <LinkIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {student.notionUrl && (
                                                    <a
                                                        href={student.notionUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                                                        title="Abrir no Notion"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleOpenModal(student)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                                                    title="Editar Aluno"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStudent(student.id, student.name)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Excluir Aluno"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Nenhum aluno encontrado.
                    </div>
                )}
            </div>

            <StudentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                studentToEdit={studentToEdit}
            />

            <AnamnesisViewerModal
                isOpen={!!viewAnamnesisStudent}
                onClose={() => setViewAnamnesisStudent(null)}
                student={viewAnamnesisStudent}
            />
        </div>
    );
}
