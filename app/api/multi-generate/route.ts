import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkQuota } from '@/lib/utils/quota';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

import { z } from 'zod';

const multiGenerateSchema = z.object({
    eventType: z.string().min(1),
    theme: z.string().min(1),
    style: z.string().min(1),
    language: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const { allowed, error: quotaError } = await checkQuota();
        if (!allowed) return NextResponse.json({ error: quotaError }, { status: 403 });

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = multiGenerateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Data tidak valid', details: validation.error.format() }, { status: 400 });
        }

        const { eventType, theme, style, language } = validation.data;

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                responseMimeType: 'application/json',
            },
        }, { apiVersion: 'v1beta' });

        const prompt = `
      Buatlah 3 versi naskah khutbah yang berbeda untuk:
      - Jenis: ${eventType}
      - Tema: ${theme}
      - Gaya Utama: ${style}
      - Bahasa: ${language}

      Berikan output dalam format JSON array dengan struktur:
      [
        { "title": "...", "content": "..." },
        { "title": "...", "content": "..." },
        { "title": "...", "content": "..." }
      ]
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let versionsData;
        try {
            versionsData = JSON.parse(responseText.trim());
        } catch {
            let cleanJson = responseText.trim();
            if (cleanJson.startsWith('```')) {
                cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
            }
            versionsData = JSON.parse(cleanJson);
        }

        const versionGroupId = crypto.randomUUID();

        // Save each version to the database
        const { data, error } = await supabase.from('khutbahs').insert(
            versionsData.map((v: any) => ({
                user_id: user.id,
                title: v.title,
                content: {
                    title: v.title,
                    khutbah1: { content: v.content },
                    khutbah2: { content: "" }, // Placeholder for now
                    mukadimah: { arabic: "", translation: "" },
                    penutup: { closing: "", reminder: "", dua: { arabic: "", translation: "" } }
                },
                event_type: eventType,
                theme: theme,
                style: style,
                language: language,
                version_group_id: versionGroupId
            }))
        ).select();

        if (error) throw error;

        return NextResponse.json({ versions: data, versionGroupId });
    } catch (error: any) {
        console.error('Multi-gen error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
