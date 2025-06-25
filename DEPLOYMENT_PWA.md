# 🚀 Déploiement PWA - Inventory

## Prérequis pour PWA

Pour qu'une PWA fonctionne correctement, elle **DOIT** être servie via HTTPS. Voici les meilleures options de déploiement :

## 🌟 Vercel (Recommandé)

### Avantages
- ✅ HTTPS automatique
- ✅ Déploiement automatique depuis Git
- ✅ Variables d'environnement sécurisées
- ✅ CDN global
- ✅ Support PWA natif

### Déploiement
```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel

# 3. Suivre les instructions
# - Lier à votre compte GitHub
# - Configurer le projet
# - Déployer automatiquement
```

### Configuration des variables d'environnement
1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Onglet "Settings" > "Environment Variables"
4. Ajoutez :
   - `VITE_SUPABASE_URL` : URL de votre projet Supabase
   - `VITE_SUPABASE_ANON_KEY` : Clé anonyme Supabase

## 🔥 Netlify

### Avantages
- ✅ HTTPS automatique
- ✅ Déploiement par glisser-déposer
- ✅ Formulaires intégrés
- ✅ Functions serverless

### Déploiement
```bash
# 1. Build du projet
npm run build

# 2. Glisser-déposer le dossier dist/ sur netlify.com
# OU utiliser Netlify CLI

npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Configuration
1. Site Settings > Environment variables
2. Ajoutez vos variables Supabase
3. Redéployez

## ☁️ GitHub Pages

### ⚠️ Limitation
GitHub Pages ne supporte que les sites statiques sans variables d'environnement serveur.

### Configuration
```bash
# 1. Installer gh-pages
npm install --save-dev gh-pages

# 2. Ajouter au package.json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# 3. Déployer
npm run deploy
```

## 🐳 Docker

### Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # PWA - Service Worker
        location /sw.js {
            add_header Cache-Control "no-cache";
            proxy_cache_bypass $http_pragma;
            proxy_cache_revalidate on;
            expires off;
            access_log off;
        }

        # PWA - Manifest
        location /manifest.webmanifest {
            add_header Content-Type application/manifest+json;
        }

        # SPA - Toutes les routes vers index.html
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

## 📋 Checklist de déploiement PWA

### Avant le déploiement
- [ ] Variables d'environnement configurées
- [ ] `npm run check-pwa` passe tous les tests
- [ ] `npm run build` fonctionne sans erreur
- [ ] Test local avec `npm run preview`

### Après le déploiement
- [ ] Site accessible via HTTPS
- [ ] Service Worker actif (DevTools > Application > Service Workers)
- [ ] Manifest valide (DevTools > Application > Manifest)
- [ ] Audit Lighthouse PWA > 90
- [ ] Installation PWA fonctionne sur mobile
- [ ] Mode hors ligne fonctionne

### Test sur mobile
1. **Android Chrome** :
   - Ouvrir le site
   - Menu (⋮) > "Ajouter à l'écran d'accueil"
   - Vérifier l'icône sur l'écran d'accueil
   - Lancer l'app installée

2. **iOS Safari** :
   - Ouvrir le site
   - Bouton partage (⬆️) > "Sur l'écran d'accueil"
   - Vérifier l'icône sur l'écran d'accueil
   - Lancer l'app installée

## 🛠️ Dépannage

### Service Worker ne se met pas à jour
```bash
# Dans les DevTools
Application > Storage > Clear storage > Clear site data
```

### Manifest invalide
```bash
# Vérifier dans DevTools
Application > Manifest > Voir les erreurs
```

### PWA non installable
- Vérifiez HTTPS
- Vérifiez le manifest
- Vérifiez le Service Worker
- Utilisez Lighthouse pour diagnostiquer

### Cache trop agressif
```javascript
// Dans vite.config.js, ajustez workbox
workbox: {
  runtimeCaching: [{
    urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
    handler: 'NetworkFirst', // Toujours essayer le réseau d'abord
    options: {
      networkTimeoutSeconds: 3
    }
  }]
}
```

## 📊 Monitoring PWA

### Métriques importantes
- **Time to Interactive (TTI)** : < 3.8s
- **First Contentful Paint (FCP)** : < 1.8s
- **Largest Contentful Paint (LCP)** : < 2.5s
- **Cumulative Layout Shift (CLS)** : < 0.1

### Outils de monitoring
- Google Analytics 4 (événements PWA)
- Lighthouse CI
- Web Vitals extension
- Sentry (erreurs PWA)

## 🔄 Mises à jour PWA

### Stratégie de mise à jour
1. **Build** : `npm run build`
2. **Deploy** : Vercel/Netlify déploie automatiquement
3. **Service Worker** : Se met à jour automatiquement
4. **Notification** : Les utilisateurs voient la notification de mise à jour
5. **Installation** : Mise à jour appliquée au prochain rechargement

### Forcer une mise à jour
```javascript
// Dans PWAInstallPrompt.vue
const updatePWA = () => {
  if (updateSW) {
    updateSW() // Fonction fournie par vite-plugin-pwa
  } else {
    window.location.reload()
  }
}
```

## 📱 Distribution

### Android
- **Google Play Store** : Utilisez [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)
- **Samsung Galaxy Store** : PWA Builder
- **Installation directe** : Via navigateur

### iOS
- **App Store** : Non supporté directement
- **Installation directe** : Via Safari uniquement

### Desktop
- **Chrome** : Installation via menu
- **Edge** : Installation via menu
- **Firefox** : Support limité

---

🎉 **Votre PWA Inventory est maintenant prête pour le déploiement !**

Pour toute question, consultez la [documentation officielle PWA](https://web.dev/progressive-web-apps/). 