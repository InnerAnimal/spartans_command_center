# 🚀 InnerAnimalMedia.com - Deployment Guide

## ✅ What's Been Completed

### Application Setup
- ✅ **Next.js 14** initialized with TypeScript
- ✅ **Tailwind CSS** configured with custom theme
- ✅ **App Router** structure in place
- ✅ **Responsive homepage** with modern design
- ✅ **Placeholder pages** for AI Chat, Community, and Video features
- ✅ **Git repository** connected to https://github.com/InnerAnimal/spartans_command_center

### Project Structure
```
InnerAnimalMedia/
├── app/
│   ├── ai-chat/        # AI Chat interface (placeholder)
│   ├── community/      # Community forum (placeholder)
│   ├── video/          # Video conferencing (placeholder)
│   ├── login/          # Login page (placeholder)
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles
├── components/         # Reusable components (empty - ready for use)
├── lib/
│   └── utils.ts        # Utility functions
├── public/             # Static assets
└── ENVIRONMENT_KEYS.md # Preserved API keys
```

---

## 🔧 Next Steps for Deployment

### 1. Set Up Environment Variables in Vercel

Go to your Vercel project dashboard and add these environment variables:

**Vercel Project:** https://vercel.com/dashboard  
**Project ID:** `prj_4rOWsKyVlnVE2kHyRT75ZXYLaM3f`

#### Required Variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from ENVIRONMENT_KEYS.md>
SUPABASE_SERVICE_ROLE_KEY=<from ENVIRONMENT_KEYS.md>

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=<from ENVIRONMENT_KEYS.md>
CLOUDFLARE_API_TOKEN=<from ENVIRONMENT_KEYS.md>
CLOUDFLARE_KV_NAMESPACE_ID=<from ENVIRONMENT_KEYS.md>

# Application
NEXT_PUBLIC_APP_URL=https://inneranimalmedia.com
NODE_ENV=production
ADMIN_EMAIL=meauxbility@gmail.com
ADMIN_PHONE=+13374509998
```

#### Optional (for future features):
```env
# AI Services
OPENAI_API_KEY=<your key>
ANTHROPIC_API_KEY=<your key>

# Stripe (if using payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<from ENVIRONMENT_KEYS.md>
STRIPE_SECRET_KEY=<from ENVIRONMENT_KEYS.md>
STRIPE_WEBHOOK_SECRET=<from ENVIRONMENT_KEYS.md>

# Email
RESEND_API_KEY=<your key>
```

### 2. Connect Vercel to GitHub (if not already connected)

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import from Git: `InnerAnimal/spartans_command_center`
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (current directory)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### 3. Configure Custom Domain

In Vercel Project Settings → Domains:
1. Add domain: `inneranimalmedia.com`
2. Add domain: `www.inneranimalmedia.com`
3. Follow Vercel's DNS instructions to point your domain

**Cloudflare DNS Configuration:**
- Go to Cloudflare Dashboard for `inneranimalmedia.com`
- Add CNAME record: `@` → `cname.vercel-dns.com`
- Or use A records provided by Vercel

### 4. Deploy

Since GitHub is already connected, every push to `main` branch will automatically deploy!

To manually trigger a deployment:
```bash
cd "C:\Users\conno\OneDrive\Desktop\InnerAnimalMedia"
git push origin main
```

Or use Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

---

## 🧪 Testing Locally

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
```

The application is already running on your machine!

---

## 📋 Features Status

### ✅ Completed
- [x] Homepage with modern design
- [x] Navigation structure
- [x] Responsive layouts
- [x] Tailwind CSS theming
- [x] Basic page structure for all features

### 🚧 In Progress / Coming Soon
- [ ] **AI Chat Integration**
  - [ ] OpenAI API integration
  - [ ] Anthropic Claude API integration
  - [ ] Chat history & persistence
  - [ ] Real-time streaming responses

- [ ] **Community Forum**
  - [ ] Supabase database schema
  - [ ] Threaded discussions
  - [ ] User authentication
  - [ ] Rich text editor
  - [ ] Search & filtering

- [ ] **Video Conferencing**
  - [ ] WebRTC implementation
  - [ ] Screen sharing
  - [ ] Real-time chat
  - [ ] Recording (optional)

- [ ] **Authentication**
  - [ ] Supabase Auth integration
  - [ ] Email/password login
  - [ ] OAuth providers
  - [ ] User profiles

---

## 🔑 API Keys Reference

All API keys are preserved in `ENVIRONMENT_KEYS.md` (NOT committed to Git).

**To use them locally:**
1. Copy `.env.local.example` to `.env.local`
2. Fill in values from `ENVIRONMENT_KEYS.md`
3. Never commit `.env.local` to Git!

---

## 📊 Deployment Checklist

- [x] Repository cleaned of old Meauxbility content
- [x] Next.js 14 application initialized
- [x] Tailwind CSS configured
- [x] Homepage and placeholder pages created
- [x] Code committed to GitHub
- [ ] Environment variables added to Vercel
- [ ] Vercel connected to GitHub repo
- [ ] Custom domain configured
- [ ] Production deployment verified

---

## 🆘 Troubleshooting

### Build Failures
- Check that all environment variables are set in Vercel
- Ensure Node.js version is 18.x or higher
- Review build logs in Vercel dashboard

### Environment Variables Not Working
- Make sure they're set for "Production" environment
- Redeploy after adding new variables
- Prefix public variables with `NEXT_PUBLIC_`

### Domain Not Working
- Verify DNS records in Cloudflare
- Wait 24-48 hours for DNS propagation
- Check domain configuration in Vercel

---

## 📞 Support

- **Email:** meauxbility@gmail.com
- **Phone:** +1 (337) 450-9998
- **GitHub Repo:** https://github.com/InnerAnimal/spartans_command_center

---

## 🎉 What's Next?

1. **Deploy to Vercel** - Set up environment variables and connect your domain
2. **Implement AI Chat** - Integrate OpenAI and Anthropic APIs
3. **Build Community Forum** - Set up Supabase database and authentication
4. **Add Video Conferencing** - Implement WebRTC functionality
5. **Launch!** 🚀

---

**Built with ❤️ for the Meauxbility Foundation**

