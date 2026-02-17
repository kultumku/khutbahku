'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        checkAdmin();
        fetchUsers();
    }, []);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'admin') setIsAdmin(true);
    };

    const fetchUsers = async () => {
        setLoading(true);
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (data) setUsers(data);
        setLoading(false);
    };

    const handleUpgrade = async (userId: string, email: string) => {
        if (!confirm(`Upgrade user ${email} ke Pro?`)) return;

        const res = await fetch('/api/admin/upgrade-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, email }),
        });

        if (res.ok) {
            alert('User berhasil di-upgrade ke Pro!');
            fetchUsers();
            // Trigger email activation
            await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    subject: 'Akses Pro KhutbahKu Aktif!',
                    body: 'Selamat! Pembayaran Anda telah dikonfirmasi. Akun Pro Anda sudah aktif selama 1 tahun.'
                }),
            });
        } else {
            alert('Terjadi kesalahan saat upgrade.');
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Memuat data Admin...</div>;
    if (!isAdmin) return <div className="p-12 text-center text-red-500 font-bold">Akses Ditolak. Halaman ini khusus Admin.</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Admin Control Panel</h1>
                    <p className="text-slate-500 font-medium">Kelola User dan Konfirmasi Pembayaran Manual.</p>
                </div>
                <div className="bg-[var(--color-primary)]/10 px-4 py-2 rounded-xl border border-[var(--color-primary)]/20 shadow-sm">
                    <span className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-widest">PRO DASHBOARD</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Bukti Transfer</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-800">{u.full_name || 'Tanpa Nama'}</p>
                                    <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter mt-1">{new Date(u.created_at).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4">
                                    {u.proof_url ? (
                                        <a href={u.proof_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                            📄 Lihat Bukti
                                        </a>
                                    ) : (
                                        <span className="text-[10px] text-slate-300 italic">Belum Upload</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${u.role === 'pro' ? 'bg-emerald-100 text-emerald-600' : u.proof_status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {u.role === 'pro' ? 'Active Pro' : u.proof_status === 'pending' ? 'Pending Verif' : u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {u.role !== 'pro' && (
                                        <button
                                            onClick={() => handleUpgrade(u.id, u.email)}
                                            className="bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/10"
                                        >
                                            Verify & Activate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
