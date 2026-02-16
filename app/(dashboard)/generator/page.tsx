'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { EVENT_TYPES } from '@/lib/constants/events';
import { THEMES, THEME_CATEGORIES } from '@/lib/constants/themes';
import { LANGUAGE_STYLES } from '@/lib/constants/styles';
import { OUTPUT_LANGUAGES } from '@/lib/constants/languages';
import OnboardingTour from '@/components/ui/OnboardingTour';

const LOADING_MESSAGES = [
    'Menyiapkan struktur khutbah...',
    'Mencari dalil yang relevan...',
    'Menyusun pembukaan...',
    'Mengembangkan isi khutbah...',
    'Menyelesaikan penutup...',
];

export default function GeneratorPage() {
    const [step, setStep] = useState(1);
    const [eventType, setEventType] = useState('');
    const [theme, setTheme] = useState('');
    const [style, setStyle] = useState('');
    const [language, setLanguage] = useState('id');
    const [themeFilter, setThemeFilter] = useState('semua');
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('');
    const [error, setError] = useState('');
    const [multiVersion, setMultiVersion] = useState(false);
    const [variants, setVariants] = useState<any[]>([]);
    const router = useRouter();

    const filteredThemes = themeFilter === 'semua'
        ? THEMES
        : THEMES.filter(t => t.category === themeFilter);

    const selectedEvent = EVENT_TYPES.find(e => e.id === eventType);
    const selectedTheme = THEMES.find(t => t.id === theme);
    const selectedStyle = LANGUAGE_STYLES.find(s => s.id === style);
    const selectedLanguage = OUTPUT_LANGUAGES.find(l => l.id === language);

    const canNext = () => {
        switch (step) {
            case 1: return !!eventType;
            case 2: return !!theme;
            case 3: return !!style;
            case 4: return !!language;
            default: return false;
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setVariants([]);

        // Animate loading messages
        const animateLoading = async () => {
            for (let i = 0; i < LOADING_MESSAGES.length; i++) {
                setLoadingMsg(LOADING_MESSAGES[i]);
                await new Promise(r => setTimeout(r, 2000));
            }
        };

        const generationTask = async () => {
            try {
                const endpoint = multiVersion ? '/api/multi-generate' : '/api/generate';
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ eventType, theme, style, language }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Gagal menyusun khutbah');

                if (multiVersion && data.versions) {
                    setVariants(data.versions);
                } else if (data.id) {
                    router.push(`/khutbah/${data.id}`);
                }
            } catch (err: any) {
                setError(err.message);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } finally {
                setLoading(false);
            }
        };

        animateLoading();
        await generationTask();
    };

    const handleUseVariant = async (variant: any) => {
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Create structured content for the DB
        const fullContent = {
            title: variant.title,
            khutbah1: { content: variant.content, intro: "", ayat: { arabic: "", translation: "" }, hadith: { arabic: "", translation: "" } },
            khutbah2: { content: "" },
            mukadimah: { arabic: "", translation: "" },
            penutup: { closing: "", reminder: "", dua: { arabic: "", translation: "" } }
        };

        const { data, error } = await supabase
            .from('khutbahs')
            .insert({
                user_id: user.id,
                title: variant.title,
                event_type: eventType,
                theme: theme,
                language_style: style,
                output_language: language,
                content: fullContent,
            })
            .select()
            .single();

        if (error) {
            alert('Gagal menyimpan versi ini. Mohon coba lagi.');
            setLoading(false);
        } else {
            router.push(`/khutbah/${data.id}`);
        }
    };

    if (variants.length > 0) {
        return (
            <div className="p-6 max-w-6xl mx-auto animate-fade-in">
                <h1 className="text-3xl font-bold mb-8 text-center text-[var(--color-text-primary)]">3 Pilihan Khutbah Anda</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {variants.map((v, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-100 hover:border-[var(--color-primary)] transition-all flex flex-col">
                            <h3 className="font-bold text-lg mb-4 text-[var(--color-primary)]">{v.title}</h3>
                            <p className="text-sm text-slate-600 line-clamp-[12] mb-6 leading-relaxed flex-grow">{v.content}</p>
                            <button
                                onClick={() => handleUseVariant(v)}
                                disabled={loading}
                                className="w-full btn-primary text-xs !py-3 font-bold"
                            >
                                {loading ? '⏳ Menyiapkan...' : '✨ Gunakan Versi Ini'}
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={() => setVariants([])} className="mt-12 block mx-auto text-slate-500 hover:text-[var(--color-primary)] transition-colors font-medium">
                    ← Kembali ke Pengaturan
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-20 lg:pb-0">
            <OnboardingTour />
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Buat Khutbah Baru</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">Ikuti langkah sederhana untuk menghasilkan khutbah berkualitas tinggi</p>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${s < step ? 'bg-[var(--color-primary)] text-white' :
                            s === step ? 'bg-[var(--color-primary)] text-white scale-110 shadow-lg shadow-[var(--color-primary)]/30' :
                                'bg-[var(--color-border)] text-[var(--color-text-muted)]'
                            }`}>
                            {s < step ? '✓' : s}
                        </div>
                        {s < 4 && (
                            <div className={`w-12 sm:w-16 h-1 mx-1 rounded transition-colors duration-300 ${s < step ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                                }`}></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-10 max-w-sm w-full mx-4 text-center shadow-2xl animate-scale-up">
                        <div className="loader mx-auto mb-6"></div>
                        <p className="text-[var(--color-primary)] font-black text-xl mb-3">Menyusun Khutbah...</p>
                        <p className="text-slate-500 text-sm animate-pulse h-10">{loadingMsg}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm mb-8 flex items-center justify-between shadow-sm animate-slide-up">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <span className="font-medium">{error}</span>
                    </div>
                    <button onClick={() => setError('')} className="text-2xl leading-none">&times;</button>
                </div>
            )}

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[400px]">
                {step === 1 && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                            <span className="bg-[var(--color-primary)]/10 p-2 rounded-lg">🎤</span> Pilih Jenis Acara
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {EVENT_TYPES.map((event) => (
                                <button
                                    key={event.id}
                                    onClick={() => setEventType(event.id)}
                                    className={`p-6 rounded-2xl text-center cursor-pointer border-2 transition-all flex flex-col items-center gap-3 ${eventType === event.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-4 ring-[var(--color-primary)]/10' : 'border-slate-100 hover:border-[var(--color-primary)]/30 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="text-4xl">{event.icon}</div>
                                    <div>
                                        <div className="font-bold text-[var(--color-text-primary)]">{event.name}</div>
                                        <div className="text-xs text-slate-500 mt-1">{event.duration} menit</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                            <span className="bg-[var(--color-primary)]/10 p-2 rounded-lg">📋</span> Pilih Tema Utama
                        </h2>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {THEME_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setThemeFilter(cat.id)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${themeFilter === cat.id
                                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {filteredThemes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`p-4 rounded-xl text-center cursor-pointer border-2 transition-all flex flex-col items-center gap-2 ${theme === t.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-slate-100 hover:border-[var(--color-primary)]/30'
                                        }`}
                                >
                                    <div className="text-3xl">{t.icon}</div>
                                    <div className="font-bold text-sm">{t.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                            <span className="bg-[var(--color-primary)]/10 p-2 rounded-lg">🎨</span> Pilih Gaya Bahasa
                        </h2>
                        <div className="space-y-4">
                            {LANGUAGE_STYLES.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setStyle(s.id)}
                                    className={`p-6 w-full text-left rounded-2xl border-2 transition-all flex items-center gap-4 ${style === s.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-slate-100 hover:border-[var(--color-primary)]/30'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${style === s.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-slate-300'}`}>
                                        {style === s.id && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-inner"></div>}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{s.name}</div>
                                        <div className="text-sm text-slate-500">{s.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Tahap Akhir & Output</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {OUTPUT_LANGUAGES.map((l) => (
                                <button
                                    key={l.id}
                                    onClick={() => setLanguage(l.id)}
                                    className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-3 ${language === l.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-slate-100 hover:border-[var(--color-primary)]/30'
                                        }`}
                                >
                                    <span className="text-2xl">{l.flag}</span>
                                    <div className="text-left">
                                        <div className="font-bold">{l.name}</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-black">{l.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Ringkasan Konfigurasi</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                                <div className="flex gap-2"><span>🏷️</span> {selectedEvent?.name}</div>
                                <div className="flex gap-2"><span>📌</span> {selectedTheme?.name}</div>
                                <div className="flex gap-2"><span>🎭</span> {selectedStyle?.name}</div>
                                <div className="flex gap-2"><span>🌐</span> {selectedLanguage?.name}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-8">
                <button
                    onClick={() => setStep(Math.max(1, step - 1))}
                    className={`btn-secondary h-12 !px-8 ${step === 1 ? 'invisible' : ''}`}
                >
                    ← Kembali
                </button>

                {step < 4 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        disabled={!canNext()}
                        className="btn-primary h-12 !px-10"
                    >
                        Lanjut →
                    </button>
                ) : (
                    <div className="flex items-center gap-4 flex-1 justify-end">
                        <div className="flex items-center gap-2 mr-4">
                            <input
                                type="checkbox"
                                id="multi-toggle"
                                checked={multiVersion}
                                onChange={(e) => setMultiVersion(e.target.checked)}
                                className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer"
                            />
                            <label htmlFor="multi-toggle" className="text-sm font-bold text-slate-600 cursor-pointer">Mode 3 Versi</label>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="btn-primary h-12 !px-12 shadow-xl shadow-[var(--color-primary)]/20"
                        >
                            🚀 Mulai Susun
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
