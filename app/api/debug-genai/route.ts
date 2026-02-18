import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(req: NextRequest) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        // We can't easily list models with the SDK without more setup, 
        // but we can try a simple generate content with a very basic model.
        return NextResponse.json({
            status: 'Checking...',
            key_preview: process.env.GEMINI_API_KEY?.substring(0, 5) + '...',
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
