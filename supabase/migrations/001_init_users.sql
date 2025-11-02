-- ============================================================================
-- INNERANIMALMEDIA - USER MANAGEMENT SCHEMA
-- Migration: 001_init_users.sql
-- Description: Core user tables and authentication setup
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  
  -- Social links
  twitter_handle TEXT,
  github_handle TEXT,
  linkedin_url TEXT,
  
  -- Settings
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ,
  
  -- Stats
  total_posts INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_likes_received INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0
);

-- ============================================================================
-- USER PROFILES (Extended Info)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  
  -- Preferences
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  
  -- AI Chat Preferences
  preferred_ai_model TEXT DEFAULT 'claude' CHECK (preferred_ai_model IN ('claude', 'chatgpt')),
  ai_temperature DECIMAL(2,1) DEFAULT 0.7,
  
  -- Privacy
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'friends')),
  show_online_status BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER SESSIONS (Track active sessions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  device_info JSONB,
  ip_address INET,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER RELATIONSHIPS (Following system)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_display_name ON public.users(display_name);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_follows_follower ON public.user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON public.user_follows(following_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view public profiles"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- User profiles policies
CREATE POLICY "Anyone can view public profiles"
  ON public.user_profiles FOR SELECT
  USING (
    profile_visibility = 'public' 
    OR id = auth.uid()
  );

CREATE POLICY "Users can update their own profile settings"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Sessions policies
CREATE POLICY "Users can view their own sessions"
  ON public.user_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON public.user_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Anyone can view follows"
  ON public.user_follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON public.user_follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON public.user_follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
  total_posts INTEGER,
  total_comments INTEGER,
  total_followers INTEGER,
  total_following INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.total_posts,
    u.total_comments,
    (SELECT COUNT(*) FROM public.user_follows WHERE following_id = user_uuid)::INTEGER as total_followers,
    (SELECT COUNT(*) FROM public.user_follows WHERE follower_id = user_uuid)::INTEGER as total_following
  FROM public.users u
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Create default admin user profile template (will be created on first signup)

COMMENT ON TABLE public.users IS 'Core user information and authentication data';
COMMENT ON TABLE public.user_profiles IS 'Extended user profile settings and preferences';
COMMENT ON TABLE public.user_sessions IS 'Track user sessions and activity';
COMMENT ON TABLE public.user_follows IS 'User following/follower relationships';

