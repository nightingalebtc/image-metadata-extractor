const { extractMetadata, displayMetadata } = require('./index');

async function runExample() {
    console.log('Image Metadata Extractor Example');
    console.log('================================\n');
    
    const testImages = [
        'test-image.jpg',
        'photo.png',
        'sample.jpeg'
    ];
    
    console.log('This would process the following images:');
    testImages.forEach((img, i) => {
        console.log(`${i + 1}. ${img}`);
    });
    
    console.log('\nTo use with real images, run:');
    console.log('node index.js path/to/your/image.jpg');
    
    console.log('\nExample metadata display:');
    const exampleMetadata = {
        Make: 'Canon',
        Model: 'EOS 5D Mark IV',
        DateTime: '2023:12:15 14:30:20',
        ExposureTime: 1/125,
        FNumber: 2.8,
        ISO: 800,
        FocalLength: 85,
        latitude: 37.774929,
        longitude: -122.419416
    };
    
    displayMetadata(exampleMetadata, 'example.jpg');
}

if (require.main === module) {
    runExample().catch(console.error);
}