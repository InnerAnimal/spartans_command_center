#!/usr/bin/env node

/**
 * Meauxbility GCP Connection Test
 * Tests Google Cloud Storage and AI services connectivity
 */

const { Storage } = require('@google-cloud/storage');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const chalk = require('chalk');
const ora = require('ora');

class GCPConnectionTester {
    constructor() {
        this.projectId = process.env.GCP_PROJECT_ID || 'meauxbility-assets';
        this.keyFile = process.env.GCP_KEY_FILE || './meauxbility-ai-key.json';
        
        this.storage = new Storage({
            projectId: this.projectId,
            keyFilename: this.keyFile
        });
        
        this.vision = new ImageAnnotatorClient({
            projectId: this.projectId,
            keyFilename: this.keyFile
        });
    }

    async testConnection() {
        console.log(chalk.blue.bold('\n🚀 Testing Meauxbility GCP Connection...\n'));
        
        const tests = [
            { name: 'Google Cloud Storage', test: () => this.testStorage() },
            { name: 'Vision API', test: () => this.testVision() },
            { name: 'Bucket Access', test: () => this.testBuckets() },
            { name: 'File Upload', test: () => this.testFileUpload() }
        ];

        let passed = 0;
        let failed = 0;

        for (const { name, test } of tests) {
            const spinner = ora(`Testing ${name}...`).start();
            
            try {
                await test();
                spinner.succeed(chalk.green(`✅ ${name} - Connected successfully`));
                passed++;
            } catch (error) {
                spinner.fail(chalk.red(`❌ ${name} - ${error.message}`));
                failed++;
            }
        }

        console.log(chalk.blue.bold('\n📊 Test Results:'));
        console.log(chalk.green(`✅ Passed: ${passed}`));
        console.log(chalk.red(`❌ Failed: ${failed}`));
        
        if (failed === 0) {
            console.log(chalk.green.bold('\n🎉 All tests passed! GCP is ready for Meauxbility assets.'));
        } else {
            console.log(chalk.yellow.bold('\n⚠️  Some tests failed. Please check your configuration.'));
        }

        return { passed, failed };
    }

    async testStorage() {
        const [buckets] = await this.storage.getBuckets();
        if (!Array.isArray(buckets)) {
            throw new Error('Failed to retrieve buckets');
        }
        return true;
    }

    async testVision() {
        // Test with a simple image URL
        const testImageUrl = 'https://via.placeholder.com/100x100/4ABAB8/ffffff?text=Test';
        const [result] = await this.vision.labelDetection(testImageUrl);
        if (!result) {
            throw new Error('Vision API returned no results');
        }
        return true;
    }

    async testBuckets() {
        const expectedBuckets = [
            'meauxbility-raw-assets',
            'meauxbility-processed-images',
            'meauxbility-optimized-web',
            'meauxbility-ai-processed'
        ];

        const [buckets] = await this.storage.getBuckets();
        const bucketNames = buckets.map(bucket => bucket.name);
        
        const missingBuckets = expectedBuckets.filter(name => !bucketNames.includes(name));
        
        if (missingBuckets.length > 0) {
            console.log(chalk.yellow(`⚠️  Missing buckets: ${missingBuckets.join(', ')}`));
            console.log(chalk.blue('💡 Run ./scripts/setup-gcp-assets.sh to create them'));
        }

        return true;
    }

    async testFileUpload() {
        const bucketName = 'meauxbility-raw-assets';
        const fileName = `test-connection-${Date.now()}.txt`;
        const testContent = 'Meauxbility GCP Connection Test - ' + new Date().toISOString();

        try {
            const bucket = this.storage.bucket(bucketName);
            const file = bucket.file(fileName);
            
            await file.save(testContent, {
                metadata: {
                    contentType: 'text/plain',
                    metadata: {
                        test: 'true',
                        timestamp: new Date().toISOString()
                    }
                }
            });

            // Clean up test file
            await file.delete();
            
            return true;
        } catch (error) {
            throw new Error(`File upload test failed: ${error.message}`);
        }
    }

    async testAIServices() {
        console.log(chalk.blue('\n🤖 Testing AI Services...\n'));
        
        const aiTests = [
            { name: 'Label Detection', test: () => this.testLabelDetection() },
            { name: 'Text Detection', test: () => this.testTextDetection() },
            { name: 'Face Detection', test: () => this.testFaceDetection() }
        ];

        for (const { name, test } of aiTests) {
            const spinner = ora(`Testing ${name}...`).start();
            
            try {
                await test();
                spinner.succeed(chalk.green(`✅ ${name} - Working`));
            } catch (error) {
                spinner.fail(chalk.red(`❌ ${name} - ${error.message}`));
            }
        }
    }

    async testLabelDetection() {
        const testImageUrl = 'https://via.placeholder.com/200x200/339999/ffffff?text=Meauxbility+Test';
        const [result] = await this.vision.labelDetection(testImageUrl);
        return result.labelAnnotations && result.labelAnnotations.length > 0;
    }

    async testTextDetection() {
        const testImageUrl = 'https://via.placeholder.com/200x200/FF6B35/ffffff?text=Test+Text';
        const [result] = await this.vision.textDetection(testImageUrl);
        return result.textAnnotations && result.textAnnotations.length > 0;
    }

    async testFaceDetection() {
        const testImageUrl = 'https://via.placeholder.com/200x200/4ABAB8/ffffff?text=Face+Test';
        const [result] = await this.vision.faceDetection(testImageUrl);
        return result.faceAnnotations !== undefined;
    }

    printConfiguration() {
        console.log(chalk.blue.bold('\n⚙️  Current Configuration:'));
        console.log(chalk.white(`Project ID: ${this.projectId}`));
        console.log(chalk.white(`Key File: ${this.keyFile}`));
        console.log(chalk.white(`Environment: ${process.env.NODE_ENV || 'development'}`));
        
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            console.log(chalk.white(`Credentials: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`));
        }
    }

    printNextSteps() {
        console.log(chalk.blue.bold('\n🚀 Next Steps:'));
        console.log(chalk.white('1. Upload your first assets: npm run upload-assets ./your-assets'));
        console.log(chalk.white('2. Open content manager: http://localhost:3000/pages/content-manager'));
        console.log(chalk.white('3. Run optimization: npm run optimize ./your-assets'));
        console.log(chalk.white('4. Check the dashboard for results'));
    }
}

// CLI interface
async function main() {
    const tester = new GCPConnectionTester();
    
    tester.printConfiguration();
    
    const results = await tester.testConnection();
    
    if (results.failed === 0) {
        await tester.testAIServices();
        tester.printNextSteps();
    } else {
        console.log(chalk.red.bold('\n❌ Please fix the failed tests before proceeding.'));
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error(chalk.red.bold('\n💥 Test failed:'), error);
        process.exit(1);
    });
}

module.exports = GCPConnectionTester;
