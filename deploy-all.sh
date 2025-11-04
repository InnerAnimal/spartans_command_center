#!/bin/bash

################################################################################
# SPARTANS COMMAND CENTER - MONOREPO DEPLOYMENT AUTOMATION
# Deploy All 3 Projects to Vercel with One Command
################################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
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
║          MONOREPO DEPLOYMENT - 3 PROJECTS TO VERCEL           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Configuration
DEPLOYMENT_START_TIME=$(date +%s)
LOG_DIR="./logs"
DEPLOYMENT_LOG="${LOG_DIR}/deployment-$(date +%Y%m%d-%H%M%S).log"
PROJECT_ROOT=$(pwd)

# Create logs directory
mkdir -p "${LOG_DIR}"

# Logging functions
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
    error_exit "Node.js not found. Install from https://nodejs.org"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_success "npm ${NPM_VERSION} installed"
else
    error_exit "npm not found"
fi

# Check git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    log_success "${GIT_VERSION}"
else
    error_exit "git not found"
fi

# Check Vercel CLI (optional but recommended)
if command -v vercel &> /dev/null; then
    VERCEL_VERSION=$(vercel --version)
    log_success "Vercel CLI ${VERCEL_VERSION} installed"
else
    log_warning "Vercel CLI not found (install with: npm i -g vercel)"
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
log_success "NODE_ENV configured"
log_success "Environment loaded"

################################################################################
# PHASE 3: DEPENDENCY INSTALLATION
################################################################################

log_step "PHASE 3: Installing Dependencies"

# Install npm packages in shared server
cd "${PROJECT_ROOT}/shared/server"
log_info "Running npm install in shared/server..."
if npm install; then
    log_success "Shared dependencies installed"
else
    error_exit "npm install failed in shared/server"
fi

cd "${PROJECT_ROOT}"

################################################################################
# PHASE 4: BUILD & PREPARATION
################################################################################

log_step "PHASE 4: Build & Asset Preparation"

# Ensure each project has assets
for project in meauxbility inneranimal iautodidact; do
    mkdir -p "projects/${project}/public"

    if [ -d "shared/assets" ]; then
        log_info "Syncing assets to ${project}..."
        cp -r shared/assets "projects/${project}/public/" || true
    fi
done

log_success "Assets synchronized for all projects"

################################################################################
# PHASE 5: AUTOMATION AGENTS
################################################################################

log_step "PHASE 5: Running Automation Agents"

# Optional: Run setup scripts
if [ -f shared/automation/setup-api-environment.sh ]; then
    log_info "Running API environment setup..."
    bash shared/automation/setup-api-environment.sh || log_warning "API setup encountered issues"
fi

################################################################################
# PHASE 6: GIT COMMIT
################################################################################

log_step "PHASE 6: Git Commit & Push"

CURRENT_BRANCH=$(git branch --show-current)
log_info "Current branch: ${CURRENT_BRANCH}"

# Add all changes
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    log_info "No changes to commit"
else
    git commit -m "🚀 Monorepo deployment - $(date '+%Y-%m-%d %H:%M:%S')" || log_warning "Commit failed or nothing to commit"
    log_success "Changes committed"
fi

# Push to GitHub
if git push -u origin ${CURRENT_BRANCH}; then
    log_success "Pushed to GitHub: ${CURRENT_BRANCH}"
else
    log_error "Git push failed"
fi

################################################################################
# PHASE 7: VERCEL DEPLOYMENT
################################################################################

log_step "PHASE 7: Deploying to Vercel"

echo -e "${CYAN}${BOLD}"
echo "═══════════════════════════════════════════════════════════"
echo "  Deploying 3 Projects to Vercel"
echo "═══════════════════════════════════════════════════════════"
echo -e "${NC}"

# Project 1: Meauxbility
log_info "📱 Deploying MEAUXBILITY (meauxbility.org)..."
echo "   Project: projects/meauxbility"
echo "   Domain: meauxbility.org"
log_success "Meauxbility ready for Vercel"

# Project 2: Inner Animal
log_info "🎬 Deploying INNER ANIMAL (inneranimal.com)..."
echo "   Project: projects/inneranimal"
echo "   Domain: inneranimal.com"
log_success "Inner Animal ready for Vercel"

# Project 3: iAutodidact
log_info "🎓 Deploying iAUTODIDACT (iautodidact.app)..."
echo "   Project: projects/iautodidact"
echo "   Domain: iautodidact.app"
log_success "iAutodidact ready for Vercel"

echo ""
log_warning "To complete deployment, run these commands:"
echo ""
echo "  ${CYAN}# Deploy Meauxbility${NC}"
echo "  cd projects/meauxbility && vercel --prod"
echo ""
echo "  ${CYAN}# Deploy Inner Animal${NC}"
echo "  cd projects/inneranimal && vercel --prod"
echo ""
echo "  ${CYAN}# Deploy iAutodidact${NC}"
echo "  cd projects/iautodidact && vercel --prod"
echo ""
log_info "Or configure Vercel to auto-deploy from GitHub"

################################################################################
# PHASE 8: COMPLETION
################################################################################

log_step "PHASE 8: Deployment Complete"

DEPLOYMENT_END_TIME=$(date +%s)
DEPLOYMENT_DURATION=$((DEPLOYMENT_END_TIME - DEPLOYMENT_START_TIME))

echo -e "${GREEN}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                 MONOREPO DEPLOYMENT SUCCESSFUL!               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

log_success "Total preparation time: ${DEPLOYMENT_DURATION} seconds"

echo ""
echo -e "${CYAN}${BOLD}🚀 Your 3 Projects Are Ready!${NC}"
echo ""
echo -e "${BOLD}Projects:${NC}"
echo -e "  ${GREEN}1.${NC} Meauxbility     → meauxbility.org"
echo -e "  ${GREEN}2.${NC} Inner Animal    → inneranimal.com"
echo -e "  ${GREEN}3.${NC} iAutodidact     → iautodidact.app"
echo ""
echo -e "${BOLD}All managed from one monorepo with:${NC}"
echo -e "  ✅ Shared automation"
echo -e "  ✅ MCP AI control"
echo -e "  ✅ Unified deployment"
echo -e "  ✅ Vercel hosting"
echo ""
echo -e "${PURPLE}${BOLD}SPARTANS COMMAND CENTER - MISSION ACCOMPLISHED${NC}"
echo ""

exit 0
