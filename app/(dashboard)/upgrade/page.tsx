'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UpgradePage() {
    const [uploading, setUploading] = useState(false);
    const [proofUploaded, setProofUploaded] = useState(false);

    useEffect(() => {
        // Track Lead event when user visits upgrade page
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Lead');
        }
    }, []);

    const bankAccounts = [
        { bank: 'BCA', number: '8610509879', name: 'Joko susilo' },
        { bank: 'Mandiri', number: '1370004531675', name: 'Joko susilo' },
        { bank: 'BRI', number: '105601000146565', name: 'Joko susilo' },
    ];

    const waLink = "https://wa.me/6282134341331?text=Halo%20Admin%2C%20saya%20ingin%20konfirmasi%20pembayaran%20KhutbahKu%20Pro.";

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Unauthorized');

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `proofs/${fileName}`;

            const { error } = await supabase.storage
                .from('payment-proofs')
                .upload(filePath, file);

            if (error) throw error;

            setProofUploaded(true);
            alert('Bukti berhasil diupload! Admin akan segera memverifikasi.');
        } catch (err: any) {
            console.error(err);
            alert('Gagal mengupload bukti: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-10 animate-fade-in pb-32">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black mb-4 gradient-text">Upgrade ke KhutbahKu Pro</h1>
                <p className="text-slate-500 text-lg">Buka semua fitur premium dan dukung dakwah digital yang lebih luas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Benefits Area */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm transition-all hover:shadow-xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="bg-emerald-100 p-2 rounded-lg">✨</span> Fitur KhutbahKu Pro
                    </h2>
                    <ul className="space-y-4">
                        {[
                            "Generate Khutbah Tanpa Batas",
                            "Mode Multi-Versi (3 Draf Sekaligus)",
                            "Akses Teleprompter Eksklusif",
                            "Ekspor PowerPoint & PDF Premium",
                            "Analisis Kualitas & Durasi Pintar",
                            "Auto-save Naskah (Lupa Simpan? Aman!)",
                            "Akses Tim & Kolaborasi Penuh",
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <span className="text-emerald-500 font-bold bg-emerald-50 w-6 h-6 rounded-full flex items-center justify-center text-xs">✓</span>
                                <p className="text-slate-700 font-medium">{feature}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Payment Area */}
                <div className="bg-[var(--color-primary)] text-white rounded-3xl p-8 shadow-xl shadow-[var(--color-primary)]/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">💰</div>
                    <div>
                        <h2 className="text-xl font-bold mb-6 relative z-10">Metode Pembayaran</h2>
                        <div className="space-y-4 relative z-10">
                            {bankAccounts.map((acc, i) => (
                                <div key={i} className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{acc.bank}</p>
                                    <p className="text-xl font-black">{acc.number}</p>
                                    <p className="text-xs opacity-80 mt-1">a.n {acc.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8 p-6 bg-white/20 rounded-2xl text-center border border-white/20">
                        <p className="text-sm font-bold opacity-80">Investasi Dakwah:</p>
                        <p className="text-4xl font-black">99rb <span className="text-sm font-medium opacity-70">/ Selamanya</span></p>
                    </div>
                </div>
            </div>

            {/* Confirmation & Upload Area */}
            <div className="bg-emerald-50 border-2 border-emerald-500/20 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-inner">
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">Konfirmasi Pembayaran</h3>
                <p className="text-emerald-700 mb-8 font-medium">Lengkapi upgrade Anda dengan mengupload bukti transfer atau hubungi admin via WhatsApp.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* File Upload Button */}
                    <div className="relative">
                        <label className={`w-full cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all h-full ${proofUploaded ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500'}`}>
                            <span className="text-3xl mb-2">{uploading ? '⌛' : proofUploaded ? '✅' : '📁'}</span>
                            <span className="font-bold text-sm">{uploading ? 'Sedang Mengunggah...' : proofUploaded ? 'Bukti Terkirim' : 'Upload Bukti Disini'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading || proofUploaded} />
                        </label>
                    </div>

                    {/* WA Button */}
                    <a
                        href={waLink}
                        target="_blank"
                        className="flex flex-col items-center justify-center p-6 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <span className="text-3xl mb-2">📱</span>
                        <span className="text-sm">Konfirmasi via WhatsApp</span>
                    </a>
                </div>

                {proofUploaded && (
                    <div className="mt-6 p-4 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold animate-pulse">
                        Akun Anda akan aktif dalam 1-24 jam setelah verifikasi admin.
                    </div>
                )}
            </div>
        </div>
    );
}
