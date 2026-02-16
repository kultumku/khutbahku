export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6 prose prose-emerald text-slate-700">
            <h1 className="text-4xl font-black text-slate-900 mb-8">Syarat dan Ketentuan</h1>
            <p className="text-sm text-slate-500 mb-10">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">1. Penerimaan Ketentuan</h2>
                <p>Dengan menggunakan KhutbahKu, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Layanan ini disediakan "apa adanya" tanpa jaminan keakuratan mutlak atas hasil AI.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">2. Tanggung Jawab Pengguna</h2>
                <p>Anda bertanggung jawab penuh untuk meninjau dan memverifikasi setiap konten (termasuk Ayat Al-Quran dan Hadits) yang dihasilkan oleh sistem kami sebelum digunakan dalam kegiatan keagamaan atau publik.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">3. Langganan dan Pembayaran</h2>
                <p>Akses 'Pro' memerlukan pembayaran langganan. Pembayaran bersifat final dan tidak dapat dikembalikan kecuali diwajibkan oleh hukum atau kebijakan pengembalian dana kami yang berlaku.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">4. Pembatasan Lisensi</h2>
                <p>Anda diberikan lisensi terbatas untuk menggunakan konten yang dihasilkan untuk keperluan dakwah pribadi atau jamaah Masjid Anda. Penjualan kembali konten secara massal tanpa izin adalah dilarang.</p>
            </section>
        </div>
    );
}
