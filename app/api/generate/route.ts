import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPrompt } from '@/lib/utils/prompts';
import { checkQuota } from '@/lib/utils/quota';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

import { z } from 'zod';

const generateSchema = z.object({
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
        const validation = generateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Data tidak valid', details: validation.error.format() }, { status: 400 });
        }

        const { eventType, theme, style, language } = validation.data;

        const { systemPrompt, userPrompt } = buildPrompt(eventType, theme, style, language);

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json',
            },
        }, { apiVersion: 'v1beta' });

        const fullPrompt = `${systemPrompt}\n\nUSER REQUEST:\n${userPrompt}`;

        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        let content;
        try {
            content = JSON.parse(responseText.trim());
        } catch {
            // Handle case where it might wrap in code blocks despite responseMimeType
            let cleanJson = responseText.trim();
            if (cleanJson.startsWith('```')) {
                cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
            }
            content = JSON.parse(cleanJson);
        }

        // Save to database
        const { data: khutbah, error: dbError } = await supabase
            .from('khutbahs')
            .insert({
                user_id: user.id,
                title: content.title,
                event_type: eventType,
                theme: theme,
                language_style: style,
                output_language: language,
                content: content,
                is_favorite: false,
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json({ error: 'Gagal menyimpan. Coba lagi.' }, { status: 500 });
        }

        return NextResponse.json({ id: khutbah.id, title: content.title });
    } catch (error) {
        console.error('Generate error:', error);

        if (error instanceof Error) {
            if (error.message.includes('rate_limit') || error.message.includes('429')) {
                return NextResponse.json({ error: 'Terlalu banyak request. Tunggu sebentar.' }, { status: 429 });
            }
            if (error.message.includes('timeout')) {
                return NextResponse.json({ error: 'Generation timeout. Coba lagi.' }, { status: 408 });
            }
        }

        return NextResponse.json({
            error: 'Gagal generate. Coba lagi.',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
