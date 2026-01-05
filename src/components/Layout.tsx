import React from 'react';
import { LayoutDashboard, Users, LogOut, Settings, Menu, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

import djTeamLogo from '../assets/dj-team-logo-transparent.png';

export function Layout({ children }: LayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ... (maintain current sidebar styling logic but use NavLink)

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
        { icon: Users, label: 'Alunos', href: '/alunos' },
        { icon: TrendingUp, label: 'Financeiro', href: '/financeiro' },
        { icon: Settings, label: 'Configurações', href: '/configuracoes' },
    ];

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-gray-100 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-[#121212] border-r border-[#2a2a2a] fixed h-full z-10">
                <div className="h-20 flex items-center px-6 border-b border-[#2a2a2a]">
                    <div className="flex items-center gap-3">
                        <img src={djTeamLogo} alt="DJ TEAM" className="h-10 w-auto object-contain" />
                        <span className="font-bold text-xl text-white tracking-wide">DJ TEAM</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`
                            }
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full transition-colors">
                        <LogOut className="h-5 w-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#121212] border-b border-[#2a2a2a] z-20 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src={djTeamLogo} alt="DJ TEAM" className="h-8 object-contain" />
                    <span className="font-bold text-lg text-white">DJ TEAM</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400 hover:text-white">
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-30 bg-gray-800/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 p-4" onClick={(e) => e.stopPropagation()}>
                        <nav className="space-y-1 mt-14">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`
                                    }
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </NavLink>
                            ))}
                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 w-full">
                                    <LogOut className="h-5 w-5" />
                                    Sair
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 bg-[#0f0f0f] min-h-screen">
                <div className="max-w-7xl mx-auto h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
