'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Team, Schedule } from '@/types/saas';
import Link from 'next/link';
import CalendarView from '@/components/teams/CalendarView';

export default function TeamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const supabase = createClient();

    const [team, setTeam] = useState<Team | null>(null);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingSchedule, setAddingSchedule] = useState(false);
    const [newSchedule, setNewSchedule] = useState({ date: '', khatib: '', theme: '' });
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    useEffect(() => {
        fetchTeamData();
    }, [id]);

    const fetchTeamData = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        const { data: teamData } = await supabase.from('teams').select('*').eq('id', id).single();
        if (teamData) setTeam(teamData);

        const { data: scheduleData } = await supabase
            .from('schedules')
            .select('*')
            .eq('team_id', id)
            .order('event_date', { ascending: true });

        if (scheduleData) setSchedules(scheduleData);

        const { data: memberData } = await supabase
            .from('team_members')
            .select('*, profiles(full_name, email)')
            .eq('team_id', id);

        if (memberData) setMembers(memberData);

        setLoading(false);
    };

    const handleAddSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSchedule.date || !newSchedule.khatib) return;

        setAddingSchedule(true);
        const { error } = await supabase.from('schedules').insert({
            team_id: id,
            event_date: newSchedule.date,
            khatib_name: newSchedule.khatib,
            theme: newSchedule.theme,
        });

        if (!error) {
            setNewSchedule({ date: '', khatib: '', theme: '' });
            fetchTeamData();
        }
        setAddingSchedule(false);
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm('Hapus anggota ini dari tim?')) return;
        const { error } = await supabase.from('team_members').delete().eq('team_id', id).eq('user_id', userId);
        if (!error) fetchTeamData();
    };

    const handleLeaveTeam = async () => {
        if (!confirm('Yakin ingin keluar dari tim ini?')) return;
        const { error } = await supabase.from('team_members').delete().eq('team_id', id).eq('user_id', currentUser?.id);
        if (!error) router.push('/teams');
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Memuat data tim...</div>;
    if (!team) return <div className="p-12 text-center text-red-500">Tim tidak ditemukan.</div>;

    const isOwner = currentUser?.id === team.owner_id;

    return (
        <div className="p-6 max-w-5xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/teams" className="text-slate-400 hover:text-[var(--color-primary)] transition-colors text-2xl">←</Link>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{team.name}</h1>
                        <p className="text-[var(--color-text-secondary)]">Kelola jadwal khatib dan anggota tim.</p>
                    </div>
                </div>
                {!isOwner && (
                    <button onClick={handleLeaveTeam} className="text-xs text-red-500 font-bold hover:underline transition-all">Keluar Tim</button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Area: Schedule & Members */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Schedule List */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span>📅</span> Jadwal Imam & Khatib
                            </h2>
                            <div className="flex p-1 bg-slate-100 rounded-xl">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    LIST
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    KALENDER
                                </button>
                            </div>
                        </div>

                        {viewMode === 'calendar' ? (
                            <CalendarView schedules={schedules} />
                        ) : schedules.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                                Belum ada jadwal yang direncanakan.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {schedules.map((s) => (
                                    <div key={s.id} className="flex items-center justify-between p-4 bg-slate-100/50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/50">
                                        <div>
                                            <p className="text-sm font-bold text-[var(--color-primary)]">
                                                {new Date(s.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <h3 className="font-bold text-lg">{s.khatib_name}</h3>
                                            <p className="text-sm text-slate-500 italic">{s.theme || 'Tanpa Tema'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-full font-bold shadow-sm uppercase tracking-widest leading-none">TERJADWAL</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Members List */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span>👥</span> Anggota Tim
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {members.map((m) => (
                                <div key={m.user_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm uppercase">
                                            {m.profiles?.full_name?.[0] || m.profiles?.email?.[0] || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold truncate max-w-[120px]">{m.profiles?.full_name || 'Tanpa Nama'}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{m.role}</p>
                                        </div>
                                    </div>
                                    {isOwner && m.user_id !== team.owner_id && (
                                        <button onClick={() => handleRemoveMember(m.user_id)} className="text-red-500 hover:text-red-700 p-2 transition-colors">
                                            <span className="text-xs font-bold">Hapus</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Area: Form */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
                        <h2 className="text-lg font-bold mb-4">Tambah Jadwal Baru</h2>
                        <form onSubmit={handleAddSchedule} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1 ml-1 text-slate-600">Tanggal</label>
                                <input
                                    type="date"
                                    value={newSchedule.date}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 ml-1 text-slate-600">Nama Khatib</label>
                                <input
                                    type="text"
                                    value={newSchedule.khatib}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, khatib: e.target.value })}
                                    placeholder="Contoh: Ust. Yusuf Mansur"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 ml-1 text-slate-600">Tema (Opsional)</label>
                                <input
                                    type="text"
                                    value={newSchedule.theme}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, theme: e.target.value })}
                                    placeholder="Contoh: Meneladani Sifat Rasul"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={addingSchedule}
                                className="w-full bg-[var(--color-primary)] text-white py-4 rounded-2xl font-black hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-[var(--color-primary)]/20"
                            >
                                {addingSchedule ? 'Sedang Menyimpan...' : 'Simpan Jadwal'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
