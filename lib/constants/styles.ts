import { LanguageStyle } from '@/types/khutbah';

export const LANGUAGE_STYLES: LanguageStyle[] = [
    {
        id: 'formal',
        name: 'Resmi & Formal',
        description: 'Cocok untuk khutbah di masjid besar dan acara resmi. Bahasa baku, struktur teratur, fokus pada dalil.',
    },
    {
        id: 'menyentuh_hati',
        name: 'Menyentuh Hati',
        description: 'Penuh nasihat yang mengena dan menyentuh perasaan. Emotional, relatable, banyak analogi kehidupan.',
    },
    {
        id: 'puitis',
        name: 'Puitis & Indah',
        description: 'Bahasa yang indah dengan pilihan kata yang artistik. Literary, estetik, flow seperti puisi.',
    },
    {
        id: 'kekinian',
        name: 'Kekinian & Santai',
        description: 'Gaya bahasa yang dekat dengan anak muda dan santai. Informal (tetap sopan), contoh modern, relatable.',
    },
];
