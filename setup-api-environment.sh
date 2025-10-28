#!/bin/bash
# =============================================================================
# MEAUXBILITY API ENVIRONMENT SETUP
# =============================================================================
# This script automates the setup of all API connections and environment
# variables for the Meauxbility project.

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to test API connection
test_api_connection() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    print_status "Testing $name connection..."
    
    if curl -s -f -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        print_success "$name: Connection successful"
        return 0
    else
        print_error "$name: Connection failed"
        return 1
    fi
}

# Function to create environment file
create_env_file() {
    local env_file="$1"
    local template_file="$2"
    
    if [ ! -f "$env_file" ]; then
        if [ -f "$template_file" ]; then
            cp "$template_file" "$env_file"
            print_success "Created $env_file from template"
        else
            print_warning "Template file $template_file not found, creating empty $env_file"
            touch "$env_file"
        fi
    else
        print_warning "$env_file already exists, skipping creation"
    fi
}

# Function to prompt for API key
prompt_for_api_key() {
    local key_name="$1"
    local key_description="$2"
    local key_url="$3"
    
    echo
    print_status "Setting up $key_name"
    echo "Description: $key_description"
    echo "Get your key at: $key_url"
    echo
    read -p "Enter your $key_name (or press Enter to skip): " api_key
    
    if [ -n "$api_key" ]; then
        echo "$key_name=$api_key" >> .env.local
        print_success "$key_name added to environment"
    else
        print_warning "$key_name skipped"
    fi
}

# Main setup function
main() {
    echo "🔧 MEAUXBILITY API ENVIRONMENT SETUP"
    echo "======================================"
    echo
    
    # Check for required tools
    print_status "Checking for required tools..."
    
    if ! command_exists curl; then
        print_error "curl is required but not installed"
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is required but not installed"
        exit 1
    fi
    
    print_success "All required tools are available"
    
    # Create environment files
    print_status "Creating environment files..."
    create_env_file ".env.local" ".env.example"
    create_env_file ".env.production" ".env.example"
    
    # Setup Supabase (already configured)
    print_status "Setting up Supabase configuration..."
    cat >> .env.local << EOF

# =============================================================================
# SUPABASE CONFIGURATION (✅ CONFIGURED)
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_ACCESS_TOKEN=sbp_5ab70061508d790c3de27d4dea25772503b37252
DATABASE_URL=postgresql://postgres:your_password@db.ghiulqoqujsiofsjcrqk.supabase.co:5432/postgres
EOF
    
    # Setup Render (already configured)
    print_status "Setting up Render configuration..."
    cat >> .env.local << EOF

# =============================================================================
# RENDER CONFIGURATION (✅ CONFIGURED)
# =============================================================================
RENDER_API_KEY=rnd_EoAUnT6UJCOoxttLxDoM2iIqfZd2
RENDER_SERVICE_ID=srv-d3tea8ndiees73dfnne0
RENDER_WEBHOOK_SECRET=0abfbaaeb7347360c7cdad469915cb5f
RENDER_SERVICE_URL=https://supabasesupercharge.onrender.com
EOF
    
    # Setup GitHub (already configured)
    print_status "Setting up GitHub configuration..."
    cat >> .env.local << EOF

# =============================================================================
# GITHUB CONFIGURATION (✅ CONFIGURED)
# =============================================================================
GITHUB_TOKEN=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
GITHUB_USERNAME=meauxbility
GITHUB_ORG=meauxbility
EOF
    
    # Setup Stripe (needs verification)
    print_status "Setting up Stripe configuration..."
    cat >> .env.local << EOF

# =============================================================================
# STRIPE CONFIGURATION (⚠️ NEEDS VERIFICATION)
# =============================================================================
STRIPE_SECRET_KEY=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
STRIPE_PUBLISHABLE_KEY=pk_live_51S4R0SRW56Pm3uYI8EKbysm1ok4peVXSD6G17HtFy8BDuG9Carn8Ry7iPVzulMBtdEFcz5pFvXpE04CIgn8PY6WS00aXOqMYEI
STRIPE_WEBHOOK_SECRET=whsec_ac1Pc6tHKMtr0THF6MDBgGmybnQUOI9Uk
STRIPE_CURRENCY=usd
EOF
    
    # Setup Google Services
    print_status "Setting up Google Services configuration..."
    cat >> .env.local << EOF

# =============================================================================
# GOOGLE SERVICES CONFIGURATION (⚠️ NEEDS OPTIMIZATION)
# =============================================================================
GOOGLE_API_KEY=AIzaSyDcrNrKERctNfX5lOToqfJo00hIKuupW90
GOOGLE_CLIENT_ID=688530500057-2a9s2b8db2cogd4tv1vk3sd8jv13qubj.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GA4_MEASUREMENT_ID=G-R43YS1Q7J0
GA4_API_SECRET=vVRFTRQ0RkmZhriLnhhbWQ

# Google Cloud Storage (2TB!)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=meauxbility-assets
GOOGLE_CLOUD_REGION=us-west1
EOF
    
    # Prompt for missing API keys
    echo
    print_status "Setting up additional API keys..."
    
    prompt_for_api_key "ANTHROPIC_API_KEY" "Anthropic Claude AI API Key" "https://console.anthropic.com/"
    prompt_for_api_key "GOOGLE_CLOUD_CREDENTIALS" "Google Cloud Service Account JSON" "https://console.cloud.google.com/"
    prompt_for_api_key "SMTP_PASS" "Gmail App Password for SMTP" "https://myaccount.google.com/apppasswords"
    
    # Test API connections
    echo
    print_status "Testing API connections..."
    
    # Test Supabase
    test_api_connection "Supabase" "https://ghiulqoqujsiofsjcrqk.supabase.co/rest/v1/" "200"
    
    # Test Render
    test_api_connection "Render" "https://supabasesupercharge.onrender.com/healthz" "200"
    
    # Test GitHub
    test_api_connection "GitHub" "https://api.github.com/repos/meauxbility/SUPABASESUPERCHARGE" "200"
    
    # Create additional configuration files
    print_status "Creating additional configuration files..."
    
    # Create Google Cloud Storage optimization script
    cat > optimize-google-cloud.sh << 'EOF'
#!/bin/bash
# Google Cloud Storage Optimization Script

echo "🌐 GOOGLE CLOUD STORAGE OPTIMIZATION"
echo "===================================="

# Check current storage usage
echo "📊 Current storage usage:"
gsutil du -sh gs://your-bucket-name

# Create optimized bucket structure
echo "📁 Creating optimized bucket structure..."
gsutil mb gs://meauxbility-media
gsutil mb gs://meauxbility-documents  
gsutil mb gs://meauxbility-backups
gsutil mb gs://meauxbility-assets

# Set up CDN
echo "🚀 Setting up Cloud CDN..."
gcloud compute url-maps create meauxbility-cdn-map
gcloud compute backend-buckets create meauxbility-backend --gcs-bucket-name=meauxbility-assets

echo "✅ Google Cloud optimization complete!"
EOF
    
    chmod +x optimize-google-cloud.sh
    
    # Create deployment script
    cat > deploy-all.sh << 'EOF'
#!/bin/bash
# One-click deployment script

echo "🚀 DEPLOYING TO ALL ENVIRONMENTS"
echo "================================"

# Deploy to Render
echo "Deploying to Render..."
curl -X POST "https://api.render.com/v1/services/srv-d3tea8ndiees73dfnne0/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json"

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
git push origin main

# Update Supabase
echo "Updating Supabase..."
supabase db push

echo "✅ All deployments complete!"
EOF
    
    chmod +x deploy-all.sh
    
    # Create health check script
    cat > health-check.sh << 'EOF'
#!/bin/bash
# API Health Check Script

echo "🏥 API HEALTH CHECK"
echo "==================="

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Check Supabase
echo "Checking Supabase..."
if curl -f -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/" > /dev/null; then
    echo "✅ Supabase: OK"
else
    echo "❌ Supabase: FAIL"
fi

# Check Render
echo "Checking Render..."
if curl -f -s "$RENDER_SERVICE_URL/healthz" > /dev/null; then
    echo "✅ Render: OK"
else
    echo "❌ Render: FAIL"
fi

# Check GitHub
echo "Checking GitHub..."
if curl -f -s -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/meauxbility/SUPABASESUPERCHARGE" > /dev/null; then
    echo "✅ GitHub: OK"
else
    echo "❌ GitHub: FAIL"
fi

echo "🏥 Health check complete!"
EOF
    
    chmod +x health-check.sh
    
    print_success "Setup complete!"
    echo
    echo "📋 NEXT STEPS:"
    echo "1. Review and update .env.local with your actual API keys"
    echo "2. Run ./optimize-google-cloud.sh to optimize your 2TB storage"
    echo "3. Run ./health-check.sh to verify all connections"
    echo "4. Run ./deploy-all.sh to deploy to all environments"
    echo
    echo "🔐 SECURITY REMINDER:"
    echo "- Never commit .env.local to version control"
    echo "- Keep all API keys secure"
    echo "- Use environment variables in production"
    echo
    print_success "Meauxbility environment setup complete! 🎉"
}

# Run main function
main "$@"
