# 🚀 Spartans Command Center - Monorepo Guide

## Overview

This is a **monorepo** containing 3 separate Vercel projects, all managed from one repository with shared automation and AI control.

---

## 📁 Project Structure

```
spartans_command_center/
├── projects/
│   ├── meauxbility/           → meauxbility.org
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── vercel.json
│   │   └── ... (all Meauxbility pages)
│   │
│   ├── inneranimal/           → inneranimal.com
│   │   ├── index.html
│   │   ├── vercel.json
│   │   └── ... (media company site)
│   │
│   └── iautodidact/           → iautodidact.app
│       ├── index.html
│       ├── vercel.json
│       └── ... (learning platform)
│
├── shared/
│   ├── server/
│   │   ├── server.js          (Express.js backend for all)
│   │   └── package.json
│   ├── automation/
│   │   ├── deploy-monitor.sh
│   │   ├── setup-google-workspace.sh
│   │   └── ... (all automation scripts)
│   ├── mcp/
│   │   └── mcp-server.json    (AI control config)
│   └── assets/
│       ├── css/
│       └── js/
│
├── deploy-all.sh              (Deploy all 3 projects)
├── validate-deployment.sh
└── README.md
```

---

## 🎯 The 3 Projects

### 1. 💚 Meauxbility (`projects/meauxbility/`)
**Domain:** meauxbility.org
**Purpose:** Nonprofit organization
**Content:**
- About/Mission
- Grant application
- Donation page
- Success stories
- Contact
- Admin dashboard

### 2. 🎬 Inner Animal Media (`projects/inneranimal/`)
**Domain:** inneranimal.com
**Purpose:** Creative media production company
**Content:**
- Company homepage
- Services/Portfolio
- Media projects
- Contact

### 3. 🎓 iAutodidact (`projects/iautodidact/`)
**Domain:** iautodidact.app
**Purpose:** Self-directed learning platform
**Content:**
- Course catalog
- Learning platform
- Student portal
- Instructor dashboard

---

## 🚀 Deployment

### One Command for All 3

```bash
./deploy-all.sh
```

This script:
1. ✅ Validates system dependencies
2. ✅ Installs shared dependencies
3. ✅ Syncs assets to all projects
4. ✅ Commits and pushes to GitHub
5. ✅ Prepares all 3 projects for Vercel

### Manual Deployment Per Project

```bash
# Deploy Meauxbility
cd projects/meauxbility && vercel --prod

# Deploy Inner Animal
cd projects/inneranimal && vercel --prod

# Deploy iAutodidact
cd projects/iautodidact && vercel --prod
```

---

## ⚙️ Vercel Setup

### Step 1: Create 3 Vercel Projects

Go to: https://vercel.com/team_eMhajA4eD6XUAGomNi6CnQeZ

Create 3 new projects:

1. **meauxbility-org**
   - Repository: spartans_command_center
   - Root Directory: `projects/meauxbility`
   - Domain: meauxbility.org

2. **inneranimal-media**
   - Repository: spartans_command_center
   - Root Directory: `projects/inneranimal`
   - Domain: inneranimal.com

3. **iautodidact-app**
   - Repository: spartans_command_center
   - Root Directory: `projects/iautodidact`
   - Domain: iautodidact.app

### Step 2: Configure Environment Variables

For each project in Vercel dashboard, add:

```bash
NODE_ENV=production
PROJECT_NAME=<project_name>
SUPABASE_URL=<your_url>
SUPABASE_ANON_KEY=<your_key>
```

### Step 3: Enable Auto-Deploy

In Vercel settings:
- ✅ Enable auto-deploy from GitHub
- ✅ Set production branch
- ✅ Configure build settings

---

## 🤖 MCP AI Control

The shared MCP server can control all 3 projects!

### Start MCP Server

```bash
npm run mcp:start
```

### AI Can Now:

- Deploy any/all projects
- Check health across all 3
- Monitor deployments
- Manage infrastructure

### Example AI Commands

```
"Deploy all 3 projects to production"
"Check health status of Meauxbility"
"What's deployed on Inner Animal?"
```

---

## 📚 Shared Resources

### Shared Server (`shared/server/`)

All 3 projects use the same Express.js backend:
- API routes
- Health checks
- Webhook handling
- Authentication

### Shared Assets (`shared/assets/`)

Common styles and scripts:
- CSS framework
- JavaScript utilities
- Design system

### Shared Automation (`shared/automation/`)

All automation scripts:
- Google Workspace setup
- Cloud optimization
- API configuration
- Deployment monitoring

---

## 🔧 Development

### Local Development

```bash
# Start server for any project
cd projects/meauxbility
npm start

# Or use shared server
cd shared/server
npm run dev
```

### Adding New Pages

Add to respective project folder:

```bash
# Add new page to Meauxbility
touch projects/meauxbility/new-page.html

# Add new page to Inner Animal
touch projects/inneranimal/new-page.html
```

### Updating Shared Code

Edit in `shared/` and it affects all projects:

```bash
# Update shared server
vim shared/server/server.js

# Update shared styles
vim shared/assets/css/main.css
```

---

## 🎯 Benefits of This Structure

### ✅ Unified Management
- One repository for all 3 projects
- Single deployment command
- Shared automation

### ✅ Code Reuse
- Shared backend server
- Common assets and styles
- Reusable automation

### ✅ Simplified Deployment
- Deploy all 3 with one command
- Or deploy individually
- AI-controllable via MCP

### ✅ Independent Scaling
- Each project deploys separately on Vercel
- Independent domains
- Can scale independently

---

## 📊 What's Different from Before

### Before (Old Structure)
```
spartans_command_center/
├── index.html
├── about.html
├── server.js
└── deploy-all.sh (deployed to Render + GitHub Pages)
```

### After (Monorepo)
```
spartans_command_center/
├── projects/
│   ├── meauxbility/     (was root level)
│   ├── inneranimal/     (NEW)
│   └── iautodidact/     (NEW)
├── shared/
│   ├── server/          (was root level)
│   ├── automation/
│   └── assets/
└── deploy-all.sh (deploys all 3 to Vercel)
```

### Key Changes
- ❌ **Removed:** Render references
- ❌ **Removed:** GitHub Pages deployment
- ✅ **Added:** Vercel-only deployment
- ✅ **Added:** 2 new projects (Inner Animal, iAutodidact)
- ✅ **Added:** Shared resources structure
- ✅ **Added:** Monorepo organization

---

## 🚀 Next Steps

### 1. Configure Vercel Dashboard

Create 3 projects pointing to this repo with different root directories.

### 2. Set Environment Variables

Add required env vars to each Vercel project.

### 3. Deploy

```bash
./deploy-all.sh
```

Then either:
- Push to GitHub and let Vercel auto-deploy
- Or manually deploy each project with `vercel --prod`

### 4. Configure Domains

In Vercel dashboard:
- meauxbility.org → meauxbility-org project
- inneranimal.com → inneranimal-media project
- iautodidact.app → iautodidact-app project

---

## 📝 Notes

- All 3 projects share the same backend server
- Assets are copied to each project during deployment
- Each project can be deployed independently
- MCP AI control works across all 3 projects
- One repository, one source of truth

---

## 🙏 Questions?

Check the other docs:
- QUICKSTART.md - Quick setup
- DEPLOY.md - Deployment details
- MCP_GUIDE.md - AI control
- AUTOMATION_README.md - Automation overview

---

**Built with the Spartans Command Center automation framework** 🤖✨
