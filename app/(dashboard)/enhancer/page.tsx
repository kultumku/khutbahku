'use client';

import { useState } from 'react';

export default function EnhancerPage() {
    const [content, setContent] = useState('');
    const [instruction, setInstruction] = useState('');
    const [enhanced, setEnhanced] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEnhance = async () => {
        if (!content.trim() || !instruction.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, instruction }),
            });
            const data = await res.json();
            if (data.enhancedContent) {
                setEnhanced(data.enhancedContent);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]">Sistem Perbaikan Naskah</h1>
                <p className="text-[var(--color-text-secondary)]">Gunakan teknologi pintar untuk memoles, memperdalam, atau mengubah gaya bahasa naskah Anda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Side */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <label className="block font-bold mb-2">Naskah Asli</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Tempel naskah khutbah Anda di sini..."
                            className="w-full h-80 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <label className="block font-bold mb-2">Instruksi Perbaikan</label>
                        <textarea
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            placeholder="Contoh: Buat lebih menyentuh hati, tambahkan dalil tentang sabar, atau perpendek durasi..."
                            className="w-full h-24 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none resize-none"
                        ></textarea>
                        <button
                            onClick={handleEnhance}
                            disabled={loading}
                            className="w-full mt-4 bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Sedang Memproses...' : '✨ Perbaiki Naskah Sekarang'}
                        </button>
                    </div>
                </div>

                {/* Output Side */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[500px] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <label className="font-bold">Hasil Perbaikan</label>
                        {enhanced && (
                            <button
                                onClick={() => navigator.clipboard.writeText(enhanced)}
                                className="text-sm text-[var(--color-primary)] font-medium"
                            >
                                Salin Teks
                            </button>
                        )}
                    </div>
                    <div className="flex-grow bg-slate-50 rounded-xl p-4 overflow-y-auto whitespace-pre-wrap text-[var(--color-text-primary)]">
                        {enhanced || (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <span className="text-4xl mb-4">🪄</span>
                                <p>Hasil perbaikan akan muncul di sini</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
