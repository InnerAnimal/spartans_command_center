#!/usr/bin/env node

/**
 * Meauxbility Google Cloud Drive Integration
 * Connects Google Drive with our asset management system
 */

const { Storage } = require('@google-cloud/storage');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class MeauxbilityDriveIntegration {
    constructor() {
        this.storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID || 'meauxbility-assets',
            keyFilename: process.env.GCP_KEY_FILE || './meauxbility-ai-key.json'
        });

        // Google Drive API setup
        this.drive = google.drive({
            version: 'v3',
            auth: new google.auth.GoogleAuth({
                keyFile: process.env.GCP_KEY_FILE || './meauxbility-ai-key.json',
                scopes: [
                    'https://www.googleapis.com/auth/drive',
                    'https://www.googleapis.com/auth/drive.file',
                    'https://www.googleapis.com/auth/drive.metadata'
                ]
            })
        });

        this.buckets = {
            raw: 'meauxbility-raw-assets',
            optimized: 'meauxbility-optimized-web',
            drive: 'meauxbility-drive-sync'
        };
    }

    /**
     * Sync files from Google Drive to our storage system
     */
    async syncFromDrive(folderId = null) {
        console.log('🔄 Syncing files from Google Drive...');
        
        try {
            // Get files from Drive
            const driveFiles = await this.getDriveFiles(folderId);
            
            const syncedFiles = [];
            
            for (const file of driveFiles) {
                console.log(`📥 Syncing: ${file.name}`);
                
                // Download file from Drive
                const fileBuffer = await this.downloadFromDrive(file.id);
                
                // Upload to our storage
                const storageUrl = await this.uploadToStorage(fileBuffer, file.name, file.mimeType);
                
                // Process with our optimization pipeline
                const optimized = await this.processFile(fileBuffer, file.name, file.mimeType);
                
                syncedFiles.push({
                    driveId: file.id,
                    name: file.name,
                    mimeType: file.mimeType,
                    originalUrl: storageUrl,
                    optimizedFiles: optimized,
                    syncedAt: new Date().toISOString()
                });
            }
            
            console.log(`✅ Synced ${syncedFiles.length} files from Google Drive`);
            return syncedFiles;
            
        } catch (error) {
            console.error('❌ Drive sync failed:', error);
            throw error;
        }
    }

    /**
     * Upload files to Google Drive
     */
    async uploadToDrive(fileBuffer, fileName, mimeType, folderId = null) {
        try {
            const fileMetadata = {
                name: fileName,
                parents: folderId ? [folderId] : undefined
            };

            const media = {
                mimeType: mimeType,
                body: fileBuffer
            };

            const response = await this.drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id,name,webViewLink,webContentLink'
            });

            console.log(`📤 Uploaded to Drive: ${fileName}`);
            return response.data;
            
        } catch (error) {
            console.error(`❌ Drive upload failed for ${fileName}:`, error);
            throw error;
        }
    }

    /**
     * Create organized folder structure in Drive
     */
    async createDriveFolders() {
        const folders = [
            'Meauxbility Assets',
            'Meauxbility Assets/Images',
            'Meauxbility Assets/Images/Hero',
            'Meauxbility Assets/Images/Gallery',
            'Meauxbility Assets/Images/Team',
            'Meauxbility Assets/Images/Athletes',
            'Meauxbility Assets/Videos',
            'Meauxbility Assets/Videos/Training',
            'Meauxbility Assets/Videos/Events',
            'Meauxbility Assets/Documents',
            'Meauxbility Assets/Documents/Grants',
            'Meauxbility Assets/Documents/Reports',
            'Meauxbility Assets/Optimized',
            'Meauxbility Assets/Optimized/WebP',
            'Meauxbility Assets/Optimized/AVIF',
            'Meauxbility Assets/Shared'
        ];

        const createdFolders = {};
        
        for (const folderPath of folders) {
            const folderName = folderPath.split('/').pop();
            const parentPath = folderPath.split('/').slice(0, -1).join('/');
            const parentId = parentPath ? createdFolders[parentPath] : null;
            
            try {
                const folderMetadata = {
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: parentId ? [parentId] : undefined
                };

                const response = await this.drive.files.create({
                    resource: folderMetadata,
                    fields: 'id,name'
                });

                createdFolders[folderPath] = response.data.id;
                console.log(`📁 Created folder: ${folderPath}`);
                
            } catch (error) {
                console.warn(`⚠️  Folder creation failed for ${folderPath}:`, error.message);
            }
        }

        return createdFolders;
    }

    /**
     * Get files from Google Drive
     */
    async getDriveFiles(folderId = null) {
        try {
            const query = folderId 
                ? `'${folderId}' in parents and trashed=false`
                : 'trashed=false';
            
            const response = await this.drive.files.list({
                q: query,
                fields: 'files(id,name,mimeType,size,createdTime,modifiedTime)',
                pageSize: 100
            });

            return response.data.files || [];
            
        } catch (error) {
            console.error('❌ Failed to get Drive files:', error);
            throw error;
        }
    }

    /**
     * Download file from Google Drive
     */
    async downloadFromDrive(fileId) {
        try {
            const response = await this.drive.files.get({
                fileId: fileId,
                alt: 'media'
            }, {
                responseType: 'arraybuffer'
            });

            return Buffer.from(response.data);
            
        } catch (error) {
            console.error(`❌ Failed to download file ${fileId}:`, error);
            throw error;
        }
    }

    /**
     * Upload file to our storage system
     */
    async uploadToStorage(fileBuffer, fileName, mimeType) {
        const bucket = this.storage.bucket(this.buckets.raw);
        const fileName_clean = `drive-sync/${Date.now()}-${fileName}`;
        const file = bucket.file(fileName_clean);
        
        await file.save(fileBuffer, {
            metadata: {
                contentType: mimeType,
                metadata: {
                    source: 'google-drive',
                    uploadedAt: new Date().toISOString()
                }
            }
        });
        
        return `https://storage.googleapis.com/${this.buckets.raw}/${fileName_clean}`;
    }

    /**
     * Process file with our optimization pipeline
     */
    async processFile(fileBuffer, fileName, mimeType) {
        // This would integrate with our existing optimization system
        // For now, return mock data
        return [
            {
                format: 'webp',
                size: Math.round(fileBuffer.length * 0.6),
                url: `https://storage.googleapis.com/${this.buckets.optimized}/optimized-${fileName}.webp`
            }
        ];
    }

    /**
     * Share file from Drive
     */
    async shareDriveFile(fileId, permissions = ['reader']) {
        try {
            const response = await this.drive.permissions.create({
                fileId: fileId,
                resource: {
                    role: 'reader',
                    type: 'anyone'
                }
            });

            // Get the shareable link
            const fileResponse = await this.drive.files.get({
                fileId: fileId,
                fields: 'webViewLink,webContentLink'
            });

            return {
                shareId: response.data.id,
                shareLink: fileResponse.data.webViewLink,
                downloadLink: fileResponse.data.webContentLink
            };
            
        } catch (error) {
            console.error(`❌ Failed to share file ${fileId}:`, error);
            throw error;
        }
    }

    /**
     * Get Drive storage usage
     */
    async getDriveUsage() {
        try {
            const response = await this.drive.about.get({
                fields: 'storageQuota'
            });

            const quota = response.data.storageQuota;
            return {
                total: parseInt(quota.limit),
                used: parseInt(quota.usage),
                available: parseInt(quota.limit) - parseInt(quota.usage),
                usagePercent: (parseInt(quota.usage) / parseInt(quota.limit)) * 100
            };
            
        } catch (error) {
            console.error('❌ Failed to get Drive usage:', error);
            throw error;
        }
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0] || 'sync';
    
    const driveIntegration = new MeauxbilityDriveIntegration();
    
    switch (command) {
        case 'sync':
            driveIntegration.syncFromDrive()
                .then(results => {
                    console.log('\n🎉 Drive sync complete!');
                    console.log(`📊 Synced ${results.length} files`);
                })
                .catch(error => {
                    console.error('❌ Sync failed:', error);
                    process.exit(1);
                });
            break;
            
        case 'create-folders':
            driveIntegration.createDriveFolders()
                .then(folders => {
                    console.log('\n🎉 Drive folders created!');
                    console.log(`📁 Created ${Object.keys(folders).length} folders`);
                })
                .catch(error => {
                    console.error('❌ Folder creation failed:', error);
                    process.exit(1);
                });
            break;
            
        case 'usage':
            driveIntegration.getDriveUsage()
                .then(usage => {
                    console.log('\n📊 Google Drive Usage:');
                    console.log(`💾 Used: ${(usage.used / 1024 / 1024 / 1024).toFixed(2)} GB`);
                    console.log(`💾 Total: ${(usage.total / 1024 / 1024 / 1024).toFixed(2)} GB`);
                    console.log(`📈 Usage: ${usage.usagePercent.toFixed(1)}%`);
                })
                .catch(error => {
                    console.error('❌ Usage check failed:', error);
                    process.exit(1);
                });
            break;
            
        default:
            console.log('Usage: node drive-integration.js [sync|create-folders|usage]');
            process.exit(1);
    }
}

module.exports = MeauxbilityDriveIntegration;
