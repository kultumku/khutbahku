-- Add payment proof tracking to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS proof_url TEXT,
ADD COLUMN IF NOT EXISTS proof_status TEXT DEFAULT 'none'; -- 'none', 'pending', 'verified', 'rejected'

-- Ensure RLS allows admin to view all profiles for the dashboard
CREATE POLICY "Admins can view all profiles" 
ON profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Ensure RLS allows admin to update all profiles (for verif)
CREATE POLICY "Admins can update all profiles" 
ON profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
