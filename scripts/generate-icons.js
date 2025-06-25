import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgContent = readFileSync(resolve(__dirname, '../public/icon.svg'));

const sizes = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
];

async function generateIcons() {
  console.log('🎨 Génération des icônes PWA...');
  
  for (const { size, name } of sizes) {
    try {
      await sharp(svgContent)
        .resize(size, size)
        .png()
        .toFile(resolve(__dirname, `../public/${name}`));
      
      console.log(`✅ ${name} (${size}x${size}) généré`);
    } catch (error) {
      console.error(`❌ Erreur lors de la génération de ${name}:`, error);
    }
  }
  
  // Générer le favicon.ico
  try {
    await sharp(svgContent)
      .resize(32, 32)
      .toFormat('png')
      .toFile(resolve(__dirname, '../public/favicon.ico'));
    
    console.log('✅ favicon.ico généré');
  } catch (error) {
    console.error('❌ Erreur lors de la génération du favicon.ico:', error);
  }
  
  console.log('🎉 Toutes les icônes ont été générées !');
}

generateIcons(); 