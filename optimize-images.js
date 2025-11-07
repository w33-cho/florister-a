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

  // Optimizar imágenes JPEG/PNG/WebP con mejor compresión
  const compressedFiles = await imagemin(['public/**/*.{jpg,jpeg,png,webp}', '!public/optimized/**'], {
    destination: outputDir,
    plugins: [
      imageminMozjpeg({
        quality: 40, // Reducido de 50 para mejor compresión
        progressive: true
      }),
      imageminPngquant({
        quality: [0.4, 0.6], // Reducido para mejor compresión
        speed: 1
      }),
      imageminWebp({
        quality: 40, // Reducido de 50 para mejor compresión
        effort: 6
      })
    ]
  });

  console.log(`Optimized ${compressedFiles.length} images`);
}

optimizeImages().catch(console.error);