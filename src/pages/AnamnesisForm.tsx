import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStudentStore } from '../store/useStudentStore';
import { CheckCircle, AlertCircle, Save, User, Activity, Dumbbell, Utensils, FileText } from 'lucide-react';
import type { Anamnesis } from '../types';
import djTeamLogo from '../assets/dj-team-logo.png';

export function AnamnesisForm() {
    const { token } = useParams<{ token: string }>();
    const { getStudentByToken, submitAnamnesis } = useStudentStore();
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
    const [studentName, setStudentName] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Anamnesis>({
        fullName: '',
        email: '',
        whatsapp: '',
        age: '',
        sex: 'male',
        weight: '',
        height: '',
        pathology: '',
        injuries: '',
        medications: '',
        experienceLevel: 'beginner',
        trainingAvailability: '',
        currentTraining: '',
        dietaryHistory: '',
        restrictions: '',
        aestheticGoals: '',
        difficulties: '',
        currentDiet: '',
        supplements: '',
        finalNotes: ''
    });

    useEffect(() => {
        if (token) {
            const student = getStudentByToken(token);
            if (student) {
                setIsValidToken(true);
                setStudentName(student.name);
                // Pre-fill name if empty
                if (!formData.fullName) {
                    setFormData(prev => ({ ...prev, fullName: student.name }));
                }
                if (student.anamnesis) {
                    setIsSubmitted(true);
                }
            } else {
                setIsValidToken(false);
            }
        }
    }, [token, getStudentByToken]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (token && isValidToken) {
            const success = submitAnamnesis(token, formData);
            if (success) {
                setIsSubmitted(true);
            }
        }
    };

    if (isValidToken === null) {
        return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">Carregando...</div>;
    }

    if (!isValidToken) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
                <div className="bg-[#1e1e1e] p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-red-900/30">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Link Inválido</h2>
                    <p className="text-gray-400">Este link de anamnese não é válido ou expirou. Entre em contato com seu treinador.</p>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
                <div className="bg-[#1e1e1e] p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-green-900/30">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Anamnese Recebida!</h2>
                    <p className="text-gray-400">Obrigado, {studentName}. Suas informações foram enviadas com sucesso para a equipe DJ TEAM.</p>
                </div>
            </div>
        );
    }

    const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-800">
            <div className="p-2 bg-blue-900/20 rounded-lg">
                <Icon className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wide">{title}</h2>
        </div>
    );

    const InputGroup = ({ label, name, type = "text", placeholder, required = false, width = "full" }: any) => (
        <div className={`${width === 'half' ? 'col-span-1' : 'col-span-2'}`}>
            <label className="block text-sm font-medium text-gray-400 mb-1.5 uppercase tracking-wide text-xs">
                {label} {required && <span className="text-blue-500">*</span>}
            </label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={(formData as any)[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    rows={3}
                    className="w-full bg-[#121212] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={(formData as any)[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full bg-[#121212] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f0f0f] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <img src={djTeamLogo} alt="DJ TEAM" className="h-16 h-auto mx-auto mb-4 object-contain" />
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Ficha de Anamnese</h1>
                    <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                        Preencha com o máximo de detalhes possível para que possamos montar o melhor protocolo para você.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Info */}
                    <div className="bg-[#1e1e1e] shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-800">
                        <SectionHeader icon={User} title="Dados Pessoais" />
                        <div className="grid grid-cols-2 gap-6">
                            <InputGroup label="Nome Completo" name="fullName" required />
                            <InputGroup label="E-mail" name="email" type="email" width="half" required />
                            <InputGroup label="WhatsApp" name="whatsapp" width="half" required placeholder="(00) 00000-0000" />

                            <div className="grid grid-cols-4 gap-4 col-span-2">
                                <InputGroup label="Idade" name="age" type="number" width="half" />
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5 uppercase tracking-wide text-xs">Sexo</label>
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleChange}
                                        className="w-full bg-[#121212] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    >
                                        <option value="male">Masculino</option>
                                        <option value="female">Feminino</option>
                                    </select>
                                </div>
                                <InputGroup label="Peso (kg)" name="weight" type="number" width="half" />
                                <InputGroup label="Altura (cm)" name="height" type="number" width="half" />
                            </div>
                        </div>
                    </div>

                    {/* Health */}
                    <div className="bg-[#1e1e1e] shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-800">
                        <SectionHeader icon={Activity} title="Histórico de Saúde" />
                        <div className="space-y-6">
                            <InputGroup label="Possui alguma patologia? (Diabetes, hipertensão, etc)" name="pathology" type="textarea" placeholder="Se não, deixe em branco." />
                            <InputGroup label="Lesões ou Cirurgias Prévias" name="injuries" type="textarea" />
                            <InputGroup label="Uso de Medicações (Quais e horários)" name="medications" type="textarea" />
                        </div>
                    </div>

                    {/* Training */}
                    <div className="bg-[#1e1e1e] shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-800">
                        <SectionHeader icon={Dumbbell} title="Treino e Rotina" />
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5 uppercase tracking-wide text-xs">Nível de Experiência</label>
                                <select
                                    name="experienceLevel"
                                    value={formData.experienceLevel}
                                    onChange={handleChange}
                                    className="w-full bg-[#121212] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                >
                                    <option value="beginner">Iniciante (Treina há menos de 1 ano)</option>
                                    <option value="intermediate">Intermediário (1 a 3 anos)</option>
                                    <option value="advanced">Avançado (Mais de 3 anos)</option>
                                </select>
                            </div>
                            <InputGroup label="Tempo disponível / Onde treina" name="trainingAvailability" type="textarea" placeholder="Ex: 1h por dia, Smart Fit..." />
                            <InputGroup label="Como é seu treino atual?" name="currentTraining" type="textarea" placeholder="Descreva brevemente sua divisão atual..." />
                        </div>
                    </div>

                    {/* Nutrition */}
                    <div className="bg-[#1e1e1e] shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-800">
                        <SectionHeader icon={Utensils} title="Nutrição e Objetivos" />
                        <div className="space-y-6">
                            <InputGroup label="Objetivo Principal" name="aestheticGoals" type="textarea" placeholder="Ex: Hipertrofia, Emagrecimento, Definição..." required />
                            <InputGroup label="Histórico Alimentar (O que come no dia a dia?)" name="dietaryHistory" type="textarea" placeholder="Descreva suas refeições habituais..." required />
                            <InputGroup label="Alergias ou Restrições Alimentares" name="restrictions" type="textarea" />
                            <InputGroup label="Principais Dificuldades com Dieta" name="difficulties" type="textarea" />
                            <InputGroup label="Suplementação Atual" name="supplements" type="textarea" />
                        </div>
                    </div>

                    {/* Final Notes */}
                    <div className="bg-[#1e1e1e] shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-800">
                        <SectionHeader icon={FileText} title="Observações Finais" />
                        <div className="space-y-6">
                            <InputGroup label="Algo mais que devamos saber?" name="finalNotes" type="textarea" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-900/40 transition-all transform hover:-translate-y-0.5 text-lg"
                    >
                        <Save className="h-6 w-6" />
                        ENVIAR ANAMNESE
                    </button>

                    <p className="text-center text-gray-500 text-sm pb-8">
                        DJ TEAM Consultoria Esportiva © 2024
                    </p>
                </form>
            </div>
        </div>
    );
}
