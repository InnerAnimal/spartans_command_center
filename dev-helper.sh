#!/bin/bash
# 🚀 Meauxbility Development Helper Script

echo "🚀 Meauxbility Development Helper"
echo "================================="

# Check if we're in the right directory
if [[ ! -f "DEVELOPMENT_GUIDE.md" ]]; then
    echo "❌ Error: Run this script from the meauxbility-dev directory"
    echo "   cd /Users/brandonprimeaux/Downloads/meauxbility-dev"
    exit 1
fi

# Function to show current status
show_status() {
    echo ""
    echo "📊 Current Status:"
    echo "=================="
    echo "Branch: $(git branch --show-current)"
    echo "Status: $(git status --porcelain | wc -l) files changed"
    echo ""
}

# Function to deploy to GitHub Pages
deploy_dev() {
    echo "🚀 Deploying to GitHub Pages..."
    git add .
    git commit -m "Development update - $(date)"
    git push origin development
    echo "✅ Deployed! Check: https://inneranimal.github.io/meauxbility-dev/"
}

# Function to deploy to production
deploy_prod() {
    echo "⚠️  WARNING: This will deploy to PRODUCTION!"
    echo "   Make sure you've tested on GitHub Pages first!"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Deploying to production..."
        cd /Users/brandonprimeaux/Downloads/meauxbility.org
        git checkout main
        git pull origin development
        git push origin main
        echo "✅ Deployed to production!"
    else
        echo "❌ Cancelled"
    fi
}

# Main menu
while true; do
    show_status
    echo "Choose an option:"
    echo "1) Deploy to GitHub Pages (development)"
    echo "2) Deploy to Production (LIVE SITE)"
    echo "3) Show git status"
    echo "4) Show git log"
    echo "5) Exit"
    echo ""
    read -p "Enter choice (1-5): " choice
    
    case $choice in
        1)
            deploy_dev
            ;;
        2)
            deploy_prod
            ;;
        3)
            git status
            ;;
        4)
            git log --oneline -10
            ;;
        5)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done
