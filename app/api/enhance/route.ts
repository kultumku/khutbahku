import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { content, instruction } = await req.json();

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
            },
        }, { apiVersion: 'v1' });

        const prompt = `
      Anda adalah asisten ahli penyusun khutbah. 
      Tugas Anda adalah memperbaiki atau meningkatkan naskah khutbah berikut berdasarkan instruksi khusus.
      
      NASKAH ASLI:
      """
      ${content}
      """
      
      INSTRUKSI PERBAIKAN:
      "${instruction}"
      
      Berikan hasil naskah yang sudah diperbaiki secara lengkap. 
      Jangan berikan komentar tambahan, langsung berikan naskah hasilnya saja.
      Gunakan bahasa yang santun, islami, dan sesuai dengan target audiens.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json({ enhancedContent: responseText });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
