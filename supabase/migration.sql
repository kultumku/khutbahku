-- KhutbahKu Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create khutbahs table
CREATE TABLE public.khutbahs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  theme TEXT NOT NULL,
  language_style TEXT NOT NULL,
  output_language TEXT NOT NULL DEFAULT 'id',
  content JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_khutbahs_user_id ON public.khutbahs(user_id);
CREATE INDEX idx_khutbahs_created_at ON public.khutbahs(created_at DESC);
CREATE INDEX idx_khutbahs_event_type ON public.khutbahs(event_type);

-- Enable Row Level Security
ALTER TABLE public.khutbahs ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own khutbahs
CREATE POLICY "Users can view their own khutbahs"
  ON public.khutbahs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own khutbahs"
  ON public.khutbahs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own khutbahs"
  ON public.khutbahs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own khutbahs"
  ON public.khutbahs FOR DELETE
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_khutbah_updated
  BEFORE UPDATE ON public.khutbahs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
