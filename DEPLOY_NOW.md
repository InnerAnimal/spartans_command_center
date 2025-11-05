# 🚀 Deploy to Vercel - Quick Start

## ⚡ 3-Minute Setup

### Step 1: Go to Vercel Dashboard
**Open:** https://vercel.com/team_eMhajA4eD6XUAGomNi6CnQeZ

### Step 2: Import Your Repository (Do This 3 Times)

#### 🎯 Deployment #1: MEAUXBILITY
1. Click **"Add New..."** → **"Project"**
2. Select repository: `InnerAnimal/spartans_command_center`
3. Configure:
   - **Project Name:** `meauxbility-org`
   - **Root Directory:** `projects/meauxbility`
   - **Framework:** Other
   - ⚠️ **IMPORTANT:** Enable "Include source files outside Root Directory"
4. Add environment variable:
   - `PROJECT_NAME` = `meauxbility`
5. Click **"Deploy"** 🚀

#### 🎯 Deployment #2: INNER ANIMAL MEDIA
1. Click **"Add New..."** → **"Project"** (again)
2. Select same repository: `InnerAnimal/spartans_command_center`
3. Configure:
   - **Project Name:** `inneranimal-media`
   - **Root Directory:** `projects/inneranimal`
   - **Framework:** Other
   - ⚠️ **IMPORTANT:** Enable "Include source files outside Root Directory"
4. Add environment variable:
   - `PROJECT_NAME` = `inneranimal`
5. Click **"Deploy"** 🚀

#### 🎯 Deployment #3: iAUTODIDACT
1. Click **"Add New..."** → **"Project"** (one more time)
2. Select same repository: `InnerAnimal/spartans_command_center`
3. Configure:
   - **Project Name:** `iautodidact-app`
   - **Root Directory:** `projects/iautodidact`
   - **Framework:** Other
   - ⚠️ **IMPORTANT:** Enable "Include source files outside Root Directory"
4. Add environment variable:
   - `PROJECT_NAME` = `iautodidact`
5. Click **"Deploy"** 🚀

---

## 🌐 Step 3: Add Custom Domains (After Deployment)

For each project, go to **Settings** → **Domains** and add:

| Project | Domain |
|---------|--------|
| meauxbility-org | `meauxbility.org` + `www.meauxbility.org` |
| inneranimal-media | `inneranimal.com` + `www.inneranimal.com` |
| iautodidact-app | `iautodidact.app` + `www.iautodidact.app` |

Follow the DNS instructions Vercel provides for each domain.

---

## ✅ That's It!

Your 3 projects will now:
- ✅ Deploy automatically on every git push
- ✅ Have separate URLs and configurations
- ✅ Share the same backend infrastructure
- ✅ Be managed from one monorepo

---

## 🎯 Critical Setting

When importing each project, you **MUST** enable this setting:

```
⚙️ Advanced Build Settings
└── ✅ Include source files outside Root Directory in the Build Step
```

Without this, the projects can't access the `shared/` folder!

---

## 📞 Deployment URLs

After deployment, you'll get:

1. **Meauxbility:** `https://meauxbility-org-xxx.vercel.app`
2. **Inner Animal:** `https://inneranimal-media-xxx.vercel.app`
3. **iAutodidact:** `https://iautodidact-app-xxx.vercel.app`

(Replace with custom domains after DNS configuration)

---

## 🆘 Issues?

**Build fails?**
- Check "Include source files outside Root Directory" is enabled
- Verify Root Directory is exactly `projects/<project-name>`

**404 errors?**
- Check `vercel.json` is in each project folder ✅ (already done)
- Verify routing configuration

**Need more help?**
- See full guide: `VERCEL_SETUP_GUIDE.md`
- Vercel docs: https://vercel.com/docs

---

**Your Team ID:** `team_eMhajA4eD6XUAGomNi6CnQeZ`
**Repository:** `InnerAnimal/spartans_command_center`
**Branch:** `claude/deploy-automated-webapp-011CUeB9XeU2jXDkC4b5n7Hg`

🎉 **Ready to deploy! Open Vercel dashboard and follow the 3 steps above.**
