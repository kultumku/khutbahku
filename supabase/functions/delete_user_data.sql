-- Run this in your Supabase SQL Editor
-- This function deletes all data associated with a user

CREATE OR REPLACE FUNCTION delete_user_data()
RETURNS void AS $$
BEGIN
  -- Delete from khutbahs
  DELETE FROM khutbahs WHERE user_id = auth.uid();
  
  -- Delete from team_members (will leave teams they owned floating, but removed from list)
  DELETE FROM team_members WHERE user_id = auth.uid();
  
  -- Delete from profiles
  DELETE FROM profiles WHERE id = auth.uid();
  
  -- Note: auth.users deletion needs to be handled via Supabase Auth Admin or a separate trigger if allowed.
  -- For now, this cleans up the application data.
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
