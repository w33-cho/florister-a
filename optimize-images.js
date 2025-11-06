import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeImages() {
  const inputDir = 'public';
  const outputDir = 'public/optimized';

  // Crear directorio de salida si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Optimizar imágenes JPEG/PNG
  const compressedFiles = await imagemin(['public/**/*.{jpg,jpeg,png}'], {
    destination: outputDir,
    plugins: [
      imageminMozjpeg({ quality: 50 }),
      imageminPngquant({ quality: [0.5, 0.7] })
    ]
  });

  console.log(`Compressed ${compressedFiles.length} JPEG/PNG images`);

  // Convertir a WebP (solo si no hay errores)
  try {
    const webpFiles = await imagemin(['public/**/*.{jpg,jpeg,png}'], {
      destination: outputDir,
      plugins: [
        imageminWebp({ quality: 50 })
      ]
    });
    console.log(`Converted ${webpFiles.length} images to WebP`);
  } catch (error) {
    console.log('Skipping WebP conversion due to error:', error.message);
  }
}

optimizeImages().catch(console.error);