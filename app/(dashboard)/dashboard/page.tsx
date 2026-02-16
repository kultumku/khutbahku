'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Khutbah } from '@/types/khutbah';
import { EVENT_TYPES } from '@/lib/constants/events';

export default function DashboardPage() {
    const [userName, setUserName] = useState('');
    const [khutbahs, setKhutbahs] = useState<Khutbah[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [monthCount, setMonthCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');

                // Fetch recent khutbahs
                const { data: recentKhutbahs } = await supabase
                    .from('khutbahs')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (recentKhutbahs) setKhutbahs(recentKhutbahs);

                // Fetch total count
                const { count: total } = await supabase
                    .from('khutbahs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                if (total !== null) setTotalCount(total);

                // Fetch month count
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);

                const { count: monthly } = await supabase
                    .from('khutbahs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .gte('created_at', startOfMonth.toISOString());

                if (monthly !== null) setMonthCount(monthly);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const getEventName = (id: string) => EVENT_TYPES.find(e => e.id === id)?.name || id;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20 lg:pb-0">
            {/* Welcome Banner */}
            <div className="gradient-bg rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">👋 Selamat Datang, {userName}!</h1>
                    <p className="text-white/80 mb-6">Siap membuat khutbah hari ini?</p>
                    <Link href="/generator" className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-50)] transition-all hover:scale-105 shadow-lg">
                        ✨ Buat Khutbah Baru
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { icon: '📖', value: totalCount, label: 'Total Khutbah' },
                    { icon: '📅', value: monthCount, label: 'Bulan Ini' },
                    { icon: '⭐', value: khutbahs.filter(k => k.is_favorite).length, label: 'Favorit' },
                ].map((stat, i) => (
                    <div key={i} className="card p-4 sm:p-6 text-center">
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">{stat.value}</div>
                        <div className="text-xs sm:text-sm text-[var(--color-text-secondary)]">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Khutbahs */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Khutbah Terbaru</h2>
                    {khutbahs.length > 0 && (
                        <Link href="/history" className="text-sm text-[var(--color-primary)] font-medium hover:underline">
                            Lihat Semua →
                        </Link>
                    )}
                </div>

                {khutbahs.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="text-5xl mb-4">📝</div>
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Belum Ada Khutbah</h3>
                        <p className="text-[var(--color-text-secondary)] mb-6">Mulai buat khutbah pertama Anda sekarang!</p>
                        <Link href="/generator" className="btn-primary">
                            ✨ Buat Khutbah Pertama
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {khutbahs.map((khutbah) => (
                            <Link
                                key={khutbah.id}
                                href={`/khutbah/${khutbah.id}`}
                                className="card p-4 sm:p-5 flex items-center justify-between group block"
                            >
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                                        {khutbah.title}
                                    </h3>
                                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                                        {getEventName(khutbah.event_type)} • {new Date(khutbah.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors ml-4 text-lg">
                                    →
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
