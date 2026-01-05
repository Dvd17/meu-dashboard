
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    className?: string;
}

export function StatsCard({ title, value, icon: Icon, description, className }: StatsCardProps) {
    return (
        <div className={cn("bg-[#181818] p-6 rounded-xl shadow-sm border border-[#2a2a2a]", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                </div>
                <div className="h-12 w-12 bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-400" />
                </div>
            </div>
            {description && (
                <div className="mt-4 flex items-center text-sm text-gray-400">
                    {description}
                </div>
            )}
        </div>
    );
}
