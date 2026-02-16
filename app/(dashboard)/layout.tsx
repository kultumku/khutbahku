'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const navItems = [
        { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
        { href: '/generator', icon: '✨', label: 'Buat Khutbah' },
        { href: '/history', icon: '📚', label: 'Riwayat' },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-surface)]">
            {/* Top Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[var(--color-border)] h-16">
                <div className="flex items-center justify-between h-full px-4 lg:px-8">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-2xl">🕌</span>
                        <span className="text-xl font-bold gradient-text">KhutbahKu</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="/generator" className="btn-primary text-sm !py-2 !px-4 hidden sm:inline-flex">
                            + Buat Khutbah
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-[var(--color-text-secondary)] hover:text-red-600 transition-colors font-medium"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </header>

            <div className="pt-16 flex">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:flex flex-col w-64 fixed top-16 left-0 bottom-0 bg-white border-r border-[var(--color-border)] p-4 overflow-y-auto">
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)]">
                    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Bottom Nav - Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-border)] z-50">
                <div className="flex items-center justify-around h-16">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${pathname === item.href
                                    ? 'text-[var(--color-primary)]'
                                    : 'text-[var(--color-text-muted)]'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
