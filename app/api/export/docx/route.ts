import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, BorderStyle } from 'docx';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { khutbahId } = await request.json();

        const { data: khutbah } = await supabase
            .from('khutbahs')
            .select('*')
            .eq('id', khutbahId)
            .eq('user_id', user.id)
            .single();

        if (!khutbah) {
            return NextResponse.json({ error: 'Khutbah not found' }, { status: 404 });
        }

        const c = khutbah.content;

        const doc = new Document({
            styles: {
                default: {
                    document: {
                        run: { font: 'Times New Roman', size: 24 },
                    },
                },
            },
            sections: [{
                properties: {
                    page: {
                        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                    },
                },
                children: [
                    // Title
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                        children: [
                            new TextRun({ text: 'KhutbahKu', font: 'Times New Roman', size: 20, color: '2D5F3F', italics: true }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 100 },
                        children: [
                            new TextRun({ text: khutbah.title.toUpperCase(), bold: true, size: 36, font: 'Times New Roman' }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '2D5F3F' } },
                        children: [
                            new TextRun({ text: ' ', size: 12 }),
                        ],
                    }),

                    // Mukadimah
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 },
                        children: [new TextRun({ text: 'المقدمة - Mukadimah', bold: true, size: 28, font: 'Times New Roman' })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 200 },
                        children: [new TextRun({ text: c.mukadimah.arabic, font: 'Traditional Arabic', size: 28 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 300 },
                        children: [new TextRun({ text: c.mukadimah.translation, size: 24, font: 'Times New Roman' })],
                    }),

                    // Khutbah 1
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 },
                        children: [new TextRun({ text: 'الخطبة الأولى - Khutbah Pertama', bold: true, size: 28, font: 'Times New Roman' })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 300 },
                        children: [new TextRun({ text: c.khutbah1.intro, size: 24, font: 'Times New Roman' })],
                    }),

                    // Ayat
                    new Paragraph({
                        spacing: { before: 200, after: 100 },
                        children: [new TextRun({ text: `📖 ${c.khutbah1.ayat.reference}`, bold: true, size: 24, color: '2D5F3F' })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 100 },
                        children: [new TextRun({ text: c.khutbah1.ayat.arabic, font: 'Traditional Arabic', size: 28 })],
                    }),
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [new TextRun({ text: `"${c.khutbah1.ayat.translation}"`, italics: true, size: 24 })],
                    }),

                    // Hadith
                    new Paragraph({
                        spacing: { before: 200, after: 100 },
                        children: [new TextRun({ text: `📚 ${c.khutbah1.hadith.reference} (${c.khutbah1.hadith.authenticity})`, bold: true, size: 24, color: '2D5F3F' })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 100 },
                        children: [new TextRun({ text: c.khutbah1.hadith.arabic, font: 'Traditional Arabic', size: 28 })],
                    }),
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [new TextRun({ text: `"${c.khutbah1.hadith.translation}"`, italics: true, size: 24 })],
                    }),

                    // Content
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 300 },
                        children: [new TextRun({ text: c.khutbah1.content, size: 24, font: 'Times New Roman' })],
                    }),

                    // Pause
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400, after: 100 },
                        children: [new TextRun({ text: '• • •', size: 24, color: '999999' })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 },
                        children: [new TextRun({ text: c.pause, font: 'Traditional Arabic', size: 28 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                        children: [new TextRun({ text: '(Duduk Sebentar)', size: 20, color: '999999', italics: true })],
                    }),

                    // Khutbah 2
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 },
                        children: [new TextRun({ text: 'الخطبة الثانية - Khutbah Kedua', bold: true, size: 28, font: 'Times New Roman' })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [new TextRun({ text: c.khutbah2.content, size: 24, font: 'Times New Roman' })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 300 },
                        children: [new TextRun({ text: c.khutbah2.callToAction, size: 24, font: 'Times New Roman', bold: true })],
                    }),

                    // Penutup
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 },
                        children: [new TextRun({ text: 'الدعاء - Penutup', bold: true, size: 28, font: 'Times New Roman' })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [new TextRun({ text: c.penutup.reminder, size: 24, font: 'Times New Roman' })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 100 },
                        children: [new TextRun({ text: c.penutup.dua.arabic, font: 'Traditional Arabic', size: 28 })],
                    }),
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [new TextRun({ text: c.penutup.dua.translation, italics: true, size: 24 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 300 },
                        children: [new TextRun({ text: c.penutup.closing, font: 'Traditional Arabic', size: 28 })],
                    }),
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);
        const uint8 = new Uint8Array(buffer);

        return new NextResponse(uint8, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${khutbah.title}.docx"`,
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}
