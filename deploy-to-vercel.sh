#!/bin/bash

################################################################################
# VERCEL AUTOMATED DEPLOYMENT - Non-Interactive
# Deploy all 3 projects to Vercel automatically
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${PURPLE}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          VERCEL AUTOMATED DEPLOYMENT - 3 PROJECTS             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

PROJECT_ROOT=$(pwd)
TEAM_ID="team_eMhajA4eD6XUAGomNi6CnQeZ"

echo -e "${CYAN}Deploying 3 Vercel projects to team: ${TEAM_ID}${NC}"
echo -e "  1. ${GREEN}Meauxbility${NC} (meauxbility.org)"
echo -e "  2. ${GREEN}Inner Animal Media${NC} (inneranimal.com)"
echo -e "  3. ${GREEN}iAutodidact${NC} (iautodidact.app)"
echo ""

# Check if already logged in
echo -e "${BLUE}▶ Checking Vercel authentication...${NC}"
if vercel whoami &>/dev/null; then
    echo -e "${GREEN}✓${NC} Already logged in as: $(vercel whoami)"
else
    echo -e "${YELLOW}⚠${NC} Not logged in to Vercel"
    echo -e "${CYAN}Please run: vercel login${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}▶ Team ID: ${YELLOW}${TEAM_ID}${NC}"
echo ""

################################################################################
# PROJECT 1: MEAUXBILITY
################################################################################

echo -e "${PURPLE}${BOLD}════════════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}${BOLD}  PROJECT 1/3: MEAUXBILITY${NC}"
echo -e "${PURPLE}${BOLD}════════════════════════════════════════════════════════════${NC}"
echo ""

cd "${PROJECT_ROOT}/projects/meauxbility"
echo -e "${CYAN}Current directory:${NC} $(pwd)"
echo ""

echo -e "${YELLOW}Project Details:${NC}"
echo -e "  Name: ${GREEN}meauxbility-org${NC}"
echo -e "  Domain: ${GREEN}meauxbility.org${NC}"
echo -e "  Root: ${GREEN}projects/meauxbility${NC}"
echo ""

echo -e "${BLUE}Linking and deploying Meauxbility...${NC}"
vercel --prod --yes --confirm || {
    echo -e "${YELLOW}First time deployment - need to link project${NC}"
    vercel link --yes
    vercel --prod --yes
}

echo ""
echo -e "${GREEN}✓${NC} Meauxbility deployed!"
echo ""

################################################################################
# PROJECT 2: INNER ANIMAL MEDIA
################################################################################

cd "${PROJECT_ROOT}"

echo -e "${PURPLE}${BOLD}════════════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}${BOLD}  PROJECT 2/3: INNER ANIMAL MEDIA${NC}"
echo -e "${PURPLE}${BOLD}════════════════════════════════════════════════════════════${NC}"
echo ""

cd "${PROJECT_ROOT}/projects/inneranimal"
echo -e "${CYAN}Current directory:${NC} $(pwd)"
echo ""

echo -e "${YELLOW}Project Details:${NC}"
echo -e "  Name: ${GREEN}inneranimal-media${NC}"
echo -e "  Domain: ${GREEN}inneranimal.com${NC}"
echo -e "  Root: ${GREEN}projects/inneranimal${NC}"
echo ""

echo -e "${BLUE}Linking and deploying Inner Animal...${NC}"
vercel --prod --yes --confirm || {
    echo -e "${YELLOW}First time deployment - need to link project${NC}"
    vercel link --yes
    vercel --prod --yes
}

echo ""
echo -e "${GREEN}✓${NC} Inner Animal Media deployed!"
echo ""

################################################################################
# PROJECT 3: iAUTODIDACT
################################################################################

cd "${PROJECT_ROOT}"

echo -e "${PURPLE}${BOLD}════════════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}${BOLD}  PROJECT 3/3: iAUTODIDACT${NC}"
echo -e "${PURPLE}${BOLD}════════════════════════════════════════════════════════════${NC}"
echo ""

cd "${PROJECT_ROOT}/projects/iautodidact"
echo -e "${CYAN}Current directory:${NC} $(pwd)"
echo ""

echo -e "${YELLOW}Project Details:${NC}"
echo -e "  Name: ${GREEN}iautodidact-app${NC}"
echo -e "  Domain: ${GREEN}iautodidact.app${NC}"
echo -e "  Root: ${GREEN}projects/iautodidact${NC}"
echo ""

echo -e "${BLUE}Linking and deploying iAutodidact...${NC}"
vercel --prod --yes --confirm || {
    echo -e "${YELLOW}First time deployment - need to link project${NC}"
    vercel link --yes
    vercel --prod --yes
}

echo ""
echo -e "${GREEN}✓${NC} iAutodidact deployed!"
echo ""

################################################################################
# COMPLETION
################################################################################

cd "${PROJECT_ROOT}"

echo -e "${GREEN}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              ALL 3 PROJECTS DEPLOYED TO VERCEL!               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}${BOLD}🎉 Your Projects Are Live!${NC}"
echo ""
echo -e "${BOLD}Deployed Projects:${NC}"
echo -e "  ${GREEN}1.${NC} Meauxbility → Check Vercel dashboard for URL"
echo -e "  ${GREEN}2.${NC} Inner Animal → Check Vercel dashboard for URL"
echo -e "  ${GREEN}3.${NC} iAutodidact → Check Vercel dashboard for URL"
echo ""
echo -e "${BOLD}Next Steps:${NC}"
echo -e "  1. Go to: ${CYAN}https://vercel.com/${TEAM_ID}${NC}"
echo -e "  2. Configure custom domains for each project"
echo -e "  3. Add additional environment variables if needed"
echo ""
echo -e "${BOLD}To redeploy any project:${NC}"
echo -e "  cd projects/<project-name>"
echo -e "  vercel --prod"
echo ""
echo -e "${PURPLE}${BOLD}MONOREPO DEPLOYMENT COMPLETE!${NC}"
echo ""

exit 0
