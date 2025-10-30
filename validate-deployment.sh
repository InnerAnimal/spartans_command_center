#!/bin/bash

################################################################################
# SPARTANS COMMAND CENTER - Deployment Validation Script
# Validates that the deployment system is ready to use
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${CYAN}${BOLD}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     SPARTANS COMMAND CENTER - DEPLOYMENT VALIDATION       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Validation counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    WARNING_CHECKS=$((WARNING_CHECKS + 1))
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
}

section() {
    echo -e "\n${BLUE}${BOLD}▶ $1${NC}"
}

################################################################################
# CHECK 1: Required System Dependencies
################################################################################

section "Checking System Dependencies"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check_pass "Node.js installed: ${NODE_VERSION}"
else
    check_fail "Node.js not found - Install from https://nodejs.org"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_pass "npm installed: ${NPM_VERSION}"
else
    check_fail "npm not found"
fi

if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    check_pass "${GIT_VERSION}"
else
    check_fail "git not found - Install from https://git-scm.com"
fi

################################################################################
# CHECK 2: Optional Dependencies
################################################################################

section "Checking Optional Dependencies"

if command -v gcloud &> /dev/null; then
    check_pass "gcloud CLI installed (for Google Cloud features)"
else
    check_warn "gcloud CLI not found (optional - needed for cloud optimization)"
fi

if command -v gh &> /dev/null; then
    check_pass "GitHub CLI installed"
else
    check_warn "GitHub CLI not found (optional)"
fi

if command -v curl &> /dev/null; then
    check_pass "curl installed"
else
    check_fail "curl not found"
fi

################################################################################
# CHECK 3: Project Files
################################################################################

section "Checking Project Files"

PROJECT_FILES=(
    "package.json"
    "server.js"
    "deploy-all.sh"
    "mcp-server.json"
    "DEPLOY.md"
    "QUICKSTART.md"
)

for file in "${PROJECT_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "Found: $file"
    else
        check_fail "Missing: $file"
    fi
done

################################################################################
# CHECK 4: Automation Scripts
################################################################################

section "Checking Automation Scripts"

AUTOMATION_SCRIPTS=(
    "deploy-all.sh"
    "deploy-monitor.sh"
    "setup-google-workspace.sh"
    "optimize-google-cloud.sh"
    "setup-api-environment.sh"
)

for script in "${AUTOMATION_SCRIPTS[@]}"; do
    if [ -f "$script" ] && [ -x "$script" ]; then
        check_pass "Executable: $script"
    elif [ -f "$script" ]; then
        check_warn "Not executable: $script (run: chmod +x $script)"
    else
        check_fail "Missing: $script"
    fi
done

################################################################################
# CHECK 5: Environment Configuration
################################################################################

section "Checking Environment Configuration"

if [ -f ".env" ]; then
    check_pass ".env file exists"

    # Check for critical variables
    if grep -q "NODE_ENV" .env; then
        check_pass "NODE_ENV configured"
    else
        check_warn "NODE_ENV not set in .env"
    fi

    if grep -q "PORT" .env; then
        check_pass "PORT configured"
    else
        check_warn "PORT not set in .env"
    fi
else
    check_warn ".env file not found (copy from ENVIRONMENT_TEMPLATE.env)"
fi

if [ -f "ENVIRONMENT_TEMPLATE.env" ]; then
    check_pass "ENVIRONMENT_TEMPLATE.env exists"
else
    check_fail "ENVIRONMENT_TEMPLATE.env missing"
fi

################################################################################
# CHECK 6: Node Modules
################################################################################

section "Checking Dependencies"

if [ -d "node_modules" ]; then
    check_pass "node_modules directory exists"
else
    check_warn "node_modules not found (run: npm install)"
fi

if [ -f "package-lock.json" ]; then
    check_pass "package-lock.json exists"
else
    check_warn "package-lock.json not found (will be created on npm install)"
fi

################################################################################
# CHECK 7: Git Repository
################################################################################

section "Checking Git Repository"

if [ -d ".git" ]; then
    check_pass "Git repository initialized"

    CURRENT_BRANCH=$(git branch --show-current)
    check_pass "Current branch: ${CURRENT_BRANCH}"

    if git remote -v | grep -q "origin"; then
        REMOTE_URL=$(git remote get-url origin)
        check_pass "Remote origin configured: ${REMOTE_URL}"
    else
        check_warn "No remote origin configured"
    fi
else
    check_fail "Not a git repository (run: git init)"
fi

################################################################################
# CHECK 8: Directory Structure
################################################################################

section "Checking Directory Structure"

REQUIRED_DIRS=(
    "public"
    "assets"
    "admin"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        check_pass "Directory exists: $dir"
    else
        check_warn "Directory missing: $dir (may be created during deployment)"
    fi
done

################################################################################
# CHECK 9: Web Pages
################################################################################

section "Checking Web Pages"

WEB_PAGES=(
    "index.html"
    "about.html"
    "contact.html"
    "donate.html"
)

for page in "${WEB_PAGES[@]}"; do
    if [ -f "$page" ] || [ -f "public/$page" ]; then
        check_pass "Found: $page"
    else
        check_fail "Missing: $page"
    fi
done

################################################################################
# CHECK 10: NPM Scripts
################################################################################

section "Checking NPM Scripts"

NPM_SCRIPTS=(
    "start"
    "dev"
    "deploy"
    "setup:google"
    "monitor"
)

for script in "${NPM_SCRIPTS[@]}"; do
    if grep -q "\"$script\"" package.json; then
        check_pass "NPM script configured: $script"
    else
        check_warn "NPM script missing: $script"
    fi
done

################################################################################
# FINAL SUMMARY
################################################################################

echo -e "\n${CYAN}${BOLD}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}${BOLD}║                    VALIDATION SUMMARY                     ║${NC}"
echo -e "${CYAN}${BOLD}╚═══════════════════════════════════════════════════════════╝${NC}\n"

echo -e "Total Checks:    ${BOLD}${TOTAL_CHECKS}${NC}"
echo -e "${GREEN}Passed:          ${PASSED_CHECKS}${NC}"
echo -e "${YELLOW}Warnings:        ${WARNING_CHECKS}${NC}"
echo -e "${RED}Failed:          ${FAILED_CHECKS}${NC}"

echo ""

# Determine overall status
if [ $FAILED_CHECKS -eq 0 ] && [ $WARNING_CHECKS -eq 0 ]; then
    echo -e "${GREEN}${BOLD}✓ ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}Your deployment system is ready to use.${NC}"
    echo -e "\n${CYAN}Run: ${BOLD}./deploy-all.sh${NC} to deploy\n"
    exit 0
elif [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${YELLOW}${BOLD}⚠ CHECKS PASSED WITH WARNINGS${NC}"
    echo -e "${YELLOW}Your deployment system should work, but check warnings above.${NC}"
    echo -e "\n${CYAN}Run: ${BOLD}./deploy-all.sh${NC} to deploy\n"
    exit 0
else
    echo -e "${RED}${BOLD}✗ VALIDATION FAILED${NC}"
    echo -e "${RED}Please fix the failed checks above before deploying.${NC}"
    echo ""
    echo -e "${CYAN}Common fixes:${NC}"
    echo -e "  ${BLUE}•${NC} Install Node.js: https://nodejs.org"
    echo -e "  ${BLUE}•${NC} Install Git: https://git-scm.com"
    echo -e "  ${BLUE}•${NC} Run: ${BOLD}npm install${NC}"
    echo -e "  ${BLUE}•${NC} Run: ${BOLD}cp ENVIRONMENT_TEMPLATE.env .env${NC}"
    echo -e "  ${BLUE}•${NC} Run: ${BOLD}chmod +x *.sh${NC}"
    echo ""
    exit 1
fi
