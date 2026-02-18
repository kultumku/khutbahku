import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

import { z } from 'zod';

const analyzeSchema = z.object({
    content: z.string().min(20), // Minimum enough text to analyze
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = analyzeSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Teks terlalu pendek untuk dianalisis' }, { status: 400 });
        }

        const { content } = validation.data;

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
            },
        }, { apiVersion: 'v1' });

        const prompt = `
      Analisalah naskah khutbah berikut. Berikan penilaian objektif dalam format JSON.
      
      NASKAH:
      """
      ${content}
      """
      
      Format JSON:
      {
        "emotionalScore": 0-100,
        "clarityScore": 0-100,
        "estimatedDuration": "menit",
        "feedback": "Saran singkat untuk perbaikan",
        "keyPoints": ["poin 1", "poin 2"]
      }
    `;

        const result = await model.generateContent(prompt);
        const analysis = JSON.parse(result.response.text());

        return NextResponse.json({ analysis });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
