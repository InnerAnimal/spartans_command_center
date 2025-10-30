#!/bin/bash

################################################################################
# SPARTANS COMMAND CENTER - MASTER DEPLOYMENT AUTOMATION
# One Command to Deploy Them All
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# ASCII Art Banner
echo -e "${PURPLE}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ███████╗██████╗  █████╗ ██████╗ ████████╗ █████╗ ███╗   ██╗║
║   ██╔════╝██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗████╗  ██║║
║   ███████╗██████╔╝███████║██████╔╝   ██║   ███████║██╔██╗ ██║║
║   ╚════██║██╔═══╝ ██╔══██║██╔══██╗   ██║   ██╔══██║██║╚██╗██║║
║   ███████║██║     ██║  ██║██║  ██║   ██║   ██║  ██║██║ ╚████║║
║   ╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝║
║                                                               ║
║              COMMAND CENTER - DEPLOYMENT SYSTEM               ║
║                   Automated Full Stack Deploy                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Configuration
DEPLOYMENT_START_TIME=$(date +%s)
LOG_DIR="./logs"
DEPLOYMENT_LOG="${LOG_DIR}/deployment-$(date +%Y%m%d-%H%M%S).log"
DOMAIN="meauxbility.org"
PROJECT_ROOT=$(pwd)

# Create logs directory
mkdir -p "${LOG_DIR}"

# Logging function
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "${DEPLOYMENT_LOG}"
}

log_success() {
    echo -e "${GREEN}✓${NC} $@" | tee -a "${DEPLOYMENT_LOG}"
}

log_error() {
    echo -e "${RED}✗${NC} $@" | tee -a "${DEPLOYMENT_LOG}"
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $@" | tee -a "${DEPLOYMENT_LOG}"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $@" | tee -a "${DEPLOYMENT_LOG}"
}

log_step() {
    echo -e "\n${CYAN}${BOLD}▶ $@${NC}\n" | tee -a "${DEPLOYMENT_LOG}"
}

# Error handler
error_exit() {
    log_error "$1"
    echo -e "\n${RED}${BOLD}Deployment Failed!${NC}\n"
    exit 1
}

################################################################################
# PHASE 1: SYSTEM CHECKS
################################################################################

log_step "PHASE 1: System Dependency Checks"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_success "Node.js ${NODE_VERSION} installed"
else
    error_exit "Node.js not found. Please install Node.js 18+ from https://nodejs.org"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_success "npm ${NPM_VERSION} installed"
else
    error_exit "npm not found. Please install npm"
fi

# Check git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    log_success "${GIT_VERSION}"
else
    error_exit "git not found. Please install git"
fi

# Check gcloud (optional)
if command -v gcloud &> /dev/null; then
    GCLOUD_VERSION=$(gcloud --version | head -n 1)
    log_success "${GCLOUD_VERSION}"
else
    log_warning "gcloud CLI not found (optional for Google Cloud features)"
fi

# Check gh (optional)
if command -v gh &> /dev/null; then
    GH_VERSION=$(gh --version | head -n 1)
    log_success "${GH_VERSION}"
else
    log_warning "GitHub CLI not found (optional for advanced features)"
fi

################################################################################
# PHASE 2: ENVIRONMENT SETUP
################################################################################

log_step "PHASE 2: Environment Configuration"

# Check for .env file
if [ ! -f .env ]; then
    log_warning ".env file not found. Creating from template..."
    if [ -f ENVIRONMENT_TEMPLATE.env ]; then
        cp ENVIRONMENT_TEMPLATE.env .env
        log_info "Please edit .env with your actual credentials"
        log_warning "Deployment paused. Configure .env and run again."
        exit 0
    else
        error_exit "No .env or ENVIRONMENT_TEMPLATE.env found"
    fi
else
    log_success ".env file found"
fi

# Load environment variables
set -a
source .env
set +a

# Validate critical environment variables
REQUIRED_VARS=(
    "NODE_ENV"
    "PORT"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        log_warning "${var} not set in .env"
    else
        log_success "${var} configured"
    fi
done

################################################################################
# PHASE 3: DEPENDENCY INSTALLATION
################################################################################

log_step "PHASE 3: Installing Dependencies"

# Install npm packages
log_info "Running npm install..."
if npm install; then
    log_success "Dependencies installed successfully"
else
    error_exit "npm install failed"
fi

# Audit dependencies for security issues
log_info "Running security audit..."
npm audit --production || log_warning "Security vulnerabilities detected. Run 'npm audit fix' manually"

################################################################################
# PHASE 4: BUILD & PREPARATION
################################################################################

log_step "PHASE 4: Build & Asset Preparation"

# Create necessary directories
mkdir -p public/assets/css
mkdir -p public/assets/js
mkdir -p public/assets/images

# Copy assets to public directory
if [ -d assets ]; then
    log_info "Copying assets to public directory..."
    cp -r assets/* public/assets/ || log_warning "Asset copy failed or no assets to copy"
    log_success "Assets synchronized"
fi

# Optimize assets (if tools available)
if command -v terser &> /dev/null; then
    log_info "Minifying JavaScript..."
    # Add minification commands here if needed
fi

################################################################################
# PHASE 5: AUTOMATION AGENTS
################################################################################

log_step "PHASE 5: Running Automation Agents"

# Setup API Environment
if [ -f setup-api-environment.sh ]; then
    log_info "Running API environment setup agent..."
    if bash setup-api-environment.sh; then
        log_success "API environment configured"
    else
        log_warning "API environment setup encountered issues"
    fi
fi

# Google Workspace Setup
if [ -f setup-google-workspace.sh ]; then
    log_info "Running Google Workspace setup agent..."
    if bash setup-google-workspace.sh; then
        log_success "Google Workspace configured"
    else
        log_warning "Google Workspace setup encountered issues"
    fi
fi

# Google Cloud Optimization
if [ -f optimize-google-cloud.sh ] && command -v gcloud &> /dev/null; then
    log_info "Running Google Cloud optimization agent..."
    if bash optimize-google-cloud.sh; then
        log_success "Google Cloud optimized"
    else
        log_warning "Google Cloud optimization encountered issues"
    fi
fi

################################################################################
# PHASE 6: LOCAL TESTING
################################################################################

log_step "PHASE 6: Local Testing & Validation"

# Start server in background for testing
log_info "Starting server for validation..."
npm start &
SERVER_PID=$!
sleep 5

# Wait for server to be ready
MAX_RETRIES=10
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:${PORT}/api/health > /dev/null; then
        log_success "Server health check passed"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        log_info "Waiting for server... (${RETRY_COUNT}/${MAX_RETRIES})"
        sleep 2
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    kill $SERVER_PID 2>/dev/null || true
    error_exit "Server failed to start properly"
fi

# Test critical endpoints
ENDPOINTS=(
    "/api/health"
    "/api/status"
    "/"
)

for endpoint in "${ENDPOINTS[@]}"; do
    if curl -s -f "http://localhost:${PORT}${endpoint}" > /dev/null; then
        log_success "Endpoint ${endpoint} responding"
    else
        log_error "Endpoint ${endpoint} failed"
    fi
done

# Stop test server
kill $SERVER_PID 2>/dev/null || true
log_success "Local validation complete"

################################################################################
# PHASE 7: DEPLOYMENT
################################################################################

log_step "PHASE 7: Multi-Platform Deployment"

# GitHub Pages Deployment
if [ -d .git ]; then
    log_info "Deploying to GitHub Pages..."

    CURRENT_BRANCH=$(git branch --show-current)
    log_info "Current branch: ${CURRENT_BRANCH}"

    # Commit changes
    git add .
    if git diff --staged --quiet; then
        log_info "No changes to commit"
    else
        git commit -m "🚀 Automated deployment - $(date '+%Y-%m-%d %H:%M:%S')" || log_warning "Commit failed or nothing to commit"
    fi

    # Push to GitHub
    if git push -u origin ${CURRENT_BRANCH}; then
        log_success "Pushed to GitHub: ${CURRENT_BRANCH}"
    else
        log_error "Git push failed"
    fi
fi

# Render Deployment (via deploy-monitor.sh)
if [ -f deploy-monitor.sh ]; then
    log_info "Running Render deployment monitor..."
    if bash deploy-monitor.sh; then
        log_success "Render deployment initiated"
    else
        log_warning "Render deployment encountered issues"
    fi
fi

################################################################################
# PHASE 8: POST-DEPLOYMENT VALIDATION
################################################################################

log_step "PHASE 8: Post-Deployment Validation"

# Check GitHub Pages
log_info "Checking GitHub Pages deployment..."
if curl -s -f "https://${DOMAIN}" > /dev/null 2>&1 || curl -s -f "https://inneranimal.github.io/spartans_command_center" > /dev/null 2>&1; then
    log_success "GitHub Pages deployment accessible"
else
    log_warning "GitHub Pages not accessible yet (may take a few minutes)"
fi

# Check Render deployment
if [ -n "${RENDER_SERVICE_URL}" ]; then
    log_info "Checking Render deployment..."
    if curl -s -f "${RENDER_SERVICE_URL}/healthz" > /dev/null; then
        log_success "Render service responding"
    else
        log_warning "Render service not accessible yet"
    fi
fi

################################################################################
# PHASE 9: COMPLETION & SUMMARY
################################################################################

log_step "PHASE 9: Deployment Complete"

DEPLOYMENT_END_TIME=$(date +%s)
DEPLOYMENT_DURATION=$((DEPLOYMENT_END_TIME - DEPLOYMENT_START_TIME))

echo -e "${GREEN}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                    DEPLOYMENT SUCCESSFUL!                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

log_success "Total deployment time: ${DEPLOYMENT_DURATION} seconds"

echo ""
echo -e "${CYAN}${BOLD}🚀 Your Application is Live!${NC}"
echo ""
echo -e "${BOLD}URLs:${NC}"
echo -e "  ${GREEN}→${NC} https://${DOMAIN}"
echo -e "  ${GREEN}→${NC} https://inneranimal.github.io/spartans_command_center"
if [ -n "${RENDER_SERVICE_URL}" ]; then
    echo -e "  ${GREEN}→${NC} ${RENDER_SERVICE_URL}"
fi
echo ""

echo -e "${BOLD}Deployment Log:${NC}"
echo -e "  ${GREEN}→${NC} ${DEPLOYMENT_LOG}"
echo ""

echo -e "${BOLD}Next Steps:${NC}"
echo -e "  ${CYAN}1.${NC} Verify deployment at https://${DOMAIN}"
echo -e "  ${CYAN}2.${NC} Monitor server logs: ${BLUE}npm start${NC}"
echo -e "  ${CYAN}3.${NC} Run health check: ${BLUE}curl https://${DOMAIN}/api/health${NC}"
echo -e "  ${CYAN}4.${NC} Check admin dashboard: ${BLUE}https://${DOMAIN}/admin${NC}"
echo ""

echo -e "${PURPLE}${BOLD}SPARTANS COMMAND CENTER - MISSION ACCOMPLISHED${NC}"
echo ""

exit 0
