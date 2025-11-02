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

