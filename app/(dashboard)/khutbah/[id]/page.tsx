'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Khutbah } from '@/types/khutbah';
import { EVENT_TYPES } from '@/lib/constants/events';

export default function KhutbahViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [khutbah, setKhutbah] = useState<Khutbah | null>(null);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchKhutbah = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/login'); return; }

            const { data } = await supabase
                .from('khutbahs')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (data) {
                setKhutbah(data);
            }
            setLoading(false);
        };
        fetchKhutbah();
    }, [id, router]);

    const handleCopy = async () => {
        if (!khutbah) return;
        const c = khutbah.content;
        const text = `${khutbah.title}\n\n${c.mukadimah.arabic}\n\n${c.mukadimah.translation}\n\n--- Khutbah Pertama ---\n\n${c.khutbah1.intro}\n\n${c.khutbah1.ayat.reference}\n${c.khutbah1.ayat.arabic}\n${c.khutbah1.ayat.translation}\n\n${c.khutbah1.hadith.reference}\n${c.khutbah1.hadith.arabic}\n${c.khutbah1.hadith.translation}\n\n${c.khutbah1.content}\n\n${c.pause}\n\n--- Khutbah Kedua ---\n\n${c.khutbah2.content}\n\n${c.khutbah2.callToAction}\n\n--- Penutup ---\n\n${c.penutup.reminder}\n\n${c.penutup.dua.arabic}\n${c.penutup.dua.translation}\n\n${c.penutup.closing}`;

        await navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleDownload = async () => {
        if (!khutbah) return;
        setDownloading(true);
        try {
            const res = await fetch('/api/export/docx', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ khutbahId: khutbah.id }),
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${khutbah.title}.docx`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Download failed:', err);
        }
        setDownloading(false);
    };

    const handlePrint = () => window.print();

    const handleDelete = async () => {
        if (!khutbah || !confirm('Yakin ingin menghapus khutbah ini? Tindakan ini tidak bisa dibatalkan.')) return;
        const supabase = createClient();
        await supabase.from('khutbahs').delete().eq('id', khutbah.id);
        router.push('/history');
    };

    const getEventName = (eventId: string) => EVENT_TYPES.find(e => e.id === eventId)?.name || eventId;

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="loader"></div></div>;
    }

    if (!khutbah) {
        return (
            <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-bold mb-2">Khutbah Tidak Ditemukan</h2>
                <p className="text-[var(--color-text-secondary)] mb-6">Khutbah ini tidak ada atau bukan milik Anda.</p>
                <Link href="/dashboard" className="btn-primary">← Kembali ke Dashboard</Link>
            </div>
        );
    }

    const c = khutbah.content;

    return (
        <div className="animate-fade-in pb-20 lg:pb-0">
            {/* Back + Title */}
            <div className="flex items-center gap-3 mb-4 no-print">
                <Link href="/dashboard" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                    ← Dashboard
                </Link>
                <span className="text-[var(--color-text-muted)]">|</span>
                <span className="text-sm text-[var(--color-text-secondary)]">{getEventName(khutbah.event_type)}</span>
            </div>

            {/* Action Bar */}
            <div className="card p-3 flex flex-wrap items-center gap-2 mb-6 no-print">
                <button onClick={handleCopy} className="btn-secondary !py-2 !px-4 text-sm">
                    {copySuccess ? '✓ Tersalin!' : '📋 Salin'}
                </button>
                <button onClick={handleDownload} disabled={downloading} className="btn-secondary !py-2 !px-4 text-sm">
                    {downloading ? '⏳ Mengunduh...' : '📄 DOC'}
                </button>
                <button onClick={handlePrint} className="btn-secondary !py-2 !px-4 text-sm">🖨️ Print</button>
                <div className="flex-1"></div>
                <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700 px-3 py-2 transition-colors">
                    🗑️ Hapus
                </button>
            </div>

            {/* Khutbah Content */}
            <div className="card p-6 sm:p-8 lg:p-12 max-w-3xl mx-auto">
                {/* Title */}
                <div className="text-center mb-8 pb-6 border-b-2 border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-primary)] font-semibold uppercase tracking-wider mb-2">{getEventName(khutbah.event_type)}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">{c.title}</h1>
                </div>

                {/* Mukadimah */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                        <span className="arabic-text text-xl">المقدمة</span>
                        <span className="text-sm font-normal text-[var(--color-text-secondary)]">Mukadimah</span>
                    </h2>
                    <div className="dalil-box">
                        <p className="arabic-text mb-3">{c.mukadimah.arabic}</p>
                    </div>
                    <p className="text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line">{c.mukadimah.translation}</p>
                </section>

                {/* Khutbah 1 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                        <span className="arabic-text text-xl">الخطبة الأولى</span>
                        <span className="text-sm font-normal text-[var(--color-text-secondary)]">Khutbah Pertama</span>
                    </h2>

                    <p className="text-[var(--color-text-primary)] leading-relaxed mb-6 whitespace-pre-line">{c.khutbah1.intro}</p>

                    {/* Ayat */}
                    <div className="dalil-box mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span>📖</span>
                            <span className="font-semibold text-[var(--color-primary)]">{c.khutbah1.ayat.reference}</span>
                        </div>
                        <p className="arabic-text mb-3">{c.khutbah1.ayat.arabic}</p>
                        {c.khutbah1.ayat.transliteration && (
                            <p className="text-sm italic text-[var(--color-text-secondary)] mb-2">{c.khutbah1.ayat.transliteration}</p>
                        )}
                        <p className="font-medium text-[var(--color-text-primary)] mb-2">&quot;{c.khutbah1.ayat.translation}&quot;</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">{c.khutbah1.ayat.tafsir}</p>
                    </div>

                    {/* Hadith */}
                    <div className="dalil-box mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span>📚</span>
                            <span className="font-semibold text-[var(--color-primary)]">{c.khutbah1.hadith.reference}</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{c.khutbah1.hadith.authenticity}</span>
                        </div>
                        <p className="arabic-text mb-3">{c.khutbah1.hadith.arabic}</p>
                        <p className="font-medium text-[var(--color-text-primary)]">&quot;{c.khutbah1.hadith.translation}&quot;</p>
                    </div>

                    <p className="text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line">{c.khutbah1.content}</p>
                </section>

                {/* Pause */}
                <div className="text-center py-6 my-8 border-y border-[var(--color-border)]">
                    <p className="text-[var(--color-text-muted)] text-sm mb-2">• • •</p>
                    <p className="arabic-text text-lg">{c.pause}</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-2">(Duduk Sebentar)</p>
                </div>

                {/* Khutbah 2 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                        <span className="arabic-text text-xl">الخطبة الثانية</span>
                        <span className="text-sm font-normal text-[var(--color-text-secondary)]">Khutbah Kedua</span>
                    </h2>
                    <p className="text-[var(--color-text-primary)] leading-relaxed mb-6 whitespace-pre-line">{c.khutbah2.content}</p>
                    <div className="bg-[var(--color-primary-50)] p-5 rounded-xl border border-[var(--color-primary)]/10">
                        <p className="font-semibold text-[var(--color-primary)] mb-2">💡 Ajakan untuk Jemaah:</p>
                        <p className="text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line">{c.khutbah2.callToAction}</p>
                    </div>
                </section>

                {/* Penutup */}
                <section>
                    <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                        <span className="arabic-text text-xl">الدعاء</span>
                        <span className="text-sm font-normal text-[var(--color-text-secondary)]">Penutup</span>
                    </h2>
                    <p className="text-[var(--color-text-primary)] leading-relaxed mb-6 whitespace-pre-line">{c.penutup.reminder}</p>
                    <div className="dalil-box mb-6">
                        <p className="arabic-text mb-3">{c.penutup.dua.arabic}</p>
                        <p className="font-medium text-[var(--color-text-primary)]">{c.penutup.dua.translation}</p>
                    </div>
                    <div className="text-center">
                        <p className="arabic-text text-xl">{c.penutup.closing}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
