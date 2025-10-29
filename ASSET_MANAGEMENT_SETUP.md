# Meauxbility Asset Management System

## 🚀 Complete Setup Guide

This system provides AI-powered asset optimization, Google Cloud Storage integration, and intelligent content management for your Meauxbility assets.

### 📋 Prerequisites

1. **Google Cloud Platform Account**
   - Create a new project: `meauxbility-assets`
   - Enable billing
   - Install Google Cloud CLI

2. **Node.js Environment**
   - Node.js 16+ installed
   - npm or yarn package manager

3. **Required Tools**
   - Google Cloud CLI (`gcloud`)
   - Squoosh CLI for image optimization

### 🔧 Installation Steps

#### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Squoosh CLI globally
npm install -g @squoosh/cli

# Install FFmpeg for video processing
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

#### 2. Google Cloud Setup

```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your project
gcloud config set project meauxbility-assets

# Run the automated setup script
chmod +x scripts/setup-gcp-assets.sh
./scripts/setup-gcp-assets.sh
```

#### 3. Environment Configuration

Create a `.env` file in your project root:

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

# AI Services
GOOGLE_APPLICATION_CREDENTIALS=./meauxbility-ai-key.json

# Meauxbility Configuration
MEAUXBILITY_DOMAIN=meauxbility.org
MEAUXBILITY_CDN_URL=https://storage.googleapis.com/meauxbility-optimized-web
```

### 🎯 Usage

#### Basic Asset Optimization

```bash
# Optimize a single directory
npm run optimize ./path/to/your/assets

# Watch mode for continuous processing
npm run optimize:watch ./path/to/your/assets

# Upload assets to Google Cloud
npm run upload-assets ./path/to/your/assets
```

#### Content Management Dashboard

1. Start your server: `node server.js`
2. Navigate to: `http://localhost:3000/pages/content-manager`
3. Upload and manage your assets through the web interface

#### AI-Powered Analysis

```bash
# Analyze content with AI
npm run analyze-content ./path/to/your/assets

# Test Google Cloud connection
npm run test-gcp
```

### 🏗️ System Architecture

#### Storage Structure

```
Google Cloud Storage Buckets:
├── meauxbility-raw-assets/          # Original uploads
│   ├── images/
│   │   ├── hero/
│   │   ├── gallery/
│   │   ├── team/
│   │   ├── athletes/
│   │   └── events/
│   ├── videos/
│   └── documents/
├── meauxbility-processed-images/    # AI-processed images
├── meauxbility-optimized-web/       # Web-optimized assets
├── meauxbility-ai-processed/        # AI analysis results
└── meauxbility-backup/              # Backup storage
```

#### AI Processing Pipeline

1. **Upload**: Assets uploaded to raw storage
2. **Analysis**: Google Vision API analyzes content
3. **Categorization**: AI suggests categories and tags
4. **Optimization**: Squoosh optimizes for web delivery
5. **Storage**: Optimized assets stored in CDN-ready buckets
6. **Metadata**: AI-generated metadata stored for search

### 🎨 Features

#### Asset Optimization
- **Format Conversion**: WebP, AVIF, MP4, WebM
- **Size Optimization**: Multiple resolutions for responsive design
- **Quality Tuning**: AI-suggested quality settings
- **Compression**: Lossless and lossy compression options

#### AI Analysis
- **Content Recognition**: Automatic labeling and categorization
- **Text Detection**: OCR for document processing
- **Face Detection**: Privacy-aware face recognition
- **Object Detection**: Sports equipment, wheelchairs, etc.

#### Content Management
- **Drag & Drop Upload**: Intuitive file upload interface
- **Category Filtering**: Organize by content type
- **Search & Filter**: Find assets by AI-generated tags
- **Batch Operations**: Process multiple assets simultaneously

#### Integration Features
- **CDN Ready**: Direct Google Cloud Storage URLs
- **Analytics**: Track asset usage and performance
- **API Access**: RESTful API for programmatic access
- **Webhook Support**: Real-time processing notifications

### 🔧 Advanced Configuration

#### Custom Optimization Profiles

Edit `scripts/asset-optimizer.js` to customize:

```javascript
this.optimizationProfiles = {
    hero: { quality: 90, width: 1920, height: 1080, format: 'webp' },
    gallery: { quality: 85, width: 1200, height: 800, format: 'webp' },
    thumbnail: { quality: 80, width: 400, height: 300, format: 'webp' },
    mobile: { quality: 75, width: 768, height: 512, format: 'webp' },
    avif: { quality: 90, width: 1920, height: 1080, format: 'avif' }
};
```

#### AI Analysis Customization

Modify AI analysis parameters:

```javascript
// In analyzeAssets method
const [result] = await this.vision.labelDetection(file, {
    maxResults: 10,
    minScore: 0.7
});
```

### 📊 Monitoring & Analytics

#### Asset Performance Tracking

The system automatically tracks:
- Upload success rates
- Processing times
- Storage usage
- CDN performance
- AI analysis accuracy

#### Dashboard Metrics

Access real-time metrics at `/pages/content-manager`:
- Total assets processed
- Optimization savings
- AI analysis results
- Storage utilization

### 🚨 Troubleshooting

#### Common Issues

1. **Google Cloud Authentication**
   ```bash
   gcloud auth application-default login
   export GOOGLE_APPLICATION_CREDENTIALS=./meauxbility-ai-key.json
   ```

2. **Squoosh Installation Issues**
   ```bash
   npm uninstall -g @squoosh/cli
   npm install -g @squoosh/cli@latest
   ```

3. **Permission Errors**
   ```bash
   chmod +x scripts/*.sh
   sudo chown -R $USER:$USER .
   ```

#### Debug Mode

Enable debug logging:

```bash
DEBUG=meauxbility:* npm run optimize
```

### 🔒 Security Best Practices

1. **Service Account Keys**: Store securely, never commit to git
2. **Bucket Permissions**: Use least-privilege access
3. **CORS Configuration**: Restrict to your domains only
4. **API Keys**: Rotate regularly
5. **Access Logs**: Monitor for suspicious activity

### 📈 Performance Optimization

#### Recommended Settings

- **Image Quality**: 85% for web, 95% for print
- **Video Bitrate**: 2Mbps for web, 8Mbps for high-quality
- **Batch Size**: Process 10-20 assets at a time
- **Concurrent Uploads**: Limit to 5 simultaneous uploads

#### CDN Configuration

Configure your CDN to cache optimized assets:
- **Cache Duration**: 1 year for optimized assets
- **Compression**: Enable gzip/brotli
- **Headers**: Set appropriate cache-control headers

### 🎉 Getting Started

1. **Run the setup script**: `./scripts/setup-gcp-assets.sh`
2. **Install dependencies**: `npm install`
3. **Configure environment**: Copy `.env.example` to `.env`
4. **Upload your first assets**: Use the web interface
5. **Monitor processing**: Check the dashboard for results

### 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review Google Cloud documentation
- Contact the Meauxbility development team

---

**Built with ❤️ for the Meauxbility community**

*Empowering spinal cord injury athletes through technology, hard work, willpower, inspiration, community, and faith.*
