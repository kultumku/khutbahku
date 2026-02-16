import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { trackCAPI } from '@/lib/tracking/capi';

import { z } from 'zod';

const upgradeSchema = z.object({
    userId: z.string().uuid(),
    email: z.string().email(),
});

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    // 1. Verify if the requester is an admin
    const { data: { user: requester } } = await supabase.auth.getUser();
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', requester.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // 2. Validate Body
    const body = await req.json();
    const validation = upgradeSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    const { userId, email } = validation.data;

    // 3. Perform the upgrade
    const { error } = await supabase
        .from('profiles')
        .update({
            subscription_tier: 'pro',
            subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year for now
        })
        .eq('id', userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // 3. Trigger Facebook CAPI Purchase Event
    await trackCAPI('Purchase', { email }, { value: 99000.00, currency: 'IDR' });

    return NextResponse.json({ success: true });
}
