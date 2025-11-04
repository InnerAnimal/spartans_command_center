# 🗄️ SYSTEMATIC SQL MIGRATION GUIDE

**Supabase Dashboard:** https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk
**Strategy:** One database, multiple apps, shared users

---

## 📋 **MIGRATION SEQUENCE (Run in Order)**

### **Before Starting:**
1. ✅ Open Supabase Dashboard → SQL Editor
2. ✅ Have this document open
3. ✅ Copy each migration block completely
4. ✅ Paste into SQL Editor
5. ✅ Click "Run"
6. ✅ Verify "Success. No rows returned"
7. ✅ Proceed to next migration

---

## 🔹 **MIGRATION 1: USERS FOUNDATION** (Required - 5 min)

**Purpose:** Shared user system across all 4 apps
**Creates:** 4 tables (users, user_profiles, user_sessions, user_follows)
**Used by:** All apps (InnerAnimalMedia, Meauxbility, iAutodidact, Shop)

### **Step 1: Copy this entire block**

```sql
-- ============================================================================
-- MIGRATION 001: USER MANAGEMENT (SHARED FOUNDATION)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  apps_access TEXT[] DEFAULT ARRAY['inneranimalmedia', 'meauxbility', 'iautodidact', 'shop'],
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- User profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  twitter_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  app_name TEXT NOT NULL CHECK (app_name IN ('inneranimalmedia', 'meauxbility', 'iautodidact', 'shop')),
  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  country TEXT,
  city TEXT
);

-- User follows
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_app ON public.user_sessions(app_name);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON public.user_follows(following_id);

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Profiles viewable by all" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own sessions" ON public.user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON public.user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Follows viewable by all" ON public.user_follows FOR SELECT USING (true);
CREATE POLICY "Users can create follows" ON public.user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete follows" ON public.user_follows FOR DELETE USING (auth.uid() = follower_id);

-- Triggers
CREATE OR REPLACE FUNCTION update_users_timestamp() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_users_timestamp();

CREATE OR REPLACE FUNCTION update_user_profiles_timestamp() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_user_profiles_timestamp();

CREATE OR REPLACE FUNCTION create_user_profile() RETURNS TRIGGER AS $$
BEGIN INSERT INTO public.user_profiles (user_id) VALUES (NEW.id); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_created AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Helper functions
CREATE OR REPLACE FUNCTION get_follower_count(user_uuid UUID) RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.user_follows WHERE following_id = user_uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION get_following_count(user_uuid UUID) RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.user_follows WHERE follower_id = user_uuid;
$$ LANGUAGE sql STABLE;
```

### **Step 2: Paste into SQL Editor and Run**
### **Step 3: Verify Success**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'user%'
ORDER BY table_name;
```

**Expected:** users, user_follows, user_profiles, user_sessions

---

## ⏸️ **STOP HERE AND CONFIRM**

**Before proceeding to Migration 2, tell me:**
- ✅ "Migration 1 Success" - All 4 tables created
- ⚠️ "Error: [paste error]" - I'll fix immediately
- 🔍 "Need help verifying" - I'll guide you

---

**Once Migration 1 is confirmed, I'll provide Migration 2 (Assets & Storage)**

---

## 📊 **MIGRATION ROADMAP**

After Migration 1, we'll proceed with:

- **Migration 2:** Assets (R2 file tracking - all apps)
- **Migration 3:** AI Conversations (iAutodidact)
- **Migration 4:** Community Forum (iAutodidact, InnerAnimalMedia)
- **Migration 5:** Projects & Uploads (InnerAnimalMedia)
- **Migration 6:** Donations & Grants (Meauxbility)
- **Migration 7:** Products & Orders (Shop)
- **Migration 8:** Video Conferencing (iAutodidact)

**Total:** 8 migrations, ~25 tables, shared user system

---

**Ready? Paste Migration 1 and tell me the result!** 🚀
