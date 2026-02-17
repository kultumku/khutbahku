import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { to, subject, body } = await req.json();

        // In production, use RESEND_API_KEY from .env
        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (!RESEND_API_KEY) {
            console.log("MOCK EMAIL SENT TO:", to, "SUBJECT:", subject);
            return NextResponse.json({ success: true, mock: true });
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'KhutbahKu <noreply@khutbahku.com>',
                to: [to],
                subject: subject,
                html: `<div>${body}</div>`
            })
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
