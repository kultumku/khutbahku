import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { name } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Create the team
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
            name,
            owner_id: user.id
        })
        .select()
        .single();

    if (teamError) {
        return NextResponse.json({ error: teamError.message }, { status: 500 });
    }

    // 2. Add creator as 'owner' in team_members
    const { error: memberError } = await supabase
        .from('team_members')
        .insert({
            team_id: team.id,
            user_id: user.id,
            role: 'owner'
        });

    if (memberError) {
        return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    return NextResponse.json({ team });
}
