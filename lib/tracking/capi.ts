import crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const ACCESS_TOKEN = process.env.FB_CAPI_ACCESS_TOKEN;

function hash(value: string) {
    if (!value) return null;
    return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export async function trackCAPI(eventName: string, userData: { email?: string, phone?: string }, customData?: any) {
    const payload = {
        data: [
            {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                user_data: {
                    em: [hash(userData.email || '')],
                    ph: [hash(userData.phone || '')],
                },
                custom_data: customData,
            },
        ],
    };

    try {
        const res = await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return await res.json();
    } catch (err) {
        console.error('CAPI Error:', err);
        return null;
    }
}
