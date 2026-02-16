'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function JoinTeamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [status, setStatus] = useState('Memproses undangan...');
    const supabase = createClient();

    useEffect(() => {
        handleJoin();
    }, [id]);

    const handleJoin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push(`/login?returnUrl=/teams/join/${id}`);
            return;
        }

        const { error } = await supabase.from('team_members').insert({
            team_id: id,
            user_id: user.id,
            role: 'member'
        });

        if (error && error.code !== '23505') { // Ignore unique constraint error (user already in team)
            setStatus('Gagal bergabung ke tim. Mungkin tim tidak ditemukan atau link kadaluarsa.');
        } else {
            setStatus('Berhasil bergabung! Mengalihkan Anda...');
            setTimeout(() => router.push(`/teams/${id}`), 1500);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
            <div className="bg-white p-12 rounded-3xl shadow-xl text-center">
                <div className="loader mx-auto mb-6"></div>
                <p className="text-xl font-bold text-slate-800">{status}</p>
            </div>
        </div>
    );
}
