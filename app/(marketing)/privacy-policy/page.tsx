export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6 prose prose-emerald text-slate-700">
            <h1 className="text-4xl font-black text-slate-900 mb-8">Kebijakan Privasi</h1>
            <p className="text-sm text-slate-500 mb-10">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">1. Informasi yang Kami Kumpulkan</h2>
                <p>Kami mengumpulkan informasi yang Anda berikan langsung kepada kami saat mendaftar, seperti nama dan alamat email. Kami juga mengumpulkan data otomatis melalui teknologi pelacakan.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">2. Penggunaan Teknologi Pelacakan</h2>
                <p>Kami menggunakan Meta Pixel dan Conversions API (CAPI) untuk melacak aktivitas di situs kami guna keperluan optimasi iklan dan analisis penggunaan. Data ini membantu kami memahami bagaimana pengguna berinteraksi dengan layanan kami.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">3. Penggunaan Data AI</h2>
                <p>Input yang Anda berikan untuk menghasilkan khutbah diproses melalui API pihak ketiga (Google Gemini). Kami tidak menyimpan draf khutbah sebagai data pelatihan AI pihak ketiga secara publik tanpa izin Anda.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">4. Hak Anda</h2>
                <p>Anda berhak untuk mengakses, memperbaiki, atau menghapus data pribadi Anda kapan saja melalui pengaturan akun atau dengan menghubungi dukungan kami.</p>
            </section>

            <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="text-sm">Hubungi kami: support@khutbahku.com</p>
            </div>
        </div>
    );
}
