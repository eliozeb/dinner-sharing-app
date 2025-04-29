const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../images');
const outputDir = path.join(__dirname, '../public/images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = {
    sm: 400,
    md: 800,
    lg: 1200
};

async function optimizeImage(file) {
    const filename = path.parse(file).name;
    const input = path.join(sourceDir, file);

    // Generate WebP versions
    for (const [size, width] of Object.entries(sizes)) {
        await sharp(input)
            .resize(width, null, { 
                withoutEnlargement: true,
                fit: 'contain'
            })
            .webp({ quality: 80 })
            .toFile(path.join(outputDir, `${filename}-${size}.webp`));
    }

    // Generate optimized JPG versions
    for (const [size, width] of Object.entries(sizes)) {
        await sharp(input)
            .resize(width, null, {
                withoutEnlargement: true,
                fit: 'contain'
            })
            .jpeg({ quality: 80, progressive: true })
            .toFile(path.join(outputDir, `${filename}-${size}.jpg`));
    }
}

async function processImages() {
    try {
        const files = fs.readdirSync(sourceDir).filter(file => 
            file.match(/\.(jpg|jpeg|png)$/i)
        );

        console.log(`Found ${files.length} images to process`);

        for (const file of files) {
            console.log(`Processing ${file}...`);
            await optimizeImage(file);
        }

        console.log('Image optimization complete!');
    } catch (error) {
        console.error('Error processing images:', error);
    }
}

processImages();