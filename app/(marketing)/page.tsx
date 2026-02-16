import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[var(--color-surface)]">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl">🕌</span>
                            <span className="text-xl font-bold gradient-text">KhutbahKu</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#features" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors text-sm font-medium">Fitur</a>
                            <a href="#how-it-works" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors text-sm font-medium">Cara Kerja</a>
                            <Link href="/login" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors text-sm font-medium">Masuk</Link>
                            <Link href="/register" className="btn-primary text-sm !py-2 !px-4">Daftar Gratis</Link>
                        </nav>
                        <Link href="/register" className="md:hidden btn-primary text-sm !py-2 !px-4">Daftar</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-primary)] rounded-full opacity-5 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--color-accent)] rounded-full opacity-5 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)] rounded-full opacity-[0.02] blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-fade-in">
                        <div className="inline-flex items-center gap-2 bg-[var(--color-primary-50)] text-[var(--color-primary)] px-4 py-2 rounded-full text-sm font-medium mb-8">
                            <span className="animate-pulse">✨</span>
                            <span>Teknologi Pintar — 100% Gratis</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--color-text-primary)] leading-tight mb-6">
                            Buat Khutbah Berkualitas
                            <br />
                            <span className="gradient-text">dalam 5 Menit Secara Otomatis</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
                            Tidak perlu pusing menyiapkan khutbah lagi. Cukup pilih tema,
                            gaya bahasa, dan biarkan sistem menyusun khutbah lengkap dengan dalil shahih.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="btn-primary text-lg !py-4 !px-8 w-full sm:w-auto">
                                🚀 Mulai Gratis Sekarang
                            </Link>
                            <a href="#how-it-works" className="btn-secondary text-lg !py-4 !px-8 w-full sm:w-auto">
                                ▶️ Lihat Demo
                            </a>
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-[var(--color-text-muted)]">
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Dalil Shahih
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Multi Bahasa
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Export Word
                            </div>
                        </div>
                    </div>

                    {/* Preview mockup */}
                    <div className="mt-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="relative max-w-4xl mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-surface)] z-10 pointer-events-none"></div>
                            <div className="glass-card p-8 rounded-2xl shadow-2xl border border-[var(--color-border)]">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="space-y-4 text-left">
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-[var(--color-primary)]">KHUTBAH JUM&apos;AT</h3>
                                        <h2 className="text-xl font-bold">Kemuliaan Akhlak dalam Islam</h2>
                                    </div>
                                    <div className="dalil-box">
                                        <p className="arabic-text text-lg mb-2">وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ</p>
                                        <p className="text-sm text-[var(--color-text-secondary)]">QS. Al-Qalam: 4</p>
                                        <p className="text-sm italic mt-1">&quot;Dan sesungguhnya kamu benar-benar berbudi pekerti yang agung.&quot;</p>
                                    </div>
                                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                                        Ma&apos;asyiral Muslimin Rahimakumullah, akhlak mulia merupakan fondasi utama dalam kehidupan seorang Muslim.
                                        Rasulullah SAW sendiri diutus untuk menyempurnakan akhlak mulia...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                            Kenapa Memilih <span className="gradient-text">KhutbahKu</span>?
                        </h2>
                        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                            Platform cerdas untuk membantu para khatib menyiapkan khutbah berkualitas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: '⚡', title: 'Cepat 5 Menit', desc: 'Dari nol ke khutbah lengkap hanya dalam 5 menit. Tidak perlu berjam-jam mencari referensi.' },
                            { icon: '📖', title: 'Dalil Shahih', desc: 'Setiap ayat Al-Quran dan hadith yang digunakan dijamin dari sumber terpercaya.' },
                            { icon: '🎨', title: '4 Gaya Bahasa', desc: 'Pilih gaya formal, menyentuh hati, puitis, atau kekinian sesuai kebutuhan.' },
                            { icon: '🌍', title: '5 Bahasa', desc: 'Tersedia dalam Bahasa Indonesia, Jawa, Sunda, English, dan Arab Fusha.' },
                            { icon: '💾', title: 'Export Word', desc: 'Download khutbah sebagai file .docx. Siap cetak dan dibawa ke mimbar.' },
                            { icon: '🔄', title: '12 Jenis Acara', desc: 'Dari Khutbah Jumat, Idul Fitri, nikah, aqiqah, hingga Maulid Nabi.' },
                        ].map((feature, i) => (
                            <div key={i} className="card p-8 text-center group">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{feature.title}</h3>
                                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-[var(--color-surface)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                            Cara Kerja <span className="gradient-text">Semudah 1-2-3-4</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: '1', icon: '📅', title: 'Pilih Jenis Acara', desc: 'Khutbah Jumat, Idul Fitri, Nikah, dan lainnya' },
                            { step: '2', icon: '📝', title: 'Pilih Tema', desc: '20 tema dari Tauhid hingga Dakwah Digital' },
                            { step: '3', icon: '🎭', title: 'Pilih Gaya Bahasa', desc: 'Formal, Menyentuh Hati, Puitis, atau Kekinian' },
                            { step: '4', icon: '🚀', title: 'Generate!', desc: 'Sistem menyusun khutbah lengkap dalam hitungan detik' },
                        ].map((item, i) => (
                            <div key={i} className="relative text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white text-2xl font-bold mb-4 shadow-lg shadow-[var(--color-primary)]/20">
                                    {item.step}
                                </div>
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{item.title}</h3>
                                <p className="text-[var(--color-text-secondary)] text-sm">{item.desc}</p>
                                {i < 3 && (
                                    <div className="hidden lg:block absolute top-8 left-[calc(100%_-_1rem)] w-8 text-[var(--color-primary)] opacity-30">
                                        →
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 gradient-bg relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-5 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-accent)] rounded-full opacity-10 blur-3xl"></div>
                </div>
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Siap Membuat Khutbah Pertama Anda?
                    </h2>
                    <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                        Bergabunglah dengan ribuan khatib yang sudah menggunakan KhutbahKu.
                        100% gratis, tanpa batasan.
                    </p>
                    <Link href="/register" className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[var(--color-primary-50)] transition-all hover:scale-105 shadow-2xl">
                        🚀 Daftar Gratis Sekarang
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[var(--color-primary-900)] text-white/70 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🕌</span>
                            <span className="text-lg font-bold text-white">KhutbahKu</span>
                        </div>
                        <p className="text-sm">© 2026 KhutbahKu. Khutbah Berkualitas, Praktis & Cepat.</p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Kontak</a>
                            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
