import { useState } from 'react';
import { X } from 'lucide-react';
import { useStudentStore } from '../store/useStudentStore';

interface EditLinkModalProps {
    studentId: string;
    currentUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

export function EditLinkModal({ studentId, currentUrl, isOpen, onClose }: EditLinkModalProps) {
    const [url, setUrl] = useState(currentUrl);
    const updateNotionLink = useStudentStore((state) => state.updateNotionLink);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateNotionLink(studentId, url);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#181818] rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-[#2a2a2a]">
                <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
                    <h3 className="font-semibold text-white">Editar Link do Notion</h3>
                    <button onClick={onClose} className="p-1 hover:bg-[#2a2a2a] rounded-lg">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
                            URL da Página
                        </label>
                        <input
                            id="url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://notion.so/..."
                            className="w-full px-3 py-2 rounded-lg border border-[#2a2a2a] bg-[#121212] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-600"
                            autoFocus
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
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
