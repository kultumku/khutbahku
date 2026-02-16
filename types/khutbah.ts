export interface KhutbahContent {
    title: string;
    mukadimah: {
        arabic: string;
        translation: string;
    };
    khutbah1: {
        intro: string;
        ayat: {
            reference: string;
            arabic: string;
            transliteration: string;
            translation: string;
            tafsir: string;
        };
        hadith: {
            reference: string;
            arabic: string;
            translation: string;
            authenticity: string;
        };
        content: string;
    };
    pause: string;
    khutbah2: {
        content: string;
        callToAction: string;
    };
    penutup: {
        reminder: string;
        dua: {
            arabic: string;
            translation: string;
        };
        closing: string;
    };
}

export interface Khutbah {
    id: string;
    user_id: string;
    title: string;
    event_type: string;
    theme: string;
    language_style: string;
    output_language: string;
    content: KhutbahContent;
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
}

export interface EventType {
    id: string;
    name: string;
    icon: string;
    duration: number;
    structure: string[];
}

export interface Theme {
    id: string;
    name: string;
    icon: string;
    category: string;
    keywords: string[];
}

export interface LanguageStyle {
    id: string;
    name: string;
    description: string;
}

export interface OutputLanguage {
    id: string;
    name: string;
    flag: string;
    description: string;
}

export interface GeneratorState {
    step: number;
    eventType: string | null;
    theme: string | null;
    style: string | null;
    language: string | null;
}

export interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    created_at: string;
    updated_at: string;
}
