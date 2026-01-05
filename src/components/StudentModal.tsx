import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStudentStore } from '../store/useStudentStore';
import type { StudentStatus, Student } from '../types';

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentToEdit?: Student | null;
}

export function StudentModal({ isOpen, onClose, studentToEdit }: StudentModalProps) {
    const { addStudent, updateStudent } = useStudentStore();

    const [formData, setFormData] = useState({
        name: '',
        status: 'active' as StudentStatus,
        planValue: '',
        planType: 'monthly' as 'monthly' | 'bimonthly' | 'semiannual',
        renewalDate: '',
        entryDate: '',
        protocolType: 'both' as 'training' | 'diet' | 'both',
        notionUrl: ''
    });

    useEffect(() => {
        if (studentToEdit) {
            setFormData({
                name: studentToEdit.name,
                status: studentToEdit.status,
                planValue: studentToEdit.planValue.toString(),
                planType: studentToEdit.planType || 'monthly',
                renewalDate: studentToEdit.renewalDate.split('T')[0], // Ensure YYYY-MM-DD
                entryDate: studentToEdit.entryDate ? studentToEdit.entryDate.split('T')[0] : '',
                protocolType: studentToEdit.protocolType || 'both',
                notionUrl: studentToEdit.notionUrl || ''
            });
        } else {
            setFormData({
                name: '',
                status: 'active',
                planValue: '',
                planType: 'monthly',
                renewalDate: '',
                entryDate: new Date().toISOString().split('T')[0],
                protocolType: 'both',
                notionUrl: ''
            });
        }
    }, [studentToEdit, isOpen]);

    // Auto-calculate renewal date
    useEffect(() => {
        if (!formData.entryDate) return;

        // Parse YYYY-MM-DD components explicitly to avoid timezone issues
        const [year, month, day] = formData.entryDate.split('-').map(Number);

        // Create date object (Month is 0-indexed in JS Date)
        const entry = new Date(year, month - 1, day);

        let monthsToAdd = 1;
        if (formData.planType === 'bimonthly') monthsToAdd = 2;
        if (formData.planType === 'semiannual') monthsToAdd = 6;

        entry.setMonth(entry.getMonth() + monthsToAdd);

        // Format back to YYYY-MM-DD manually to ensure local time persistence
        const newYear = entry.getFullYear();
        const newMonth = String(entry.getMonth() + 1).padStart(2, '0');
        const newDay = String(entry.getDate()).padStart(2, '0');

        setFormData(prev => ({ ...prev, renewalDate: `${newYear}-${newMonth}-${newDay}` }));
    }, [formData.entryDate, formData.planType]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) return;

        if (studentToEdit) {
            updateStudent({
                ...studentToEdit,
                name: formData.name,
                status: formData.status,
                planValue: Number(formData.planValue) || 0,
                planType: formData.planType,
                renewalDate: formData.renewalDate, // Keep as string YYYY-MM-DD usually fine, or format if needed
                entryDate: formData.entryDate,
                protocolType: formData.protocolType,
                notionUrl: formData.notionUrl,
                lastUpdate: new Date().toISOString().split('T')[0] // Update timestamp on edit
            });
        } else {
            addStudent({
                name: formData.name,
                status: formData.status,
                planValue: Number(formData.planValue) || 0,
                planType: formData.planType,
                renewalDate: formData.renewalDate || new Date().toISOString().split('T')[0],
                entryDate: formData.entryDate || new Date().toISOString().split('T')[0],
                protocolType: formData.protocolType,
                notionUrl: formData.notionUrl,
                kanbanStatus: 'new_student',
                lastUpdate: new Date().toISOString().split('T')[0]
            });
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#181818] rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-[#2a2a2a]">
                <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
                    <h3 className="font-semibold text-white">
                        {studentToEdit ? 'Editar Aluno' : 'Novo Aluno'}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-[#2a2a2a] rounded-lg">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Nome do Aluno *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-[#2a2a2a] bg-[#121212] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-600"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                                className="w-full px-3 py-2 rounded-lg border border-[#2a2a2a] bg-[#121212] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            >
                                <option value="active">Ativo</option>
                                <option value="renewal">Renovação</option>
                                <option value="inactive">Inativo</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Valor do Plano (R$)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.planValue}
                                onChange={(e) => setFormData({ ...formData, planValue: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-[#2a2a2a] bg-[#121212] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Tipo de Plano
                        </label>
                        <select
                            value={formData.planType}
                            onChange={(e) => setFormData({ ...formData, planType: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-lg border border-[#2a2a2a] bg-[#121212] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        >
                            <option value="monthly">Mensal</option>
                            <option value="bimonthly">Bimestral</option>
                            <option value="semiannual">Semestral</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Data de Renovação
                        </label>
                        <input
                            type="date"
                            value={formData.renewalDate}
                            onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-[#2a2a2a] bg-[#121212] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Data de Entrada
                            </label>
                            <input
                                type="date"
                                value={formData.entryDate}
                                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-[#2a2a2a] bg-[#121212] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Tipo de Protocolo
                            </label>
                            <select
                                value={formData.protocolType}
                                onChange={(e) => setFormData({ ...formData, protocolType: e.target.value as any })}
                                className="w-full px-3 py-2 rounded-lg border border-[#2a2a2a] bg-[#121212] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            >
                                <option value="both">Treino + Dieta</option>
                                <option value="training">Apenas Treino</option>
                                <option value="diet">Apenas Dieta</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Link do Notion (Opcional)
                        </label>
                        <input
                            type="url"
                            value={formData.notionUrl}
                            onChange={(e) => setFormData({ ...formData, notionUrl: e.target.value })}
                            placeholder="https://notion.so/..."
                            className="w-full px-3 py-2 rounded-lg border border-[#2a2a2a] bg-[#121212] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-600"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#2a2a2a] rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-900/20"
                        >
                            {studentToEdit ? 'Salvar Alterações' : 'Adicionar Aluno'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
