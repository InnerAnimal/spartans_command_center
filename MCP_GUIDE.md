# 🤖 MCP Server - AI Agent Control Guide

> **Control your entire deployment infrastructure through AI agents**

Your Spartans Command Center now runs as a fully functional **MCP (Model Context Protocol) server**, allowing AI agents like Claude to control your deployment, monitoring, and cloud infrastructure.

---

## 🚀 Quick Start

### Start the MCP Server
```bash
npm run mcp:start
```

The server will start on port 3000 with MCP mode enabled, showing:
```
🤖 ════════════════════════════════════════════════════════════
🤖  SPARTANS COMMAND CENTER - MCP MODE ACTIVATED
🤖 ════════════════════════════════════════════════════════════
🤖  AI Agent Control Enabled
🤖  Model Context Protocol Ready
🤖 ════════════════════════════════════════════════════════════
```

---

## 🎯 What Can AI Agents Do?

AI agents (like Claude) can now:
- ✅ **Deploy your application** to any platform
- ✅ **Check health status** of all services
- ✅ **Setup Google Workspace** integrations
- ✅ **Optimize cloud storage** resources
- ✅ **Monitor deployments** across platforms

---

## 📡 MCP Endpoints

### 1. Capabilities Endpoint
**Get all available tools and resources**

```bash
GET http://localhost:3000/api/mcp/capabilities
```

**Response:**
```json
{
  "server": "spartans-command-center",
  "version": "1.0.0",
  "capabilities": {
    "tools": [...],
    "resources": [...]
  }
}
```

### 2. Tool Execution Endpoint
**Execute AI-controlled tools**

```bash
POST http://localhost:3000/api/mcp/tools/execute
Content-Type: application/json

{
  "tool": "health-check",
  "arguments": {
    "service": "all"
  }
}
```

### 3. Resource Access Endpoint
**Access system resources**

```bash
GET http://localhost:3000/api/mcp/resources/:resource
```

Available resources:
- `health` - System health status
- `deployment-status` - Deployment information
- `google-workspace-status` - Google Workspace configuration

---

## 🛠 Available Tools

### 1. deploy-application

**Deploy your full application stack**

```bash
curl -X POST http://localhost:3000/api/mcp/tools/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "deploy-application",
    "arguments": {
      "environment": "production",
      "platforms": ["github-pages", "render"]
    }
  }'
```

**Parameters:**
- `environment`: `development` | `staging` | `production`
- `platforms`: Array of `github-pages`, `render`, `vercel`, `local`

**What it does:**
- Runs `./deploy-all.sh`
- Deploys to specified platforms
- Returns deployment status and output

---

### 2. health-check

**Check health status of services**

```bash
curl -X POST http://localhost:3000/api/mcp/tools/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "health-check",
    "arguments": {
      "service": "all"
    }
  }'
```

**Parameters:**
- `service`: `all` | `web` | `api` | `database` | `storage`

**Returns:**
```json
{
  "success": true,
  "result": {
    "timestamp": "2025-10-31T01:39:29.465Z",
    "service": "all",
    "checks": {
      "api": {
        "status": "healthy",
        "uptime": 42.44,
        "memory": {...},
        "port": 3000
      },
      "web": {
        "status": "healthy",
        "environment": "development"
      }
    }
  }
}
```

---

### 3. setup-google-workspace

**Configure Google Workspace integration**

```bash
curl -X POST http://localhost:3000/api/mcp/tools/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "setup-google-workspace",
    "arguments": {
      "services": ["gmail", "calendar", "meet", "drive"]
    }
  }'
```

**Parameters:**
- `services`: Array of `gmail`, `calendar`, `meet`, `drive`

**What it does:**
- Runs `./setup-google-workspace.sh`
- Configures specified Google services
- Returns setup status

---

### 4. optimize-cloud-storage

**Optimize Google Cloud Storage**

```bash
curl -X POST http://localhost:3000/api/mcp/tools/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "optimize-cloud-storage",
    "arguments": {
      "actions": ["analyze", "cleanup"]
    }
  }'
```

**Parameters:**
- `actions`: Array of `cleanup`, `compress`, `archive`, `analyze`

**What it does:**
- Runs `./optimize-google-cloud.sh`
- Performs specified optimization actions
- Returns optimization results

---

### 5. monitor-deployment

**Monitor deployment status**

```bash
curl -X POST http://localhost:3000/api/mcp/tools/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "monitor-deployment",
    "arguments": {
      "platform": "all"
    }
  }'
```

**Parameters:**
- `platform`: `all` | `github` | `render` | `vercel`

**What it does:**
- Runs `./deploy-monitor.sh`
- Monitors specified platforms
- Returns monitoring data

---

## 📊 Resource Access

### Get Health Status
```bash
curl http://localhost:3000/api/mcp/resources/health
```

**Returns:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-31T01:39:16.018Z",
  "uptime": 28.997,
  "memory": {...},
  "environment": "development",
  "mcpMode": true,
  "port": 3000
}
```

### Get Deployment Status
```bash
curl http://localhost:3000/api/mcp/resources/deployment-status
```

**Returns:**
```json
{
  "timestamp": "2025-10-31T01:39:42.946Z",
  "platforms": {
    "github-pages": {
      "status": "deployed",
      "url": "https://inneranimal.github.io/spartans_command_center"
    },
    "render": {
      "status": "deployed",
      "url": "https://supabasesupercharge.onrender.com"
    }
  }
}
```

### Get Google Workspace Status
```bash
curl http://localhost:3000/api/mcp/resources/google-workspace-status
```

**Returns:**
```json
{
  "timestamp": "2025-10-31T...",
  "services": {
    "gmail": { "configured": true },
    "calendar": { "configured": true },
    "meet": { "configured": true },
    "drive": { "configured": true }
  }
}
```

---

## 🔌 Connecting AI Agents

### Claude Desktop Integration

1. **Add to Claude Desktop MCP config** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "spartans-command-center": {
      "command": "node",
      "args": ["/path/to/spartans_command_center/server.js", "--mcp"],
      "env": {
        "NODE_ENV": "production",
        "MCP_MODE": "true"
      }
    }
  }
}
```

2. **Restart Claude Desktop**

3. **Claude can now control your deployment!**

Ask Claude things like:
- "Deploy my application to production"
- "Check the health of all services"
- "Setup Google Workspace integration"
- "Optimize my cloud storage"

---

## 🧪 Testing MCP Locally

### Test Capabilities
```bash
curl http://localhost:3000/api/mcp/capabilities | jq .
```

### Test Health Check Tool
```bash
curl -X POST http://localhost:3000/api/mcp/tools/execute \
  -H "Content-Type: application/json" \
  -d '{"tool": "health-check", "arguments": {"service": "all"}}' | jq .
```

### Test Health Resource
```bash
curl http://localhost:3000/api/mcp/resources/health | jq .
```

### Test Deployment Status
```bash
curl http://localhost:3000/api/mcp/resources/deployment-status | jq .
```

---

## 🎯 Real-World AI Agent Examples

### Example 1: AI-Triggered Deployment

**User tells Claude:** "Deploy the application to production on GitHub Pages and Render"

**Claude executes:**
```json
POST /api/mcp/tools/execute
{
  "tool": "deploy-application",
  "arguments": {
    "environment": "production",
    "platforms": ["github-pages", "render"]
  }
}
```

**Result:** Full deployment runs automatically, returns status

---

### Example 2: AI Health Monitoring

**User tells Claude:** "Check if all services are healthy"

**Claude executes:**
```json
POST /api/mcp/tools/execute
{
  "tool": "health-check",
  "arguments": {
    "service": "all"
  }
}
```

**Result:** Complete health report across all services

---

### Example 3: AI-Managed Google Workspace

**User tells Claude:** "Setup Gmail and Calendar integration"

**Claude executes:**
```json
POST /api/mcp/tools/execute
{
  "tool": "setup-google-workspace",
  "arguments": {
    "services": ["gmail", "calendar"]
  }
}
```

**Result:** Google Workspace services configured automatically

---

## 🔐 Security Considerations

### MCP Mode Security

1. **Local Only**: By default, MCP endpoints are only accessible on localhost
2. **Production**: Add authentication middleware for production use
3. **Rate Limiting**: Already configured (100 req/15min)
4. **CORS**: Enabled, configure allowed origins
5. **Environment Variables**: Keep secrets in `.env`

### Recommended Production Setup

```javascript
// Add to server.js before MCP endpoints
const mcpAuth = (req, res, next) => {
  const apiKey = req.headers['x-mcp-api-key'];
  if (apiKey !== process.env.MCP_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Apply to MCP routes
app.use('/api/mcp', mcpAuth);
```

---

## 📊 Monitoring MCP Activity

### Server Logs
The MCP server logs all activity:

```
🤖 MCP Tool Execution: health-check { service: 'all' }
🏥 Health check for: all

🤖 MCP Resource Access: deployment-status
```

### Custom Logging
Add logging to track AI agent activity:

```javascript
// Track all MCP requests
app.use('/api/mcp', (req, res, next) => {
  console.log(`🤖 MCP Request: ${req.method} ${req.path}`);
  console.log(`🤖 From: ${req.ip}`);
  console.log(`🤖 Body:`, req.body);
  next();
});
```

---

## 🎉 Benefits of MCP Integration

### For Developers
- ✅ Control infrastructure via natural language
- ✅ Automate repetitive deployment tasks
- ✅ AI-assisted monitoring and optimization
- ✅ Faster debugging with AI health checks

### For Operations
- ✅ 24/7 AI-powered monitoring
- ✅ Automated incident response
- ✅ Intelligent resource optimization
- ✅ Predictive maintenance

### For Teams
- ✅ Anyone can deploy with natural language
- ✅ Reduced deployment complexity
- ✅ Consistent automated processes
- ✅ Self-documenting infrastructure

---

## 🚀 Next Steps

1. **Start the MCP server**: `npm run mcp:start`
2. **Test locally**: Use curl commands above
3. **Connect Claude**: Add to Claude Desktop config
4. **Deploy with AI**: Tell Claude to deploy your app
5. **Monitor with AI**: Ask Claude about system health

---

## 📚 Additional Resources

- **Main Docs**: [DEPLOY.md](./DEPLOY.md)
- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)
- **Automation**: [AUTOMATION_README.md](./AUTOMATION_README.md)
- **MCP Protocol**: https://modelcontextprotocol.io

---

## 🆘 Troubleshooting

### MCP Server Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Use different port
PORT=4000 npm run mcp:start
```

### AI Agent Can't Connect
1. Check server is running: `curl http://localhost:3000/api/status`
2. Verify MCP mode: Response should show `"mcpMode": true`
3. Check Claude Desktop config path
4. Restart Claude Desktop

### Tool Execution Fails
1. Check script permissions: `ls -l *.sh`
2. Verify scripts are executable: `chmod +x *.sh`
3. Check server logs for errors
4. Test script manually: `./deploy-all.sh`

---

**🤖 Your infrastructure is now AI-controllable!**

Welcome to the future of deployment automation.
