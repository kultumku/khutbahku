export type Profile = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
};

export type Team = {
    id: string;
    name: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
};

export type TeamRole = 'owner' | 'admin' | 'member';

export type TeamMember = {
    team_id: string;
    user_id: string;
    role: TeamRole;
    joined_at: string;
    profile?: Profile;
};

export type Schedule = {
    id: string;
    team_id: string;
    event_date: string;
    khatib_name: string;
    theme: string | null;
    notes: string | null;
    created_at: string;
    user_id: string;
};

export type Khutbah = {
    id: string;
    user_id: string;
    title: string;
    content: string;
    event_type: string;
    theme: string;
    style: string;
    language: string;
    is_public: boolean;
    is_featured: boolean;
    team_id: string | null;
    version_group_id: string | null;
    created_at: string;
    updated_at: string;
};
