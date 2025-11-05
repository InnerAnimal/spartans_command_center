# 🚀 Vercel Deployment Setup Guide

## Overview

Deploy all 3 projects from this monorepo to Vercel using GitHub integration.

**Your Vercel Team ID:** `team_eMhajA4eD6XUAGomNi6CnQeZ`

**Projects to Deploy:**
1. **Meauxbility** → `meauxbility.org` (Nonprofit)
2. **Inner Animal Media** → `inneranimal.com` (Media Company)
3. **iAutodidact** → `iautodidact.app` (Learning Platform)

---

## 📋 Prerequisites

✅ GitHub repository: `InnerAnimal/spartans_command_center`
✅ Vercel account with Team ID: `team_eMhajA4eD6XUAGomNi6CnQeZ`
✅ Domain names owned and ready to configure

---

## 🎯 Method 1: Vercel Dashboard (Recommended)

### Step 1: Import Repository to Vercel

1. Go to **[Vercel Dashboard](https://vercel.com/team_eMhajA4eD6XUAGomNi6CnQeZ)**
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose: `InnerAnimal/spartans_command_center`
5. Click **"Import"**

### Step 2: Configure Project 1 - Meauxbility

**Project Settings:**
```
Project Name:       meauxbility-org
Root Directory:     projects/meauxbility
Framework Preset:   Other
Build Command:      (leave empty or "npm install")
Output Directory:   . (current directory)
Install Command:    npm install
```

**Environment Variables:**
```
NODE_ENV=production
PROJECT_NAME=meauxbility
```

**Advanced Settings:**
- Node.js Version: `18.x` or higher
- Include source files outside Root Directory: ✅ **Enabled**

Click **"Deploy"**

### Step 3: Configure Project 2 - Inner Animal Media

Repeat the import process:

1. Go back to dashboard → Click **"Add New..."** → **"Project"**
2. Select the same repository: `InnerAnimal/spartans_command_center`

**Project Settings:**
```
Project Name:       inneranimal-media
Root Directory:     projects/inneranimal
Framework Preset:   Other
Build Command:      (leave empty)
Output Directory:   .
Install Command:    npm install
```

**Environment Variables:**
```
NODE_ENV=production
PROJECT_NAME=inneranimal
```

**Advanced Settings:**
- Include source files outside Root Directory: ✅ **Enabled**

Click **"Deploy"**

### Step 4: Configure Project 3 - iAutodidact

Repeat one more time:

**Project Settings:**
```
Project Name:       iautodidact-app
Root Directory:     projects/iautodidact
Framework Preset:   Other
Build Command:      (leave empty)
Output Directory:   .
Install Command:    npm install
```

**Environment Variables:**
```
NODE_ENV=production
PROJECT_NAME=iautodidact
```

**Advanced Settings:**
- Include source files outside Root Directory: ✅ **Enabled**

Click **"Deploy"**

---

## 🌐 Step 5: Configure Custom Domains

For each project, add your custom domain:

### Project 1: meauxbility-org
1. Go to Project Settings → **Domains**
2. Add domain: `meauxbility.org`
3. Add domain: `www.meauxbility.org`
4. Follow DNS configuration instructions

### Project 2: inneranimal-media
1. Go to Project Settings → **Domains**
2. Add domain: `inneranimal.com`
3. Add domain: `www.inneranimal.com`
4. Follow DNS configuration instructions

### Project 3: iautodidact-app
1. Go to Project Settings → **Domains**
2. Add domain: `iautodidact.app`
3. Add domain: `www.iautodidact.app`
4. Follow DNS configuration instructions

---

## 🔐 Step 6: Add Additional Environment Variables

For each project, add these if needed:

### Supabase Configuration (if using)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Stripe Configuration (if using)
```
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

---

## 🎯 Method 2: CLI Deployment (Alternative)

If you prefer CLI deployment, follow these steps:

### 1. Install Vercel CLI (Already Done)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
# Opens browser for authentication
```

### 3. Deploy Each Project

**Deploy Meauxbility:**
```bash
cd projects/meauxbility
vercel --prod
# Follow prompts to link to existing project or create new
```

**Deploy Inner Animal:**
```bash
cd ../inneranimal
vercel --prod
```

**Deploy iAutodidact:**
```bash
cd ../iautodidact
vercel --prod
```

---

## 🤖 Automatic Deployments

Once set up via GitHub integration, every push to your branch will automatically:
- ✅ Build and deploy all 3 projects
- ✅ Run preview deployments for PRs
- ✅ Update production on merge to main

**To trigger deployment:**
```bash
git add .
git commit -m "🚀 Update projects"
git push origin claude/deploy-automated-webapp-011CUeB9XeU2jXDkC4b5n7Hg
```

---

## 📊 Monitoring Deployments

### Via Dashboard
- View all deployments: https://vercel.com/team_eMhajA4eD6XUAGomNi6CnQeZ
- Each project shows deployment status, logs, and analytics

### Via CLI
```bash
# Check deployment status
vercel ls

# View logs for specific deployment
vercel logs <deployment-url>
```

### Via API
```bash
# Health check for each project
curl https://meauxbility.org/api/health
curl https://inneranimal.com/api/health
curl https://iautodidact.app/api/health
```

---

## 🔧 Troubleshooting

### Issue: Build fails with "Cannot find module"
**Solution:** Ensure "Include source files outside Root Directory" is enabled in project settings. This allows access to `shared/` folder.

### Issue: Domain not resolving
**Solution:** Check DNS records are correctly configured. Vercel provides specific records to add.

### Issue: Environment variables not working
**Solution:**
1. Ensure variables are added in Vercel Dashboard → Project Settings → Environment Variables
2. Select correct environment (Production, Preview, Development)
3. Redeploy after adding variables

### Issue: 404 on API routes
**Solution:** Verify `vercel.json` routing configuration points to correct server path:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "../../shared/server/server.js"
    }
  ]
}
```

---

## 📁 Project Structure Reference

```
spartans_command_center/
├── projects/
│   ├── meauxbility/          → Vercel Project 1
│   │   ├── index.html
│   │   ├── vercel.json       ← Deployment config
│   │   └── public/
│   ├── inneranimal/          → Vercel Project 2
│   │   ├── index.html
│   │   ├── vercel.json
│   │   └── public/
│   └── iautodidact/          → Vercel Project 3
│       ├── index.html
│       ├── vercel.json
│       └── public/
├── shared/
│   ├── server/               ← Shared Express.js backend
│   │   ├── server.js
│   │   └── package.json
│   ├── automation/           ← All automation scripts
│   └── assets/               ← Shared CSS/JS
└── deploy-all.sh            ← Local deployment script
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] All 3 projects show "Ready" status in Vercel dashboard
- [ ] Each project is accessible via preview URL
- [ ] Custom domains are configured and resolving
- [ ] API endpoints respond correctly (`/api/health`)
- [ ] Environment variables are set for each project
- [ ] Automatic deployments trigger on git push
- [ ] Build logs show no errors
- [ ] SSL certificates are active for all domains

---

## 🎉 Success!

Once all 3 projects are deployed, you'll have:

✅ **3 independent Vercel deployments** from one monorepo
✅ **Automatic deployments** on every git push
✅ **Custom domains** for each project
✅ **Shared backend infrastructure** (Express.js)
✅ **MCP AI control** for automation
✅ **One command deployments** with `./deploy-all.sh`

**Next Steps:**
1. Add content to each project
2. Configure analytics and monitoring
3. Set up custom email addresses for domains
4. Add additional features and functionality

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Monorepo Setup:** https://vercel.com/docs/concepts/monorepos
- **Custom Domains:** https://vercel.com/docs/concepts/projects/domains
- **Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables

---

**Generated by Spartans Command Center**
*Monorepo Deployment System*
