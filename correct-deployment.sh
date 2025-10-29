#!/bin/bash

# CORRECT Meauxbility Deployment - Fixes Everything
set -e

echo "🔧 FIXING Meauxbility Deployment"

cd "/Users/brandonprimeaux/Library/Mobile Documents/com~apple~CloudDocs/Meauxbility"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Stash any local changes
print_status "Stashing local changes..."
git stash

# Switch to gh-pages
print_status "Switching to gh-pages branch..."
git checkout gh-pages || git checkout -b gh-pages

# Reset to match main branch structure
print_status "Restoring original site structure from main..."
git reset --hard origin/main

# Ensure all directories exist
mkdir -p assets/css
mkdir -p assets/js  
mkdir -p tools

# Copy CSS files from main branch
print_status "Copying CSS files..."
git checkout origin/main -- assets/css/main.css 2>/dev/null || print_error "main.css missing"
git checkout origin/main -- assets/css/glassmorphic.css 2>/dev/null || print_error "glassmorphic.css missing"

# Copy new pages to tools directory (safe location)
print_status "Adding new tools pages..."
cp public/pages/drop-and-go.html tools/ 2>/dev/null || echo "drop-and-go.html not found"
cp public/pages/agent-command-center.html tools/ 2>/dev/null || echo "agent-command-center.html not found"
cp public/pages/content-manager.html tools/ 2>/dev/null || echo "content-manager.html not found"

# Create tools index
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
body{background:var(--bg-gradient-1)}
.tools-container{max-width:1200px;margin:4rem auto;padding:2rem}
.tools-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem}
.tool-card{background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:var(--radius-lg);padding:2rem;transition:all 0.3s;text-decoration:none;color:var(--text-primary)}
.tool-card:hover{transform:translateY(-5px);box-shadow:var(--glass-shadow)}
.tool-icon{font-size:3rem;margin-bottom:1rem}
.tool-title{font-size:1.5rem;font-weight:700;margin-bottom:0.5rem}
.tool-desc{color:var(--text-secondary)}
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

<div class="tools-container">
<h1 style="color:var(--text-primary);margin-bottom:2rem">Meauxbility Tools</h1>
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
</div>
</body>
</html>
TOOLINDEX

# Create .nojekyll
touch .nojekyll

# Commit
print_status "Committing fixes..."
git add .
git commit -m "Fix deployment: Restore original structure + add tools pages" --no-verify

# Push
print_status "Pushing to GitHub..."
git push origin gh-pages --force --no-verify

print_success "✅ Fixed! Site structure restored with new tools."
echo ""
echo "🌐 Original site: https://inneranimal.github.io/spartans_command_center/"
echo "🔧 New tools: https://inneranimal.github.io/spartans_command_center/tools/"
echo ""
print_success "Original navigation and CSS preserved!"
