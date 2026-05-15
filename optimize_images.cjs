const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'assets');

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.png')) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(dir, file.replace('.png', '.webp'));

    sharp(inputPath)
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath)
      .then(() => {
        console.log(`Converted ${file} to WebP`);
        fs.unlinkSync(inputPath); // Delete old PNG
      })
      .catch(err => {
        console.error(`Error converting ${file}:`, err);
      });
  }
});
