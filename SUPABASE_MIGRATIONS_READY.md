# 📊 SUPABASE SQL MIGRATIONS - PASTE INTO SQL EDITOR

**Supabase Dashboard:** https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk
**Location:** SQL Editor (left sidebar)

**Instructions:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy each migration below
3. Paste and run IN ORDER (001 → 002 → 003 → 004 → 005)
4. Wait for "Success" message before proceeding to next
5. Verify tables created after each migration

---

## ⚠️ IMPORTANT: RUN THESE IN ORDER!

---

## 🔹 MIGRATION 1: User Management

**File:** `001_init_users.sql`
**Purpose:** Core user tables and authentication
**Tables:** users, user_profiles, user_sessions, user_follows

**Copy and paste this entire block:**

```sql
-- ============================================================================
-- INNERANIMALMEDIA - USER MANAGEMENT SCHEMA
-- Migration: 001_init_users.sql
-- Description: Core user tables and authentication setup
-- ============================================================================

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


```

**Verify:** Check that these tables were created:
- users
- user_profiles
- user_sessions
- user_follows

---

## 🔹 MIGRATION 2: AI Conversations

**File:** `002_ai_conversations.sql`  
**Purpose:** AI chat conversations and messages  
**Tables:** conversations, messages, conversation_shares, conversation_tags

**Copy and paste this entire block:**

```sql
-- ============================================================================
-- INNERANIMALMEDIA - AI CHAT SCHEMA
-- Migration: 002_ai_conversations.sql
-- Description: Tables for AI chat conversations and messages
-- ============================================================================

-- ============================================================================
-- CONVERSATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Conversation metadata
  title TEXT DEFAULT 'New Conversation',
  model TEXT NOT NULL CHECK (model IN ('claude', 'chatgpt', 'claude-3-5-sonnet-20241022', 'gpt-4o', 'gpt-4o-mini')),
  
  -- Settings
  system_prompt TEXT,
  temperature DECIMAL(2,1) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 4096,
  
  -- Status
  is_archived BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  is_shared BOOLEAN DEFAULT false,
  
  -- Metadata
  total_messages INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  estimated_cost DECIMAL(10,4) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  
  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- Metadata
  model TEXT, -- Which model generated this (for assistant messages)
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10,6) DEFAULT 0.000000,
  
  -- Message state
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONVERSATION SHARES (For sharing conversations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.conversation_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Share settings
  share_token TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  password_hash TEXT, -- Optional password protection
  
  -- Access tracking
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  -- Expiration
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONVERSATION TAGS (Organize conversations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.conversation_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, tag)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_created_at ON public.conversations(created_at DESC);
CREATE INDEX idx_conversations_model ON public.conversations(model);
CREATE INDEX idx_conversations_archived ON public.conversations(is_archived);
CREATE INDEX idx_conversations_favorite ON public.conversations(is_favorite);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_messages_role ON public.messages(role);

CREATE INDEX idx_conversation_shares_token ON public.conversation_shares(share_token);
CREATE INDEX idx_conversation_tags_conversation ON public.conversation_tags(conversation_id);
CREATE INDEX idx_conversation_tags_tag ON public.conversation_tags(tag);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_tags ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON public.conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own messages"
  ON public.messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

-- Shares policies
CREATE POLICY "Users can view their own shares"
  ON public.conversation_shares FOR SELECT
  USING (auth.uid() = shared_by);

CREATE POLICY "Anyone can view public shared conversations"
  ON public.conversation_shares FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can create shares"
  ON public.conversation_shares FOR INSERT
  WITH CHECK (auth.uid() = shared_by);

-- Tags policies
CREATE POLICY "Users can view tags for their conversations"
  ON public.conversation_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tags"
  ON public.conversation_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update conversation's updated_at
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update last_message_at when new message added
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message_at = NEW.created_at,
    total_messages = total_messages + 1
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Get conversation with message count
CREATE OR REPLACE FUNCTION get_conversation_summary(conv_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  model TEXT,
  total_messages INTEGER,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.model,
    c.total_messages,
    c.last_message_at,
    c.created_at
  FROM public.conversations c
  WHERE c.id = conv_id;
END;
$$ LANGUAGE plpgsql;

-- Search conversations
CREATE OR REPLACE FUNCTION search_conversations(user_uuid UUID, search_term TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  model TEXT,
  last_message_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.model,
    c.last_message_at
  FROM public.conversations c
  WHERE c.user_id = user_uuid
    AND (
      c.title ILIKE '%' || search_term || '%'
      OR EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.conversation_id = c.id
          AND m.content ILIKE '%' || search_term || '%'
      )
    )
  ORDER BY c.last_message_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.conversations IS 'AI chat conversations (Claude and ChatGPT)';
COMMENT ON TABLE public.messages IS 'Individual messages within AI conversations';
COMMENT ON TABLE public.conversation_shares IS 'Shared conversations with public links';
COMMENT ON TABLE public.conversation_tags IS 'Tags for organizing conversations';


```

**Verify:** Check that these tables were created:
- conversations
- messages
- conversation_shares
- conversation_tags

---

## 🔹 MIGRATION 3: Community Forum

**File:** `003_community_forum.sql`  
**Purpose:** Forum posts, comments, and community features  
**Tables:** categories, posts, comments, likes, badges, notifications

**Copy and paste this entire block:**

```sql
-- ============================================================================
-- INNERANIMALMEDIA - COMMUNITY FORUM SCHEMA
-- Migration: 003_community_forum.sql
-- Description: Forum posts, comments, and community features
-- ============================================================================

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- Icon name or emoji
  color TEXT DEFAULT '#5F9C9E', -- Brand color
  
  -- Ordering
  order_index INTEGER DEFAULT 0,
  
  -- Stats
  total_posts INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- POSTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  
  -- Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_html TEXT, -- Rendered HTML from markdown
  
  -- Media
  images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  attachments JSONB DEFAULT '[]'::jsonb, -- Array of file URLs
  
  -- Status
  is_published BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false, -- Prevent new comments
  is_deleted BOOLEAN DEFAULT false,
  
  -- Moderation
  flagged_count INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  moderation_notes TEXT,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  -- SEO
  slug TEXT,
  meta_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMMENTS TABLE (Nested/Threaded)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For threading
  
  -- Content
  content TEXT NOT NULL,
  content_html TEXT,
  
  -- Status
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  
  -- Moderation
  is_flagged BOOLEAN DEFAULT false,
  flagged_count INTEGER DEFAULT 0,
  
  -- Stats
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ
);

-- ============================================================================
-- POST LIKES/VOTES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ============================================================================
-- COMMENT LIKES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- ============================================================================
-- POST BOOKMARKS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.post_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  notes TEXT, -- Optional personal notes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ============================================================================
-- POST TAGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.post_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, tag)
);

-- ============================================================================
-- MODERATION FLAGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.moderation_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flagged_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Target (post or comment)
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  
  -- Flag details
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'harassment', 'misinformation', 'other')),
  description TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES public.users(id),
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure only one target
  CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_category_id ON public.posts(category_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_last_activity ON public.posts(last_activity_at DESC);
CREATE INDEX idx_posts_pinned ON public.posts(is_pinned) WHERE is_pinned = true;
CREATE INDEX idx_posts_slug ON public.posts(slug);

CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at);

CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON public.post_likes(user_id);

CREATE INDEX idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON public.comment_likes(user_id);

CREATE INDEX idx_post_tags_tag ON public.post_tags(tag);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Categories (public read)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT USING (true);

-- Posts
CREATE POLICY "Anyone can view published posts"
  ON public.posts FOR SELECT
  USING (is_published = true AND is_deleted = false);

CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Comments
CREATE POLICY "Anyone can view comments on published posts"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = post_id AND is_published = true AND is_deleted = false
    ) AND is_deleted = false
  );

CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Likes
CREATE POLICY "Anyone can view post likes"
  ON public.post_likes FOR SELECT USING (true);

CREATE POLICY "Users can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comment likes"
  ON public.comment_likes FOR SELECT USING (true);

CREATE POLICY "Users can like comments"
  ON public.comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments"
  ON public.comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Bookmarks (private)
ALTER TABLE public.post_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own bookmarks"
  ON public.post_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their bookmarks"
  ON public.post_bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- Tags (public read)
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tags"
  ON public.post_tags FOR SELECT USING (true);

-- Moderation flags
ALTER TABLE public.moderation_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can flag content"
  ON public.moderation_flags FOR INSERT
  WITH CHECK (auth.uid() = flagged_by);

CREATE POLICY "Moderators can view flags"
  ON public.moderation_flags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update post stats when comment added
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET 
      comment_count = comment_count + 1,
      last_activity_at = NEW.created_at
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET comment_count = GREATEST(0, comment_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_on_comment
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- Update comment reply count
CREATE OR REPLACE FUNCTION update_comment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    UPDATE public.comments
    SET reply_count = reply_count + 1
    WHERE id = NEW.parent_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comment_on_reply
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_reply_count();

-- Update post like count
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    UPDATE public.users SET total_likes_received = total_likes_received + 1 
    WHERE id = (SELECT user_id FROM public.posts WHERE id = NEW.post_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.post_id;
    UPDATE public.users SET total_likes_received = GREATEST(0, total_likes_received - 1)
    WHERE id = (SELECT user_id FROM public.posts WHERE id = OLD.post_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_on_like
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

-- Update comment like count
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comment_on_like
  AFTER INSERT OR DELETE ON public.comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_like_count();

-- ============================================================================
-- INITIAL CATEGORIES
-- ============================================================================
INSERT INTO public.categories (name, slug, description, icon, order_index) VALUES
  ('General', 'general', 'General discussions and announcements', '💬', 1),
  ('AI & Technology', 'ai-tech', 'Discuss AI, coding, and technology', '🤖', 2),
  ('Community', 'community', 'Community events and meetups', '👥', 3),
  ('Help & Support', 'help', 'Get help and support from the community', '❓', 4),
  ('Feedback', 'feedback', 'Share feedback and feature requests', '💡', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Get post with full details
CREATE OR REPLACE FUNCTION get_post_details(post_uuid UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  author_name TEXT,
  author_avatar TEXT,
  category_name TEXT,
  comment_count INTEGER,
  like_count INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    u.display_name as author_name,
    u.avatar_url as author_avatar,
    c.name as category_name,
    p.comment_count,
    p.like_count,
    p.created_at
  FROM public.posts p
  LEFT JOIN public.users u ON p.user_id = u.id
  LEFT JOIN public.categories c ON p.category_id = c.id
  WHERE p.id = post_uuid AND p.is_published = true AND p.is_deleted = false;
END;
$$ LANGUAGE plpgsql;

-- Search posts
CREATE OR REPLACE FUNCTION search_posts(search_term TEXT, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  author_name TEXT,
  category_name TEXT,
  like_count INTEGER,
  comment_count INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    u.display_name as author_name,
    c.name as category_name,
    p.like_count,
    p.comment_count,
    p.created_at
  FROM public.posts p
  LEFT JOIN public.users u ON p.user_id = u.id
  LEFT JOIN public.categories c ON p.category_id = c.id
  WHERE p.is_published = true 
    AND p.is_deleted = false
    AND (
      p.title ILIKE '%' || search_term || '%'
      OR p.content ILIKE '%' || search_term || '%'
    )
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Get trending posts (most activity in last 7 days)
CREATE OR REPLACE FUNCTION get_trending_posts(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  like_count INTEGER,
  comment_count INTEGER,
  activity_score BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.like_count,
    p.comment_count,
    (p.like_count * 2 + p.comment_count * 3 + p.view_count) as activity_score
  FROM public.posts p
  WHERE p.is_published = true 
    AND p.is_deleted = false
    AND p.created_at > NOW() - INTERVAL '7 days'
  ORDER BY activity_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.categories IS 'Forum categories for organizing posts';
COMMENT ON TABLE public.posts IS 'User-created forum posts and discussions';
COMMENT ON TABLE public.comments IS 'Comments on posts with threading support';
COMMENT ON TABLE public.post_likes IS 'Post likes/upvotes';
COMMENT ON TABLE public.comment_likes IS 'Comment likes/upvotes';
COMMENT ON TABLE public.post_bookmarks IS 'User bookmarks for saving posts';
COMMENT ON TABLE public.post_tags IS 'Tags for categorizing posts';
COMMENT ON TABLE public.moderation_flags IS 'Content moderation flags and reports';


```

**Verify:** Check that these tables were created:
- categories
- posts
- comments
- post_likes
- comment_likes
- user_badges
- notifications

---

## 🔹 MIGRATION 4: Video Conferencing

**File:** `004_video_conferencing.sql`  
**Purpose:** Video call rooms and participants  
**Tables:** video_rooms, video_participants, video_recordings

**Copy and paste this entire block:**

```sql
-- ============================================================================
-- INNERANIMALMEDIA - VIDEO CONFERENCING SCHEMA
-- Migration: 004_video_conferencing.sql
-- Description: Video call rooms, participants, and signaling
-- ============================================================================

-- ============================================================================
-- VIDEO ROOMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.video_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Room details
  name TEXT NOT NULL,
  description TEXT,
  room_code TEXT UNIQUE NOT NULL, -- Short code for joining (e.g., "ABC-123")
  
  -- Settings
  max_participants INTEGER DEFAULT 10,
  is_locked BOOLEAN DEFAULT false, -- Prevent new joins
  password_hash TEXT, -- Optional password protection
  require_approval BOOLEAN DEFAULT false, -- Waiting room
  allow_screen_share BOOLEAN DEFAULT true,
  allow_recording BOOLEAN DEFAULT false,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_recording BOOLEAN DEFAULT false,
  
  -- Stats
  participant_count INTEGER DEFAULT 0,
  total_participants_joined INTEGER DEFAULT 0,
  total_duration_minutes INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- VIDEO PARTICIPANTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.video_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.video_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Connection info
  peer_id TEXT NOT NULL, -- WebRTC peer ID
  socket_id TEXT, -- Socket.io connection ID
  
  -- Participant details
  display_name TEXT NOT NULL,
  
  -- Permissions
  is_host BOOLEAN DEFAULT false,
  is_moderator BOOLEAN DEFAULT false,
  can_share_screen BOOLEAN DEFAULT true,
  can_chat BOOLEAN DEFAULT true,
  
  -- Status
  is_connected BOOLEAN DEFAULT true,
  is_muted BOOLEAN DEFAULT false,
  is_video_off BOOLEAN DEFAULT false,
  is_screen_sharing BOOLEAN DEFAULT false,
  is_hand_raised BOOLEAN DEFAULT false,
  
  -- Connection quality
  connection_quality TEXT DEFAULT 'good' CHECK (connection_quality IN ('excellent', 'good', 'fair', 'poor')),
  
  -- Timestamps
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- VIDEO RECORDINGS TABLE (If recording enabled)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.video_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.video_rooms(id) ON DELETE CASCADE NOT NULL,
  recorded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Recording details
  title TEXT,
  file_url TEXT NOT NULL, -- Cloudflare R2 URL
  file_size BIGINT, -- bytes
  duration_seconds INTEGER,
  
  -- Metadata
  thumbnail_url TEXT,
  format TEXT DEFAULT 'webm',
  
  -- Access control
  is_public BOOLEAN DEFAULT false,
  password_hash TEXT,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ -- Auto-delete after X days
);

-- ============================================================================
-- WAITING ROOM (For approval-required rooms)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.waiting_room (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.video_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Request details
  display_name TEXT NOT NULL,
  message TEXT, -- Optional message to host
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.users(id),
  review_notes TEXT,
  
  -- Timestamps
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- ============================================================================
-- ROOM CHAT MESSAGES (Text chat during calls)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.room_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.video_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Message content
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'emoji')),
  
  -- Metadata
  is_private BOOLEAN DEFAULT false, -- Private message to specific user
  recipient_id UUID REFERENCES public.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SIGNALING DATA (WebRTC signaling)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.webrtc_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.video_rooms(id) ON DELETE CASCADE NOT NULL,
  from_peer_id TEXT NOT NULL,
  to_peer_id TEXT NOT NULL,
  
  -- Signal data
  signal_type TEXT NOT NULL CHECK (signal_type IN ('offer', 'answer', 'ice-candidate')),
  signal_data JSONB NOT NULL,
  
  -- Processed
  is_processed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_video_rooms_created_by ON public.video_rooms(created_by);
CREATE INDEX idx_video_rooms_active ON public.video_rooms(is_active) WHERE is_active = true;
CREATE INDEX idx_video_rooms_code ON public.video_rooms(room_code);

CREATE INDEX idx_participants_room_id ON public.video_participants(room_id);
CREATE INDEX idx_participants_user_id ON public.video_participants(user_id);
CREATE INDEX idx_participants_connected ON public.video_participants(is_connected) WHERE is_connected = true;

CREATE INDEX idx_recordings_room_id ON public.video_recordings(room_id);
CREATE INDEX idx_recordings_public ON public.video_recordings(is_public) WHERE is_public = true;

CREATE INDEX idx_waiting_room_status ON public.waiting_room(status) WHERE status = 'pending';

CREATE INDEX idx_room_messages_room_id ON public.room_messages(room_id);
CREATE INDEX idx_room_messages_created_at ON public.room_messages(created_at);

CREATE INDEX idx_signals_room_id ON public.webrtc_signals(room_id);
CREATE INDEX idx_signals_unprocessed ON public.webrtc_signals(is_processed) WHERE is_processed = false;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE public.video_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waiting_room ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webrtc_signals ENABLE ROW LEVEL SECURITY;

-- Rooms
CREATE POLICY "Anyone can view active public rooms"
  ON public.video_rooms FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create rooms"
  ON public.video_rooms FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update their rooms"
  ON public.video_rooms FOR UPDATE
  USING (auth.uid() = created_by);

-- Participants
CREATE POLICY "Participants can view room participants"
  ON public.video_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.video_participants vp
      WHERE vp.room_id = video_participants.room_id 
        AND vp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join rooms"
  ON public.video_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participant status"
  ON public.video_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- Room messages
CREATE POLICY "Participants can view room messages"
  ON public.room_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.video_participants
      WHERE room_id = room_messages.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.room_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Recordings
CREATE POLICY "Anyone can view public recordings"
  ON public.video_recordings FOR SELECT
  USING (is_public = true);

CREATE POLICY "Participants can view room recordings"
  ON public.video_recordings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.video_participants
      WHERE room_id = video_recordings.room_id AND user_id = auth.uid()
    )
  );

-- WebRTC signals
CREATE POLICY "Participants can view signals"
  ON public.webrtc_signals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.video_participants
      WHERE room_id = webrtc_signals.room_id 
        AND user_id = auth.uid()
        AND is_connected = true
    )
  );

CREATE POLICY "Participants can create signals"
  ON public.webrtc_signals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.video_participants
      WHERE room_id = webrtc_signals.room_id 
        AND user_id = auth.uid()
        AND is_connected = true
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update room participant count
CREATE OR REPLACE FUNCTION update_room_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_connected = true THEN
    UPDATE public.video_rooms
    SET 
      participant_count = participant_count + 1,
      total_participants_joined = total_participants_joined + 1
    WHERE id = NEW.room_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.is_connected = true AND NEW.is_connected = false THEN
    UPDATE public.video_rooms
    SET participant_count = GREATEST(0, participant_count - 1)
    WHERE id = NEW.room_id;
  ELSIF TG_OP = 'DELETE' AND OLD.is_connected = true THEN
    UPDATE public.video_rooms
    SET participant_count = GREATEST(0, participant_count - 1)
    WHERE id = OLD.room_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_room_on_participant
  AFTER INSERT OR UPDATE OR DELETE ON public.video_participants
  FOR EACH ROW EXECUTE FUNCTION update_room_participant_count();

-- Auto-generate room code
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS TRIGGER AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  IF NEW.room_code IS NULL THEN
    LOOP
      -- Generate random 6-character code
      code := UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 3) || '-' || SUBSTR(MD5(RANDOM()::TEXT), 1, 3));
      
      -- Check if code exists
      SELECT EXISTS(SELECT 1 FROM public.video_rooms WHERE room_code = code) INTO exists;
      
      EXIT WHEN NOT exists;
    END LOOP;
    
    NEW.room_code := code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_room_code_trigger
  BEFORE INSERT ON public.video_rooms
  FOR EACH ROW EXECUTE FUNCTION generate_room_code();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.video_rooms IS 'Video conference rooms';
COMMENT ON TABLE public.video_participants IS 'Participants in video calls';
COMMENT ON TABLE public.video_recordings IS 'Recorded video meetings';
COMMENT ON TABLE public.waiting_room IS 'Waiting room for participant approval';
COMMENT ON TABLE public.room_messages IS 'Text chat during video calls';
COMMENT ON TABLE public.webrtc_signals IS 'WebRTC signaling data for peer connections';


```

**Verify:** Check that these tables were created:
- video_rooms
- video_participants
- video_recordings

---

## 🔹 MIGRATION 5: Assets & Media Storage

**File:** `005_assets_table.sql`  
**Purpose:** Track uploaded files in Cloudflare R2  
**Tables:** assets

**Copy and paste this entire block:**

```sql
-- ============================================================================
-- ASSETS TABLE - Track files in Cloudflare R2
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- File details
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size BIGINT NOT NULL, -- Size in bytes
  mime_type TEXT NOT NULL,
  
  -- Storage details
  bucket_name TEXT NOT NULL, -- Which R2 bucket
  object_key TEXT NOT NULL, -- R2 object path
  cdn_url TEXT, -- Public CDN URL if applicable
  
  -- Metadata
  app_name TEXT NOT NULL CHECK (app_name IN ('inneranimalmedia', 'meauxbility', 'iautodidact', 'shop')),
  category TEXT, -- e.g., 'profile', 'post', 'product', '3d-model'
  title TEXT,
  description TEXT,
  alt_text TEXT,
  
  -- Image-specific metadata (if applicable)
  width INTEGER,
  height INTEGER,
  format TEXT, -- e.g., 'jpg', 'png', 'webp'
  
  -- 3D model metadata (if applicable)
  model_format TEXT, -- e.g., 'glb', 'gltf'
  polygon_count INTEGER,
  
  -- Upload tracking
  upload_status TEXT DEFAULT 'completed' CHECK (upload_status IN ('pending', 'uploading', 'completed', 'failed')),
  upload_error TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  UNIQUE(bucket_name, object_key)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON public.assets(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_app_name ON public.assets(app_name);
CREATE INDEX IF NOT EXISTS idx_assets_category ON public.assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON public.assets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_bucket ON public.assets(bucket_name, object_key);

-- RLS Policies
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Users can read their own assets
CREATE POLICY "Users can view own assets"
  ON public.assets FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own assets
CREATE POLICY "Users can upload assets"
  ON public.assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own assets
CREATE POLICY "Users can update own assets"
  ON public.assets FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own assets
CREATE POLICY "Users can delete own assets"
  ON public.assets FOR DELETE
  USING (auth.uid() = user_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_assets_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION update_assets_timestamp();

-- Helper function to get asset URL
CREATE OR REPLACE FUNCTION get_asset_url(asset_id UUID)
RETURNS TEXT AS $$
  SELECT cdn_url FROM public.assets WHERE id = asset_id;
$$ LANGUAGE sql STABLE;

```

**Verify:** Check that this table was created:
- assets

---

## ✅ FINAL VERIFICATION

After running all migrations, verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected Tables (32 total):**
- assets
- categories
- comment_likes
- comments
- conversation_shares
- conversation_tags
- conversations
- messages
- notifications
- post_likes
- posts
- user_badges
- user_follows
- user_profiles
- user_sessions
- users
- video_participants
- video_recordings
- video_rooms

---

## 🎯 SUCCESS CRITERIA

After all migrations complete:
- [ ] All 19 tables created
- [ ] All RLS policies enabled
- [ ] All indexes created
- [ ] All triggers created
- [ ] All helper functions created
- [ ] No SQL errors

---

## 🚨 IF ERRORS OCCUR

**Common Issues:**

1. **"relation already exists"** - Table already created, skip that migration
2. **"function already exists"** - Function already created, it's safe
3. **"permission denied"** - Make sure you're using Service Role Key
4. **"syntax error"** - Copy the entire migration block, don't skip lines

**Solution:** Run each migration one at a time and check for errors before proceeding.

---

## 📊 NEXT STEPS AFTER MIGRATIONS

1. ✅ All migrations applied successfully
2. Test database queries via Supabase Dashboard
3. Update Vercel environment variables
4. Test API endpoints
5. Deploy frontend pages

---

**Created:** November 2, 2025  
**Supabase Project:** ghiulqoqujsiofsjcrqk  
**Status:** Ready to paste and run!

