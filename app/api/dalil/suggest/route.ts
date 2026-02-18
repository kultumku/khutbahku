import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const suggestSchema = z.object({
  content: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = suggestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Konten tidak mencukupi' }, { status: 400 });
    }

    const { content } = validation.data;
    const { count = 3 } = body; // Extract count from the original body, with a default

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }, { apiVersion: 'v1beta' });

    const prompt = `
      Anda adalah ahli hadist dan tafsir. 
      Berikan ${count} saran dalil (Quran atau Hadits) yang sangat relevan dengan konten khutbah berikut.
      
      KONTEN:
      """
      ${content}
      """
      
      Format JSON:
      [
        {
          "type": "Quran/Hadits",
          "reference": "Surah:Ayat atau Perawi",
          "arabic": "Teks Arab",
          "translation": "Terjemahan Indonesia",
          "context": "Mengapa dalil ini cocok"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let suggestions;
    try {
      suggestions = JSON.parse(responseText.trim());
    } catch {
      let cleanJson = responseText.trim();
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }
      suggestions = JSON.parse(cleanJson);
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
