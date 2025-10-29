# 🚀 Complete Google Cloud Setup for Meauxbility

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Google account with billing enabled
- [ ] Credit card for Google Cloud billing
- [ ] Access to Google Cloud Console
- [ ] Node.js 16+ installed locally

## 🎯 Step 1: Create Google Cloud Project

### 1.1 Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Accept terms if prompted

### 1.2 Create New Project
1. Click the project dropdown at the top
2. Click "New Project"
3. Fill in project details:
   - **Project Name**: `meauxbility-assets`
   - **Organization**: (leave default)
   - **Location**: (leave default)
4. Click "Create"
5. Wait for project to be created
6. Select the new project from dropdown

## 🔧 Step 2: Enable Required APIs

### 2.1 Navigate to APIs & Services
1. Go to "APIs & Services" → "Library"
2. Search for and enable these APIs:

#### Essential APIs
- **Cloud Storage API** - For file storage
- **Vision API** - For AI image analysis
- **Drive API** - For Google Drive integration
- **Cloud Functions API** - For serverless functions
- **Cloud Build API** - For automated builds

### 2.2 Enable APIs
For each API:
1. Click on the API name
2. Click "Enable"
3. Wait for activation

## 🔑 Step 3: Create Service Account

### 3.1 Navigate to IAM
1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"

### 3.2 Configure Service Account
1. **Service Account Name**: `meauxbility-ai-processor`
2. **Service Account ID**: `meauxbility-ai-processor`
3. **Description**: `Service account for Meauxbility AI asset processing`
4. Click "Create and Continue"

### 3.3 Assign Roles
Add these roles to the service account:
- **Storage Admin** - Full access to Cloud Storage
- **AI Platform User** - Access to AI services
- **Vision API User** - Access to Vision API
- **Drive API User** - Access to Google Drive

### 3.4 Create and Download Key
1. Click "Done" to finish role assignment
2. Click on the created service account
3. Go to "Keys" tab
4. Click "Add Key" → "Create New Key"
5. Select "JSON" format
6. Click "Create"
7. **IMPORTANT**: Save the downloaded JSON file as `meauxbility-ai-key.json`

## 🗄️ Step 4: Set Up Cloud Storage Buckets

### 4.1 Navigate to Cloud Storage
1. Go to "Cloud Storage" → "Buckets"
2. Click "Create Bucket"

### 4.2 Create Required Buckets
Create these buckets (one at a time):

#### Bucket 1: Raw Assets
- **Name**: `meauxbility-raw-assets`
- **Location**: `us-central1`
- **Storage Class**: `Standard`
- **Access Control**: `Uniform`

#### Bucket 2: Processed Images
- **Name**: `meauxbility-processed-images`
- **Location**: `us-central1`
- **Storage Class**: `Standard`
- **Access Control**: `Uniform`

#### Bucket 3: Optimized Web Assets
- **Name**: `meauxbility-optimized-web`
- **Location**: `us-central1`
- **Storage Class**: `Standard`
- **Access Control**: `Uniform`

#### Bucket 4: AI Processed
- **Name**: `meauxbility-ai-processed`
- **Location**: `us-central1`
- **Storage Class**: `Standard`
- **Access Control**: `Uniform`

### 4.3 Configure CORS for Web Buckets
For buckets that will serve web content (`meauxbility-optimized-web`):

1. Click on the bucket name
2. Go to "Permissions" tab
3. Click "Add Principal"
4. Add these CORS settings:

```json
[
  {
    "origin": ["https://meauxbility.org", "https://inneranimal.github.io"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
```

## 🔐 Step 5: Configure Authentication

### 5.1 Set Up Application Default Credentials
1. Install Google Cloud CLI:
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

2. Authenticate:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

### 5.2 Set Project
```bash
gcloud config set project meauxbility-assets
```

## 📁 Step 6: Set Up Google Drive Integration

### 6.1 Enable Drive API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Library"
3. Search for "Google Drive API"
4. Click "Enable"

### 6.2 Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - **App Name**: `Meauxbility Asset Manager`
   - **User Support Email**: Your email
   - **Developer Contact**: Your email
4. Add scopes:
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/drive.metadata`

## ⚙️ Step 7: Configure Local Environment

### 7.1 Create Environment File
Create `.env` file in your project root:

```bash
# Google Cloud Configuration
GCP_PROJECT_ID=meauxbility-assets
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
```

### 7.2 Place Service Account Key
1. Move `meauxbility-ai-key.json` to your project root
2. **IMPORTANT**: Add `meauxbility-ai-key.json` to `.gitignore`

## 🧪 Step 8: Test Configuration

### 8.1 Install Dependencies
```bash
npm install
```

### 8.2 Test Google Cloud Connection
```bash
npm run test-gcp
```

### 8.3 Test Drive Integration
```bash
npm run drive-folders
```

### 8.4 Test File Upload
```bash
npm run optimize ./test-assets
```

## 🚀 Step 9: Deploy and Test

### 9.1 Start Local Server
```bash
npm start
```

### 9.2 Test Drop & Go
1. Open: `http://localhost:3000/pages/drop-and-go.html`
2. Upload a test image
3. Verify processing works

### 9.3 Deploy to GitHub Pages
```bash
npm run deploy
```

## 🔍 Troubleshooting Common Issues

### Issue 1: "Permission Denied" Errors
**Solution**: Ensure service account has correct roles
```bash
gcloud projects add-iam-policy-binding meauxbility-assets \
    --member="serviceAccount:meauxbility-ai-processor@meauxbility-assets.iam.gserviceaccount.com" \
    --role="roles/storage.admin"
```

### Issue 2: "API Not Enabled" Errors
**Solution**: Enable required APIs in Google Cloud Console

### Issue 3: "Invalid Credentials" Errors
**Solution**: Check service account key file path and format

### Issue 4: "Bucket Not Found" Errors
**Solution**: Verify bucket names match exactly in `.env` file

## 💰 Cost Optimization Tips

### 1. Use Appropriate Storage Classes
- **Standard**: For frequently accessed files
- **Nearline**: For files accessed monthly
- **Coldline**: For files accessed quarterly
- **Archive**: For long-term storage

### 2. Set Up Lifecycle Policies
1. Go to Cloud Storage → Buckets
2. Click on bucket → "Lifecycle"
3. Add rules to automatically delete old files

### 3. Monitor Usage
1. Go to "Billing" → "Reports"
2. Set up budget alerts
3. Monitor API usage

## 📊 Expected Costs (Monthly)

For typical Meauxbility usage:
- **Cloud Storage**: $5-20 (depending on file volume)
- **Vision API**: $1-5 (per 1,000 images analyzed)
- **Drive API**: Free (within quotas)
- **Cloud Functions**: $1-10 (if using serverless)

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] All APIs enabled
- [ ] Service account created with proper roles
- [ ] Storage buckets created
- [ ] CORS configured for web buckets
- [ ] Service account key downloaded
- [ ] Environment variables configured
- [ ] Local authentication working
- [ ] Test upload successful
- [ ] GitHub Pages deployment working

## 🎉 You're Ready!

Once all steps are complete, your Meauxbility system will have:
- ✅ AI-powered content analysis
- ✅ Automatic image optimization
- ✅ Google Drive integration
- ✅ Cloud storage with CDN
- ✅ Scalable file processing
- ✅ Real-time analytics

**Next Steps**: Test the live site and start uploading your Meauxbility assets!
