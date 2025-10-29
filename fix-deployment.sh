#!/bin/bash

# PROPER Meauxbility Deployment - Preserves Original Structure
echo "🔧 PROPER Meauxbility Deployment - Preserving Original Structure"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Ensure we're in the right directory
cd "/Users/brandonprimeaux/Library/Mobile Documents/com~apple~CloudDocs/Meauxbility"

# Check if git is clean
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes. Stashing them..."
    git stash
fi

# Switch to gh-pages branch
print_status "Switching to gh-pages branch..."
git checkout gh-pages 2>/dev/null || git checkout -b gh-pages

# Get the original main branch content
print_status "Preserving original site structure..."

# Copy essential files from main branch
git checkout main -- assets/css/main.css 2>/dev/null || print_warning "main.css not found"
git checkout main -- assets/css/glassmorphic.css 2>/dev/null || print_warning "glassmorphic.css not found"
git checkout main -- index.html 2>/dev/null || print_warning "index.html not found"

# Ensure assets directory exists
mkdir -p assets/css
mkdir -p assets/js
mkdir -p tools

# Copy CSS files if they exist locally
if [ -f "css/global.css" ]; then
    cp css/global.css assets/css/ 2>/dev/null || true
fi
if [ -f "css/header.css" ]; then
    cp css/header.css assets/css/ 2>/dev/null || true
fi
if [ -f "css/footer.css" ]; then
    cp css/footer.css assets/css/ 2>/dev/null || true
fi

# Copy new pages to tools directory (won't conflict with existing structure)
print_status "Adding new tools pages..."
mkdir -p tools

# Copy new pages
cp -r public/pages/* tools/ 2>/dev/null || true

# Create navigation links for new tools
cat > tools/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5.0,user-scalable=yes">
<title>Meauxbility Tools</title>
<link rel="stylesheet" href="../assets/css/main.css">
<link rel="stylesheet" href="../assets/css/glassmorphic.css">
<style>
.tools-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem;padding:2rem;max-width:1200px;margin:0 auto}
.tool-card{background:rgba(255,255,255,0.1);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.18);border-radius:20px;padding:2rem;transition:all 0.3s;text-decoration:none;color:inherit}
.tool-card:hover{transform:translateY(-5px);box-shadow:0 20px 60px rgba(31,38,135,0.37)}
.tool-icon{font-size:3rem;margin-bottom:1rem}
.tool-title{font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;color:#ffffff}
.tool-desc{color:rgba(255,255,255,0.7)}
</style>
</head>
<body>
<nav class="nav-glass">
<div class="nav-container">
<a href="../index.html" class="logo">MEAUXBILITY</a>
<ul class="nav-menu">
<li><a href="../index.html">Home</a></li>
<li><a href="../about.html">About</a></li>
<li><a href="../apply.html">Apply</a></li>
<li><a href="../donate.html">Donate</a></li>
</ul>
</div>
</nav>

<div class="tools-grid">
<a href="drop-and-go.html" class="tool-card">
<div class="tool-icon">📁</div>
<div class="tool-title">Drop & Go</div>
<div class="tool-desc">Upload and optimize content instantly</div>
</a>

<a href="agent-command-center.html" class="tool-card">
<div class="tool-icon">⚡</div>
<div class="tool-title">Command Center</div>
<div class="tool-desc">Admin dashboard and agent system</div>
</a>

<a href="content-manager.html" class="tool-card">
<div class="tool-icon">🎨</div>
<div class="tool-title">Content Manager</div>
<div class="tool-desc">Manage assets and media</div>
</a>
</div>
</body>
</html>
EOF

# Copy new pages to tools
cp public/pages/drop-and-go.html tools/ 2>/dev/null || true
cp public/pages/agent-command-center.html tools/ 2>/dev/null || true
cp public/pages/content-manager.html tools/ 2>/dev/null || true

# Update index.html to link to tools
print_status "Updating navigation..."

# Create .nojekyll file
touch .nojekyll

# Commit and push
print_status "Committing changes..."
git add .
git commit -m "Add new tools pages while preserving original structure" --no-verify

print_status "Pushing to GitHub Pages..."
git push origin gh-pages --force --no-verify

if [ $? -eq 0 ]; then
    print_success "🎉 Deployment successful!"
    echo ""
    echo "🌐 Your site is now live at:"
    echo "   https://inneranimal.github.io/spartans_command_center/"
    echo ""
    echo "🔗 New Tools Available:"
    echo "   • Drop & Go: https://inneranimal.github.io/spartans_command_center/tools/drop-and-go.html"
    echo "   • Command Center: https://inneranimal.github.io/spartans_command_center/tools/agent-command-center.html"
    echo "   • Content Manager: https://inneranimal.github.io/spartans_command_center/tools/content-manager.html"
    echo ""
    echo "✅ Original navigation and styling preserved!"
else
    print_error "Deployment failed"
    exit 1
fi

print_success "Built with ❤️ for the Meauxbility community"
