'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) setShow(true);
    }, []);

    const accept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 z-[100] animate-slide-up no-print">
            <div className="flex items-start gap-4">
                <div className="text-3xl">🍪</div>
                <div>
                    <h3 className="font-bold text-slate-900 mb-1">Pemberitahuan Cookie</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        Kami menggunakan cookie untuk meningkatkan pengalaman Anda dan melacak performa iklan (Meta Pixel).
                        Dengan melanjutkan, Anda menyetujui penggunaan cookie kami.
                    </p>
                    <div className="flex gap-2">
                        <button onClick={accept} className="btn-primary !py-2 !px-6 text-xs">Setuju</button>
                        <button onClick={() => setShow(false)} className="text-xs text-slate-400 hover:text-slate-600">Nanti saja</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
