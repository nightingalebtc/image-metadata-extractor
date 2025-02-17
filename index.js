#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const exifr = require('exifr');

function isImageFile(filePath) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp', '.bmp', '.gif'];
    const ext = path.extname(filePath).toLowerCase();
    return imageExtensions.includes(ext);
}

async function extractMetadata(imagePath) {
    try {
        if (!fs.existsSync(imagePath)) {
            throw new Error(`File not found: ${imagePath}`);
        }
        
        if (!isImageFile(imagePath)) {
            throw new Error(`Unsupported file type: ${path.extname(imagePath)}`);
        }
        
        const stats = fs.statSync(imagePath);
        if (stats.isDirectory()) {
            throw new Error(`Path is a directory, not a file: ${imagePath}`);
        }
        
        const metadata = await exifr.parse(imagePath);
        return metadata;
    } catch (error) {
        console.error(`Error processing ${path.basename(imagePath)}: ${error.message}`);
        return null;
    }
}

function displayMetadata(metadata, filename, verbose = false) {
    console.log(`\n=== Metadata for ${filename} ===`);
    
    if (!metadata) {
        console.log('No metadata found or error occurred');
        return;
    }
    
    // Display basic info
    if (metadata.Make) console.log(`Camera: ${metadata.Make} ${metadata.Model || ''}`);
    if (metadata.DateTime) console.log(`Date: ${metadata.DateTime}`);
    if (metadata.ExposureTime) console.log(`Exposure: ${metadata.ExposureTime}s`);
    if (metadata.FNumber) console.log(`Aperture: f/${metadata.FNumber}`);
    if (metadata.ISO) console.log(`ISO: ${metadata.ISO}`);
    if (metadata.FocalLength) console.log(`Focal Length: ${metadata.FocalLength}mm`);
    
    // GPS info
    if (metadata.latitude && metadata.longitude) {
        console.log(`GPS: ${metadata.latitude.toFixed(6)}, ${metadata.longitude.toFixed(6)}`);
    }
    
    if (verbose) {
        console.log('\n--- Detailed Information ---');
        if (metadata.ImageWidth && metadata.ImageHeight) {
            console.log(`Dimensions: ${metadata.ImageWidth}x${metadata.ImageHeight}`);
        }
        if (metadata.Flash !== undefined) {
            console.log(`Flash: ${metadata.Flash === 0 ? 'No flash' : 'Flash fired'}`);
        }
        if (metadata.WhiteBalance !== undefined) {
            console.log(`White Balance: ${metadata.WhiteBalance === 0 ? 'Auto' : 'Manual'}`);
        }
        if (metadata.ColorSpace !== undefined) {
            console.log(`Color Space: ${metadata.ColorSpace}`);
        }
        if (metadata.Software) {
            console.log(`Software: ${metadata.Software}`);
        }
    }
    
    console.log('---');
}

function showHelp() {
    console.log('Image Metadata Extractor');
    console.log('========================');
    console.log('');
    console.log('Usage: node index.js [options] <image_path> [image_path2] ...');
    console.log('');
    console.log('Options:');
    console.log('  -h, --help     Show this help message');
    console.log('  -v, --verbose  Show additional metadata');
    console.log('  --json         Output metadata in JSON format');
    console.log('');
    console.log('Examples:');
    console.log('  node index.js photo.jpg');
    console.log('  node index.js --verbose image1.jpg image2.png');
    console.log('  node index.js --json photo.jpg');
}

function parseArgs(args) {
    const options = {
        help: false,
        verbose: false,
        json: false,
        files: []
    };
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === '-h' || arg === '--help') {
            options.help = true;
        } else if (arg === '-v' || arg === '--verbose') {
            options.verbose = true;
        } else if (arg === '--json') {
            options.json = true;
        } else if (!arg.startsWith('-')) {
            options.files.push(arg);
        } else {
            console.error(`Unknown option: ${arg}`);
            process.exit(1);
        }
    }
    
    return options;
}

async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);
    
    if (options.help || args.length === 0) {
        showHelp();
        process.exit(0);
    }
    
    if (options.files.length === 0) {
        console.error('Error: No image files specified');
        showHelp();
        process.exit(1);
    }
    
    for (const imagePath of options.files) {
        const metadata = await extractMetadata(imagePath);
        
        if (options.json) {
            console.log(JSON.stringify({
                filename: path.basename(imagePath),
                metadata: metadata
            }, null, 2));
        } else {
            displayMetadata(metadata, path.basename(imagePath), options.verbose);
        }
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { extractMetadata, displayMetadata };