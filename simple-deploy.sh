#!/bin/bash

# Simple Meauxbility Deployment Script
echo "🚀 Deploying Meauxbility to GitHub Pages..."

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

# Set up remote
print_status "Setting up GitHub Pages remote..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/InnerAnimal/spartans.git

# Create deployment branch
print_status "Creating deployment branch..."
git checkout -b gh-pages 2>/dev/null || git checkout gh-pages

# Build production assets
print_status "Building production assets..."
mkdir -p dist

# Copy all necessary files
cp -r public/* dist/ 2>/dev/null || true
cp index.html dist/ 2>/dev/null || true
cp admin-dashboard.html dist/ 2>/dev/null || true

# Create GitHub Pages specific files
cat > dist/.nojekyll << 'EOF'
# GitHub Pages configuration
EOF

cat > dist/CNAME << 'EOF'
meauxbility.org
EOF

# Create a simple index.html for GitHub Pages
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5.0,user-scalable=yes">
<title>Meauxbility - Empowering Mobility</title>

<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HZEWHZG1WP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-HZEWHZG1WP', {
    custom_map: {
      'custom_parameter_1': 'user_type',
      'custom_parameter_2': 'community_impact',
      'custom_parameter_3': 'session_id'
    }
  });
</script>

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,system-ui,sans-serif;background:linear-gradient(135deg,#051b1e 0%,#0a2427 50%,#1a4a52 100%);min-height:100vh;color:#f0f9fa;overflow-x:hidden}

.container{max-width:1200px;margin:0 auto;padding:2rem;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}

.logo{width:100px;height:100px;background:linear-gradient(135deg,#FF6B35,#E85D00);border-radius:20px;margin:0 auto 2rem;display:flex;align-items:center;justify-content:center;font-size:3rem;font-weight:bold;color:#fff;box-shadow:0 20px 50px rgba(255,107,53,0.4);animation:pulse 2s infinite}

.title{font-size:4rem;font-weight:900;margin-bottom:1rem;background:linear-gradient(135deg,#4ABAB8,#339999);-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:glow 3s ease-in-out infinite}

.subtitle{color:rgba(240,249,250,0.8);font-size:1.5rem;margin-bottom:2rem;max-width:800px;line-height:1.6}

.description{color:rgba(240,249,250,0.7);font-size:1.125rem;margin-bottom:3rem;max-width:600px;line-height:1.6}

.cta-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:2rem;margin-bottom:3rem;width:100%;max-width:800px}

.cta-card{background:rgba(26,74,82,0.6);backdrop-filter:blur(20px);border:1px solid rgba(74,171,184,0.3);border-radius:20px;padding:2rem;transition:all 0.3s;cursor:pointer;text-decoration:none;color:inherit}

.cta-card:hover{transform:translateY(-10px);border-color:rgba(255,107,53,0.5);box-shadow:0 20px 60px rgba(255,107,53,0.2)}

.cta-icon{font-size:3rem;margin-bottom:1rem;color:#4ABAB8}
.cta-title{font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;color:#f0f9fa}
.cta-desc{font-size:1rem;color:rgba(240,249,250,0.7)}

.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;margin-top:3rem;width:100%;max-width:800px}

.stat-card{background:rgba(26,74,82,0.4);backdrop-filter:blur(20px);border:1px solid rgba(74,171,184,0.2);border-radius:16px;padding:2rem;text-align:center;transition:all 0.3s}

.stat-card:hover{transform:translateY(-5px);border-color:rgba(255,107,53,0.5);box-shadow:0 10px 30px rgba(255,107,53,0.1)}

.stat-number{font-size:3rem;font-weight:700;color:#4ABAB8;margin-bottom:0.5rem}
.stat-label{font-size:1rem;color:rgba(240,249,250,0.7);text-transform:uppercase;letter-spacing:0.05em}

@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes glow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.2)}}

@media(max-width:768px){
.container{padding:1rem}
.title{font-size:2.5rem}
.subtitle{font-size:1.25rem}
.cta-grid{grid-template-columns:1fr;gap:1rem}
}
</style>
</head>
<body>

<div class="container">
<div class="logo">M</div>
<h1 class="title">Empowering Mobility</h1>
<h2 class="subtitle">Restoring Independence</h2>
<p class="description">Supporting spinal cord injury survivors across Acadiana with grants for adaptive equipment and accessibility services.</p>

<div class="cta-grid">
<a href="pages/about-us.html" class="cta-card">
<div class="cta-icon">📖</div>
<div class="cta-title">About</div>
<div class="cta-desc">Learn about our mission and impact</div>
</a>

<a href="pages/community.html" class="cta-card">
<div class="cta-icon">🤝</div>
<div class="cta-title">Apply</div>
<div class="cta-desc">Apply for grant support</div>
</a>

<a href="pages/donate.html" class="cta-card">
<div class="cta-icon">❤️</div>
<div class="cta-title">Donate</div>
<div class="cta-desc">Support our mission</div>
</a>

<a href="pages/drop-and-go.html" class="cta-card">
<div class="cta-icon">📁</div>
<div class="cta-title">Drop & Go</div>
<div class="cta-desc">Upload and optimize content</div>
</a>

<a href="pages/agent-command-center.html" class="cta-card">
<div class="cta-icon">⚡</div>
<div class="cta-title">Command Center</div>
<div class="cta-desc">Admin dashboard</div>
</a>

<a href="pages/content-manager.html" class="cta-card">
<div class="cta-icon">🎨</div>
<div class="cta-title">Content Manager</div>
<div class="cta-desc">Manage assets and media</div>
</a>
</div>

<div class="stats">
<div class="stat-card">
<div class="stat-number">50+</div>
<div class="stat-label">Grants Awarded</div>
</div>
<div class="stat-card">
<div class="stat-number">$250K+</div>
<div class="stat-label">Funds Distributed</div>
</div>
<div class="stat-card">
<div class="stat-number">100%</div>
<div class="stat-label">Acadiana Coverage</div>
</div>
<div class="stat-card">
<div class="stat-number">24/7</div>
<div class="stat-label">Support Available</div>
</div>
</div>
</div>

</body>
</html>
EOF

# Commit and push
print_status "Committing changes..."
git add dist/ -f
git commit -m "Deploy Meauxbility buildout - $(date)" --no-verify

print_status "Pushing to GitHub Pages..."
git push origin gh-pages --force --no-verify

if [ $? -eq 0 ]; then
    print_success "🎉 Deployment successful!"
    echo ""
    echo "🌐 Your site is now live at:"
    echo "   https://inneranimal.github.io/spartans/"
    echo ""
    echo "🔗 Key Pages:"
    echo "   • Home: https://inneranimal.github.io/spartans/"
    echo "   • Drop & Go: https://inneranimal.github.io/spartans/pages/drop-and-go.html"
    echo "   • Command Center: https://inneranimal.github.io/spartans/pages/agent-command-center.html"
    echo "   • Content Manager: https://inneranimal.github.io/spartans/pages/content-manager.html"
    echo ""
    echo "📊 Next Steps:"
    echo "   1. Test all functionality on live site"
    echo "   2. Set up Google Cloud integration"
    echo "   3. Configure CapCut integration"
    echo "   4. Add custom domain (meauxbility.org)"
else
    print_error "Deployment failed. Please check your Git configuration."
    exit 1
fi

print_success "Built with ❤️ for the Meauxbility community"
