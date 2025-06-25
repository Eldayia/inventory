# 📱 Guide PWA - Inventory

## Qu'est-ce qu'une PWA ?

Une **Progressive Web App (PWA)** est une application web qui peut être installée sur votre appareil comme une application native. Inventory est maintenant disponible en tant que PWA !

## 🚀 Installation sur Android

### Via Chrome/Edge
1. Ouvrez Inventory dans votre navigateur
2. Appuyez sur le menu (⋮) en haut à droite
3. Sélectionnez **"Ajouter à l'écran d'accueil"** ou **"Installer l'application"**
4. Confirmez l'installation

### Via Firefox
1. Ouvrez Inventory dans Firefox
2. Appuyez sur le menu (⋮)
3. Sélectionnez **"Installer"**
4. Confirmez l'installation

### Installation automatique
- Le navigateur proposera automatiquement l'installation via sa propre interface
- Utilisez la fonctionnalité native du navigateur pour installer l'app

## 📲 Installation sur iOS

### Via Safari
1. Ouvrez Inventory dans Safari
2. Appuyez sur le bouton de partage (⬆️)
3. Sélectionnez **"Sur l'écran d'accueil"**
4. Personnalisez le nom si souhaité
5. Appuyez sur **"Ajouter"**

## ✨ Fonctionnalités PWA

### 🔄 Fonctionnement hors ligne
- **Cache intelligent** : L'application fonctionne même sans connexion
- **Synchronisation** : Les données se synchronisent automatiquement quand la connexion revient
- **Mises à jour automatiques** : L'app se met à jour automatiquement

### 📱 Expérience native
- **Écran d'accueil** : Icône sur votre écran d'accueil
- **Mode plein écran** : Pas de barre d'adresse
- **Notifications** : Alertes pour les mises à jour
- **Démarrage rapide** : Lancement instantané

### 🎨 Interface optimisée
- **Responsive design** : Parfaitement adapté à tous les écrans
- **Touch-friendly** : Boutons optimisés pour le tactile
- **Mode sombre** : Support automatique du thème sombre

## 🔧 Fonctionnalités techniques

### Service Worker
- Cache les ressources pour un accès hors ligne
- Mise à jour automatique en arrière-plan
- Optimisation des performances

### Manifest Web App
- Icônes adaptées à chaque plateforme
- Configuration d'affichage optimale
- Métadonnées complètes

### Cache Strategy
- **NetworkFirst** pour les données Supabase
- **CacheFirst** pour les ressources statiques
- Expiration automatique des caches

## 🛠️ Développement

### Build PWA
```bash
npm run build
```

### Générer les icônes
```bash
npm run generate-icons
```

### Preview PWA
```bash
npm run preview
```

## 📊 Audit PWA

Pour vérifier la qualité de votre PWA :

1. Ouvrez les **DevTools** (F12)
2. Allez dans l'onglet **Lighthouse**
3. Cochez **"Progressive Web App"**
4. Cliquez sur **"Generate report"**

## 🎯 Critères PWA respectés

✅ **Manifest** : Fichier manifest.json complet  
✅ **Service Worker** : Cache et fonctionnement hors ligne  
✅ **HTTPS** : Connexion sécurisée (requis en production)  
✅ **Responsive** : Design adaptatif  
✅ **Icônes** : Icônes pour toutes les tailles  
✅ **Thème** : Couleurs de thème définies  
✅ **Démarrage** : URL de démarrage configurée  
✅ **Display** : Mode d'affichage standalone  

## 🚨 Dépannage

### L'installation ne s'affiche pas
- Vérifiez que vous êtes sur HTTPS
- Assurez-vous que le manifest est valide
- Rechargez la page

### L'app ne fonctionne pas hors ligne
- Vérifiez que le Service Worker est actif
- Consultez l'onglet Application des DevTools
- Videz le cache et rechargez

### Mise à jour non disponible
- Forcez le rechargement (Ctrl+F5)
- Vérifiez les DevTools > Application > Service Workers
- Désinstaller et réinstaller l'app si nécessaire

## 📞 Support

Pour toute question concernant la PWA, consultez :
- [Documentation PWA](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Issues GitHub du projet](https://github.com/Eldayia/inventory/issues) 