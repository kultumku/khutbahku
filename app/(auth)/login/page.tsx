'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError(error.message === 'Invalid login credentials'
                    ? 'Email atau password salah. Silakan coba lagi.'
                    : error.message);
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch {
            setError('Koneksi gagal. Periksa internet Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-2 mb-6">
                    <span className="text-3xl">🕌</span>
                    <span className="text-2xl font-bold gradient-text">KhutbahKu</span>
                </Link>
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Masuk ke Akun Anda</h1>
                <p className="text-[var(--color-text-secondary)] mt-2">Selamat datang kembali!</p>
            </div>

            <div className="card p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="nama@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field !pr-12"
                                placeholder="Masukkan password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full !py-3"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="loader !w-5 !h-5 !border-2 !border-white/30 !border-t-white"></span>
                                Memproses...
                            </span>
                        ) : 'Masuk'}
                    </button>
                </form>

                <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
                    Belum punya akun?{' '}
                    <Link href="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
                        Daftar di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}
