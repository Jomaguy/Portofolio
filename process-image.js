import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'client/public/images/euler-portrait.jpg');
const outputPath = path.join(__dirname, 'client/public/images/euler-portrait-fitted.jpg');

// Process the image to fit a 16:9 aspect ratio
// Using a balanced position between top and center
sharp(inputPath)
  .extract({ left: 0, top: 100, width: 440, height: 400 }) // Extract a region focusing on the face
  .resize({
    width: 1280,
    height: 720,
    fit: 'fill'
  })
  .toFile(outputPath)
  .then(() => {
    console.log('Image processed successfully!');
    console.log('Output path:', outputPath);
  })
  .catch(err => {
    console.error('Error processing image:', err);
  }); 