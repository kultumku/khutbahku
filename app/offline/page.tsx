'use client';

export default function OfflinePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
            <div className="text-6xl mb-6">📶🚫</div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">Anda Sedang Offline</h1>
            <p className="text-slate-500 mb-8 max-w-sm">KhutbahKu membutuhkan koneksi internet untuk generate naskah. Silakan cek koneksi Anda dan coba lagi.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
                Coba Segarkan Halaman
            </button>
        </div>
    );
}
