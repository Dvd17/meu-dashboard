import type { ReactNode } from 'react';
import { GripVertical, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Draggable } from '@hello-pangea/dnd';

interface BaseBlockProps {
    id: string;
    index: number;
    onRemove: () => void;
    children: ReactNode;
    title?: string;
    icon?: ReactNode;
    colorAccent?: string; // Hex color for left border accent
}

export function BaseBlock({ id, index, onRemove, children, title, icon, colorAccent }: BaseBlockProps) {
    return (
        <Draggable draggableId={id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                        "group relative bg-white border border-gray-200 rounded-lg shadow-sm mb-4 transition-all duration-200",
                        snapshot.isDragging && "shadow-lg scale-[1.02] z-50 ring-2 ring-indigo-500/20"
                    )}
                >
                    {/* Drag Handle - Visible on hover or dragging */}
                    <div
                        {...provided.dragHandleProps}
                        className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-50 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <GripVertical className="h-4 w-4 text-gray-400" />
                    </div>

                    {/* Content Container */}
                    <div className="pl-8 pr-4 py-4">
                        {/* Header if Title or Icon is present */}
                        {(title || icon) && (
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    {icon && <span className="text-gray-500">{icon}</span>}
                                    {title && <span>{title}</span>}
                                </div>
                                <button
                                    onClick={onRemove}
                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remover bloco"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* If no header, show delete button absolute top right */}
                        {(!title && !icon) && (
                            <button
                                onClick={onRemove}
                                className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                title="Remover bloco"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}

                        {/* Accent Bar */}
                        {colorAccent && (
                            <div
                                className="absolute left-0 top-4 bottom-4 w-1 rounded-r-sm"
                                style={{ backgroundColor: colorAccent }}
                            />
                        )}

                        <div className="text-gray-800 text-sm">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
