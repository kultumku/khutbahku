import { OutputLanguage } from '@/types/khutbah';

export const OUTPUT_LANGUAGES: OutputLanguage[] = [
    {
        id: 'id',
        name: 'Bahasa Indonesia',
        flag: '🇮🇩',
        description: 'Khutbah dalam bahasa Indonesia standar',
    },
    {
        id: 'jv',
        name: 'Bahasa Jawa Kromo Inggil',
        flag: '🗣️',
        description: 'Khutbah dalam bahasa Jawa halus',
    },
    {
        id: 'su',
        name: 'Bahasa Sunda Halus',
        flag: '🗣️',
        description: 'Khutbah dalam bahasa Sunda formal',
    },
    {
        id: 'en',
        name: 'English',
        flag: '🇬🇧',
        description: 'Sermon in formal English',
    },
    {
        id: 'ar',
        name: 'اللغة العربية الفصحى',
        flag: '🇸🇦',
        description: 'Khutbah dalam bahasa Arab Fusha klasik',
    },
];
