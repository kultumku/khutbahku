import type { Metadata } from "next";
import "./globals.css";
import SWRegistration from '@/components/sw/ServiceWorkerRegistration';

export const metadata: Metadata = {
  title: "KhutbahKu - Khutbah Berkualitas, Praktis & Cepat",
  description: "Buat khutbah berkualitas dalam 5 menit secara otomatis. Dalil shahih, multi-bahasa, dan siap cetak.",
  keywords: ["khutbah", "jumat", "sistem", "otomatis", "islam", "masjid"],
  manifest: "/manifest.json",
  themeColor: "#16a34a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KhutbahKu",
  },
};

import CookieBanner from '@/components/ui/CookieBanner';

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
        {/* FB Pixel */}
        <script dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `
        }} />
      </head>
      <body className="antialiased">
        <SWRegistration />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
