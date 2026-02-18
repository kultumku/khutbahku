import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { verifyVerse } from "@/lib/utils/dalil-verify";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1beta' });

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    // 1. Use Gemini to extract Surah & Ayah numbers from references
    const prompt = `Extract all Quranic references (Surah and Ayah numbers) from this text and return them as a JSON array of objects like this: [{"surahNumber": 2, "ayahNumber": 183, "reference": "Al-Baqarah: 183"}]. If no references found, return []. Text: \n\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    const refs = JSON.parse(text);

    const verificationResults = [];

    // 2. Cross-check each reference with Quran API
    for (const ref of refs) {
      const official = await verifyVerse(ref.surahNumber, ref.ayahNumber);
      if (official) {
        verificationResults.push({
          reference: ref.reference,
          status: "Valid",
          official: official
        });
      } else {
        verificationResults.push({
          reference: ref.reference,
          status: "Invalid or Not Found",
          correction: "Pastikan nomor Surah dan Ayat sudah benar."
        });
      }
    }

    const isSafe = verificationResults.every(v => v.status === "Valid");

    return NextResponse.json({
      verification: {
        isSafe,
        details: verificationResults
      }
    });
  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
