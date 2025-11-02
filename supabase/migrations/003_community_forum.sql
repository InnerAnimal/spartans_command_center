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

