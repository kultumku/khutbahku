'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Team } from '@/types/saas';
import Link from 'next/link';

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setTeams(data);
        }
        setLoading(false);
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;

        setCreating(true);
        const res = await fetch('/api/teams/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newTeamName }),
        });

        if (res.ok) {
            setNewTeamName('');
            fetchTeams();
        }
        setCreating(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Unit & Tim Khutbah</h1>
                    <p className="text-[var(--color-text-secondary)]">Kelola tim dakwah dan jadwal khutbah bersama.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
                <h2 className="text-lg font-semibold mb-4">Buat Unit Baru</h2>
                <form onSubmit={handleCreateTeam} className="flex gap-4">
                    <input
                        type="text"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="Nama Masjid atau Organisasi..."
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                        required
                    />
                    <button
                        type="submit"
                        disabled={creating}
                        className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {creating ? 'Menyimpan...' : 'Tambah Unit'}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-2 text-center py-12 text-[var(--color-text-secondary)]">Memuat daftar tim...</div>
                ) : teams.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-[var(--color-text-secondary)]">
                        Belum ada unit. Buat unit pertama Anda untuk mulai berkolaborasi.
                    </div>
                ) : (
                    teams.map((team) => (
                        <Link key={team.id} href={`/teams/${team.id}`} className="block group">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:border-[var(--color-primary)] transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl flex items-center justify-center text-xl font-bold">
                                        {team.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-[var(--color-primary)] transition-colors">{team.name}</h3>
                                        <p className="text-sm text-[var(--color-text-secondary)]">Terdaftar pada {new Date(team.name).toLocaleDateString('id-ID')}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm text-[var(--color-text-secondary)]">
                                    <span>Lihat Jadwal & Anggota</span>
                                    <span className="text-[var(--color-primary)]">→</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
