const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const sharp = require('sharp');
const { execSync } = require('child_process');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|pdf|doc|docx|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('File type not supported'));
        }
    }
});

// Initialize Google Cloud services
const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID || 'meauxbility-assets',
    keyFilename: process.env.GCP_KEY_FILE || './meauxbility-ai-key.json'
});

const vision = new ImageAnnotatorClient({
    projectId: process.env.GCP_PROJECT_ID || 'meauxbility-assets',
    keyFilename: process.env.GCP_KEY_FILE || './meauxbility-ai-key.json'
});

const buckets = {
    raw: 'meauxbility-raw-assets',
    optimized: 'meauxbility-optimized-web',
    ai: 'meauxbility-ai-processed'
};

class MeauxbilityFileProcessor {
    constructor() {
        this.supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        this.supportedVideoTypes = ['video/mp4', 'video/webm'];
        this.supportedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    }

    async processFile(file, originalName) {
        const startTime = Date.now();
        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const fileExtension = path.extname(originalName).toLowerCase();
        const baseName = path.basename(originalName, fileExtension);
        
        try {
            // 1. Upload original to raw bucket
            const originalUrl = await this.uploadOriginal(file, fileId, originalName);
            
            // 2. Analyze with AI
            const aiAnalysis = await this.analyzeWithAI(file, originalName);
            
            // 3. Optimize based on file type
            let optimizedResults = [];
            if (this.supportedImageTypes.includes(file.mimetype)) {
                optimizedResults = await this.optimizeImage(file, fileId, baseName, fileExtension);
            } else if (this.supportedVideoTypes.includes(file.mimetype)) {
                optimizedResults = await this.optimizeVideo(file, fileId, baseName, fileExtension);
            } else {
                // For documents, just store as-is
                optimizedResults = [await this.storeDocument(file, fileId, originalName)];
            }
            
            // 4. Generate share URL
            const shareUrl = `${process.env.MEAUXBILITY_DOMAIN || 'https://meauxbility.org'}/shared/${fileId}`;
            
            // 5. Store metadata
            const metadata = {
                fileId,
                originalName,
                originalSize: file.length,
                optimizedSize: optimizedResults.reduce((sum, result) => sum + result.size, 0),
                category: this.detectCategory(file.mimetype),
                aiLabels: aiAnalysis.labels,
                aiConfidence: aiAnalysis.confidence,
                processedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                shareUrl,
                optimizedFiles: optimizedResults
            };
            
            await this.storeMetadata(metadata);
            
            return {
                success: true,
                fileId,
                originalName,
                originalSize: file.length,
                optimizedSize: metadata.optimizedSize,
                shareUrl,
                category: metadata.category,
                aiLabels: metadata.aiLabels,
                processingTime: metadata.processingTime,
                optimizedFiles: optimizedResults
            };
            
        } catch (error) {
            console.error('File processing error:', error);
            return {
                success: false,
                error: error.message,
                originalName
            };
        }
    }

    async uploadOriginal(file, fileId, originalName) {
        const fileName = `originals/${fileId}/${originalName}`;
        const bucket = storage.bucket(buckets.raw);
        const fileRef = bucket.file(fileName);
        
        await fileRef.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    uploadedAt: new Date().toISOString(),
                    originalSize: file.length.toString()
                }
            }
        });
        
        return `https://storage.googleapis.com/${buckets.raw}/${fileName}`;
    }

    async analyzeWithAI(file, originalName) {
        try {
            if (this.supportedImageTypes.includes(file.mimetype)) {
                const [result] = await vision.labelDetection({
                    image: { content: file.buffer }
                });
                
                const labels = (result.labelAnnotations || []).map(label => ({
                    description: label.description,
                    score: label.score
                }));
                
                return {
                    labels: labels.map(l => l.description),
                    confidence: labels.length > 0 ? labels[0].score : 0,
                    category: this.suggestCategory(labels.map(l => l.description))
                };
            } else {
                // For non-images, return basic analysis
                return {
                    labels: [this.detectCategory(file.mimetype)],
                    confidence: 0.8,
                    category: this.detectCategory(file.mimetype)
                };
            }
        } catch (error) {
            console.warn('AI analysis failed:', error.message);
            return {
                labels: ['file'],
                confidence: 0.5,
                category: this.detectCategory(file.mimetype)
            };
        }
    }

    async optimizeImage(file, fileId, baseName, extension) {
        const results = [];
        const bucket = storage.bucket(buckets.optimized);
        
        // WebP optimization
        try {
            const webpBuffer = await sharp(file.buffer)
                .webp({ quality: 85 })
                .toBuffer();
            
            const webpFileName = `images/${fileId}/${baseName}.webp`;
            const webpFile = bucket.file(webpFileName);
            
            await webpFile.save(webpBuffer, {
                metadata: {
                    contentType: 'image/webp',
                    metadata: {
                        format: 'webp',
                        quality: '85',
                        optimizedAt: new Date().toISOString()
                    }
                }
            });
            
            results.push({
                format: 'webp',
                size: webpBuffer.length,
                url: `https://storage.googleapis.com/${buckets.optimized}/${webpFileName}`,
                fileName: webpFileName
            });
        } catch (error) {
            console.warn('WebP optimization failed:', error.message);
        }
        
        // AVIF optimization (if supported)
        try {
            const avifBuffer = await sharp(file.buffer)
                .avif({ quality: 90 })
                .toBuffer();
            
            const avifFileName = `images/${fileId}/${baseName}.avif`;
            const avifFile = bucket.file(avifFileName);
            
            await avifFile.save(avifBuffer, {
                metadata: {
                    contentType: 'image/avif',
                    metadata: {
                        format: 'avif',
                        quality: '90',
                        optimizedAt: new Date().toISOString()
                    }
                }
            });
            
            results.push({
                format: 'avif',
                size: avifBuffer.length,
                url: `https://storage.googleapis.com/${buckets.optimized}/${avifFileName}`,
                fileName: avifFileName
            });
        } catch (error) {
            console.warn('AVIF optimization failed:', error.message);
        }
        
        // Multiple sizes for responsive design
        const sizes = [
            { name: 'desktop', width: 1920, height: 1080 },
            { name: 'tablet', width: 1200, height: 800 },
            { name: 'mobile', width: 768, height: 512 },
            { name: 'thumbnail', width: 400, height: 300 }
        ];
        
        for (const size of sizes) {
            try {
                const resizedBuffer = await sharp(file.buffer)
                    .resize(size.width, size.height, { fit: 'inside', withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toBuffer();
                
                const resizedFileName = `images/${fileId}/${baseName}-${size.name}.webp`;
                const resizedFile = bucket.file(resizedFileName);
                
                await resizedFile.save(resizedBuffer, {
                    metadata: {
                        contentType: 'image/webp',
                        metadata: {
                            format: 'webp',
                            size: size.name,
                            dimensions: `${size.width}x${size.height}`,
                            optimizedAt: new Date().toISOString()
                        }
                    }
                });
                
                results.push({
                    format: 'webp',
                    size: resizedBuffer.length,
                    url: `https://storage.googleapis.com/${buckets.optimized}/${resizedFileName}`,
                    fileName: resizedFileName,
                    variant: size.name,
                    dimensions: { width: size.width, height: size.height }
                });
            } catch (error) {
                console.warn(`Resize optimization failed for ${size.name}:`, error.message);
            }
        }
        
        return results;
    }

    async optimizeVideo(file, fileId, baseName, extension) {
        const results = [];
        const bucket = storage.bucket(buckets.optimized);
        
        // For now, just store the original video
        // In production, you'd use FFmpeg to optimize
        const videoFileName = `videos/${fileId}/${baseName}${extension}`;
        const videoFile = bucket.file(videoFileName);
        
        await videoFile.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    format: 'original',
                    optimizedAt: new Date().toISOString()
                }
            }
        });
        
        results.push({
            format: 'original',
            size: file.length,
            url: `https://storage.googleapis.com/${buckets.optimized}/${videoFileName}`,
            fileName: videoFileName
        });
        
        return results;
    }

    async storeDocument(file, fileId, originalName) {
        const bucket = storage.bucket(buckets.optimized);
        const fileName = `documents/${fileId}/${originalName}`;
        const docFile = bucket.file(fileName);
        
        await docFile.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    format: 'original',
                    optimizedAt: new Date().toISOString()
                }
            }
        });
        
        return {
            format: 'original',
            size: file.length,
            url: `https://storage.googleapis.com/${buckets.optimized}/${fileName}`,
            fileName: fileName
        };
    }

    async storeMetadata(metadata) {
        const bucket = storage.bucket(buckets.ai);
        const fileName = `metadata/${metadata.fileId}.json`;
        const metaFile = bucket.file(fileName);
        
        await metaFile.save(JSON.stringify(metadata, null, 2), {
            metadata: {
                contentType: 'application/json',
                metadata: {
                    fileId: metadata.fileId,
                    processedAt: metadata.processedAt
                }
            }
        });
    }

    detectCategory(mimetype) {
        if (this.supportedImageTypes.includes(mimetype)) return 'image';
        if (this.supportedVideoTypes.includes(mimetype)) return 'video';
        if (this.supportedDocTypes.includes(mimetype)) return 'document';
        return 'file';
    }

    suggestCategory(labels) {
        const labelText = labels.join(' ').toLowerCase();
        
        if (labelText.includes('person') && labelText.includes('sport')) return 'athletes';
        if (labelText.includes('person') && labelText.includes('team')) return 'team';
        if (labelText.includes('event') || labelText.includes('celebration')) return 'events';
        if (labelText.includes('building') || labelText.includes('architecture')) return 'gallery';
        if (labelText.includes('text') || labelText.includes('document')) return 'documents';
        
        return 'gallery';
    }
}

const processor = new MeauxbilityFileProcessor();

// Upload endpoint
router.post('/upload', upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const results = [];
        
        for (const file of req.files) {
            const result = await processor.processFile(file.buffer, file.originalname);
            results.push(result);
        }
        
        res.json({
            success: true,
            results,
            totalFiles: req.files.length,
            processedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get file metadata
router.get('/file/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const bucket = storage.bucket(buckets.ai);
        const fileName = `metadata/${fileId}.json`;
        const file = bucket.file(fileName);
        
        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        const [data] = await file.download();
        const metadata = JSON.parse(data.toString());
        
        res.json({
            success: true,
            metadata
        });
        
    } catch (error) {
        console.error('Get file error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get shared file
router.get('/shared/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const bucket = storage.bucket(buckets.ai);
        const fileName = `metadata/${fileId}.json`;
        const file = bucket.file(fileName);
        
        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        const [data] = await file.download();
        const metadata = JSON.parse(data.toString());
        
        // Return the best optimized version
        const bestFile = metadata.optimizedFiles.find(f => f.format === 'webp' && f.variant === 'desktop') ||
                        metadata.optimizedFiles.find(f => f.format === 'webp') ||
                        metadata.optimizedFiles[0];
        
        if (bestFile) {
            res.redirect(bestFile.url);
        } else {
            res.status(404).json({ error: 'No optimized file found' });
        }
        
    } catch (error) {
        console.error('Get shared file error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
