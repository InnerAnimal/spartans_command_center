#!/usr/bin/env node

/**
 * Meauxbility Asset Optimizer
 * AI-powered content optimization with Squoosh integration
 */

const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const { execSync } = require('child_process');

class MeauxbilityAssetOptimizer {
    constructor() {
        this.storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID || 'meauxbility-assets',
            keyFilename: process.env.GCP_KEY_FILE || './meauxbility-ai-key.json'
        });
        
        this.vision = new ImageAnnotatorClient({
            projectId: process.env.GCP_PROJECT_ID || 'meauxbility-assets',
            keyFilename: process.env.GCP_KEY_FILE || './meauxbility-ai-key.json'
        });

        this.buckets = {
            raw: 'meauxbility-raw-assets',
            processed: 'meauxbility-processed-images',
            optimized: 'meauxbility-optimized-web',
            ai: 'meauxbility-ai-processed'
        };

        this.optimizationProfiles = {
            hero: { quality: 90, width: 1920, height: 1080, format: 'webp' },
            gallery: { quality: 85, width: 1200, height: 800, format: 'webp' },
            thumbnail: { quality: 80, width: 400, height: 300, format: 'webp' },
            mobile: { quality: 75, width: 768, height: 512, format: 'webp' },
            avif: { quality: 90, width: 1920, height: 1080, format: 'avif' }
        };
    }

    /**
     * Main optimization pipeline
     */
    async optimizeAssets(inputPath, options = {}) {
        console.log('🚀 Starting Meauxbility Asset Optimization Pipeline...');
        
        try {
            // 1. Analyze assets with AI
            const analysis = await this.analyzeAssets(inputPath);
            
            // 2. Categorize assets
            const categorized = this.categorizeAssets(analysis);
            
            // 3. Optimize with Squoosh
            const optimized = await this.optimizeWithSquoosh(categorized);
            
            // 4. Upload to GCP
            const uploaded = await this.uploadToGCP(optimized);
            
            // 5. Generate metadata
            const metadata = await this.generateMetadata(uploaded);
            
            console.log('✅ Asset optimization complete!');
            return {
                processed: optimized.length,
                uploaded: uploaded.length,
                metadata: metadata
            };
            
        } catch (error) {
            console.error('❌ Optimization failed:', error);
            throw error;
        }
    }

    /**
     * AI-powered asset analysis
     */
    async analyzeAssets(inputPath) {
        console.log('🔍 Analyzing assets with AI...');
        
        const files = this.getImageFiles(inputPath);
        const analysis = [];

        for (const file of files) {
            try {
                const [result] = await this.vision.labelDetection(file);
                const labels = result.labelAnnotations || [];
                
                const [textResult] = await this.vision.textDetection(file);
                const text = textResult.textAnnotations || [];

                const [faceResult] = await this.vision.faceDetection(file);
                const faces = faceResult.faceAnnotations || [];

                const [objectResult] = await this.vision.objectLocalization(file);
                const objects = objectResult.localizedObjectAnnotations || [];

                analysis.push({
                    file: file,
                    labels: labels.map(l => ({ description: l.description, score: l.score })),
                    text: text.map(t => t.description),
                    faces: faces.length,
                    objects: objects.map(o => ({ name: o.name, score: o.score })),
                    suggestedCategory: this.suggestCategory(labels, objects),
                    suggestedOptimization: this.suggestOptimization(labels, objects)
                });

                console.log(`📊 Analyzed: ${path.basename(file)}`);
                
            } catch (error) {
                console.warn(`⚠️  Could not analyze ${file}:`, error.message);
            }
        }

        return analysis;
    }

    /**
     * Categorize assets based on AI analysis
     */
    categorizeAssets(analysis) {
        console.log('📂 Categorizing assets...');
        
        const categories = {
            hero: [],
            gallery: [],
            team: [],
            athletes: [],
            events: [],
            documents: [],
            other: []
        };

        analysis.forEach(asset => {
            const category = asset.suggestedCategory;
            if (categories[category]) {
                categories[category].push(asset);
            } else {
                categories.other.push(asset);
            }
        });

        return categories;
    }

    /**
     * Optimize images with Squoosh
     */
    async optimizeWithSquoosh(categorized) {
        console.log('🎨 Optimizing with Squoosh...');
        
        const optimized = [];
        const tempDir = './temp-optimized';

        // Create temp directory
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        for (const [category, assets] of Object.entries(categorized)) {
            if (assets.length === 0) continue;

            console.log(`🔄 Optimizing ${category} images...`);

            for (const asset of assets) {
                const fileName = path.basename(asset.file, path.extname(asset.file));
                
                // Get optimization profile
                const profile = this.getOptimizationProfile(category);
                
                // Optimize for different formats and sizes
                const optimizations = await this.runSquooshOptimization(asset.file, fileName, profile, tempDir);
                
                optimized.push({
                    original: asset.file,
                    category: category,
                    optimized: optimizations,
                    metadata: {
                        labels: asset.labels,
                        text: asset.text,
                        faces: asset.faces,
                        objects: asset.objects
                    }
                });
            }
        }

        return optimized;
    }

    /**
     * Run Squoosh optimization
     */
    async runSquooshOptimization(inputFile, fileName, profile, outputDir) {
        const optimizations = [];

        // WebP optimization
        const webpOutput = path.join(outputDir, `${fileName}.webp`);
        try {
            execSync(`npx @squoosh/cli --webp '{"quality":${profile.quality}}' -d ${outputDir} "${inputFile}"`);
            optimizations.push({
                format: 'webp',
                file: webpOutput,
                quality: profile.quality,
                size: fs.statSync(webpOutput).size
            });
        } catch (error) {
            console.warn(`⚠️  WebP optimization failed for ${fileName}:`, error.message);
        }

        // AVIF optimization (if supported)
        const avifOutput = path.join(outputDir, `${fileName}.avif`);
        try {
            execSync(`npx @squoosh/cli --avif '{"quality":${profile.quality}}' -d ${outputDir} "${inputFile}"`);
            optimizations.push({
                format: 'avif',
                file: avifOutput,
                quality: profile.quality,
                size: fs.statSync(avifOutput).size
            });
        } catch (error) {
            console.warn(`⚠️  AVIF optimization failed for ${fileName}:`, error.message);
        }

        // Resize for different screen sizes
        const sizes = [
            { name: 'desktop', width: profile.width, height: profile.height },
            { name: 'tablet', width: Math.floor(profile.width * 0.75), height: Math.floor(profile.height * 0.75) },
            { name: 'mobile', width: Math.floor(profile.width * 0.5), height: Math.floor(profile.height * 0.5) }
        ];

        for (const size of sizes) {
            const resizedOutput = path.join(outputDir, `${fileName}-${size.name}.webp`);
            try {
                execSync(`npx @squoosh/cli --webp '{"quality":${profile.quality}}' --resize '{"enabled":true,"width":${size.width},"height":${size.height}}' -d ${outputDir} "${inputFile}"`);
                optimizations.push({
                    format: 'webp',
                    file: resizedOutput,
                    quality: profile.quality,
                    size: fs.statSync(resizedOutput).size,
                    dimensions: { width: size.width, height: size.height },
                    variant: size.name
                });
            } catch (error) {
                console.warn(`⚠️  Resize optimization failed for ${fileName}-${size.name}:`, error.message);
            }
        }

        return optimizations;
    }

    /**
     * Upload optimized assets to Google Cloud Storage
     */
    async uploadToGCP(optimized) {
        console.log('☁️  Uploading to Google Cloud Storage...');
        
        const uploaded = [];

        for (const asset of optimized) {
            for (const optimization of asset.optimized) {
                try {
                    const bucketName = this.buckets.optimized;
                    const fileName = `${asset.category}/${path.basename(optimization.file)}`;
                    
                    await this.storage.bucket(bucketName).upload(optimization.file, {
                        destination: fileName,
                        metadata: {
                            metadata: {
                                originalFile: path.basename(asset.original),
                                category: asset.category,
                                format: optimization.format,
                                quality: optimization.quality.toString(),
                                aiLabels: JSON.stringify(asset.metadata.labels),
                                faces: asset.metadata.faces.toString(),
                                objects: JSON.stringify(asset.metadata.objects)
                            }
                        }
                    });

                    uploaded.push({
                        bucket: bucketName,
                        file: fileName,
                        url: `https://storage.googleapis.com/${bucketName}/${fileName}`,
                        optimization: optimization
                    });

                    console.log(`📤 Uploaded: ${fileName}`);
                    
                } catch (error) {
                    console.warn(`⚠️  Upload failed for ${optimization.file}:`, error.message);
                }
            }
        }

        return uploaded;
    }

    /**
     * Generate comprehensive metadata
     */
    async generateMetadata(uploaded) {
        console.log('📋 Generating metadata...');
        
        const metadata = {
            totalAssets: uploaded.length,
            categories: {},
            formats: {},
            totalSize: 0,
            generatedAt: new Date().toISOString(),
            optimizationStats: {}
        };

        uploaded.forEach(asset => {
            const category = asset.optimization.category || 'other';
            const format = asset.optimization.format;
            
            if (!metadata.categories[category]) {
                metadata.categories[category] = 0;
            }
            metadata.categories[category]++;

            if (!metadata.formats[format]) {
                metadata.formats[format] = 0;
            }
            metadata.formats[format]++;

            metadata.totalSize += asset.optimization.size || 0;
        });

        // Save metadata to GCP
        const metadataFile = `metadata/optimization-${Date.now()}.json`;
        await this.storage.bucket(this.buckets.ai).upload(
            Buffer.from(JSON.stringify(metadata, null, 2)),
            { destination: metadataFile }
        );

        return metadata;
    }

    /**
     * Helper methods
     */
    getImageFiles(inputPath) {
        const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'];
        const files = [];

        const scanDir = (dir) => {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    scanDir(fullPath);
                } else if (extensions.includes(path.extname(item).toLowerCase())) {
                    files.push(fullPath);
                }
            });
        };

        scanDir(inputPath);
        return files;
    }

    suggestCategory(labels, objects) {
        const labelText = labels.map(l => l.description.toLowerCase()).join(' ');
        const objectText = objects.map(o => o.name.toLowerCase()).join(' ');

        if (labelText.includes('person') || labelText.includes('face') || objectText.includes('person')) {
            if (labelText.includes('sport') || labelText.includes('athlete')) return 'athletes';
            return 'team';
        }
        
        if (labelText.includes('event') || labelText.includes('celebration')) return 'events';
        if (labelText.includes('building') || labelText.includes('architecture')) return 'gallery';
        if (labelText.includes('text') || labelText.includes('document')) return 'documents';
        
        return 'gallery';
    }

    suggestOptimization(labels, objects) {
        const hasText = labels.some(l => l.description.toLowerCase().includes('text'));
        const hasFaces = objects.some(o => o.name.toLowerCase().includes('person'));
        
        if (hasText) return { quality: 95, preserveText: true };
        if (hasFaces) return { quality: 90, preserveFaces: true };
        return { quality: 85, standard: true };
    }

    getOptimizationProfile(category) {
        return this.optimizationProfiles[category] || this.optimizationProfiles.gallery;
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const inputPath = args[0] || './assets';
    
    if (!fs.existsSync(inputPath)) {
        console.error('❌ Input path does not exist:', inputPath);
        process.exit(1);
    }

    const optimizer = new MeauxbilityAssetOptimizer();
    optimizer.optimizeAssets(inputPath)
        .then(result => {
            console.log('\n🎉 Optimization Results:');
            console.log(`📊 Processed: ${result.processed} assets`);
            console.log(`☁️  Uploaded: ${result.uploaded} files`);
            console.log(`📋 Metadata: Generated`);
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Optimization failed:', error);
            process.exit(1);
        });
}

module.exports = MeauxbilityAssetOptimizer;
