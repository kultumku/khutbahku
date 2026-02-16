'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EVENT_TYPES } from '@/lib/constants/events';
import { THEMES, THEME_CATEGORIES } from '@/lib/constants/themes';
import { LANGUAGE_STYLES } from '@/lib/constants/styles';
import { OUTPUT_LANGUAGES } from '@/lib/constants/languages';

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

        // Animate loading messages
        for (let i = 0; i < LOADING_MESSAGES.length; i++) {
            setLoadingMsg(LOADING_MESSAGES[i]);
            await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000));
        }

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventType, theme, style, language }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Gagal generate. Coba lagi.');
            }

            const data = await res.json();
            router.push(`/khutbah/${data.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal generate. Coba lagi.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-20 lg:pb-0">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Buat Khutbah Baru</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">Ikuti 4 langkah sederhana untuk menghasilkan khutbah berkualitas</p>

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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
                        <div className="loader mx-auto mb-6"></div>
                        <p className="text-[var(--color-primary)] font-semibold text-lg mb-2">Menyusun Khutbah...</p>
                        <p className="text-[var(--color-text-secondary)] text-sm animate-pulse">{loadingMsg}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-700 font-bold">✕</button>
                </div>
            )}

            {/* Step 1: Event Type */}
            {step === 1 && (
                <div className="animate-fade-in">
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Pilih Jenis Acara</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {EVENT_TYPES.map((event) => (
                            <button
                                key={event.id}
                                onClick={() => setEventType(event.id)}
                                className={`card p-4 text-center cursor-pointer border-2 transition-all ${eventType === event.id ? 'card-selected' : 'border-transparent hover:border-[var(--color-border)]'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{event.icon}</div>
                                <div className="font-semibold text-sm text-[var(--color-text-primary)]">{event.name}</div>
                                <div className="text-xs text-[var(--color-text-muted)] mt-1">{event.duration} menit</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Theme */}
            {step === 2 && (
                <div className="animate-fade-in">
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Pilih Tema</h2>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {THEME_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setThemeFilter(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${themeFilter === cat.id
                                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                                    : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredThemes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`card p-4 text-center cursor-pointer border-2 transition-all ${theme === t.id ? 'card-selected' : 'border-transparent hover:border-[var(--color-border)]'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{t.icon}</div>
                                <div className="font-semibold text-sm text-[var(--color-text-primary)]">{t.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: Style */}
            {step === 3 && (
                <div className="animate-fade-in">
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Pilih Gaya Bahasa</h2>
                    <div className="space-y-3">
                        {LANGUAGE_STYLES.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setStyle(s.id)}
                                className={`card p-5 w-full text-left cursor-pointer border-2 transition-all ${style === s.id ? 'card-selected' : 'border-transparent hover:border-[var(--color-border)]'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${style === s.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-[var(--color-border)]'
                                        }`}>
                                        {style === s.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-[var(--color-text-primary)]">{s.name}</div>
                                        <div className="text-sm text-[var(--color-text-secondary)] mt-1">{s.description}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 4: Language + Review */}
            {step === 4 && (
                <div className="animate-fade-in">
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Pilih Bahasa Output</h2>
                    <div className="space-y-3 mb-8">
                        {OUTPUT_LANGUAGES.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setLanguage(l.id)}
                                className={`card p-5 w-full text-left cursor-pointer border-2 transition-all ${language === l.id ? 'card-selected' : 'border-transparent hover:border-[var(--color-border)]'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${language === l.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-[var(--color-border)]'
                                        }`}>
                                        {language === l.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                    </div>
                                    <div>
                                        <span className="mr-2">{l.flag}</span>
                                        <span className="font-semibold text-[var(--color-text-primary)]">{l.name}</span>
                                        <div className="text-sm text-[var(--color-text-secondary)] mt-1">{l.description}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Review */}
                    <div className="card p-6 bg-[var(--color-primary-50)] border-[var(--color-primary)]/20">
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Review Pilihan Anda</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-green-600">✓</span>
                                <span className="text-[var(--color-text-secondary)]">Jenis Acara:</span>
                                <span className="font-semibold">{selectedEvent?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-600">✓</span>
                                <span className="text-[var(--color-text-secondary)]">Tema:</span>
                                <span className="font-semibold">{selectedTheme?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-600">✓</span>
                                <span className="text-[var(--color-text-secondary)]">Gaya:</span>
                                <span className="font-semibold">{selectedStyle?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-600">✓</span>
                                <span className="text-[var(--color-text-secondary)]">Bahasa:</span>
                                <span className="font-semibold">{selectedLanguage?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-primary)]/10">
                                <span className="text-[var(--color-text-secondary)]">⏱️ Durasi estimasi:</span>
                                <span className="font-semibold">{selectedEvent?.duration} menit</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
                <button
                    onClick={() => setStep(Math.max(1, step - 1))}
                    className={`btn-secondary ${step === 1 ? 'invisible' : ''}`}
                >
                    ← Kembali
                </button>

                {step < 4 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        disabled={!canNext()}
                        className="btn-primary"
                    >
                        Lanjut →
                    </button>
                ) : (
                    <button
                        onClick={handleGenerate}
                        disabled={!canNext() || loading}
                        className="btn-primary !px-8"
                    >
                        🚀 Generate Khutbah
                    </button>
                )}
            </div>
        </div>
    );
}
