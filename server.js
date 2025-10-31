const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Check if running in MCP mode
const MCP_MODE = process.argv.includes('--mcp') || process.env.MCP_MODE === 'true';

if (MCP_MODE) {
  console.log('\n🤖 ════════════════════════════════════════════════════════════');
  console.log('🤖  SPARTANS COMMAND CENTER - MCP MODE ACTIVATED');
  console.log('🤖 ════════════════════════════════════════════════════════════');
  console.log('🤖  AI Agent Control Enabled');
  console.log('🤖  Model Context Protocol Ready');
  console.log('🤖 ════════════════════════════════════════════════════════════\n');
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://*.supabase.co"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// Middleware
app.use(cors());
app.use(compression());

// Raw body parser for webhook signature verification
app.use('/api/webhooks', express.raw({ type: 'application/json' }));

// Regular JSON parser for other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Render health check endpoint
app.get('/healthz', (req, res) => {
  res.json({ ok: true });
});

// Serve main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/donate', (req, res) => {
  res.sendFile(path.join(__dirname, 'donate.html'));
});

app.get('/apply', (req, res) => {
  res.sendFile(path.join(__dirname, 'apply.html'));
});

app.get('/stories', (req, res) => {
  res.sendFile(path.join(__dirname, 'stories.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    message: 'Meauxbility API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mcpMode: MCP_MODE
  });
});

// MCP API Endpoints (AI Agent Control)
if (MCP_MODE) {

  // MCP Capabilities endpoint
  app.get('/api/mcp/capabilities', (req, res) => {
    res.json({
      server: 'spartans-command-center',
      version: '1.0.0',
      capabilities: {
        tools: [
          {
            name: 'deploy-application',
            description: 'Deploy the full application stack to configured platforms',
            inputSchema: {
              type: 'object',
              properties: {
                environment: {
                  type: 'string',
                  enum: ['development', 'staging', 'production'],
                  description: 'Target deployment environment'
                },
                platforms: {
                  type: 'array',
                  items: { type: 'string', enum: ['github-pages', 'render', 'vercel', 'local'] },
                  description: 'Target deployment platforms'
                }
              }
            }
          },
          {
            name: 'health-check',
            description: 'Check health status of all services',
            inputSchema: {
              type: 'object',
              properties: {
                service: {
                  type: 'string',
                  enum: ['all', 'web', 'api', 'database', 'storage'],
                  description: 'Service to check'
                }
              }
            }
          },
          {
            name: 'setup-google-workspace',
            description: 'Configure Google Workspace integration',
            inputSchema: {
              type: 'object',
              properties: {
                services: {
                  type: 'array',
                  items: { type: 'string', enum: ['gmail', 'calendar', 'meet', 'drive'] }
                }
              }
            }
          },
          {
            name: 'optimize-cloud-storage',
            description: 'Optimize Google Cloud Storage buckets',
            inputSchema: {
              type: 'object',
              properties: {
                actions: {
                  type: 'array',
                  items: { type: 'string', enum: ['cleanup', 'compress', 'archive', 'analyze'] }
                }
              }
            }
          },
          {
            name: 'monitor-deployment',
            description: 'Monitor deployment status',
            inputSchema: {
              type: 'object',
              properties: {
                platform: {
                  type: 'string',
                  enum: ['all', 'github', 'render', 'vercel']
                }
              }
            }
          }
        ],
        resources: [
          { uri: 'spartans://api/health', name: 'API Health Status', mimeType: 'application/json' },
          { uri: 'spartans://deployment/status', name: 'Deployment Status', mimeType: 'application/json' },
          { uri: 'spartans://services/google-workspace', name: 'Google Workspace Status', mimeType: 'application/json' }
        ]
      }
    });
  });

  // MCP Tool execution endpoint
  app.post('/api/mcp/tools/execute', async (req, res) => {
    const { tool, arguments: toolArgs } = req.body;

    console.log(`🤖 MCP Tool Execution: ${tool}`, toolArgs);

    try {
      let result;

      switch(tool) {
        case 'deploy-application':
          result = await executeDeployment(toolArgs);
          break;
        case 'health-check':
          result = await executeHealthCheck(toolArgs);
          break;
        case 'setup-google-workspace':
          result = await executeGoogleWorkspaceSetup(toolArgs);
          break;
        case 'optimize-cloud-storage':
          result = await executeCloudOptimization(toolArgs);
          break;
        case 'monitor-deployment':
          result = await executeDeploymentMonitor(toolArgs);
          break;
        default:
          return res.status(400).json({ error: 'Unknown tool', tool });
      }

      res.json({ success: true, result });
    } catch (error) {
      console.error('🤖 MCP Tool Execution Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // MCP Resource access endpoint
  app.get('/api/mcp/resources/:resource', async (req, res) => {
    const { resource } = req.params;

    console.log(`🤖 MCP Resource Access: ${resource}`);

    try {
      let data;

      switch(resource) {
        case 'health':
          data = await getHealthStatus();
          break;
        case 'deployment-status':
          data = await getDeploymentStatus();
          break;
        case 'google-workspace-status':
          data = await getGoogleWorkspaceStatus();
          break;
        default:
          return res.status(404).json({ error: 'Resource not found' });
      }

      res.json(data);
    } catch (error) {
      console.error('🤖 MCP Resource Access Error:', error);
      res.status(500).json({ error: error.message });
    }
  });
}

// MCP Tool Implementation Functions
async function executeDeployment(args) {
  const { environment = 'production', platforms = ['github-pages'] } = args || {};

  console.log(`🚀 Deploying to ${environment} on platforms: ${platforms.join(', ')}`);

  try {
    const { stdout, stderr } = await execPromise('./deploy-all.sh');
    return {
      status: 'success',
      environment,
      platforms,
      output: stdout,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      stderr: error.stderr
    };
  }
}

async function executeHealthCheck(args) {
  const { service = 'all' } = args || {};

  console.log(`🏥 Health check for: ${service}`);

  const health = {
    timestamp: new Date().toISOString(),
    service,
    checks: {}
  };

  if (service === 'all' || service === 'api') {
    health.checks.api = {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      port: PORT
    };
  }

  if (service === 'all' || service === 'web') {
    health.checks.web = {
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  return health;
}

async function executeGoogleWorkspaceSetup(args) {
  const { services = ['gmail', 'calendar'] } = args || {};

  console.log(`☁️ Setting up Google Workspace services: ${services.join(', ')}`);

  try {
    const { stdout } = await execPromise('./setup-google-workspace.sh');
    return {
      status: 'success',
      services,
      output: stdout,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}

async function executeCloudOptimization(args) {
  const { actions = ['analyze'] } = args || {};

  console.log(`☁️ Optimizing cloud storage with actions: ${actions.join(', ')}`);

  try {
    const { stdout } = await execPromise('./optimize-google-cloud.sh');
    return {
      status: 'success',
      actions,
      output: stdout,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}

async function executeDeploymentMonitor(args) {
  const { platform = 'all' } = args || {};

  console.log(`📊 Monitoring deployment for: ${platform}`);

  try {
    const { stdout } = await execPromise('./deploy-monitor.sh');
    return {
      status: 'success',
      platform,
      output: stdout,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}

async function getHealthStatus() {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    mcpMode: MCP_MODE,
    port: PORT
  };
}

async function getDeploymentStatus() {
  return {
    timestamp: new Date().toISOString(),
    platforms: {
      'github-pages': {
        status: 'deployed',
        url: 'https://inneranimal.github.io/spartans_command_center'
      },
      'render': {
        status: 'deployed',
        url: process.env.RENDER_SERVICE_URL || 'https://supabasesupercharge.onrender.com'
      }
    }
  };
}

async function getGoogleWorkspaceStatus() {
  return {
    timestamp: new Date().toISOString(),
    services: {
      gmail: { configured: !!process.env.EMAIL_USER },
      calendar: { configured: !!process.env.GOOGLE_CLOUD_PROJECT },
      meet: { configured: !!process.env.GOOGLE_CLOUD_PROJECT },
      drive: { configured: !!process.env.GOOGLE_CLOUD_PROJECT }
    }
  };
}

// Webhook signature verification middleware
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-signature'] || req.headers['x-hub-signature-256'] || req.headers['x-webhook-signature'];
  const webhookSecret = process.env.WEBHOOK_SIGNING_SECRET;
  
  if (!signature || !webhookSecret) {
    console.log('Webhook verification failed: Missing signature or secret');
    return res.status(400).json({ error: 'Missing signature or secret' });
  }
  
  try {
    const payload = req.body;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');
    
    // Handle different signature formats
    const providedSignature = signature.startsWith('sha256=') 
      ? signature.substring(7) 
      : signature;
    
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    );
    
    if (isValid) {
      console.log('Webhook signature verified: true');
      req.webhookVerified = true;
      next();
    } else {
      console.log('Webhook signature verification failed: Invalid signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Webhook verification error:', error.message);
    return res.status(400).json({ error: 'Signature verification failed' });
  }
};

// Webhook endpoint
app.post('/api/webhooks/meauxbilityorg', verifyWebhookSignature, (req, res) => {
  try {
    const payload = JSON.parse(req.body.toString());
    
    console.log('Webhook received:', {
      verified: req.webhookVerified,
      timestamp: new Date().toISOString(),
      payloadType: payload.type || 'unknown',
      eventId: payload.id || 'no-id'
    });
    
    // Process webhook payload here
    // Add your webhook processing logic
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully',
      verified: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook processing error:', error.message);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Meauxbility server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Render health check: http://localhost:${PORT}/healthz`);
  console.log(`🎣 Webhook endpoint: http://localhost:${PORT}/api/webhooks/meauxbilityorg`);
  console.log(`🔐 Webhook secret configured: ${process.env.WEBHOOK_SIGNING_SECRET ? 'Yes' : 'No'}`);

  if (MCP_MODE) {
    console.log('\n🤖 ════════════════════════════════════════════════════════════');
    console.log('🤖  MCP ENDPOINTS ACTIVE');
    console.log('🤖 ════════════════════════════════════════════════════════════');
    console.log(`🤖  Capabilities: http://localhost:${PORT}/api/mcp/capabilities`);
    console.log(`🤖  Tool Execute: POST http://localhost:${PORT}/api/mcp/tools/execute`);
    console.log(`🤖  Resources:    http://localhost:${PORT}/api/mcp/resources/:resource`);
    console.log('🤖 ════════════════════════════════════════════════════════════');
    console.log('🤖  Available Tools:');
    console.log('🤖    • deploy-application');
    console.log('🤖    • health-check');
    console.log('🤖    • setup-google-workspace');
    console.log('🤖    • optimize-cloud-storage');
    console.log('🤖    • monitor-deployment');
    console.log('🤖 ════════════════════════════════════════════════════════════');
    console.log('🤖  AI agents can now control this server!');
    console.log('🤖 ════════════════════════════════════════════════════════════\n');
  }
});

module.exports = app;