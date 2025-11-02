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

