'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter(); // Initialized useRouter

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    const handleDeleteAccount = async () => {
        if (!confirm('PERINGATAN: Semua naskah dan data Anda akan dihapus permanen. Lanjutkan?')) return;
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.rpc('delete_user_data');
        if (error) {
            alert('Gagal menghapus akun. Hubungi dukungan.');
        } else {
            await supabase.auth.signOut();
            router.push('/');
        }
    };

    return (
        <div className="animate-fade-in max-w-2xl mx-auto pb-20 lg:pb-0">
            <h1 className="text-2xl font-bold mb-8 text-[var(--color-text-primary)]">Pengaturan Akun</h1>

            <div className="space-y-6">
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold mb-4">Profil Saya</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Email</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold mb-4">Integrasi</h2>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">🔑</span>
                            <div>
                                <h3 className="font-bold">Google Login</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">Hubungkan akun Google untuk masuk lebih cepat.</p>
                            </div>
                        </div>
                        <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-all">
                            Hubungkan
                        </button>
                    </div>
                </section>

                <section className="p-6 sm:p-8 bg-red-50/50 border border-red-100 rounded-2xl mt-12">
                    <h2 className="text-xl font-bold text-red-600 mb-2 flex items-center gap-2">
                        <span>⚠️</span> Zona Bahaya
                    </h2>
                    <p className="text-sm text-red-700/70 mb-6 leading-relaxed">
                        Menghapus akun akan menghilangkan semua riwayat khutbah, pengaturan tim, dan akses Pro Anda secara permanen. Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                    >
                        Hapus Seluruh Data Akun
                    </button>
                </section>
            </div>
        </div>
    );
}
