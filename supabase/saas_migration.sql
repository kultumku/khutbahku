-- KHUTBAHKU ULTIMATE SCHEMA MIGRATION

-- 1. PROFILES TABLE (Extends Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEAM MEMBERS TABLE (M:M)
CREATE TABLE IF NOT EXISTS public.team_members (
    team_id UUID REFERENCES public.teams ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    role TEXT CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

-- 4. SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.teams ON DELETE CASCADE,
    event_date DATE NOT NULL,
    khatib_name TEXT NOT NULL,
    theme TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users -- The person who created the schedule entry
);

-- 5. UPDATE KHUTBAHS TABLE
ALTER TABLE IF EXISTS public.khutbahs 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS version_group_id UUID; -- To group different versions of the same khutbah

-- 6. ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Teams: Only members of the team can view the team
CREATE POLICY "Team members can view their teams" ON public.teams 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.team_members WHERE team_id = teams.id AND user_id = auth.uid())
);

-- Team Members: Members can see other members in their teams
CREATE POLICY "Members can view other team members" ON public.team_members
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.team_members m2 WHERE m2.team_id = team_members.team_id AND m2.user_id = auth.uid())
);

-- Schedules: Team members can view/manage schedules
CREATE POLICY "Team members can view schedules" ON public.schedules
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.team_members WHERE team_id = schedules.team_id AND user_id = auth.uid())
);

-- Community: Public khutbahs are viewable by everyone
CREATE POLICY "Anyone can view public khutbahs" ON public.khutbahs
FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

-- 8. TRIGGER FOR NEW USERS (Profiles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
