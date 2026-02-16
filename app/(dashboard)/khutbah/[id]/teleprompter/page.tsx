'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function TeleprompterPage() {
    const { id } = useParams();
    const router = useRouter();
    const [khutbah, setKhutbah] = useState<any>(null);
    const [speed, setSpeed] = useState(20); // 1-100
    const [fontSize, setFontSize] = useState(32);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollInterval = useRef<any>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.from('khutbahs').select('*').eq('id', id).single()
            .then(({ data }) => setKhutbah(data));
    }, [id]);

    useEffect(() => {
        if (isScrolling) {
            scrollInterval.current = setInterval(() => {
                if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
                    setIsScrolling(false);
                    return;
                }
                window.scrollBy(0, speed / 10);
            }, 50);
        } else {
            clearInterval(scrollInterval.current);
        }
        return () => clearInterval(scrollInterval.current);
    }, [isScrolling, speed]);

    if (!khutbah) return <div className="bg-black min-h-screen text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-black min-h-screen text-white selection:bg-[var(--color-primary)]">
            {/* Controls Overlay */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-lg border border-slate-800 p-4 rounded-2xl flex items-center gap-6 shadow-2xl transition-opacity hover:opacity-100 opacity-30">
                <button
                    onClick={() => router.back()}
                    className="text-2xl"
                >
                    ❌
                </button>
                <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Speed: {speed}</span>
                    <input
                        type="range" min="1" max="100" value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                        className="accent-[var(--color-primary)]"
                    />
                </div>
                <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Size: {fontSize}px</span>
                    <input
                        type="range" min="16" max="72" value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="accent-[var(--color-primary)]"
                    />
                </div>
                <button
                    onClick={() => setIsScrolling(!isScrolling)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${isScrolling ? 'bg-red-500' : 'bg-[var(--color-primary)]'}`}
                >
                    {isScrolling ? '⏸' : '▶️'}
                </button>
            </div>

            {/* Text Area */}
            <main
                className="max-w-4xl mx-auto px-6 py-40 leading-relaxed font-medium"
                style={{ fontSize: `${fontSize}px` }}
            >
                <h1 className="text-center mb-20 font-bold opacity-50 uppercase tracking-widest">{khutbah.title}</h1>
                <div className="whitespace-pre-wrap">
                    {khutbah.content}
                </div>
                <div className="h-[80vh]"></div> {/* Bottom spacer */}
                <p className="text-center text-[var(--color-primary)] opacity-50">Selesai • KhutbahKu</p>
            </main>
        </div>
    );
}
