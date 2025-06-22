import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Vérification de la configuration PWA...\n');

// Vérifier les fichiers requis
const requiredFiles = [
  'public/pwa-192x192.png',
  'public/pwa-512x512.png', 
  'public/apple-touch-icon.png',
  'public/favicon.ico',
  'public/favicon-32x32.png',
  'public/favicon-16x16.png',
  'public/icon.svg'
];

let allFilesExist = true;

console.log('📁 Fichiers requis :');
requiredFiles.forEach(file => {
  const exists = existsSync(resolve(__dirname, '..', file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Vérifier le manifest dans vite.config.js
console.log('\n⚙️ Configuration Vite PWA :');
try {
  const viteConfig = readFileSync(resolve(__dirname, '..', 'vite.config.js'), 'utf8');
  
  const checks = [
    { name: 'VitePWA importé', test: /import.*VitePWA.*from.*vite-plugin-pwa/ },
    { name: 'Plugin VitePWA configuré', test: /VitePWA\(/ },
    { name: 'Manifest configuré', test: /manifest:/ },
    { name: 'Service Worker configuré', test: /workbox:/ },
    { name: 'Icons configurés', test: /icons:/ }
  ];
  
  checks.forEach(check => {
    const passed = check.test.test(viteConfig);
    console.log(`${passed ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('❌ Erreur lors de la lecture de vite.config.js');
}

// Vérifier index.html
console.log('\n🌐 Meta tags PWA dans index.html :');
try {
  const indexHtml = readFileSync(resolve(__dirname, '..', 'index.html'), 'utf8');
  
  const metaChecks = [
    { name: 'Theme color', test: /name="theme-color"/ },
    { name: 'Viewport mobile', test: /user-scalable=no/ },
    { name: 'Apple mobile web app', test: /apple-mobile-web-app-capable/ },
    { name: 'Apple touch icon', test: /apple-touch-icon/ },
    { name: 'Favicon', test: /favicon/ }
  ];
  
  metaChecks.forEach(check => {
    const passed = check.test.test(indexHtml);
    console.log(`${passed ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('❌ Erreur lors de la lecture de index.html');
}

// Vérifier les dépendances
console.log('\n📦 Dépendances PWA :');
try {
  const packageJson = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf8'));
  
  const requiredDeps = [
    'vite-plugin-pwa',
    'workbox-window',
    'sharp'
  ];
  
  requiredDeps.forEach(dep => {
    const exists = packageJson.devDependencies && packageJson.devDependencies[dep];
    console.log(`${exists ? '✅' : '❌'} ${dep}${exists ? ` (${packageJson.devDependencies[dep]})` : ''}`);
  });
} catch (error) {
  console.log('❌ Erreur lors de la lecture de package.json');
}

console.log('\n🎯 Résumé :');
if (allFilesExist) {
  console.log('✅ Toutes les icônes PWA sont présentes');
} else {
  console.log('❌ Certaines icônes PWA sont manquantes');
  console.log('💡 Exécutez : npm run generate-icons');
}

console.log('\n🚀 Pour tester votre PWA :');
console.log('1. npm run build');
console.log('2. npm run preview');
console.log('3. Ouvrez http://localhost:4173');
console.log('4. Ouvrez les DevTools > Lighthouse > PWA audit');

console.log('\n📱 Pour installer sur mobile :');
console.log('1. Déployez sur HTTPS (Vercel, Netlify, etc.)');
console.log('2. Ouvrez dans Chrome/Safari mobile');
console.log('3. Utilisez "Ajouter à l\'écran d\'accueil"'); 