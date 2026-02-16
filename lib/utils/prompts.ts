import { EVENT_TYPES } from '@/lib/constants/events';
import { THEMES } from '@/lib/constants/themes';
import { LANGUAGE_STYLES } from '@/lib/constants/styles';
import { OUTPUT_LANGUAGES } from '@/lib/constants/languages';

export function buildPrompt(eventType: string, theme: string, style: string, language: string) {
    const event = EVENT_TYPES.find(e => e.id === eventType);
    const themeData = THEMES.find(t => t.id === theme);
    const styleData = LANGUAGE_STYLES.find(s => s.id === style);
    const langData = OUTPUT_LANGUAGES.find(l => l.id === language);

    if (!event || !themeData || !styleData || !langData) {
        throw new Error('Invalid parameters');
    }

    const wordsPerMinute = 130;
    const targetWords = event.duration * wordsPerMinute;

    const styleDescriptions: Record<string, string> = {
        formal: 'Gunakan bahasa baku. Struktur kalimat teratur. Fokus pada penjelasan dalil yang mendalam. Hindari bahasa sehari-hari.',
        menyentuh_hati: 'Gunakan bahasa yang emosional tapi tidak berlebihan. Banyak analogi dengan perasaan manusia. Sentuh sisi kemanusiaan. Ajak introspeksi diri.',
        puitis: 'Gunakan majas dan kiasan. Pilihan kata yang indah. Rima sesekali boleh (tapi jangan sampai kayak pantun). Flow yang smooth.',
        kekinian: 'Bahasa yang relate dengan anak muda. Contoh dari kehidupan modern (medsos, teknologi, dll). Tetap sopan dan santun. Hindari bahasa gaul berlebihan.',
    };

    const systemPrompt = `Kamu adalah ulama Islam yang ahli dalam menulis khutbah. Kamu memiliki pengetahuan mendalam tentang Al-Qur'an, Hadith, Fiqh, dan kemampuan menyampaikan pesan dengan bahasa yang ${styleData.name}.

Tugas kamu adalah membuat naskah khutbah yang:
1. Sesuai dengan struktur khutbah Islam yang benar
2. Menggunakan dalil shahih (Al-Qur'an dan Hadith Bukhari/Muslim)
3. Relevan dengan kehidupan modern
4. Mudah dipahami jemaah
5. Menginspirasi untuk berbuat baik`;

    const userPrompt = `Buatkan naskah khutbah ${event.name} dalam ${langData.name} dengan tema ${themeData.name}.

SPESIFIKASI:
- Jenis Acara: ${event.name} (${event.duration} menit)
- Tema: ${themeData.name}
- Gaya Bahasa: ${styleData.name}
- Bahasa Output: ${langData.name}
- Target jumlah kata: ~${targetWords} kata

STRUKTUR WAJIB:
1. Mukadimah:
   - Alhamdulillah dalam bahasa Arab
   - Shalawat kepada Nabi Muhammad SAW
   - Pembukaan dalam ${langData.name}

2. Khutbah Pertama:
   - Pengantar tema dengan kalimat pembuka yang kuat
   - Minimal 1 ayat Al-Qur'an (HARUS: Arab + transliterasi + terjemahan + tafsir singkat)
   - Minimal 1 hadith shahih (HARUS: Arab + terjemahan + sumber lengkap seperti 'HR. Bukhari no. 1234')
   - Penjelasan lengkap tema dengan 2-3 poin utama
   - Contoh konkret dari kehidupan sehari-hari yang relatable
   
3. Duduk Sebentar:
   - Text: "أَقُوْلُ قَوْلِيْ هٰذَا وَأَسْتَغْفِرُ اللهَ لِيْ وَلَكُمْ"

4. Khutbah Kedua:
   - Kelanjutan tema atau aspek berbeda dari tema yang sama
   - Bisa tambahkan 1 dalil lagi kalau relevan
   - Aplikasi praktis: Apa yang harus jemaah lakukan setelah khutbah?
   - Call to action yang jelas dan actionable

5. Penutup:
   - Pengingat singkat (2-3 kalimat)
   - Doa penutup dalam Arab + terjemahan
   - Penutup: "وَالسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ"

PENTING:
- Semua ayat & hadith HARUS shahih dan dari sumber terpercaya
- Transliterasi Arab harus benar
- Gaya bahasa: ${styleDescriptions[style] || styleDescriptions.formal}
- Hindari konten yang kontroversial atau politis
- Fokus pada pesan positif dan membangun

OUTPUT FORMAT:
Return HANYA JSON dengan struktur berikut (JANGAN ada text lain):

{
  "title": "Judul khutbah yang singkat dan menarik (max 60 karakter)",
  "mukadimah": {
    "arabic": "Text Arab mukadimah lengkap dengan harakah",
    "translation": "Terjemahan mukadimah dalam ${langData.name}"
  },
  "khutbah1": {
    "intro": "Kalimat pembuka yang kuat (2-3 paragraf)",
    "ayat": {
      "reference": "QS. [Nama Surah]:[Nomor Ayat]",
      "arabic": "Text ayat dalam Arab dengan harakah",
      "transliteration": "Transliterasi Latin",
      "translation": "Terjemahan dalam ${langData.name}",
      "tafsir": "Penjelasan singkat konteks ayat (2-3 kalimat)"
    },
    "hadith": {
      "reference": "HR. [Bukhari/Muslim/dll] no. [nomor]",
      "arabic": "Text hadith dalam Arab",
      "translation": "Terjemahan dalam ${langData.name}",
      "authenticity": "Shahih"
    },
    "content": "Penjelasan lengkap tema dengan elaborasi dalil dan contoh (4-6 paragraf)"
  },
  "pause": "أَقُوْلُ قَوْلِيْ هٰذَا وَأَسْتَغْفِرُ اللهَ لِيْ وَلَكُمْ",
  "khutbah2": {
    "content": "Lanjutan tema atau aspek lain (3-4 paragraf)",
    "callToAction": "Ajakan konkret untuk jemaah (1-2 paragraf)"
  },
  "penutup": {
    "reminder": "Pengingat singkat kesimpulan (2-3 kalimat)",
    "dua": {
      "arabic": "Doa penutup dalam Arab",
      "translation": "Terjemahan doa"
    },
    "closing": "وَالسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ"
  }
}`;

    return { systemPrompt, userPrompt };
}
