import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function checkQuota() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { allowed: false, error: 'Unauthorized' };

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    if (profile?.subscription_tier === 'pro') {
        return { allowed: true };
    }

    // Count generations in the last 24 hours for free users
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error } = await supabase
        .from('khutbahs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gt('created_at', yesterday);

    const LIMIT = 1; // 1 generation per day for free tier
    if ((count || 0) >= LIMIT) {
        return { allowed: false, error: 'Limit harian tercapai. Silakan upgrade ke Pro untuk akses tak terbatas.' };
    }

    return { allowed: true };
}
