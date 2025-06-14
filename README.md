# FlexiList - Gestionnaire d'Inventaire Flexible

FlexiList est une application web moderne et responsive pour la gestion d'inventaires personnels, conçue comme un tableur Notion/Airtable simplifié avec une forte composante de personnalisation.

## 🚀 Fonctionnalités

### Gestion des Pages
- ✅ Créer des pages d'inventaire personnalisées
- ✅ Renommer les pages (double-clic)
- ✅ Supprimer avec double confirmation de sécurité
- ✅ Navigation intuitive entre les pages

### Grille Personnalisable
- ✅ **Colonnes dynamiques** : Ajout, suppression, renommage, réorganisation
- ✅ **Types de données multiples** :
  - Texte libre
  - Nombres
  - Cases à cocher
  - Choix multiples (avec options personnalisées)
- ✅ **Redimensionnement** des colonnes par glisser-déposer
- ✅ **Édition inline** directe dans les cellules

### Gestion des Données
- ✅ Ajout/suppression de lignes
- ✅ Sélection multiple avec actions groupées
- ✅ **Import/Export CSV** pour l'interopérabilité
- ✅ Sauvegarde automatique en temps réel

### Interface Utilisateur
- ✅ **Design responsive** - Parfait sur mobile et desktop
- ✅ **Thème clair/sombre** avec sauvegarde des préférences
- ✅ Interface intuitive avec icônes claires
- ✅ Animations fluides et feedback visuel

## 🛠️ Technologies

- **Frontend** : Vue.js 3 (Composition API) + Vite
- **Styling** : Tailwind CSS
- **Base de données** : Supabase (PostgreSQL)
- **Import/Export** : PapaParse (CSV)
- **Drag & Drop** : SortableJS

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase (gratuit)

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd inventory
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configuration Supabase

#### A. Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre `Project URL` et `anon public key`

#### B. Créer les tables
Exécutez ce SQL dans l'éditeur Supabase :

```sql
-- Table des pages d'inventaire
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  columns JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des items/lignes
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}'::jsonb,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_items_page_id ON items(page_id);
CREATE INDEX idx_items_order ON items(page_id, order_index);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### C. Configurer les variables d'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec vos vraies valeurs
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon
```

### 4. Lancer l'application
```bash
npm run dev
# ou
yarn dev
```

L'application sera disponible sur `http://localhost:3000`

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement dans le dashboard Vercel
```

### Netlify
```bash
# Build
npm run build

# Le dossier dist/ contient les fichiers à déployer
# Configurez les variables d'environnement dans Netlify
```

## 📖 Guide d'utilisation

### Créer votre première page
1. Cliquez sur "Nouvelle Page" sur l'accueil
2. Donnez un nom à votre inventaire (ex: "Ma collection de livres")
3. Cliquez sur "Créer"

### Personnaliser les colonnes
1. Dans votre page, cliquez sur "Ajouter une colonne"
2. Choisissez le nom et le type :
   - **Texte** : Pour les titres, descriptions, etc.
   - **Nombre** : Pour les quantités, prix, etc.
   - **Case à cocher** : Pour marquer comme lu/non lu, etc.
   - **Choix multiple** : Pour les catégories, états, etc.
3. Pour les choix multiples, définissez vos options

### Gérer vos données
- **Ajouter une ligne** : Cliquez sur le bouton "+" en bas du tableau
- **Éditer** : Cliquez directement dans une cellule
- **Sélectionner** : Utilisez les cases à cocher pour sélectionner plusieurs lignes
- **Supprimer** : Sélectionnez les lignes et cliquez sur "Supprimer"

### Import/Export
- **Exporter** : Bouton "Exporter" pour télécharger en CSV
- **Importer** : Bouton "Importer" pour charger un fichier CSV
  - Le CSV doit avoir des en-têtes correspondant aux noms de vos colonnes

## 🔧 API Documentation

FlexiList expose une API RESTful complète pour l'automatisation et l'intégration avec des outils comme n8n.

### Authentification
Utilisez votre clé Supabase anon dans l'en-tête :
```
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
apikey: YOUR_SUPABASE_ANON_KEY
```

### Endpoints principaux

#### Pages
```http
# Lister toutes les pages
GET https://votre-projet.supabase.co/rest/v1/pages

# Créer une page
POST https://votre-projet.supabase.co/rest/v1/pages
Content-Type: application/json
{
  "name": "Ma nouvelle page",
  "columns": []
}

# Mettre à jour une page
PATCH https://votre-projet.supabase.co/rest/v1/pages?id=eq.UUID
Content-Type: application/json
{
  "name": "Nouveau nom"
}

# Supprimer une page
DELETE https://votre-projet.supabase.co/rest/v1/pages?id=eq.UUID
```

#### Items
```http
# Lister les items d'une page
GET https://votre-projet.supabase.co/rest/v1/items?page_id=eq.UUID&order=order_index

# Créer un item
POST https://votre-projet.supabase.co/rest/v1/items
Content-Type: application/json
{
  "page_id": "UUID",
  "data": {"colonne1": "valeur1"},
  "order_index": 0
}

# Mettre à jour un item
PATCH https://votre-projet.supabase.co/rest/v1/items?id=eq.UUID
Content-Type: application/json
{
  "data": {"colonne1": "nouvelle_valeur"}
}
```

### Exemples d'intégration n8n

#### Ajouter un item via webhook
```json
{
  "method": "POST",
  "url": "https://votre-projet.supabase.co/rest/v1/items",
  "headers": {
    "Authorization": "Bearer YOUR_KEY",
    "apikey": "YOUR_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "page_id": "{{$json.page_id}}",
    "data": {
      "nom": "{{$json.nom}}",
      "quantite": "{{$json.quantite}}"
    }
  }
}
```

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que vos variables d'environnement Supabase sont correctes
2. Assurez-vous que les tables sont créées dans Supabase
3. Consultez la console du navigateur pour les erreurs
4. Ouvrez une issue sur GitHub avec les détails de l'erreur

---

**FlexiList** - Organisez vos données comme vous le souhaitez ! 🎯