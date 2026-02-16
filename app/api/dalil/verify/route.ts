import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

import { z } from 'zod';

const verifySchema = z.object({
  content: z.string().min(20),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Teks terlalu pendek untuk diverifikasi' }, { status: 400 });
    }

    const { content } = validation.data;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
          Analisis draf khutbah berikut dan verifikasi setiap kutipan Ayat Al-Quran atau Hadits yang ada. 
          Cek apakah referensinya akurat atau ada indikasi halusinasi (salah kutip/salah surat/salah perawi).

          Draf:
          ${content}

          Berikan output dalam format JSON:
          {
            "isSafe": boolean (true jika semua dalil akurat),
            "verificationLevel": "Verified" | "Warning" | "Critical",
            "details": [
              { "reference": "...", "status": "Valid" | "Invalid", "correction": "..." }
            ]
          }
        `;

    const result = await model.generateContent(prompt);
    const verification = JSON.parse(result.response.text());

    return NextResponse.json({ verification });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
