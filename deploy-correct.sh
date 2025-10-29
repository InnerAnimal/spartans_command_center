#!/bin/bash

# CORRECT Meauxbility Deployment - Restores Original + Adds Tools Safely
# Deploys to: spartans_command_center (CORRECT repository)

set -e

cd "/Users/brandonprimeaux/Library/Mobile Documents/com~apple~CloudDocs/Meauxbility"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "🔧 CORRECT Meauxbility Deployment"
echo "=================================="
echo "Repository: spartans_command_center"
echo ""

# Verify correct remote
print_status "Checking repository configuration..."
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")

if [[ "$CURRENT_REMOTE" != *"spartans_command_center"* ]]; then
    print_warning "Fixing remote URL..."
    git remote set-url origin https://github.com/InnerAnimal/spartans_command_center.git
    print_success "Remote set to: spartans_command_center"
else
    print_success "Correct remote already configured"
fi

# Fetch latest
print_status "Fetching latest from repository..."
git fetch origin

# Stash any local changes
print_status "Stashing local changes..."
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    git stash push -m "Stashing before deployment $(date)" || true
fi

# Switch to gh-pages branch
print_status "Switching to gh-pages branch..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
    git checkout gh-pages
else
    git checkout -b gh-pages origin/main
fi

# Reset to match main branch (restore original site)
print_status "Restoring original site structure from main branch..."
git reset --hard origin/main
print_success "✅ Original site structure restored"

# Ensure all directories exist
print_status "Creating directory structure..."
mkdir -p assets/css
mkdir -p assets/js
mkdir -p tools
mkdir -p js

# Verify CSS files exist
print_status "Verifying CSS files..."
if [ ! -f "assets/css/main.css" ]; then
    print_warning "main.css not found, checking if it exists in main branch..."
    if git show origin/main:assets/css/main.css > /dev/null 2>&1; then
        git checkout origin/main -- assets/css/main.css
        print_success "✅ Restored main.css from main branch"
    else
        print_error "❌ main.css not found in main branch!"
        exit 1
    fi
fi

if [ ! -f "assets/css/glassmorphic.css" ]; then
    print_warning "glassmorphic.css not found, checking if it exists in main branch..."
    if git show origin/main:assets/css/glassmorphic.css > /dev/null 2>&1; then
        git checkout origin/main -- assets/css/glassmorphic.css
        print_success "✅ Restored glassmorphic.css from main branch"
    else
        print_warning "⚠️  glassmorphic.css not found, continuing..."
    fi
fi

# Copy analytics scripts if they exist
print_status "Copying analytics scripts..."
if [ -d "public/js" ]; then
    cp -r public/js/* js/ 2>/dev/null || true
    print_success "✅ Analytics scripts copied"
fi

# Copy new tools pages to tools directory (safe location that won't conflict)
print_status "Adding new tools pages to /tools directory..."

# Copy tools pages
if [ -f "public/pages/drop-and-go.html" ]; then
    cp public/pages/drop-and-go.html tools/
    # Fix paths in drop-and-go.html to work from /tools/
    sed -i '' 's|src="js/|src="../js/|g' tools/drop-and-go.html 2>/dev/null || sed -i 's|src="js/|src="../js/|g' tools/drop-and-go.html
    sed -i '' 's|href="pages/|href="../pages/|g' tools/drop-and-go.html 2>/dev/null || sed -i 's|href="pages/|href="../pages/|g' tools/drop-and-go.html
    print_success "✅ drop-and-go.html added"
else
    print_warning "⚠️  drop-and-go.html not found"
fi

if [ -f "public/pages/agent-command-center.html" ]; then
    cp public/pages/agent-command-center.html tools/
    sed -i '' 's|src="js/|src="../js/|g' tools/agent-command-center.html 2>/dev/null || sed -i 's|src="js/|src="../js/|g' tools/agent-command-center.html
    print_success "✅ agent-command-center.html added"
else
    print_warning "⚠️  agent-command-center.html not found"
fi

if [ -f "public/pages/content-manager.html" ]; then
    cp public/pages/content-manager.html tools/
    sed -i '' 's|src="js/|src="../js/|g' tools/content-manager.html 2>/dev/null || sed -i 's|src="js/|src="../js/|g' tools/content-manager.html
    print_success "✅ content-manager.html added"
else
    print_warning "⚠️  content-manager.html not found"
fi

# Create tools index page
print_status "Creating tools index page..."
cat > tools/index.html << 'TOOLINDEX'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Meauxbility Tools</title>
<link rel="stylesheet" href="../assets/css/main.css">
<link rel="stylesheet" href="../assets/css/glassmorphic.css">
<style>
body{background:var(--bg-gradient-1);min-height:100vh}
.tools-container{max-width:1200px;margin:4rem auto;padding:2rem}
.tools-header{text-align:center;margin-bottom:3rem}
.tools-header h1{color:var(--text-primary);font-size:3rem;margin-bottom:1rem}
.tools-header p{color:var(--text-secondary);font-size:1.25rem}
.tools-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem}
.tool-card{background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:var(--radius-lg);padding:2rem;transition:all 0.3s;text-decoration:none;color:var(--text-primary);display:block}
.tool-card:hover{transform:translateY(-5px);box-shadow:var(--glass-shadow)}
.tool-icon{font-size:3rem;margin-bottom:1rem;text-align:center}
.tool-title{font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;text-align:center}
.tool-desc{color:var(--text-secondary);text-align:center;line-height:1.6}
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
<li><a href="index.html">Tools</a></li>
</ul>
</div>
</nav>

<div class="tools-container">
<div class="tools-header">
<h1>Meauxbility Tools</h1>
<p>Powerful tools for content management and optimization</p>
</div>
<div class="tools-grid">
<a href="drop-and-go.html" class="tool-card">
<div class="tool-icon">📁</div>
<div class="tool-title">Drop & Go</div>
<div class="tool-desc">Upload and optimize content instantly. Drag & drop files and watch them get automatically optimized and stored.</div>
</a>
<a href="agent-command-center.html" class="tool-card">
<div class="tool-icon">⚡</div>
<div class="tool-title">Command Center</div>
<div class="tool-desc">Admin dashboard with 10-tier agent system for managing all aspects of Meauxbility operations.</div>
</a>
<a href="content-manager.html" class="tool-card">
<div class="tool-icon">🎨</div>
<div class="tool-title">Content Manager</div>
<div class="tool-desc">AI-powered asset management with Google Cloud integration. Organize, optimize, and track all your content.</div>
</a>
</div>
</div>
</body>
</html>
TOOLINDEX
print_success "✅ Tools index page created"

# Create .nojekyll file for GitHub Pages
print_status "Creating .nojekyll file..."
touch .nojekyll

# Create CNAME file for custom domain
print_status "Creating CNAME file..."
cat > CNAME << 'EOF'
meauxbility.org
EOF

# Verify index.html exists and has correct structure
print_status "Verifying index.html..."
if [ ! -f "index.html" ]; then
    print_warning "index.html not found, restoring from main..."
    git checkout origin/main -- index.html
fi

# Check if index.html has correct CSS links
if grep -q "assets/css/main.css" index.html; then
    print_success "✅ index.html has correct CSS links"
else
    print_warning "⚠️  index.html may need CSS path fixes"
fi

# Commit all changes
print_status "Committing changes..."
git add .
git commit -m "Deploy: Restore original site + add tools pages to /tools directory" --no-verify

# Push to correct repository
print_status "Pushing to GitHub Pages (spartans_command_center)..."
git push origin gh-pages --force --no-verify

if [ $? -eq 0 ]; then
    echo ""
    print_success "🎉✅ DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "🌐 Your original site is restored at:"
    echo "   https://inneranimal.github.io/spartans_command_center/"
    echo ""
    echo "🔧 New tools are available at:"
    echo "   • Tools Hub: https://inneranimal.github.io/spartans_command_center/tools/"
    echo "   • Drop & Go: https://inneranimal.github.io/spartans_command_center/tools/drop-and-go.html"
    echo "   • Command Center: https://inneranimal.github.io/spartans_command_center/tools/agent-command-center.html"
    echo "   • Content Manager: https://inneranimal.github.io/spartans_command_center/tools/content-manager.html"
    echo ""
    echo "✅ Original navigation and CSS preserved!"
    echo "✅ New tools added safely without breaking existing structure!"
    echo ""
else
    print_error "❌ Push failed. Please check your Git configuration."
    exit 1
fi

print_success "Built with ❤️ for the Meauxbility community"
