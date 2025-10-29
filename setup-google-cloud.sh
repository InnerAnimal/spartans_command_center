#!/bin/bash

# Meauxbility Google Cloud Quick Setup
# This script helps you set up Google Cloud for Meauxbility

echo "🚀 Meauxbility Google Cloud Setup Assistant"
echo "============================================="

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

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "Google Cloud CLI is not installed."
    echo ""
    echo "Please install it first:"
    echo "macOS: brew install google-cloud-sdk"
    echo "Or visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

print_success "Google Cloud CLI found: $(gcloud version --format='value(Google Cloud SDK)')"

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_warning "Not authenticated with Google Cloud."
    echo ""
    echo "Please run: gcloud auth login"
    echo "Then run this script again."
    exit 1
fi

print_success "Authenticated as: $(gcloud auth list --filter=status:ACTIVE --format='value(account)')"

# Set project
PROJECT_ID="meauxbility-assets"
print_status "Setting project to: $PROJECT_ID"

if ! gcloud config set project $PROJECT_ID 2>/dev/null; then
    print_error "Project $PROJECT_ID not found or not accessible."
    echo ""
    echo "Please:"
    echo "1. Go to https://console.cloud.google.com/"
    echo "2. Create a project named 'meauxbility-assets'"
    echo "3. Enable billing"
    echo "4. Run this script again"
    exit 1
fi

print_success "Project set to: $PROJECT_ID"

# Enable required APIs
print_status "Enabling required APIs..."

apis=(
    "storage-api.googleapis.com"
    "vision.googleapis.com"
    "drive.googleapis.com"
    "cloudfunctions.googleapis.com"
    "cloudbuild.googleapis.com"
)

for api in "${apis[@]}"; do
    print_status "Enabling $api..."
    if gcloud services enable $api --quiet; then
        print_success "✅ $api enabled"
    else
        print_warning "⚠️  Failed to enable $api"
    fi
done

# Create storage buckets
print_status "Creating storage buckets..."

buckets=(
    "meauxbility-raw-assets"
    "meauxbility-processed-images"
    "meauxbility-optimized-web"
    "meauxbility-ai-processed"
)

for bucket in "${buckets[@]}"; do
    print_status "Creating bucket: $bucket"
    if gsutil mb -p $PROJECT_ID -c STANDARD -l us-central1 gs://$bucket/ 2>/dev/null; then
        print_success "✅ Bucket $bucket created"
    else
        print_warning "⚠️  Bucket $bucket might already exist"
    fi
done

# Set up CORS for web bucket
print_status "Setting up CORS for web bucket..."

cat > cors.json << EOF
[
  {
    "origin": ["https://meauxbility.org", "https://inneranimal.github.io"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
EOF

if gsutil cors set cors.json gs://meauxbility-optimized-web/; then
    print_success "✅ CORS configured for web bucket"
else
    print_warning "⚠️  CORS configuration failed"
fi

rm -f cors.json

# Create service account
print_status "Creating service account..."

SERVICE_ACCOUNT_NAME="meauxbility-ai-processor"
SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"

if gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --display-name="Meauxbility AI Asset Processor" \
    --description="Service account for AI-powered asset processing" 2>/dev/null; then
    print_success "✅ Service account created"
else
    print_warning "⚠️  Service account might already exist"
fi

# Grant permissions
print_status "Granting permissions to service account..."

roles=(
    "roles/storage.admin"
    "roles/aiplatform.user"
    "roles/vision.annotator"
)

for role in "${roles[@]}"; do
    if gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
        --role="$role" --quiet; then
        print_success "✅ Granted $role"
    else
        print_warning "⚠️  Failed to grant $role"
    fi
done

# Create and download service account key
print_status "Creating service account key..."

if gcloud iam service-accounts keys create ./meauxbility-ai-key.json \
    --iam-account=$SERVICE_ACCOUNT_EMAIL 2>/dev/null; then
    print_success "✅ Service account key created"
else
    print_warning "⚠️  Service account key might already exist"
fi

# Create environment file
print_status "Creating environment configuration..."

cat > .env << EOF
# Google Cloud Configuration
GCP_PROJECT_ID=$PROJECT_ID
GCP_KEY_FILE=./meauxbility-ai-key.json
GCP_REGION=us-central1

# Storage Buckets
GCP_RAW_BUCKET=meauxbility-raw-assets
GCP_PROCESSED_BUCKET=meauxbility-processed-images
GCP_OPTIMIZED_BUCKET=meauxbility-optimized-web
GCP_AI_BUCKET=meauxbility-ai-processed

# Meauxbility Configuration
MEAUXBILITY_DOMAIN=https://inneranimal.github.io/spartans_command_center
MEAUXBILITY_CDN_URL=https://storage.googleapis.com/meauxbility-optimized-web

# AI Services
GOOGLE_APPLICATION_CREDENTIALS=./meauxbility-ai-key.json
EOF

print_success "✅ Environment file created"

# Update .gitignore
print_status "Updating .gitignore..."

if ! grep -q "meauxbility-ai-key.json" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# Google Cloud Service Account Key" >> .gitignore
    echo "meauxbility-ai-key.json" >> .gitignore
    print_success "✅ Added service account key to .gitignore"
fi

# Test configuration
print_status "Testing configuration..."

if node -e "
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: '$PROJECT_ID',
    keyFilename: './meauxbility-ai-key.json'
});
console.log('✅ Google Cloud connection test passed');
" 2>/dev/null; then
    print_success "✅ Configuration test passed"
else
    print_warning "⚠️  Configuration test failed - you may need to install dependencies"
fi

echo ""
print_success "🎉 Google Cloud setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Install dependencies: npm install"
echo "2. Test the setup: npm run test-gcp"
echo "3. Start the server: npm start"
echo "4. Test Drop & Go: http://localhost:3000/pages/drop-and-go.html"
echo ""
echo "🔗 Your site will be available at:"
echo "   https://inneranimal.github.io/spartans_command_center/"
echo ""
print_success "Built with ❤️ for the Meauxbility community"
