import { Theme } from '@/types/khutbah';

export const THEMES: Theme[] = [
    { id: 'tauhid_aqidah', name: 'Tauhid & Aqidah', icon: '☪️', category: 'spiritual', keywords: ['iman', 'Allah', 'rukun iman'] },
    { id: 'akhlak_etika', name: 'Akhlak & Etika Islami', icon: '🤝', category: 'sosial', keywords: ['adab', 'sopan santun', 'budi pekerti'] },
    { id: 'keluarga_sakinah', name: 'Keluarga Sakinah', icon: '👨‍👩‍👧‍👦', category: 'sosial', keywords: ['rumah tangga', 'pernikahan', 'anak'] },
    { id: 'muamalah_syariah', name: 'Muamalah & Ekonomi Syariah', icon: '💰', category: 'ekonomi', keywords: ['riba', 'jual beli', 'halal'] },
    { id: 'ukhuwah_islamiyah', name: 'Ukhuwah Islamiyah', icon: '🤲', category: 'sosial', keywords: ['persatuan', 'toleransi', 'persaudaraan'] },
    { id: 'kisah_muslim', name: 'Kisah & Teladan Muslim', icon: '📖', category: 'spiritual', keywords: ['sahabat', 'nabi', 'sejarah'] },
    { id: 'ibadah_ketaatan', name: 'Ibadah & Ketaatan', icon: '🕌', category: 'spiritual', keywords: ['shalat', 'puasa', 'zakat'] },
    { id: 'jihad_perjuangan', name: 'Jihad & Perjuangan', icon: '⚔️', category: 'spiritual', keywords: ['jihad nafs', 'dakwah', 'perjuangan'] },
    { id: 'kematian_akhirat', name: 'Kematian & Akhirat', icon: '⏳', category: 'spiritual', keywords: ['mati', 'kubur', 'hari kiamat'] },
    { id: 'syukur_sabar', name: 'Syukur & Sabar', icon: '🙏', category: 'spiritual', keywords: ['nikmat', 'cobaan', 'ikhlas'] },
    { id: 'taubat_istighfar', name: 'Taubat & Istighfar', icon: '💫', category: 'spiritual', keywords: ['dosa', 'ampunan', 'tobat'] },
    { id: 'wanita_islam', name: 'Wanita dalam Islam', icon: '👩', category: 'sosial', keywords: ['muslimah', 'hak wanita', 'kemuliaan'] },
    { id: 'pemuda_generasi', name: 'Pemuda & Generasi Muda', icon: '🧑', category: 'sosial', keywords: ['anak muda', 'milenial', 'masa depan'] },
    { id: 'zakat_sedekah', name: 'Zakat & Sedekah', icon: '🎁', category: 'ekonomi', keywords: ['infaq', 'memberi', 'berbagi'] },
    { id: 'haji_umrah', name: 'Haji & Umrah', icon: '🕋', category: 'spiritual', keywords: ['haji', 'umrah', 'baitullah'] },
    { id: 'dakwah_digital', name: 'Dakwah di Era Digital', icon: '📱', category: 'modern', keywords: ['media sosial', 'internet', 'teknologi'] },
    { id: 'kesehatan_islam', name: 'Kesehatan dalam Islam', icon: '🏥', category: 'modern', keywords: ['sehat', 'kebersihan', 'jasmani'] },
    { id: 'lingkungan', name: 'Menjaga Lingkungan', icon: '🌍', category: 'modern', keywords: ['alam', 'bumi', 'khalifah'] },
    { id: 'moderasi_islam', name: 'Moderasi Beragama', icon: '⚖️', category: 'sosial', keywords: ['wasathiyah', 'toleransi', 'moderat'] },
    { id: 'politik_islam', name: 'Politik & Kepemimpinan', icon: '🏛️', category: 'sosial', keywords: ['pemimpin', 'amanah', 'keadilan'] },
];

export const THEME_CATEGORIES = [
    { id: 'semua', name: 'Semua' },
    { id: 'spiritual', name: 'Spiritual' },
    { id: 'sosial', name: 'Sosial' },
    { id: 'ekonomi', name: 'Ekonomi' },
    { id: 'modern', name: 'Modern' },
];
