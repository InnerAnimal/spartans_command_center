#!/usr/bin/env node

/**
 * Meauxbility CapCut Integration
 * Automated video/image editing pipeline
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');

class MeauxbilityCapCutIntegration {
    constructor() {
        this.tempDir = './temp-capcut';
        this.outputDir = './capcut-output';
        this.presets = {
            hero: {
                video: { width: 1920, height: 1080, fps: 30, bitrate: '5000k' },
                image: { width: 1920, height: 1080, quality: 95 }
            },
            social: {
                video: { width: 1080, height: 1080, fps: 30, bitrate: '3000k' },
                image: { width: 1080, height: 1080, quality: 90 }
            },
            mobile: {
                video: { width: 720, height: 1280, fps: 30, bitrate: '2000k' },
                image: { width: 720, height: 1280, quality: 85 }
            },
            thumbnail: {
                video: { width: 480, height: 360, fps: 15, bitrate: '1000k' },
                image: { width: 480, height: 360, quality: 80 }
            }
        };
        
        this.createDirectories();
    }

    /**
     * Create necessary directories
     */
    createDirectories() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    /**
     * Process video with CapCut-style effects
     */
    async processVideo(inputPath, preset = 'hero', effects = {}) {
        console.log(`🎬 Processing video: ${path.basename(inputPath)}`);
        
        const presetConfig = this.presets[preset];
        const outputPath = path.join(this.outputDir, `processed-${Date.now()}-${path.basename(inputPath)}`);
        
        try {
            // Apply video effects
            await this.applyVideoEffects(inputPath, outputPath, presetConfig, effects);
            
            // Generate thumbnail
            const thumbnailPath = await this.generateVideoThumbnail(outputPath);
            
            // Create multiple versions for different platforms
            const versions = await this.createVideoVersions(outputPath, preset);
            
            return {
                original: inputPath,
                processed: outputPath,
                thumbnail: thumbnailPath,
                versions: versions,
                preset: preset,
                effects: effects
            };
            
        } catch (error) {
            console.error('❌ Video processing failed:', error);
            throw error;
        }
    }

    /**
     * Process image with CapCut-style effects
     */
    async processImage(inputPath, preset = 'hero', effects = {}) {
        console.log(`🖼️  Processing image: ${path.basename(inputPath)}`);
        
        const presetConfig = this.presets[preset];
        const outputPath = path.join(this.outputDir, `processed-${Date.now()}-${path.basename(inputPath)}`);
        
        try {
            let image = sharp(inputPath);
            
            // Apply preset dimensions
            image = image.resize(presetConfig.image.width, presetConfig.image.height, {
                fit: 'cover',
                position: 'center'
            });
            
            // Apply effects
            image = await this.applyImageEffects(image, effects);
            
            // Save processed image
            await image.jpeg({ quality: presetConfig.image.quality }).toFile(outputPath);
            
            // Create multiple formats
            const formats = await this.createImageFormats(outputPath, preset);
            
            return {
                original: inputPath,
                processed: outputPath,
                formats: formats,
                preset: preset,
                effects: effects
            };
            
        } catch (error) {
            console.error('❌ Image processing failed:', error);
            throw error;
        }
    }

    /**
     * Apply video effects using FFmpeg
     */
    async applyVideoEffects(inputPath, outputPath, preset, effects) {
        return new Promise((resolve, reject) => {
            let command = ffmpeg(inputPath);
            
            // Basic preset settings
            command = command
                .size(`${preset.video.width}x${preset.video.height}`)
                .fps(preset.video.fps)
                .videoBitrate(preset.video.bitrate);
            
            // Apply effects
            if (effects.brightness) {
                command = command.videoFilters(`eq=brightness=${effects.brightness}`);
            }
            
            if (effects.contrast) {
                command = command.videoFilters(`eq=contrast=${effects.contrast}`);
            }
            
            if (effects.saturation) {
                command = command.videoFilters(`eq=saturation=${effects.saturation}`);
            }
            
            if (effects.blur) {
                command = command.videoFilters(`gblur=sigma=${effects.blur}`);
            }
            
            if (effects.speed) {
                command = command.videoFilters(`setpts=${1/effects.speed}*PTS`);
            }
            
            // Meauxbility branding overlay
            if (effects.branding) {
                command = command.videoFilters(`drawtext=text='Meauxbility':fontcolor=white:fontsize=24:x=10:y=10`);
            }
            
            command
                .on('end', () => {
                    console.log('✅ Video processing complete');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('❌ Video processing error:', err);
                    reject(err);
                })
                .save(outputPath);
        });
    }

    /**
     * Apply image effects using Sharp
     */
    async applyImageEffects(image, effects) {
        // Brightness/Contrast
        if (effects.brightness || effects.contrast) {
            image = image.modulate({
                brightness: effects.brightness || 1,
                contrast: effects.contrast || 1
            });
        }
        
        // Saturation
        if (effects.saturation) {
            image = image.modulate({
                saturation: effects.saturation
            });
        }
        
        // Blur
        if (effects.blur) {
            image = image.blur(effects.blur);
        }
        
        // Sharpen
        if (effects.sharpen) {
            image = image.sharpen();
        }
        
        // Meauxbility branding
        if (effects.branding) {
            // Add Meauxbility logo overlay
            const logoPath = './assets/meauxbility-logo.png';
            if (fs.existsSync(logoPath)) {
                image = image.composite([{
                    input: logoPath,
                    top: 20,
                    left: 20,
                    blend: 'over'
                }]);
            }
        }
        
        return image;
    }

    /**
     * Generate video thumbnail
     */
    async generateVideoThumbnail(videoPath) {
        const thumbnailPath = path.join(this.outputDir, `thumb-${Date.now()}.jpg`);
        
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .screenshots({
                    timestamps: ['50%'],
                    filename: path.basename(thumbnailPath),
                    folder: path.dirname(thumbnailPath),
                    size: '480x360'
                })
                .on('end', () => {
                    console.log('✅ Thumbnail generated');
                    resolve(thumbnailPath);
                })
                .on('error', (err) => {
                    console.error('❌ Thumbnail generation failed:', err);
                    reject(err);
                });
        });
    }

    /**
     * Create multiple video versions for different platforms
     */
    async createVideoVersions(videoPath, preset) {
        const versions = [];
        
        for (const [platform, config] of Object.entries(this.presets)) {
            if (platform === preset) continue; // Skip the original preset
            
            const versionPath = path.join(this.outputDir, `${platform}-${Date.now()}.mp4`);
            
            try {
                await new Promise((resolve, reject) => {
                    ffmpeg(videoPath)
                        .size(`${config.video.width}x${config.video.height}`)
                        .fps(config.video.fps)
                        .videoBitrate(config.video.bitrate)
                        .on('end', resolve)
                        .on('error', reject)
                        .save(versionPath);
                });
                
                versions.push({
                    platform: platform,
                    path: versionPath,
                    dimensions: `${config.video.width}x${config.video.height}`,
                    bitrate: config.video.bitrate
                });
                
            } catch (error) {
                console.warn(`⚠️  Failed to create ${platform} version:`, error.message);
            }
        }
        
        return versions;
    }

    /**
     * Create multiple image formats
     */
    async createImageFormats(imagePath, preset) {
        const formats = [];
        const baseName = path.basename(imagePath, path.extname(imagePath));
        
        // WebP
        try {
            const webpPath = path.join(this.outputDir, `${baseName}.webp`);
            await sharp(imagePath).webp({ quality: 90 }).toFile(webpPath);
            formats.push({ format: 'webp', path: webpPath });
        } catch (error) {
            console.warn('⚠️  WebP conversion failed:', error.message);
        }
        
        // AVIF
        try {
            const avifPath = path.join(this.outputDir, `${baseName}.avif`);
            await sharp(imagePath).avif({ quality: 90 }).toFile(avifPath);
            formats.push({ format: 'avif', path: avifPath });
        } catch (error) {
            console.warn('⚠️  AVIF conversion failed:', error.message);
        }
        
        // PNG
        try {
            const pngPath = path.join(this.outputDir, `${baseName}.png`);
            await sharp(imagePath).png({ quality: 95 }).toFile(pngPath);
            formats.push({ format: 'png', path: pngPath });
        } catch (error) {
            console.warn('⚠️  PNG conversion failed:', error.message);
        }
        
        return formats;
    }

    /**
     * Batch process multiple files
     */
    async batchProcess(files, preset = 'hero', effects = {}) {
        console.log(`🔄 Batch processing ${files.length} files...`);
        
        const results = [];
        
        for (const file of files) {
            try {
                const ext = path.extname(file).toLowerCase();
                
                if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
                    const result = await this.processVideo(file, preset, effects);
                    results.push({ type: 'video', ...result });
                } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
                    const result = await this.processImage(file, preset, effects);
                    results.push({ type: 'image', ...result });
                } else {
                    console.warn(`⚠️  Unsupported file type: ${ext}`);
                }
                
            } catch (error) {
                console.error(`❌ Failed to process ${file}:`, error.message);
                results.push({ type: 'error', file: file, error: error.message });
            }
        }
        
        console.log(`✅ Batch processing complete: ${results.length} files processed`);
        return results;
    }

    /**
     * Clean up temporary files
     */
    cleanup() {
        try {
            if (fs.existsSync(this.tempDir)) {
                fs.rmSync(this.tempDir, { recursive: true, force: true });
            }
            console.log('🧹 Cleanup complete');
        } catch (error) {
            console.warn('⚠️  Cleanup failed:', error.message);
        }
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0] || 'process';
    const inputPath = args[1];
    const preset = args[2] || 'hero';
    
    if (!inputPath) {
        console.log('Usage: node capcut-integration.js [process|batch] <input-path> [preset]');
        console.log('Presets: hero, social, mobile, thumbnail');
        process.exit(1);
    }
    
    const capcut = new MeauxbilityCapCutIntegration();
    
    switch (command) {
        case 'process':
            if (fs.statSync(inputPath).isDirectory()) {
                console.log('❌ Use "batch" command for directories');
                process.exit(1);
            }
            
            const ext = path.extname(inputPath).toLowerCase();
            if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
                capcut.processVideo(inputPath, preset, { branding: true })
                    .then(result => {
                        console.log('\n🎉 Video processing complete!');
                        console.log(`📁 Output: ${result.processed}`);
                        console.log(`🖼️  Thumbnail: ${result.thumbnail}`);
                        console.log(`📱 Versions: ${result.versions.length}`);
                    })
                    .catch(error => {
                        console.error('❌ Processing failed:', error);
                        process.exit(1);
                    });
            } else {
                capcut.processImage(inputPath, preset, { branding: true })
                    .then(result => {
                        console.log('\n🎉 Image processing complete!');
                        console.log(`📁 Output: ${result.processed}`);
                        console.log(`🎨 Formats: ${result.formats.length}`);
                    })
                    .catch(error => {
                        console.error('❌ Processing failed:', error);
                        process.exit(1);
                    });
            }
            break;
            
        case 'batch':
            if (!fs.statSync(inputPath).isDirectory()) {
                console.log('❌ Batch command requires a directory');
                process.exit(1);
            }
            
            const files = fs.readdirSync(inputPath)
                .map(file => path.join(inputPath, file))
                .filter(file => fs.statSync(file).isFile());
            
            capcut.batchProcess(files, preset, { branding: true })
                .then(results => {
                    console.log('\n🎉 Batch processing complete!');
                    console.log(`📊 Processed: ${results.filter(r => r.type !== 'error').length} files`);
                    console.log(`❌ Errors: ${results.filter(r => r.type === 'error').length} files`);
                })
                .catch(error => {
                    console.error('❌ Batch processing failed:', error);
                    process.exit(1);
                });
            break;
            
        default:
            console.log('Usage: node capcut-integration.js [process|batch] <input-path> [preset]');
            process.exit(1);
    }
}

module.exports = MeauxbilityCapCutIntegration;
