'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Khutbah } from '@/types/saas';
import Link from 'next/link';

export default function CommunityPage() {
    const [khutbahs, setKhutbahs] = useState<Khutbah[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchPublicKhutbahs();
    }, []);

    const fetchPublicKhutbahs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('khutbahs')
            .select('*')
            .eq('is_public', true)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setKhutbahs(data);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]">Komunitas KhutbahKu</h1>
                <p className="text-[var(--color-text-secondary)]">Dapatkan inspirasi dari naskah publik yang dibagikan oleh khatib lainnya.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse h-48"></div>
                    ))}
                </div>
            ) : khutbahs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="text-5xl mb-4">🌐</div>
                    <h3 className="text-xl font-bold mb-2">Belum ada naskah publik</h3>
                    <p className="text-[var(--color-text-secondary)]">Jadilah yang pertama membagikan khutbah Anda ke komunitas!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {khutbahs.map((khutbah) => (
                        <Link key={khutbah.id} href={`/khutbah/${khutbah.id}`} className="block group">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:border-[var(--color-primary)] group-hover:-translate-y-1 transition-all flex flex-col h-full">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold px-2 py-1 rounded">
                                        {khutbah.event_type}
                                    </span>
                                    <span className="text-xs text-[var(--color-text-secondary)]">
                                        {new Date(khutbah.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-3 line-clamp-2 leading-tight flex-grow">{khutbah.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                                    <span>Tema: {khutbah.theme}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
