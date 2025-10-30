# 🤖 Spartans Command Center - Automation Hub

> **True Monorepo / MCP / Machine Architecture**

This repository is now a **fully automated deployment machine** with AI agent integration, one-command deployment, and MCP server capabilities.

---

## 🎯 What's New

### ✅ Complete Automation System
- **One-command deployment**: `./deploy-all.sh`
- **Validation system**: `./validate-deployment.sh`
- **MCP server integration**: AI-controllable via Claude and other agents
- **Modular npm scripts**: Run any automation task easily

### ✅ Monorepo Structure
```
spartans_command_center/
├── 🚀 Deployment Automation
│   ├── deploy-all.sh              # Master deployment orchestrator
│   ├── validate-deployment.sh     # Deployment validation
│   ├── deploy-monitor.sh          # Platform monitoring
│   └── mcp-server.json            # MCP configuration
│
├── 🤖 Automation Agents
│   ├── setup-google-workspace.sh  # Google integration
│   ├── optimize-google-cloud.sh   # Cloud optimization
│   ├── setup-api-environment.sh   # API configuration
│   └── dev-helper.sh              # Development utilities
│
├── 🌐 Web Application
│   ├── server.js                  # Express.js backend
│   ├── *.html                     # Public pages (9+)
│   ├── admin/                     # Admin dashboard
│   ├── assets/                    # Design system
│   └── public/                    # Static files
│
├── 📋 Documentation
│   ├── QUICKSTART.md              # 5-minute setup
│   ├── DEPLOY.md                  # Complete deployment guide
│   ├── AUTOMATION_README.md       # This file
│   └── *.md                       # Additional docs
│
└── ⚙️ Configuration
    ├── package.json               # Enhanced npm scripts
    ├── mcp-server.json            # MCP integration
    ├── .env                       # Environment (create from template)
    └── ENVIRONMENT_TEMPLATE.env   # Template
```

---

## ⚡ Quick Commands

### Deployment
```bash
# Full automated deployment
./deploy-all.sh

# Quick local deployment
npm run deploy:quick

# Validate deployment system
./validate-deployment.sh

# Deploy via npm
npm run deploy
```

### Setup & Configuration
```bash
# Setup environment
npm run setup:env

# Setup Google Workspace
npm run setup:google

# Run all setup scripts
npm run all:setup
```

### Operations
```bash
# Start server
npm start

# Development mode
npm run dev

# Health check
npm run health

# Monitor deployments
npm run monitor

# Optimize cloud
npm run optimize:cloud
```

### MCP Integration
```bash
# Start as MCP server
npm run mcp:start

# The application becomes AI-controllable
```

---

## 🤖 AI Agent Integration (MCP)

This project is **MCP (Model Context Protocol) ready**, making it a true machine-controllable monorepo.

### Available MCP Tools

1. **deploy-application**
   - Deploy to any platform (GitHub Pages, Render, etc.)
   - AI can trigger deployments automatically

2. **health-check**
   - Check service health across all platforms
   - Monitor API, database, storage

3. **setup-google-workspace**
   - Configure Gmail, Calendar, Meet, Drive
   - AI-assisted Google integration

4. **optimize-cloud-storage**
   - Manage Google Cloud Storage
   - Automated optimization

5. **monitor-deployment**
   - Track deployment status
   - Multi-platform monitoring

### How AI Agents Use This

```javascript
// Claude or other AI can:
await deployApplication({
  environment: "production",
  platforms: ["github-pages", "render"]
});

await healthCheck({ service: "all" });

await setupGoogleWorkspace({
  services: ["gmail", "calendar", "meet"]
});
```

---

## 📦 Enhanced Package.json

All automation is accessible via npm:

```json
{
  "scripts": {
    "deploy": "./deploy-all.sh",           // Full deployment
    "deploy:quick": "npm install && npm start",
    "setup:env": "bash setup-api-environment.sh",
    "setup:google": "bash setup-google-workspace.sh",
    "optimize:cloud": "bash optimize-google-cloud.sh",
    "monitor": "bash deploy-monitor.sh",
    "health": "curl http://localhost:3000/api/health",
    "mcp:start": "node server.js --mcp",
    "all:setup": "npm run setup:env && npm run setup:google",
    "all:deploy": "./deploy-all.sh",
    "validate": "npm audit && npm run health"
  }
}
```

---

## 🎯 Deployment Workflow

### Automated Workflow (Recommended)
```bash
./deploy-all.sh
```

This runs through all 9 phases:
1. System dependency checks
2. Environment configuration
3. Dependency installation
4. Build & asset preparation
5. Automation agents
6. Local testing
7. Multi-platform deployment
8. Post-deployment validation
9. Success reporting

### Manual Workflow
```bash
# 1. Validate system
./validate-deployment.sh

# 2. Install dependencies
npm install

# 3. Setup environment
npm run setup:env

# 4. Setup Google
npm run setup:google

# 5. Deploy
npm run deploy
```

---

## 🔗 Integration Points

### Current Integrations
- ✅ **Supabase**: Database & authentication
- ✅ **Stripe**: Payment processing
- ✅ **Google Workspace**: Gmail, Calendar, Meet, Drive
- ✅ **Google Cloud**: 2TB storage
- ✅ **GitHub Pages**: Static hosting
- ✅ **Render**: Dynamic hosting
- ✅ **Nodemailer**: Email service

### Available for Integration
- **Vercel**: Add deployment target
- **Netlify**: Add deployment target
- **AWS**: Cloud services
- **Azure**: Cloud services
- **Cloudflare**: CDN & edge
- **MCP**: AI agent control

---

## 📊 Monitoring & Validation

### Health Checks
```bash
# Local health check
npm run health
curl http://localhost:3000/api/health

# Production health check
curl https://meauxbility.org/api/health

# Render health check
curl https://supabasesupercharge.onrender.com/healthz
```

### Deployment Validation
```bash
# Pre-deployment validation
./validate-deployment.sh

# Post-deployment validation
curl https://meauxbility.org
curl https://meauxbility.org/api/status
```

### Monitoring
```bash
# Monitor deployments
npm run monitor

# Check logs
cat logs/deployment-*.log
```

---

## 🛠 Available Automation Agents

### 1. deploy-all.sh
**Master deployment orchestrator**
- Checks all dependencies
- Configures environment
- Runs all agents
- Deploys to all platforms
- Validates everything

**Usage:**
```bash
./deploy-all.sh
```

### 2. validate-deployment.sh
**Pre-deployment validation**
- Checks 36 different conditions
- Validates dependencies
- Checks project files
- Verifies git setup
- Reports status

**Usage:**
```bash
./validate-deployment.sh
```

### 3. deploy-monitor.sh
**Multi-platform monitoring**
- Health check automation
- Deployment tracking
- Render integration
- Connection testing

**Usage:**
```bash
npm run monitor
```

### 4. setup-google-workspace.sh
**Google Workspace automation**
- Gmail API setup
- Calendar integration
- Meet configuration
- Drive setup
- Team member setup

**Usage:**
```bash
npm run setup:google
```

### 5. optimize-google-cloud.sh
**Cloud optimization**
- 2TB bucket management
- Storage optimization
- Cost analysis
- gcloud authentication

**Usage:**
```bash
npm run optimize:cloud
```

### 6. setup-api-environment.sh
**API configuration**
- Environment setup
- API key configuration
- Service integration

**Usage:**
```bash
npm run setup:env
```

---

## 🌐 Available URLs

### Production
- **Primary**: https://meauxbility.org
- **GitHub**: https://inneranimal.github.io/spartans_command_center
- **Render**: https://supabasesupercharge.onrender.com

### API Endpoints
- `/api/health` - Health check
- `/api/status` - API status
- `/api/webhooks/meauxbilityorg` - Webhook receiver
- `/healthz` - Render health check

### Pages
- `/` - Homepage
- `/about` - About
- `/apply` - Grant application
- `/donate` - Donations
- `/stories` - Success stories
- `/contact` - Contact
- `/services` - Services
- `/assets` - Tech dashboard
- `/cloud-dashboard` - Cloud services
- `/admin` - Admin dashboard

---

## 🔐 Security & Best Practices

### Automated Security
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Webhook signature verification
- ✅ Environment variable isolation
- ✅ npm audit integration

### Secure Deployment
```bash
# Audit before deploy
npm audit

# Fix vulnerabilities
npm audit fix

# Validate
npm run validate
```

---

## 📚 Documentation Structure

| Document | Purpose |
|----------|---------|
| **QUICKSTART.md** | 5-minute setup guide |
| **DEPLOY.md** | Complete deployment documentation |
| **AUTOMATION_README.md** | This file - automation overview |
| **CLOUD_DASHBOARD_SETUP.md** | Cloud setup guide |
| **README.md** | Project overview |

---

## 🎯 Next Steps

### For Developers
1. Clone repository
2. Run `./validate-deployment.sh`
3. Copy `ENVIRONMENT_TEMPLATE.env` to `.env`
4. Run `./deploy-all.sh`
5. Access at https://meauxbility.org

### For AI Agents
1. Connect via MCP server
2. Use available tools
3. Automate deployments
4. Monitor health
5. Optimize resources

### For Operations
1. Set up monitoring: `npm run monitor`
2. Configure webhooks
3. Set up cloud optimization
4. Schedule health checks
5. Configure backup automation

---

## 🚀 Features

### ✅ Completed
- Full automation system
- MCP server integration
- One-command deployment
- Multi-platform deployment
- Health monitoring
- Google Workspace integration
- Cloud optimization
- Validation system
- Comprehensive documentation

### 🎯 Available for Enhancement
- CI/CD pipeline expansion
- Additional platform integrations
- Advanced monitoring dashboards
- Automated testing suite
- Performance optimization
- Scaling automation
- Backup automation
- Disaster recovery

---

## 📞 Support

- **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md)
- **Full Guide**: See [DEPLOY.md](./DEPLOY.md)
- **Issues**: https://github.com/InnerAnimal/spartans_command_center/issues
- **Email**: info@meauxbility.org

---

## 🎉 Summary

You now have:
- ✅ **True monorepo** with organized structure
- ✅ **MCP integration** for AI control
- ✅ **Full automation** via one command
- ✅ **Multi-platform deployment** (GitHub, Render, etc.)
- ✅ **Complete monitoring** and validation
- ✅ **Google Workspace** integration
- ✅ **Cloud optimization** tools
- ✅ **Beautiful web app** with glassmorphic design
- ✅ **Production-ready** security and performance

**This is a machine - not just a repository.**

Run `./deploy-all.sh` and watch the magic happen.

---

**Made with 🤖 by Spartans Command Center**
**Powered by automation, driven by purpose**
