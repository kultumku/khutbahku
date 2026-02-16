'use client';

import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

export default function OnboardingTour() {
    const [run, setRun] = useState(false);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('onboarding-completed');
        if (!hasSeenTour) {
            // Small delay to ensure page elements are rendered
            const timer = setTimeout(() => setRun(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const steps: Step[] = [
        {
            target: 'h1',
            content: 'Selamat datang di KhutbahKu! Mari kami tunjukkan cara membuat khutbah dalam hitungan menit.',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '.grid',
            content: 'Pilih jenis acara yang sesuai. Setiap pilihan akan menyesuaikan durasi dan struktur khutbah.',
            placement: 'top',
        },
        {
            target: '.btn-primary',
            content: 'Klik tombol Lanjut untuk masuk ke tahap pemilihan Tema.',
            placement: 'top',
        },
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
            localStorage.setItem('onboarding-completed', 'true');
            setRun(false);
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideBackButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    primaryColor: '#16a34a',
                    textColor: '#334155',
                    zIndex: 1000,
                },
            }}
            locale={{
                last: 'Selesai',
                next: 'Lanjut',
                skip: 'Lewati',
            }}
        />
    );
}
