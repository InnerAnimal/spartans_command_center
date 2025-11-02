# 🎯 CURSOR AI - COMPLETE PROJECT BRIEFING

**Date:** November 2, 2025
**Project:** InnerAnimalMedia Ecosystem (4 Vercel Projects)
**Your Role:** Build/Deploy Agent | Frontend Implementation
**Claude's Role:** Backend/SQL/Architecture | Documentation

---

## 📋 YOUR MISSION

I need you to audit and report on our complete Vercel deployment ecosystem. Claude has compiled all backend configuration in `MASTER_VAULT_PUBLIC.md` - now I need you to fill in the frontend deployment details.

---

## 🔍 STEP 1: AUDIT ALL VERCEL PROJECTS

Using the Vercel token provided, please scan and report on ALL projects:

**Vercel Token:** `rtPMwvDK44vh2zMWQlxT0T2V`
**Team ID:** `team_eMhajA4eD6XUAGomNi6CnQeZ`
**Organization:** Meauxbility

### **Please provide:**

1. **List ALL Vercel projects** with:
   - Project name
   - Production URL
   - Preview URL (if any)
   - GitHub repo connected
   - Last deployment date/status
   - Framework detected (Next.js, etc.)
   - Build command
   - Output directory
   - Node version

2. **Environment Variables Status** for each project:
   - Which env vars are configured
   - Which are missing (compare to MASTER_VAULT_PUBLIC.md)
   - Production vs Preview vs Development

3. **Deployment Health:**
   - Recent deployment errors
   - Build logs (last 3 deployments)
   - Performance metrics
   - Any warnings or issues

---

## 🌐 EXPECTED PROJECTS (verify these exist)

According to our records, we should have:

1. **InnerAnimalMedia** (Creative Agency)
   - Domain: inneranimalmedia.com
   - Current: https://inneranimalmedia-86c80buiv-meauxbilityorg.vercel.app
   - Repo: https://github.com/InnerAnimal/spartans_command_center

2. **Meauxbility.org** (Nonprofit Foundation)
   - Domain: meauxbility.org
   - Expected: https://meauxbility-org.vercel.app

3. **iAutodidact** (Learning Platform)
   - Domain: iautodidact.app
   - Expected: https://iautodidact.vercel.app

4. **InnerAnimal Shop** (E-commerce)
   - Domain: inneranimal.app
   - Expected: https://inneranimals-shop.vercel.app

**Confirm:** Do all 4 projects exist? Are they deployed? What are the ACTUAL URLs?

---

## 📊 STEP 2: PAGE AUDIT

For each project, list ALL deployed pages:

### **Format:**
```
Project: [Name]
├── / (Homepage) - Status: [200/404/500]
├── /about - Status: [200/404/500]
├── /contact - Status: [200/404/500]
└── ... (all routes)
```

### **Check for:**
- Working pages (200 OK)
- Missing pages (404)
- Broken pages (500 errors)
- Pages that exist but show placeholders

---

## 🔧 STEP 3: BUILD & DEPLOYMENT STATUS

For the **spartans_command_center** project specifically:

1. **Current Deployment:**
   - Is it live?
   - What's the production URL?
   - When was last deployment?
   - Any build errors?

2. **Missing Pages** (create these):
   - `/register` - Sign up page (404 currently)
   - `/about` - About page (404 currently)
   - `/contact` - Contact page (404 currently)

3. **Environment Variables Needed:**
   ```bash
   # From MASTER_VAULT_PUBLIC.md - verify these are set in Vercel:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - CLOUDFLARE_ACCOUNT_ID
   - CLOUDFLARE_API_TOKEN
   - VERCEL_TOKEN
   - RESEND_API_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - STRIPE_SECRET_KEY
   - (and all others from .env.local)
   ```

---

## 🚀 STEP 4: IMMEDIATE ACTIONS

After reporting, please execute:

### **A. Create Missing Pages**

Build these 3 pages with our neumorphic design system:

1. **app/register/page.tsx**
   - Sign up form (email, password, confirm password)
   - Same styling as `/login`
   - Link to `/login` at bottom
   - Use `btn-neu`, `card-neu`, `input-neu` classes

2. **app/about/page.tsx**
   - Company information
   - Mission statement
   - Team section (placeholder)
   - Neumorphic cards layout

3. **app/contact/page.tsx**
   - Contact form (name, email, message)
   - Integration with Resend API
   - Form validation with react-hook-form + zod

### **B. Deploy to Vercel**

```bash
# Deploy using Vercel CLI with provided token
vercel --token=rtPMwvDK44vh2zMWQlxT0T2V --prod

# Or trigger deployment via API
# Report deployment URL and status
```

### **C. Sync Environment Variables**

```bash
# Compare .env.local with Vercel environment variables
# Report any missing variables
# Add missing ones to Vercel dashboard
```

---

## 📁 REFERENCE FILES

### **Read These First:**

1. **MASTER_VAULT_PUBLIC.md** - Complete backend configuration
   - All API tokens and credentials
   - Database configuration
   - Service integrations
   - Project status and blockers

2. **.env.local** - Local environment variables
   - Use as reference for what Vercel needs
   - DO NOT commit this file

3. **BRAND_IDENTITY.md** - Design system guide
   - Colors, typography, components
   - Neumorphic design patterns
   - Brand guidelines

4. **PHASE_1_COMPLETE.md** - Backend status
   - What's built
   - What's pending
   - Database migrations needed

### **Study These Examples:**

- `app/page.tsx` - Homepage with neumorphic design
- `app/login/page.tsx` - Form styling reference
- `app/ai-chat/page.tsx` - Feature page layout
- `components/layout/Navigation.tsx` - Nav component
- `app/globals.css` - Design system classes

---

## 🎨 DESIGN SYSTEM QUICK REFERENCE

### **Classes to Use:**

```css
/* Buttons */
.btn-neu - Primary neumorphic button (teal gradient)

/* Cards */
.card-neu - Neumorphic card (raised effect)

/* Inputs */
.input-neu - Debossed input field

/* Colors */
text-brand-teal - Teal accent color
bg-charcoal-deep - Dark background
text-foreground - Primary text
text-muted-foreground - Secondary text

/* Backgrounds */
.bg-hero-gradient - Radial gradient background
.bg-gradient-teal - Teal gradient
```

### **Layout Pattern:**
```tsx
<div className="min-h-screen bg-hero-gradient">
  <Navigation />
  <div className="container mx-auto px-4 py-16">
    <div className="max-w-4xl mx-auto">
      <div className="card-neu p-8">
        {/* Content here */}
      </div>
    </div>
  </div>
</div>
```

---

## 🤝 WORKFLOW COORDINATION

### **Your Responsibilities:**
- ✅ Build & deploy Vercel projects
- ✅ Create missing frontend pages
- ✅ Implement UI components
- ✅ Manage environment variables in Vercel
- ✅ Monitor deployment status
- ✅ Handle build errors

### **Claude's Responsibilities:**
- ✅ Database schema & SQL migrations
- ✅ Backend API development
- ✅ Service layer architecture
- ✅ Documentation
- ✅ Integration planning
- ✅ Security configuration

### **Shared Responsibilities:**
- Testing end-to-end flows
- Bug fixing
- Performance optimization
- Documentation updates

---

## 📊 REPORTING FORMAT

Please structure your response as:

```markdown
## VERCEL PROJECT AUDIT

### Project 1: [Name]
- Production URL:
- Status:
- Last Deploy:
- Environment:
- Pages Found:

### Project 2: [Name]
...

## MISSING PAGES
- [List all 404s]

## DEPLOYMENT ACTIONS TAKEN
- [What you built/deployed]

## BLOCKERS
- [What you need from me or Claude]

## NEXT STEPS
- [What should be done next]
```

---

## 🎯 SUCCESS CRITERIA

After you complete this briefing, we should have:

1. ✅ Complete audit of all 4 Vercel projects
2. ✅ All production URLs documented
3. ✅ Missing pages identified and created
4. ✅ Environment variables synced to Vercel
5. ✅ Fresh deployment to production
6. ✅ Clear report of what's working/broken
7. ✅ Coordinated workflow with Claude established

---

## 🚨 IMPORTANT NOTES

- **DO NOT** commit `.env.local` to git (it's gitignored)
- **DO** add all environment variables to Vercel dashboard
- **DO** use the neumorphic design system (see BRAND_IDENTITY.md)
- **DO** test pages locally before deploying (`npm run dev`)
- **DO** report any API errors or missing credentials
- **DO NOT** modify database schema (Claude handles this)
- **DO NOT** change authentication logic (Claude handles this)

---

## 🔗 QUICK LINKS

- **Vercel Dashboard:** https://vercel.com/meauxbilityorg
- **Supabase Dashboard:** https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk
- **GitHub Repo:** https://github.com/InnerAnimal/spartans_command_center
- **Master Vault:** See `MASTER_VAULT_PUBLIC.md` in repo root

---

## 💬 COMMUNICATION

**Format for Updates:**
- Tag findings with emojis: ✅ (done), ⚠️ (warning), ❌ (error), 🔧 (in progress)
- Use markdown formatting
- Include URLs for deployed pages
- Reference line numbers when discussing code
- Ask questions if anything is unclear

---

**Ready to sync up! Let's build this together!** 🚀

**Your first task:** Run the Vercel audit and report all 4 projects + URLs.

---

_Generated by Claude Code for Cursor AI Coordination_
_Last Updated: November 2, 2025_
