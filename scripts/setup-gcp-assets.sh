#!/bin/bash

# Meauxbility Google Cloud Asset Management Setup
# This script sets up GCP storage buckets and AI processing pipeline

echo "🚀 Setting up Meauxbility Google Cloud Asset Management..."

# Set project variables
PROJECT_ID="meauxbility-assets"
REGION="us-central1"
BUCKET_PREFIX="meauxbility"

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

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "Google Cloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_warning "Not authenticated with Google Cloud. Please run:"
    echo "gcloud auth login"
    exit 1
fi

# Set the project
print_status "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Create storage buckets for different asset types
print_status "Creating storage buckets..."

# Main asset buckets
buckets=(
    "$BUCKET_PREFIX-raw-assets"
    "$BUCKET_PREFIX-processed-images"
    "$BUCKET_PREFIX-processed-videos"
    "$BUCKET_PREFIX-documents"
    "$BUCKET_PREFIX-ai-processed"
    "$BUCKET_PREFIX-optimized-web"
    "$BUCKET_PREFIX-backup"
)

for bucket in "${buckets[@]}"; do
    print_status "Creating bucket: $bucket"
    gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$bucket/ || print_warning "Bucket $bucket might already exist"
done

# Set up bucket permissions and CORS
print_status "Setting up bucket permissions and CORS..."

# CORS configuration for web access
cat > cors.json << EOF
[
  {
    "origin": ["https://meauxbility.org", "https://meauxbility.com", "http://localhost:3000"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
EOF

# Apply CORS to web-accessible buckets
web_buckets=("$BUCKET_PREFIX-processed-images" "$BUCKET_PREFIX-processed-videos" "$BUCKET_PREFIX-optimized-web")
for bucket in "${web_buckets[@]}"; do
    print_status "Applying CORS to $bucket"
    gsutil cors set cors.json gs://$bucket/
done

# Create folder structure
print_status "Creating folder structure..."

folders=(
    "raw-assets/images/hero"
    "raw-assets/images/gallery"
    "raw-assets/images/team"
    "raw-assets/images/athletes"
    "raw-assets/images/events"
    "raw-assets/videos/promotional"
    "raw-assets/videos/testimonials"
    "raw-assets/videos/training"
    "raw-assets/documents/grants"
    "raw-assets/documents/legal"
    "raw-assets/documents/reports"
    "processed-images/webp"
    "processed-images/avif"
    "processed-images/thumbnails"
    "processed-videos/mp4"
    "processed-videos/webm"
    "ai-processed/analyzed"
    "ai-processed/optimized"
    "ai-processed/metadata"
)

for folder in "${folders[@]}"; do
    print_status "Creating folder: $folder"
    gsutil mkdir -p gs://$BUCKET_PREFIX-raw-assets/$folder/
    gsutil mkdir -p gs://$BUCKET_PREFIX-processed-images/$folder/
    gsutil mkdir -p gs://$BUCKET_PREFIX-processed-videos/$folder/
    gsutil mkdir -p gs://$BUCKET_PREFIX-ai-processed/$folder/
done

# Enable required APIs
print_status "Enabling required Google Cloud APIs..."
apis=(
    "storage-api.googleapis.com"
    "vision.googleapis.com"
    "translate.googleapis.com"
    "documentai.googleapis.com"
    "aiplatform.googleapis.com"
    "cloudfunctions.googleapis.com"
    "cloudbuild.googleapis.com"
)

for api in "${apis[@]}"; do
    print_status "Enabling $api"
    gcloud services enable $api
done

# Create service account for AI processing
print_status "Creating service account for AI processing..."
gcloud iam service-accounts create meauxbility-ai-processor \
    --display-name="Meauxbility AI Asset Processor" \
    --description="Service account for AI-powered asset processing"

# Grant necessary permissions
print_status "Granting permissions to service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:meauxbility-ai-processor@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:meauxbility-ai-processor@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:meauxbility-ai-processor@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/vision.annotator"

# Create and download service account key
print_status "Creating service account key..."
gcloud iam service-accounts keys create ./meauxbility-ai-key.json \
    --iam-account=meauxbility-ai-processor@$PROJECT_ID.iam.gserviceaccount.com

print_success "Google Cloud setup complete!"
print_status "Next steps:"
echo "1. Add the service account key to your environment variables"
echo "2. Run the asset processing pipeline setup"
echo "3. Upload your initial assets for processing"

# Clean up temporary files
rm -f cors.json

print_success "🎉 Meauxbility GCP Asset Management is ready!"
