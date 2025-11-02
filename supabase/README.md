# Supabase Database Setup

## Quick Start

### 1. Apply Migrations

Go to your Supabase Dashboard:
- URL: https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk
- Navigate to: SQL Editor
- Run each migration file in order:

#### Run these in Supabase SQL Editor:

1. **001_init_users.sql** - User tables and authentication
2. **002_ai_conversations.sql** - AI chat conversations and messages
3. **003_community_forum.sql** - Forum posts, comments, likes
4. **004_video_conferencing.sql** - Video rooms and participants

### 2. Verify Setup

After running migrations, check:
- Tables created in Database → Tables
- RLS policies enabled in Authentication → Policies
- Functions created in Database → Functions

### 3. Test Connection

```bash
# In your project root
npm run dev

# Check console for Supabase connection
```

## Schema Overview

### Users & Auth
- `users` - Core user data
- `user_profiles` - Extended profile settings
- `user_sessions` - Active sessions
- `user_follows` - Following relationships

### AI Chat
- `conversations` - Chat sessions with Claude/ChatGPT
- `messages` - Individual chat messages
- `conversation_shares` - Shared conversations
- `conversation_tags` - Organize conversations

### Community Forum
- `categories` - Forum categories
- `posts` - User posts
- `comments` - Post comments (threaded)
- `post_likes` - Post upvotes
- `comment_likes` - Comment upvotes
- `post_bookmarks` - Saved posts
- `post_tags` - Post tags
- `moderation_flags` - Content reports

### Video Conferencing
- `video_rooms` - Video call rooms
- `video_participants` - Call participants
- `video_recordings` - Recorded meetings
- `waiting_room` - Approval queue
- `room_messages` - Chat during calls
- `webrtc_signals` - WebRTC signaling

## Security

All tables have Row Level Security (RLS) enabled:
- Users can only access their own data
- Public data is viewable by all
- Moderators have additional permissions
- Server-side operations use service role key

## Next Steps

Once migrations are applied:
1. Test authentication (sign up/login)
2. Create a test post in the forum
3. Start an AI conversation
4. Create a video room

