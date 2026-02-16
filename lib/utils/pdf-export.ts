import { jsPDF } from 'jspdf';
import { Khutbah } from '@/types/khutbah';

export function exportToPDF(khutbah: Khutbah) {
    const doc = new jsPDF();
    const c = khutbah.content;

    // Header Color Strip
    doc.setFillColor(22, 163, 74); // emerald-600
    doc.rect(0, 0, 210, 15, 'F');

    // Add Title
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(khutbah.title.toUpperCase(), 105, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont('helvetica', 'italic');
    doc.text(`Jenis: ${khutbah.event_type} | Dihasilkan oleh KhutbahKu`, 105, 38, { align: 'center' });

    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    let y = 60;

    // Helper to add text and handle page breaks
    const addBlock = (title: string, text: string, isArabic = false) => {
        if (!text) return;

        // Title check
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(22, 163, 74);
        doc.text(title, 20, y);
        y += 10;

        // Content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
        const lines = doc.splitTextToSize(text.replace(/<[^>]*>?/gm, ''), 170); // strip html

        if (y + (lines.length * 6) > 280) {
            doc.addPage();
            y = 20;
        }
        doc.text(lines, 20, y);
        y += (lines.length * 6) + 15;
    };

    addBlock('Mukadimah', c.mukadimah.arabic + '\n\n' + c.mukadimah.translation);
    addBlock('Khutbah Pertama', c.khutbah1.intro + '\n\n' + c.khutbah1.content);
    addBlock('Khutbah Kedua', c.khutbah2.content + '\n\n' + c.khutbah2.callToAction);
    addBlock('Penutup', c.penutup.reminder + '\n\n' + c.penutup.dua.arabic + '\n\n' + c.penutup.dua.translation);

    // Disclaimer at end
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const disclaimerLines = doc.splitTextToSize('Disclaimer: Naskah ini dihasilkan oleh AI. Mohon periksa kembali keakuratan kutipan Ayat Al-Quran dan Hadits sebelum digunakan.', 170);
    doc.text(disclaimerLines, 20, y);

    // Page Numbers
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Halaman ${i} dari ${pageCount}`, 105, 290, { align: 'center' });
    }

    doc.save(`${khutbah.title}.pdf`);
}
