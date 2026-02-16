import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt } from '@/lib/utils/prompts';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { eventType, theme, style, language } = body;

        if (!eventType || !theme || !style || !language) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { systemPrompt, userPrompt } = buildPrompt(eventType, theme, style, language);

        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
        });

        // Extract text from response
        const responseText = message.content
            .filter((block): block is Anthropic.TextBlock => block.type === 'text')
            .map(block => block.text)
            .join('');

        // Parse JSON from response - handle markdown code blocks
        let cleanJson = responseText.trim();
        if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        let content;
        try {
            content = JSON.parse(cleanJson);
        } catch {
            // Retry once if JSON parsing fails
            const retryMessage = await anthropic.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4000,
                temperature: 0.5,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: userPrompt },
                    { role: 'assistant', content: responseText },
                    { role: 'user', content: 'Response sebelumnya bukan valid JSON. Tolong return HANYA JSON tanpa text lain, tanpa markdown code blocks.' },
                ],
            });

            const retryText = retryMessage.content
                .filter((block): block is Anthropic.TextBlock => block.type === 'text')
                .map(block => block.text)
                .join('');

            let retryClean = retryText.trim();
            if (retryClean.startsWith('```')) {
                retryClean = retryClean.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
            }

            content = JSON.parse(retryClean);
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

        return NextResponse.json({ error: 'Gagal generate. Coba lagi.' }, { status: 500 });
    }
}
