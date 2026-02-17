export interface QuranVerse {
    text: string;
    translation: string;
    surah: string;
    numberInSurah: number;
}

export async function verifyVerse(surah: number, ayah: number): Promise<QuranVerse | null> {
    try {
        // Fetch Arabic text
        const arRes = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar.alafasy`);
        const arData = await arRes.json();

        // Fetch Indonesian translation
        const trRes = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/id.indonesian`);
        const trData = await trRes.json();

        if (arData.code === 200 && trData.code === 200) {
            return {
                text: arData.data.text,
                translation: trData.data.text,
                surah: arData.data.surah.englishName,
                numberInSurah: arData.data.numberInSurah
            };
        }
        return null;
    } catch (error) {
        console.error("Error verifying verse:", error);
        return null;
    }
}
