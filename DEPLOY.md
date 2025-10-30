# 🚀 Spartans Command Center - Automated Deployment Guide

> **One Command to Deploy Them All** - Complete automation for your full-stack web application

---

## 🎯 Quick Start (TL;DR)

```bash
# Clone and deploy in 3 commands
git clone https://github.com/InnerAnimal/spartans_command_center.git
cd spartans_command_center
./deploy-all.sh
```

That's it! The automation handles everything.

---

## 📋 Table of Contents

- [What You Get](#-what-you-get)
- [Prerequisites](#-prerequisites)
- [Environment Setup](#-environment-setup)
- [Deployment Options](#-deployment-options)
- [Available Automation Scripts](#-available-automation-scripts)
- [MCP Integration](#-mcp-integration)
- [Available URLs](#-available-urls)
- [Troubleshooting](#-troubleshooting)

---

## 🎁 What You Get

This repository is a **complete, production-ready monorepo** with:

### 🌐 Full Web Application
- **Frontend**: Glassmorphic design system with 9+ pages
- **Backend**: Express.js API with security middleware
- **Database**: Supabase (PostgreSQL) integration
- **Payments**: Stripe integration
- **Email**: Nodemailer with Gmail SMTP

### 🤖 Automation Agents
- **deploy-all.sh**: Master deployment orchestrator
- **deploy-monitor.sh**: Multi-platform deployment monitoring
- **setup-google-workspace.sh**: Google Workspace integration
- **optimize-google-cloud.sh**: Cloud storage optimization
- **setup-api-environment.sh**: API environment configuration

### 🎨 Beautiful Design System
- Custom glassmorphic UI components
- Responsive mobile-first design
- Dark gradient backgrounds
- Professional admin dashboard

### 🔌 Integrations
- Google Workspace (Gmail, Calendar, Meet, Drive)
- Supabase for authentication & database
- Stripe for payments
- Render for hosting
- GitHub Pages for static assets

---

## ✅ Prerequisites

### Required
- **Node.js** 18+ ([Download](https://nodejs.org))
- **npm** 9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com))

### Optional (for advanced features)
- **Google Cloud CLI** ([Install](https://cloud.google.com/sdk/docs/install))
- **GitHub CLI** ([Install](https://cli.github.com))

### Quick Check
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
git --version     # Any recent version
```

---

## 🔧 Environment Setup

### 1. Copy Environment Template

```bash
cp ENVIRONMENT_TEMPLATE.env .env
```

### 2. Configure Your Credentials

Edit `.env` and add your actual credentials:

```bash
# Required
NODE_ENV=production
PORT=3000

# Supabase (get from https://app.supabase.com)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (get from https://dashboard.stripe.com)
STRIPE_PUBLIC_KEY=your_public_key
STRIPE_SECRET_KEY=your_secret_key

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password

# Optional: Google Cloud
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=./path/to/credentials.json

# Optional: GitHub
GITHUB_TOKEN=your_github_token
```

**Security Note**: Never commit `.env` to git. It's already in `.gitignore`.

---

## 🚀 Deployment Options

### Option 1: Full Automated Deployment (Recommended)

```bash
./deploy-all.sh
```

This single command will:
1. ✅ Check all system dependencies
2. ✅ Validate environment configuration
3. ✅ Install npm dependencies
4. ✅ Run security audit
5. ✅ Copy and optimize assets
6. ✅ Execute all automation agents
7. ✅ Test locally
8. ✅ Deploy to GitHub Pages
9. ✅ Deploy to Render
10. ✅ Validate deployment
11. ✅ Generate deployment report

**Duration**: ~2-5 minutes

---

### Option 2: Quick Local Deployment

```bash
npm run deploy:quick
```

Installs dependencies and starts the server locally.

---

### Option 3: Manual Step-by-Step

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
npm run setup:env

# 3. Setup Google Workspace
npm run setup:google

# 4. Start server
npm start
```

---

### Option 4: npm Scripts (Modular)

```bash
# Deploy everything
npm run deploy

# Run all setup scripts
npm run all:setup

# Monitor deployment
npm run monitor

# Optimize Google Cloud
npm run optimize:cloud

# Health check
npm run health

# Validate installation
npm run validate
```

---

## 🤖 Available Automation Scripts

### 1. `deploy-all.sh` - Master Deployment
The ultimate automation script that orchestrates everything.

**Usage:**
```bash
./deploy-all.sh
```

**What it does:**
- System dependency checks
- Environment validation
- Dependency installation
- Asset optimization
- Automation agent execution
- Local testing
- Multi-platform deployment
- Post-deployment validation
- Success reporting

---

### 2. `deploy-monitor.sh` - Deployment Monitoring
Monitor and manage deployments across platforms.

**Usage:**
```bash
bash deploy-monitor.sh
```

**Features:**
- Health check monitoring
- Multi-environment support
- Render deployment orchestration
- Connection testing

---

### 3. `setup-google-workspace.sh` - Google Integration
Configure Google Workspace services.

**Usage:**
```bash
bash setup-google-workspace.sh
```

**Configures:**
- Gmail API
- Google Calendar
- Google Meet
- Google Drive
- Team member setup

---

### 4. `optimize-google-cloud.sh` - Cloud Optimization
Optimize Google Cloud Storage and resources.

**Usage:**
```bash
bash optimize-google-cloud.sh
```

**Features:**
- 2TB bucket management
- Storage optimization
- Cost analysis
- gcloud authentication

---

### 5. `setup-api-environment.sh` - API Setup
Configure API keys and environment.

**Usage:**
```bash
bash setup-api-environment.sh
```

---

## 🔌 MCP Integration

This project is **MCP (Model Context Protocol) ready**, making it a true machine-controllable application.

### What is MCP?

MCP allows AI agents (like Claude) to interact with your application as a server, enabling:
- Automated deployments via AI
- Health monitoring
- Resource management
- Tool integration

### Start MCP Server

```bash
npm run mcp:start
```

### MCP Configuration

The `mcp-server.json` file defines:
- **Tools**: deploy-application, health-check, setup-google-workspace, etc.
- **Resources**: API health, deployment status, cloud metrics
- **Prompts**: Pre-configured automation workflows

### Available MCP Tools

1. **deploy-application**: Deploy to any platform
2. **health-check**: Check service health
3. **setup-google-workspace**: Configure Google services
4. **optimize-cloud-storage**: Manage cloud resources
5. **monitor-deployment**: Track deployment status

---

## 🌐 Available URLs

### Production Domains
- **Primary**: https://meauxbility.org
- **GitHub Pages**: https://inneranimal.github.io/spartans_command_center

### API Endpoints
- **Health**: `/api/health`
- **Status**: `/api/status`
- **Webhooks**: `/api/webhooks/meauxbilityorg`
- **Render Health**: `/healthz`

### Admin Dashboard
- **URL**: https://meauxbility.org/admin

### Public Pages
- `/` - Homepage
- `/about` - About Us
- `/apply` - Grant Application
- `/donate` - Donations (Stripe)
- `/stories` - Success Stories
- `/contact` - Contact Form
- `/services` - Services
- `/assets` - Tech Stack Dashboard
- `/cloud-dashboard` - Cloud Services

---

## 🛠 Troubleshooting

### Issue: "Node.js not found"

**Solution:**
```bash
# Install Node.js from https://nodejs.org
# Or using package manager:
# macOS
brew install node

# Ubuntu/Debian
sudo apt install nodejs npm

# Windows
# Download from https://nodejs.org
```

---

### Issue: "npm install failed"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### Issue: ".env file missing"

**Solution:**
```bash
# Copy template
cp ENVIRONMENT_TEMPLATE.env .env

# Edit with your credentials
nano .env  # or vi, vim, code, etc.
```

---

### Issue: "Permission denied: ./deploy-all.sh"

**Solution:**
```bash
# Make script executable
chmod +x deploy-all.sh

# Run again
./deploy-all.sh
```

---

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Option 1: Kill process on port 3000
kill -9 $(lsof -ti:3000)

# Option 2: Use different port
PORT=4000 npm start

# Option 3: Find and stop the process
lsof -i :3000
kill -9 <PID>
```

---

### Issue: "Deployment failed"

**Solution:**
```bash
# Check deployment logs
cat logs/deployment-*.log

# Verify environment
npm run validate

# Test locally first
npm start

# Check health endpoint
curl http://localhost:3000/api/health
```

---

## 📊 Deployment Verification

After deployment, verify everything works:

### 1. Check Website
```bash
curl https://meauxbility.org
```

### 2. Check API Health
```bash
curl https://meauxbility.org/api/health
```

### 3. Check Admin Dashboard
```bash
curl https://meauxbility.org/admin
```

### 4. Test Webhook
```bash
curl -X POST https://meauxbility.org/api/webhooks/meauxbilityorg \
  -H "Content-Type: application/json" \
  -H "X-Signature: test" \
  -d '{"test": true}'
```

---

## 🎯 Next Steps After Deployment

1. **Configure DNS**
   - Point `meauxbility.org` to GitHub Pages or Render
   - Add CNAME record

2. **Set up SSL**
   - Automatic with GitHub Pages
   - Configure in Render dashboard

3. **Configure Webhooks**
   - Add webhook URLs to external services
   - Use `/api/webhooks/meauxbilityorg`

4. **Monitor Application**
   ```bash
   npm run monitor
   ```

5. **Set up Google Workspace**
   ```bash
   npm run setup:google
   ```

6. **Optimize Cloud Storage**
   ```bash
   npm run optimize:cloud
   ```

---

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm run deploy` | Full automated deployment |
| `npm run deploy:quick` | Quick local deployment |
| `npm run setup:env` | Setup API environment |
| `npm run setup:google` | Setup Google Workspace |
| `npm run optimize:cloud` | Optimize Google Cloud |
| `npm run monitor` | Monitor deployments |
| `npm run health` | Check API health |
| `npm run mcp:start` | Start MCP server |
| `npm run all:setup` | Run all setup scripts |
| `npm run all:deploy` | Full deployment |
| `npm run validate` | Validate installation |

---

## 🔐 Security Best Practices

1. **Never commit `.env`** - Already in `.gitignore`
2. **Rotate API keys regularly**
3. **Use environment variables** - Never hardcode secrets
4. **Enable rate limiting** - Already configured
5. **Use HTTPS only** - Enforced in production
6. **Audit dependencies** - Run `npm audit`
7. **Keep Node.js updated** - Check regularly

---

## 📞 Support

- **Documentation**: This file
- **Issues**: https://github.com/InnerAnimal/spartans_command_center/issues
- **Email**: info@meauxbility.org
- **Logs**: `./logs/deployment-*.log`

---

## 📜 License

MIT License - See LICENSE file for details

---

## 🎉 Success!

If you've followed this guide, you now have:

✅ A fully automated deployment system
✅ Production-ready web application
✅ Multi-platform hosting
✅ Google Workspace integration
✅ Cloud storage optimization
✅ MCP server capabilities
✅ Monitoring and health checks
✅ Beautiful glassmorphic design

**Welcome to Spartans Command Center - Where automation meets excellence!**

---

Made with ❤️ by the Meauxbility Team
