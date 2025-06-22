# Guide Docker - Application Inventory PWA

Ce guide vous explique comment déployer l'application Inventory en tant que conteneur Docker.

## 📋 Prérequis

- Docker installé (version 20.10+)
- Docker Compose installé (version 2.0+)
- Configuration Supabase (URL et clé API)

## 🚀 Démarrage rapide

### 1. Configuration des variables d'environnement

Copiez le fichier d'exemple et configurez vos variables :

```bash
cp env.example .env
```

Éditez le fichier `.env` avec vos informations Supabase :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
```

### 2. Build et lancement en production

```bash
# Build et démarrage
docker-compose up -d

# Vérifier les logs
docker-compose logs -f inventory-app
```

L'application sera accessible sur :
- http://localhost (port 80)
- http://localhost:8080 (port alternatif)

### 3. Mode développement

Pour le développement avec hot reload :

```bash
# Démarrer en mode développement
docker-compose --profile dev up -d inventory-dev

# Accéder aux logs
docker-compose logs -f inventory-dev
```

L'application de développement sera accessible sur http://localhost:3000

## 🏗️ Architecture Docker

### Services disponibles

1. **inventory-app** (Production)
   - Image : Nginx + application buildée
   - Ports : 80, 8080
   - Optimisé pour la production

2. **inventory-dev** (Développement)
   - Image : Node.js avec hot reload
   - Port : 3000
   - Volume monté pour le développement

3. **traefik** (Optionnel)
   - Reverse proxy avec SSL
   - Dashboard sur le port 8080

### Configuration Nginx

Le fichier `nginx.conf` inclut :
- Configuration PWA optimisée
- Cache headers appropriés
- Support des Service Workers
- Routing SPA
- Headers de sécurité

## 📝 Commandes utiles

### Gestion des conteneurs

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Rebuild après modifications
docker-compose up -d --build

# Voir les logs
docker-compose logs -f [service-name]

# Accéder au conteneur
docker-compose exec inventory-app sh
```

### Maintenance

```bash
# Nettoyer les images inutilisées
docker system prune -a

# Voir l'utilisation des ressources
docker stats

# Backup des volumes
docker run --rm -v inventory_inventory-data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz -C /data .
```

## 🌐 Déploiement

### Avec Traefik (recommandé)

```bash
# Démarrer avec Traefik
docker-compose --profile traefik up -d

# Ajouter à /etc/hosts (Linux/Mac) ou C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 inventory.local
```

### Déploiement sur serveur

1. **Copier les fichiers sur le serveur**
```bash
scp -r . user@server:/path/to/inventory/
```

2. **Configurer les variables d'environnement**
```bash
# Sur le serveur
cd /path/to/inventory/
cp env.example .env
nano .env  # Configurer vos variables
```

3. **Démarrer les services**
```bash
docker-compose up -d
```

### Avec SSL (Let's Encrypt)

Modifiez le `docker-compose.yml` pour ajouter :

```yaml
traefik:
  command:
    - "--certificatesresolvers.letsencrypt.acme.email=votre@email.com"
    - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
  volumes:
    - "./letsencrypt:/letsencrypt"
  labels:
    - "traefik.http.routers.inventory.tls.certresolver=letsencrypt"
```

## 🔧 Personnalisation

### Variables d'environnement disponibles

| Variable | Description | Défaut |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | URL de votre projet Supabase | - |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | - |
| `VITE_APP_NAME` | Nom de l'application | Inventory |
| `COMPOSE_PROJECT_NAME` | Nom du projet Docker | inventory |

### Modification des ports

Éditez le `docker-compose.yml` :

```yaml
ports:
  - "8080:80"  # Port externe:Port interne
```

### Ajout de services

Pour ajouter une base de données PostgreSQL :

```yaml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: inventory
    POSTGRES_USER: inventory
    POSTGRES_PASSWORD: password
  volumes:
    - postgres-data:/var/lib/postgresql/data
  networks:
    - inventory-network
```

## 🐛 Dépannage

### Problèmes courants

1. **Port déjà utilisé**
```bash
# Changer le port dans docker-compose.yml
ports:
  - "8081:80"
```

2. **Problème de permissions**
```bash
# Linux/Mac
sudo chown -R $USER:$USER .
```

3. **Cache Docker**
```bash
# Rebuild complet
docker-compose build --no-cache
```

4. **Logs détaillés**
```bash
# Voir tous les logs
docker-compose logs --tail=100 -f
```

### Vérification de santé

```bash
# Tester l'application
curl -f http://localhost/manifest.webmanifest

# Vérifier le service worker
curl -f http://localhost/sw.js
```

## 📊 Monitoring

### Métriques Docker

```bash
# Utilisation des ressources
docker stats inventory-pwa

# Informations détaillées
docker inspect inventory-pwa
```

### Logs applicatifs

```bash
# Logs Nginx
docker-compose exec inventory-app tail -f /var/log/nginx/access.log

# Logs d'erreur
docker-compose exec inventory-app tail -f /var/log/nginx/error.log
```

## 🔒 Sécurité

### Bonnes pratiques

1. **Variables d'environnement sensibles**
   - Utilisez Docker Secrets en production
   - Ne commitez jamais les fichiers `.env`

2. **Images de production**
   - Utilisez des images officielles
   - Mettez à jour régulièrement

3. **Réseau**
   - Utilisez des réseaux Docker privés
   - Exposez uniquement les ports nécessaires

### Exemple avec secrets

```yaml
secrets:
  supabase_key:
    file: ./secrets/supabase_key.txt

services:
  inventory-app:
    secrets:
      - supabase_key
    environment:
      - VITE_SUPABASE_ANON_KEY_FILE=/run/secrets/supabase_key
```

## 📈 Performance

### Optimisations Nginx

Le fichier `nginx.conf` inclut :
- Compression gzip
- Cache headers optimisés
- Mise en cache des assets statiques

### Optimisations Docker

- Multi-stage build pour réduire la taille
- `.dockerignore` pour exclure les fichiers inutiles
- Images Alpine pour la légèreté

---

Pour plus d'informations, consultez la [documentation officielle Docker](https://docs.docker.com/). 