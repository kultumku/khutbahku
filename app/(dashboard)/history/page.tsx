'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Khutbah } from '@/types/khutbah';
import { EVENT_TYPES } from '@/lib/constants/events';

export default function HistoryPage() {
    const [khutbahs, setKhutbahs] = useState<Khutbah[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const perPage = 10;

    const fetchKhutbahs = useCallback(async () => {
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let query = supabase
            .from('khutbahs')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(page * perPage, (page + 1) * perPage - 1);

        if (search) query = query.ilike('title', `%${search}%`);
        if (filter) query = query.eq('event_type', filter);

        const { data, count } = await query;
        if (data) setKhutbahs(data);
        if (count !== null) setTotalCount(count);
        setLoading(false);
    }, [search, filter, page]);

    useEffect(() => { fetchKhutbahs(); }, [fetchKhutbahs]);

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus khutbah ini?')) return;
        const supabase = createClient();
        await supabase.from('khutbahs').delete().eq('id', id);
        fetchKhutbahs();
    };

    const getEventName = (id: string) => EVENT_TYPES.find(e => e.id === id)?.name || id;
    const totalPages = Math.ceil(totalCount / perPage);

    return (
        <div className="animate-fade-in pb-20 lg:pb-0">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Riwayat Khutbah</h1>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">🔍</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        placeholder="Cari khutbah..."
                        className="input-field !pl-10"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => { setFilter(e.target.value); setPage(0); }}
                    className="input-field !w-auto min-w-[180px]"
                >
                    <option value="">Semua Jenis Acara</option>
                    {EVENT_TYPES.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                </select>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20"><div className="loader"></div></div>
            ) : khutbahs.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="text-5xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold mb-2">Tidak Ada Khutbah</h3>
                    <p className="text-[var(--color-text-secondary)] mb-6">
                        {search || filter ? 'Tidak ada khutbah yang cocok dengan pencarian.' : 'Belum ada khutbah. Mulai buat sekarang!'}
                    </p>
                    <Link href="/generator" className="btn-primary">✨ Buat Khutbah</Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {khutbahs.map((k) => (
                        <div key={k.id} className="card p-4 sm:p-5 flex items-center justify-between">
                            <Link href={`/khutbah/${k.id}`} className="flex-1 min-w-0 group">
                                <h3 className="font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                                    {k.title}
                                </h3>
                                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                                    {getEventName(k.event_type)} • {new Date(k.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </Link>
                            <div className="flex items-center gap-2 ml-4 shrink-0">
                                <Link href={`/khutbah/${k.id}`} className="text-sm text-[var(--color-primary)] font-medium hover:underline">
                                    Lihat
                                </Link>
                                <button onClick={() => handleDelete(k.id)} className="text-sm text-red-500 hover:text-red-700">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-50"
                    >
                        ← Sebelumnya
                    </button>
                    <span className="text-sm text-[var(--color-text-secondary)] px-4">
                        {page + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1}
                        className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-50"
                    >
                        Selanjutnya →
                    </button>
                </div>
            )}
        </div>
    );
}
