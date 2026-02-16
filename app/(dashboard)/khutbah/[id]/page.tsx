'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Khutbah } from '@/types/khutbah';
import { EVENT_TYPES } from '@/lib/constants/events';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { exportToPDF } from '@/lib/utils/pdf-export';

export default function KhutbahViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [khutbah, setKhutbah] = useState<Khutbah | null>(null);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const router = useRouter();

    const [isPro, setIsPro] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchKhutbah = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/login'); return; }

            // Check if user is Pro
            const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', user.id).single();
            setIsPro(profile?.subscription_tier === 'pro');

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

    const [lastSaved, setLastSaved] = useState<string | null>(null);

    // Auto-save logic
    useEffect(() => {
        if (!isPro || !khutbah) return;

        const delayDebounceFn = setTimeout(() => {
            handleSave();
        }, 3000); // Auto-save after 3 seconds of inactivity

        return () => clearTimeout(delayDebounceFn);
    }, [khutbah?.content, isPro]);

    const handleSave = async () => {
        if (!khutbah || !isPro) return;
        setSaving(true);
        const supabase = createClient();
        const { error } = await supabase.from('khutbahs').update({ content: khutbah.content }).eq('id', khutbah.id);
        if (!error) {
            setLastSaved(new Date().toLocaleTimeString());
        }
        setSaving(false);
    };

    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [speaking, setSpeaking] = useState(false);
    const [suggesting, setSuggesting] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const handleSuggest = async () => {
        if (!khutbah || suggestions.length > 0) return;
        setSuggesting(true);
        const c = khutbah.content;
        const text = `${c.khutbah1.content}\n\n${c.khutbah2.content}`;
        try {
            const res = await fetch('/api/dalil/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: text }),
            });
            const data = await res.json();
            if (data.suggestions) setSuggestions(data.suggestions);
        } catch (err) {
            console.error('Suggest failed:', err);
        }
        setSuggesting(false);
    };

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

    const handlePPTX = async () => {
        if (!khutbah) return;
        setDownloading(true);
        const c = khutbah.content;
        const text = `${c.khutbah1.content}\n\n${c.khutbah2.content}`;
        try {
            const res = await fetch('/api/export/pptx', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: khutbah.title, content: text }),
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${khutbah.title}.pptx`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('PPTX failed:', err);
        }
        setDownloading(false);
    };

    const handleAnalyze = async () => {
        if (!khutbah || analysis) return;
        setAnalyzing(true);
        const c = khutbah.content;
        const text = `${c.khutbah1.content}\n\n${c.khutbah2.content}`;
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: text }),
            });
            const data = await res.json();
            if (data.analysis) setAnalysis(data.analysis);
        } catch (err) {
            console.error('Analysis failed:', err);
        }
        setAnalyzing(false);
    };

    const handleSpeak = () => {
        if (!khutbah) return;
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }
        const c = khutbah.content;
        const text = `${khutbah.title}. ${c.khutbah1.content}. ${c.khutbah2.content}`;
        const utterance = new SpeechSynthesisUtterance(text);

        // Better voice selection
        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find(v => v.lang.includes('id-ID') && v.name.includes('Google'));
        const enVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Google'));

        utterance.voice = khutbah.output_language === 'id' ? (idVoice || voices[0]) : (enVoice || voices[0]);
        utterance.lang = khutbah.output_language === 'id' ? 'id-ID' : 'en-US';
        utterance.pitch = 1.0;
        utterance.rate = 1.0; // Normal speed

        utterance.onend = () => setSpeaking(false);
        setSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const handlePrint = () => window.print();

    const [verifying, setVerifying] = useState(false);
    const [verification, setVerification] = useState<any>(null);

    const handleVerify = async () => {
        if (!khutbah || verification) return;
        setVerifying(true);
        const c = khutbah.content;
        const text = `${c.khutbah1.content}\n\n${c.khutbah2.content}`;
        try {
            const res = await fetch('/api/dalil/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: text }),
            });
            const data = await res.json();
            if (data.verification) setVerification(data.verification);
        } catch (err) {
            console.error('Verification failed:', err);
        }
        setVerifying(false);
    };

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
                {isPro && (
                    <div className="flex items-center gap-2">
                        <button onClick={handleSave} disabled={saving} className="btn-primary !py-2 !px-4 text-sm shadow-md">
                            {saving ? '💾 Menyimpan...' : '💾 Simpan'}
                        </button>
                        {lastSaved && <span className="text-[10px] text-slate-400">Tersimpan: {lastSaved}</span>}
                    </div>
                )}
                <button onClick={handleCopy} className="btn-secondary !py-2 !px-4 text-sm">
                    {copySuccess ? '✓ Tersalin!' : '📋 Salin'}
                </button>
                <button onClick={handleDownload} disabled={downloading} className="btn-secondary !py-2 !px-4 text-sm">
                    {downloading ? '⏳' : '📄 Word'}
                </button>
                <button onClick={handlePPTX} disabled={downloading} className="btn-secondary !py-2 !px-4 text-sm">
                    {downloading ? '⏳' : '📊 PPTX'}
                </button>
                <button onClick={handleSpeak} className="btn-secondary !py-2 !px-4 text-sm">
                    {speaking ? '🔇 Stop' : '🔊 Dengar'}
                </button>
                <Link href={`/khutbah/${khutbah.id}/teleprompter`} className="btn-secondary !py-2 !px-4 text-sm">
                    👁️ Prompter
                </Link>
                <button onClick={handleVerify} disabled={verifying} className="btn-secondary !py-2 !px-4 text-sm">
                    {verifying ? '⌛ Memeriksa...' : '🛡️ Verifikasi'}
                </button>
                <button onClick={() => exportToPDF(khutbah)} disabled={downloading} className="btn-secondary !py-2 !px-4 text-sm">
                    📄 PDF
                </button>
                <button onClick={handlePrint} className="btn-secondary !py-2 !px-4 text-sm">🖨️ Print</button>
                <div className="flex-1"></div>
                <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700 px-3 py-2 transition-colors">
                    🗑️ Hapus
                </button>
            </div>

            {/* Verification Results */}
            {verification && (
                <div className={`card p-6 mb-8 border-l-4 animate-slide-up no-print ${verification.isSafe ? 'border-emerald-500 bg-emerald-50/30' : 'border-red-500 bg-red-50/30'}`}>
                    <h3 className={`font-bold flex items-center gap-2 mb-4 ${verification.isSafe ? 'text-emerald-800' : 'text-red-800'}`}>
                        <span>{verification.isSafe ? '✅' : '⚠️'}</span> Hasil Verifikasi Dalil
                    </h3>
                    <div className="space-y-4">
                        {verification.details.map((d: any, i: number) => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <p className="font-bold text-sm mb-1">{d.reference}</p>
                                <p className={`text-xs font-black uppercase tracking-widest ${d.status === 'Valid' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    Status: {d.status}
                                </p>
                                {d.correction && <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded italic">Saran: {d.correction}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestions Section */}
            {suggestions.length > 0 && (
                <div className="card p-6 mb-8 border-l-4 border-emerald-500 animate-slide-up no-print bg-emerald-50/30">
                    <h3 className="font-bold flex items-center gap-2 mb-4 text-emerald-800">
                        <span>📖</span> Saran Dalil Pendukung
                    </h3>
                    <div className="space-y-4">
                        {suggestions.map((s, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">{s.type}</span>
                                    <span className="text-sm font-bold">{s.reference}</span>
                                </div>
                                <p className="arabic-text mb-2 text-lg">{s.arabic}</p>
                                <p className="text-sm italic mb-2">"{s.translation}"</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Konteks: {s.context}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Analysis Section */}
            {analysis && (
                <div className="card p-6 mb-8 border-l-4 border-blue-500 animate-slide-up no-print bg-blue-50/30">
                    <h3 className="font-bold flex items-center gap-2 mb-4 text-blue-800">
                        <span>🧠</span> Analisis Teknologi Pintar
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                            <p className="text-xs text-blue-600 font-bold uppercase mb-1">Impact Emosional</p>
                            <p className="text-2xl font-black text-blue-900">{analysis.emotionalScore}%</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                            <p className="text-xs text-blue-600 font-bold uppercase mb-1">Kejelasan Pesan</p>
                            <p className="text-2xl font-black text-blue-900">{analysis.clarityScore}%</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                            <p className="text-xs text-blue-600 font-bold uppercase mb-1">Estimasi Durasi</p>
                            <p className="text-2xl font-black text-blue-900">{analysis.estimatedDuration}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                        <p className="font-bold text-sm mb-2">💡 Saran Perbaikan:</p>
                        <p className="text-sm text-blue-800 leading-relaxed">{analysis.feedback}</p>
                    </div>
                </div>
            )}

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

                    {isPro ? (
                        <div className="mt-8 border-t border-slate-100 pt-8 no-print">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Edit Isi Khutbah (Fitur Pro)</p>
                            <TiptapEditor
                                content={c.khutbah1.content}
                                onChange={(val) => setKhutbah({ ...khutbah, content: { ...c, khutbah1: { ...c.khutbah1, content: val } } })}
                            />
                        </div>
                    ) : (
                        <p className="text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line">{c.khutbah1.content}</p>
                    )}
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
                {/* Disclaimer */}
                <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center no-print">
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                        <strong>Disclaimer:</strong> Naskah ini dihasilkan oleh teknologi AI. Mohon periksa kembali keakuratan kutipan Ayat Al-Quran, nomor Hadits, dan konteks hukum agama sebelum digunakan secara luas.
                        Penggunaan naskah ini adalah tanggung jawab penuh khatib/pengguna.
                    </p>
                </div>
            </div>
        </div>
    );
}
