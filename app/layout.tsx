import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KhutbahKu - Khutbah Berkualitas, Praktis & Cepat",
  description: "Buat khutbah berkualitas dalam 5 menit dengan AI. Dalil shahih, multi-bahasa, dan siap cetak.",
  keywords: ["khutbah", "jumat", "AI", "generator", "islam", "masjid"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
