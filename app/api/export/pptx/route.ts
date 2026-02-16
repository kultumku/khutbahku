import { NextRequest, NextResponse } from 'next/server';
import pptxgen from 'pptxgenjs';

export async function POST(req: NextRequest) {
    try {
        const { title, content } = await req.json();

        const pptx = new pptxgen();

        // 1. Title Slide
        const slide1 = pptx.addSlide();
        slide1.background = { color: 'F1F5F9' };
        slide1.addText(title, {
            x: 1, y: 2, w: '80%', color: '0F172A', fontSize: 44, bold: true, align: 'center'
        });
        slide1.addText('KhutbahKu - Teknologi Pintar', {
            x: 1, y: 3.5, w: '80%', color: '16A34A', fontSize: 18, align: 'center'
        });

        // 2. Content Slides
        // Split content into reasonable chunks (per paragraph or per 500 chars)
        const paragraphs = content.split('\n\n').filter((p: string) => p.trim());

        paragraphs.forEach((p: string) => {
            const slide = pptx.addSlide();
            slide.addText(p, {
                x: 0.5, y: 0.5, w: 9, h: 4.5, color: '334155', fontSize: 24, align: 'left', valign: 'top'
            });
            // Header for context
            slide.addText(title, { x: 0.5, y: 5.2, w: 4, fontSize: 10, color: '94A3B8' });
        });

        const buffer = await pptx.write({ outputType: 'arraybuffer' });

        return new NextResponse(buffer as ArrayBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'Content-Disposition': `attachment; filename="${title.replace(/\s+/g, '_')}.pptx"`,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
