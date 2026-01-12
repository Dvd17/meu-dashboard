import { Dumbbell, Utensils, Type, Save, FileDown } from 'lucide-react';

interface ToolbarProps {
    onAddBlock: (type: 'training' | 'meal' | 'text') => void;
    onSaveTemplate: () => void;
    onExportPdf: () => void;
}

export function Toolbar({ onAddBlock, onSaveTemplate, onExportPdf }: ToolbarProps) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-1 pr-4 border-r border-gray-200">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1 mr-2 hidden sm:block">Adicionar</span>
                <button
                    onClick={() => onAddBlock('training')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-indigo-600 transition-colors tooltip-trigger"
                    title="Adicionar Treino"
                >
                    <Dumbbell className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onAddBlock('meal')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-emerald-600 transition-colors"
                    title="Adicionar Refeição"
                >
                    <Utensils className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onAddBlock('text')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-blue-600 transition-colors"
                    title="Adicionar Texto/Obs"
                >
                    <Type className="h-5 w-5" />
                </button>
            </div>

            <div className="flex items-center gap-1 pl-2">
                <button
                    onClick={onSaveTemplate}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors"
                >
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">Salvar Modelo</span>
                </button>
                <button
                    onClick={onExportPdf}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
                >
                    <FileDown className="h-4 w-4" />
                    <span className="hidden sm:inline">PDF</span>
                </button>
            </div>
        </div>
    );
}
