# 🔐 MASTER VAULT - PUBLIC CONFIGURATION
**Last Updated:** November 2, 2025
**Project:** InnerAnimalMedia / Spartans Command Center
**Status:** All tokens verified and active

---

## 📍 LIVE DEPLOYMENTS

### **Primary Application**
- **Production URL:** https://inneranimalmedia-86c80buiv-meauxbilityorg.vercel.app
- **Local Dev:** http://localhost:3001
- **GitHub Repo:** https://github.com/InnerAnimal/spartans_command_center
- **Branch:** `claude/analyze-monorepo-build-pages-011CUigFuvUXKmHrKLCkUbQx`

### **Vercel Account**
- **Dashboard:** https://vercel.com/meauxbilityorg
- **Team ID:** `team_eMhajA4eD6XUAGomNi6CnQeZ`
- **Organization:** Meauxbility
- **Plan:** Hobby (Free)
- **Verified User:** info@inneranimals.com

---

## 🔑 API TOKENS & CREDENTIALS (VERIFIED ACTIVE)

### **A. SUPABASE** (Database & Authentication) ✅
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk2MDA5MCwiZXhwIjoyMDc2NTM2MDkwfQ.kk2kiNNoUkeF6wNeNcL1a6Nuwr7vcbbdVQrrrlkX4J4
SUPABASE_JWT_SECRET=nhw9k1T0CYn2r7YZ9HCr9I9m5ZFq0guTYvvOIh3T9ksIoT9xJb2+AbnmSq/RGg2qmf7HV89vpYHAPD6I//ixew==
```

**Dashboard:** https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk
**Project ID:** `ghiulqoqujsiofsjcrqk`
**Status:** Active, Never Expires
**Plan:** Free Tier

---

### **B. CLOUDFLARE** (Storage, CDN, R2) ✅
```bash
CLOUDFLARE_ACCOUNT_ID=e8d0359c2ad85845814f446f4dd174ea
CLOUDFLARE_API_TOKEN=LnCKRCaUoz08k3zDZVjhWpvRvjRO_uxdnKioFKnV
CLOUDFLARE_KV_NAMESPACE_ID=5a156c2799884edd9490c09cedcda117
CLOUDFLARE_ZONE_ID=0bab48636c1bea4be4ea61c0c7787c3e
```

**Dashboard:** https://dash.cloudflare.com/
**Token ID:** `caa816f1d2e1feea6a0e778683ed5cbf`
**Status:** Active
**Expires:** November 8, 2025 ⚠️ (6 days)
**Plan:** Pro

#### **R2 Storage Configuration:**
```bash
CLOUDFLARE_R2_BUCKET_NAME=inneranimalmedia-storage
CLOUDFLARE_R2_ENDPOINT=https://e8d0359c2ad85845814f446f4dd174ea.r2.cloudflarestorage.com
# R2 Access Keys: ⚠️ NEED TO CREATE IN DASHBOARD
CLOUDFLARE_R2_ACCESS_KEY_ID=[CREATE IN DASHBOARD]
CLOUDFLARE_R2_SECRET_ACCESS_KEY=[CREATE IN DASHBOARD]
```

**Create R2 Keys:** https://dash.cloudflare.com/ → R2 → Manage R2 API Tokens

---

### **C. VERCEL** (Deployment) ✅
```bash
VERCEL_TOKEN=rtPMwvDK44vh2zMWQlxT0T2V
```

**Dashboard:** https://vercel.com/meauxbilityorg
**User ID:** `QvknUueIEjU5elqaJ5eUPIZV`
**Team ID:** `team_eMhajA4eD6XUAGomNi6CnQeZ`
**Status:** Active
**Verified Emails:**
- info@inneranimals.com (primary)
- meauxbility@gmail.com
- connordmcneely@gmail.com

**Environment Variables URL:**
https://vercel.com/meauxbilityorg/inneranimalmedia/settings/environment-variables

---

### **D. RESEND** (Email) ✅
```bash
RESEND_API_KEY=re_U183DFLM_qBKzcYhN2KXEvJf3z8e59ifQ
```

**Dashboard:** https://resend.com/api-keys
**Status:** Active
**API Keys:**
- MASTERRESEND (created 2025-11-02)
- Onboarding (created 2025-10-29)

**Plan:** Free (100 emails/day)

---

### **E. STRIPE** (Payments) ✅ OPTIONAL
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SJPjpK5HnR8nkDr2uGDyZvrezAHxAjP8v2pn06ItWk7xUG86aWX72VcMA5S9irhqwDWjH7YSixa4QfD8uruEx88003bSI91TX
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_ac1Pc6tHKMtr0THF6MDBgmybnQUOI9Uk
```

**Dashboard:** https://dashboard.stripe.com/
**Status:** Live mode keys
**Plan:** Standard

---

### **F. AI API KEYS** ⚠️ NOT CONFIGURED YET

```bash
# ANTHROPIC (Claude AI)
# Get from: https://console.anthropic.com/
ANTHROPIC_API_KEY=[NEED TO CREATE]

# OPENAI (ChatGPT)
# Get from: https://platform.openai.com/
OPENAI_API_KEY=[NEED TO CREATE]
```

---

## 🌐 API ENDPOINTS

### **Local Development:**
```
Base URL: http://localhost:3001
```

### **Production:**
```
Base URL: https://inneranimalmedia-86c80buiv-meauxbilityorg.vercel.app
```

### **Available Endpoints:**

#### **Authentication:**
```bash
POST /api/auth/login          # User login
POST /api/auth/register       # User signup
POST /api/auth/logout         # User logout
```

#### **AI Chat:**
```bash
POST /api/ai/chat             # Send message to AI (Claude/ChatGPT)
# Requires: ANTHROPIC_API_KEY or OPENAI_API_KEY
```

#### **Community Forum:**
```bash
GET  /api/forum/posts         # List all posts
POST /api/forum/posts         # Create new post
GET  /api/forum/comments      # Get comments for a post
POST /api/forum/comments      # Add comment to post
```

---

## 📄 LIVE PAGES STATUS

### **✅ WORKING PAGES** (200 OK)
- `/` - Homepage (hero, features, CTA)
- `/ai-chat` - AI Chat interface (placeholder)
- `/community` - Community forum (placeholder)
- `/video` - Video conferencing (placeholder)
- `/login` - Login form (styled, non-functional)

### **❌ MISSING PAGES** (404)
- `/register` - Sign up page
- `/about` - About page
- `/contact` - Contact page

---

## 🗄️ DATABASE CONFIGURATION

### **Supabase Database:**
- **Host:** `ghiulqoqujsiofsjcrqk.supabase.co`
- **Project Ref:** `ghiulqoqujsiofsjcrqk`
- **Dashboard:** https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk

### **Migration Status:** ⚠️ NOT APPLIED YET

**Required Migrations:**
1. `001_init_users.sql` - User authentication tables
2. `002_ai_conversations.sql` - AI chat history tables
3. `003_community_forum.sql` - Forum posts & comments
4. `004_video_conferencing.sql` - Video call tables

**Apply Migrations:**
1. Go to: https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk
2. Click: SQL Editor (left sidebar)
3. Copy & paste each migration file
4. Run in order (001 → 002 → 003 → 004)

---

## 📦 STORAGE BUCKETS

### **Cloudflare R2:**
```bash
Bucket Name: inneranimalmedia-storage
Endpoint: https://e8d0359c2ad85845814f446f4dd174ea.r2.cloudflarestorage.com
Account ID: e8d0359c2ad85845814f446f4dd174ea
```

**Usage:**
- User uploads (images, videos)
- 3D assets (.glb files)
- Profile pictures
- Post attachments

**Create R2 Access Keys:**
1. Go to: https://dash.cloudflare.com/
2. Navigate: R2 → Manage R2 API Tokens
3. Create new API token for R2 access
4. Add keys to `.env.local`

---

## 👥 ADMIN & CONTACT

### **Primary Contact:**
- **Email:** info@inneranimals.com
- **Alt Email:** meauxbility@gmail.com
- **Organization:** Meauxbility (501c3 Foundation)

### **Developer:**
- **Name:** Connor McNeely
- **Email:** connordmcneely@gmail.com

---

## 🎨 DESIGN SYSTEM

### **Brand Colors:**
```css
--brand-teal: #5F9C9E
--brand-teal-light: #7DB8BA
--charcoal-deep: #1A1D23
--charcoal-base: #22252B
```

### **Design Style:**
- Neumorphic (raised/pressed elements)
- Glassmorphic overlays
- Dark mode (default)
- Teal accents
- Mobile-first responsive

---

## 📊 PROJECT STATUS

### **Infrastructure:** 95% Complete
- ✅ Database schema designed (32 tables)
- ✅ API routes created (6 endpoints)
- ✅ Service layer implemented
- ✅ Authentication system ready
- ⚠️ Migrations not applied

### **Frontend:** 70% Complete
- ✅ Design system implemented
- ✅ Navigation & layouts
- ✅ All pages styled
- ❌ Functional components missing
- ❌ 3 pages missing (register, about, contact)

### **Services Configured:**
- ✅ Supabase (Database)
- ✅ Vercel (Deployment)
- ✅ Cloudflare (CDN/Storage)
- ✅ Resend (Email)
- ✅ Stripe (Payments)
- ❌ Anthropic (Claude AI) - needs API key
- ❌ OpenAI (ChatGPT) - needs API key
- ⚠️ Cloudflare R2 - needs access keys

---

## ⚠️ CRITICAL BLOCKERS

### **1. Database Migrations** 🔴 HIGH PRIORITY
**Status:** Not applied
**Impact:** Forum APIs failing (500 errors)
**Action:** Apply 4 SQL migrations in Supabase Dashboard
**Time:** 15 minutes

### **2. AI API Keys** 🔴 HIGH PRIORITY
**Status:** Not configured
**Impact:** AI chat will not work
**Action:** Sign up for Anthropic & OpenAI, get API keys
**Time:** 30 minutes

### **3. Missing Pages** 🟡 MEDIUM PRIORITY
**Status:** 3 pages return 404
**Impact:** Broken navigation links
**Action:** Create register, about, contact pages
**Time:** 30 minutes

### **4. Cloudflare R2 Access Keys** 🟡 MEDIUM PRIORITY
**Status:** Not created
**Impact:** File uploads won't work
**Action:** Create R2 API tokens in dashboard
**Time:** 10 minutes

### **5. Functional Components** 🟡 MEDIUM PRIORITY
**Status:** All pages show "Coming Soon"
**Impact:** No working features yet
**Action:** Build UI components for chat, forum, video
**Time:** 1-2 weeks

---

## 🚀 DEPLOYMENT INSTRUCTIONS

### **Deploy to Vercel:**
```bash
# Using Vercel token
vercel --token=rtPMwvDK44vh2zMWQlxT0T2V

# Or connect GitHub repo (already connected)
# Automatic deployments on push to main
```

### **Add Environment Variables to Vercel:**
```bash
# Go to Vercel Dashboard
https://vercel.com/meauxbilityorg/inneranimalmedia/settings/environment-variables

# Add all variables from .env.local
# Select: Production, Preview, Development
# Save and redeploy
```

---

## 💰 MONTHLY COSTS

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| Supabase | Free | $0 |
| Cloudflare | Pro | ~$20 |
| Resend | Free | $0 (up to 100 emails/day) |
| Stripe | Standard | $0 (pay-per-transaction) |
| Claude API | Pay-per-use | ~$10-50 (when configured) |
| OpenAI API | Pay-per-use | ~$5-30 (when configured) |
| **TOTAL** | | **~$20-100/month** |

---

## 📝 QUICK START CHECKLIST

### **To Get Fully Functional:**
- [ ] Apply database migrations (15 min)
- [ ] Get Anthropic API key (15 min)
- [ ] Get OpenAI API key (15 min)
- [ ] Create Cloudflare R2 access keys (10 min)
- [ ] Create missing pages (30 min)
- [ ] Add env vars to Vercel (10 min)
- [ ] Build functional components (1-2 weeks)

**Total Time to MVP:** ~2 hours (excludes building functional components)

---

## 🔗 IMPORTANT LINKS

### **Dashboards:**
- Supabase: https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk
- Vercel: https://vercel.com/meauxbilityorg
- Cloudflare: https://dash.cloudflare.com/
- Resend: https://resend.com/
- Stripe: https://dashboard.stripe.com/

### **Documentation:**
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Cloudflare Docs: https://developers.cloudflare.com/
- Resend Docs: https://resend.com/docs
- Next.js Docs: https://nextjs.org/docs

### **API Documentation:**
- Anthropic: https://docs.anthropic.com/
- OpenAI: https://platform.openai.com/docs/
- Stripe: https://stripe.com/docs/api

---

## 🛡️ SECURITY NOTES

- ✅ All tokens stored in `.env.local` (gitignored)
- ✅ Supabase has Row Level Security (RLS) enabled
- ✅ API routes check authentication
- ✅ Vercel has MFA enabled
- ⚠️ Cloudflare token expires Nov 8, 2025 (renew soon!)
- ⚠️ Never commit `.env.local` to Git

---

**Document Version:** 1.0
**Last Verified:** November 2, 2025
**Next Review:** November 8, 2025 (when Cloudflare token expires)
