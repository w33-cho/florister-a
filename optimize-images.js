import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import sharp from 'sharp';
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

  // Crear subdirectorios para diferentes tamaños
  const sizes = ['small', 'medium', 'large'];
  sizes.forEach(size => {
    const sizeDir = path.join(outputDir, size);
    if (!fs.existsSync(sizeDir)) {
      fs.mkdirSync(sizeDir, { recursive: true });
    }
  });

  // Función para procesar imágenes con Sharp (mejor que imagemin para resizing)
  async function processImageWithSharp(inputPath, outputPath, maxWidth = null) {
    // Asegurar que el directorio de salida existe
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let pipeline = sharp(inputPath);

    if (maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Convertir a WebP con máxima compresión
    const finalOutputPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    await pipeline
      .webp({
        quality: 30, // Máxima compresión
        effort: 6
      })
      .toFile(finalOutputPath);

    return finalOutputPath;
  }

  // Obtener todas las imágenes
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const imageFiles = [];

  function findImages(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !filePath.includes('optimized')) {
        findImages(filePath);
      } else if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (imageExtensions.includes(ext)) {
          imageFiles.push(filePath);
        }
      }
    }
  }

  findImages(inputDir);

  console.log(`Found ${imageFiles.length} images to process`);

  // Procesar cada imagen en múltiples tamaños
  for (const inputPath of imageFiles) {
    const relativePath = path.relative(inputDir, inputPath);
    const fileName = path.basename(inputPath, path.extname(inputPath));

    try {
      // Versión completa optimizada
      const outputPath = path.join(outputDir, relativePath.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp'));
      await processImageWithSharp(inputPath, outputPath);

      // Versión pequeña (448px para tarjetas de producto)
      const smallOutputPath = path.join(outputDir, 'small', relativePath.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp'));
      await processImageWithSharp(inputPath, smallOutputPath, 448);

      // Versión mediana (800px para carrusel)
      const mediumOutputPath = path.join(outputDir, 'medium', relativePath.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp'));
      await processImageWithSharp(inputPath, mediumOutputPath, 800);

      // Versión grande (1400px para carrusel grande)
      const largeOutputPath = path.join(outputDir, 'large', relativePath.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp'));
      await processImageWithSharp(inputPath, largeOutputPath, 1400);

    } catch (error) {
      console.error(`Error processing ${inputPath}:`, error.message);
    }
  }

  console.log(`Successfully processed ${imageFiles.length} images in multiple sizes with maximum compression`);
}

optimizeImages().catch(console.error);