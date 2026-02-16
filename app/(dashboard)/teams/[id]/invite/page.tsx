'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function TeamInvitePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [team, setTeam] = useState<any>(null);
    const [inviteLink, setInviteLink] = useState('');
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        supabase.from('teams').select('*').eq('id', id).single().then(({ data }) => {
            setTeam(data);
            setLoading(false);
        });
    }, [id]);

    const generateInvite = () => {
        const link = `${window.location.origin}/teams/join/${id}`;
        setInviteLink(link);
    };

    const copyInvite = () => {
        navigator.clipboard.writeText(inviteLink);
        alert('Link undangan tersalin!');
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Memuat info tim...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="card p-8 bg-white rounded-3xl shadow-sm border border-slate-100 mt-12">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🏠</div>
                    <h1 className="text-2xl font-black text-slate-900">Undang Anggota ke {team?.name}</h1>
                    <p className="text-slate-500 text-sm mt-1">Bagikan link di bawah untuk mengajak rekan dakwah Anda bergabung.</p>
                </div>

                {!inviteLink ? (
                    <button
                        onClick={generateInvite}
                        className="w-full bg-[var(--color-primary)] text-white py-4 rounded-2xl font-black shadow-lg shadow-[var(--color-primary)]/20 hover:brightness-110 transition-all"
                    >
                        Buat Link Undangan Baru
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Link Undangan Aktif</p>
                            <p className="text-sm font-medium text-slate-700 break-all">{inviteLink}</p>
                        </div>
                        <button
                            onClick={copyInvite}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all"
                        >
                            📋 Salin Link
                        </button>
                        <p className="text-[10px] text-center text-slate-400 italic">Siapa pun yang memiliki link ini dapat bergabung ke tim Anda.</p>
                    </div>
                )}

                <div className="mt-8 pt-8 border-t border-slate-100">
                    <Link href={`/teams/${id}`} className="text-sm font-bold text-slate-400 hover:text-[var(--color-primary)] transition-colors">
                        ← Kembali ke Detail Tim
                    </Link>
                </div>
            </div>
        </div>
    );
}
