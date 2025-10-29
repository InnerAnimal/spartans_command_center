#!/bin/bash

# Meauxbility Drop & Go - Ultra Simple Setup
# This script makes file uploads as easy as drag-and-drop

echo "🚀 Setting up Meauxbility Drop & Go..."

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ first:"
    echo "https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_success "Dependencies installed"

# Install Squoosh CLI globally
print_status "Installing Squoosh CLI for image optimization..."
npm install -g @squoosh/cli

if [ $? -ne 0 ]; then
    print_warning "Failed to install Squoosh CLI globally. You can install it manually later with: npm install -g @squoosh/cli"
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating environment configuration..."
    cat > .env << EOF
# Meauxbility Drop & Go Configuration
NODE_ENV=development
PORT=3000

# Google Cloud Configuration (Optional - will use local processing if not configured)
GCP_PROJECT_ID=meauxbility-assets
GCP_KEY_FILE=./meauxbility-ai-key.json

# Storage Buckets
GCP_RAW_BUCKET=meauxbility-raw-assets
GCP_PROCESSED_BUCKET=meauxbility-processed-images
GCP_OPTIMIZED_BUCKET=meauxbility-optimized-web
GCP_AI_BUCKET=meauxbility-ai-processed

# Meauxbility Configuration
MEAUXBILITY_DOMAIN=http://localhost:3000
MEAUXBILITY_CDN_URL=https://storage.googleapis.com/meauxbility-optimized-web

# AI Services (Optional)
GOOGLE_APPLICATION_CREDENTIALS=./meauxbility-ai-key.json
EOF
    print_success "Environment file created"
else
    print_status "Environment file already exists"
fi

# Create routes directory if it doesn't exist
if [ ! -d routes ]; then
    mkdir routes
    print_status "Created routes directory"
fi

# Test if the server can start
print_status "Testing server startup..."
timeout 10s node server.js > /dev/null 2>&1

if [ $? -eq 0 ] || [ $? -eq 124 ]; then
    print_success "Server test passed"
else
    print_warning "Server test failed, but this might be due to missing GCP credentials"
fi

# Create a simple test script
cat > test-drop-and-go.js << 'EOF'
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Meauxbility Drop & Go...');

// Test if all required files exist
const requiredFiles = [
    'server.js',
    'routes/file-upload.js',
    'public/pages/drop-and-go.html',
    'package.json'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.log(`❌ ${file} missing`);
        allFilesExist = false;
    }
});

if (allFilesExist) {
    console.log('\n🎉 All files are in place!');
    console.log('\n🚀 To start using Drop & Go:');
    console.log('1. Run: npm start');
    console.log('2. Open: http://localhost:3000/pages/drop-and-go');
    console.log('3. Drag and drop your files!');
} else {
    console.log('\n❌ Some files are missing. Please check the setup.');
}
EOF

print_status "Running setup test..."
node test-drop-and-go.js

# Clean up test file
rm -f test-drop-and-go.js

print_success "🎉 Meauxbility Drop & Go setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Start the server: npm start"
echo "2. Open Drop & Go: http://localhost:3000/pages/drop-and-go"
echo "3. Drag and drop your files!"
echo ""
echo "🔧 Optional: Configure Google Cloud for advanced features:"
echo "   - Run: ./scripts/setup-gcp-assets.sh"
echo "   - Add your GCP credentials to .env"
echo ""
echo "💡 Features:"
echo "   ✅ Drag & drop file upload"
echo "   ✅ Automatic image optimization (WebP, AVIF)"
echo "   ✅ AI-powered content analysis"
echo "   ✅ Instant sharing links"
echo "   ✅ Mobile-friendly interface"
echo "   ✅ Real-time processing feedback"
echo ""
print_success "Built with ❤️ for the Meauxbility community"
