# ⚡ Quick Start Guide - Spartans Command Center

> Deploy your entire web application in **under 5 minutes**

## 🚀 Three-Command Deployment

```bash
git clone https://github.com/InnerAnimal/spartans_command_center.git
cd spartans_command_center
./deploy-all.sh
```

## 🎯 What This Does

The `deploy-all.sh` script automatically:

1. ✅ Checks Node.js, npm, git
2. ✅ Sets up environment variables
3. ✅ Installs all dependencies
4. ✅ Runs security audit
5. ✅ Configures Google Workspace
6. ✅ Optimizes cloud storage
7. ✅ Tests locally
8. ✅ Deploys to GitHub Pages
9. ✅ Deploys to Render
10. ✅ Validates everything works

**Time**: 2-5 minutes

## ⚙️ First-Time Setup

### 1. Prerequisites
```bash
# Check you have these installed:
node --version    # Need v18+
npm --version     # Need v9+
git --version     # Any recent version
```

Don't have them? Install:
- **Node.js**: https://nodejs.org
- **Git**: https://git-scm.com

### 2. Configure Environment

```bash
# Copy template
cp ENVIRONMENT_TEMPLATE.env .env

# Edit with your credentials
nano .env  # or vim, code, etc.
```

**Minimum Required**:
```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

### 3. Deploy!

```bash
./deploy-all.sh
```

## 📱 Access Your App

After deployment, your app is live at:

- **Production**: https://meauxbility.org
- **GitHub Pages**: https://inneranimal.github.io/spartans_command_center
- **Local**: http://localhost:3000

## 🔥 Quick Commands

```bash
# Start development server
npm run dev

# Deploy everything
npm run deploy

# Health check
npm run health

# Setup Google services
npm run setup:google

# Monitor deployment
npm run monitor
```

## 🆘 Troubleshooting

### Port Already in Use?
```bash
PORT=4000 npm start
```

### Permission Denied?
```bash
chmod +x deploy-all.sh
```

### Deployment Failed?
```bash
# Check logs
cat logs/deployment-*.log

# Test locally
npm start
```

## 📚 Full Documentation

- **Complete Guide**: See [DEPLOY.md](./DEPLOY.md)
- **Project Details**: See [README.md](./README.md)
- **Cloud Setup**: See [CLOUD_DASHBOARD_SETUP.md](./CLOUD_DASHBOARD_SETUP.md)

## 🎉 Success Checklist

After running `./deploy-all.sh`, verify:

- [ ] See "DEPLOYMENT SUCCESSFUL!" message
- [ ] Can access https://meauxbility.org
- [ ] `/api/health` returns OK status
- [ ] Admin dashboard accessible at `/admin`

## 🔧 NPM Scripts Cheat Sheet

| Command | What It Does |
|---------|--------------|
| `npm start` | Start server |
| `npm run dev` | Dev mode with auto-reload |
| `npm run deploy` | Full deployment |
| `npm run health` | Health check |
| `npm run setup:google` | Google Workspace setup |
| `npm run monitor` | Monitor deployments |
| `npm run mcp:start` | Start as MCP server |

## 🚨 Important Notes

1. **Never commit `.env`** - It contains secrets
2. **Rotate API keys** - After initial setup
3. **Use HTTPS** - Always in production
4. **Check logs** - If something goes wrong

## 🎯 Next Steps

1. ✅ Deploy with `./deploy-all.sh`
2. ✅ Verify at https://meauxbility.org
3. ✅ Configure Google Workspace: `npm run setup:google`
4. ✅ Optimize cloud: `npm run optimize:cloud`
5. ✅ Set up monitoring: `npm run monitor`

---

**That's it!** You now have a fully automated, production-ready web application.

Need more details? See [DEPLOY.md](./DEPLOY.md)
