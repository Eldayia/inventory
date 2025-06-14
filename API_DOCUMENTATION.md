# Inventory API Documentation

Documentation complète de l'API Inventory pour l'automatisation et l'intégration avec des outils comme n8n et des agents IA.

## 🔐 Authentification

Inventory utilise l'authentification Supabase. Toutes les requêtes doivent inclure :

```http
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
apikey: YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
```

**Base URL** : `https://votre-projet.supabase.co/rest/v1`

## 📄 Pages API

### Lister toutes les pages

```http
GET /pages?select=*&order=created_at.desc
```

**Réponse** :
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Ma collection de livres",
    "columns": [
      {
        "id": "1",
        "name": "Titre",
        "type": "text",
        "width": 200
      },
      {
        "id": "2",
        "name": "Lu",
        "type": "checkbox",
        "width": 100
      }
    ],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### Récupérer une page spécifique

```http
GET /pages?id=eq.{page_id}&select=*
```

### Créer une nouvelle page

```http
POST /pages
```

**Body** :
```json
{
  "name": "Nouvelle page d'inventaire",
  "columns": [
    {
      "id": "1",
      "name": "Nom",
      "type": "text",
      "width": 200
    }
  ]
}
```

**Réponse** :
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Nouvelle page d'inventaire",
  "columns": [...],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Mettre à jour une page

```http
PATCH /pages?id=eq.{page_id}
```

**Body** :
```json
{
  "name": "Nouveau nom de page"
}
```

### Mettre à jour les colonnes d'une page

```http
PATCH /pages?id=eq.{page_id}
```

**Body** :
```json
{
  "columns": [
    {
      "id": "1",
      "name": "Titre du livre",
      "type": "text",
      "width": 250
    },
    {
      "id": "2",
      "name": "Genre",
      "type": "select",
      "options": ["Fiction", "Non-fiction", "Science-fiction", "Romance"],
      "width": 150
    },
    {
      "id": "3",
      "name": "Note",
      "type": "number",
      "width": 100
    },
    {
      "id": "4",
      "name": "Lu",
      "type": "checkbox",
      "width": 80
    }
  ]
}
```

### Supprimer une page

```http
DELETE /pages?id=eq.{page_id}
```

## 📋 Items API

### Lister tous les items d'une page

```http
GET /items?page_id=eq.{page_id}&select=*&order=order_index.asc
```

**Réponse** :
```json
[
  {
    "id": "456e7890-e89b-12d3-a456-426614174000",
    "page_id": "123e4567-e89b-12d3-a456-426614174000",
    "data": {
      "1": "Le Seigneur des Anneaux",
      "2": "Fiction",
      "3": 5,
      "4": true
    },
    "order_index": 0,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### Récupérer un item spécifique

```http
GET /items?id=eq.{item_id}&select=*
```

### Créer un nouvel item

```http
POST /items
```

**Body** :
```json
{
  "page_id": "123e4567-e89b-12d3-a456-426614174000",
  "data": {
    "1": "Nouveau livre",
    "2": "Fiction",
    "3": 4,
    "4": false
  },
  "order_index": 1
}
```

### Mettre à jour un item

```http
PATCH /items?id=eq.{item_id}
```

**Body** :
```json
{
  "data": {
    "1": "Titre modifié",
    "4": true
  }
}
```

### Mettre à jour une cellule spécifique

```http
PATCH /items?id=eq.{item_id}
```

**Body** :
```json
{
  "data": {
    "4": true
  }
}
```

### Supprimer un item

```http
DELETE /items?id=eq.{item_id}
```

### Supprimer plusieurs items

```http
DELETE /items?id=in.({item_id1},{item_id2},{item_id3})
```

## 🔄 Workflows n8n

### Exemple 1 : Ajouter un livre depuis un formulaire

**Trigger** : Webhook
**Action** : HTTP Request

```json
{
  "method": "POST",
  "url": "https://votre-projet.supabase.co/rest/v1/items",
  "headers": {
    "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY",
    "apikey": "YOUR_SUPABASE_ANON_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "page_id": "123e4567-e89b-12d3-a456-426614174000",
    "data": {
      "1": "{{$json.titre}}",
      "2": "{{$json.genre}}",
      "3": "{{$json.note}}",
      "4": false
    },
    "order_index": 999
  }
}
```

### Exemple 2 : Marquer un livre comme lu

```json
{
  "method": "PATCH",
  "url": "https://votre-projet.supabase.co/rest/v1/items?id=eq.{{$json.item_id}}",
  "headers": {
    "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY",
    "apikey": "YOUR_SUPABASE_ANON_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "data": {
      "4": true
    }
  }
}
```

### Exemple 3 : Récupérer tous les livres non lus

```json
{
  "method": "GET",
  "url": "https://votre-projet.supabase.co/rest/v1/items?page_id=eq.123e4567-e89b-12d3-a456-426614174000&data->>4=eq.false&select=*",
  "headers": {
    "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY",
    "apikey": "YOUR_SUPABASE_ANON_KEY"
  }
}
```

## 🤖 Intégration Agent IA

### Fonctions disponibles pour un agent IA

#### 1. Lire le contenu d'une page

```python
def get_page_content(page_id):
    """
    Récupère le contenu complet d'une page d'inventaire
    """
    # Récupérer la page et ses colonnes
    page_response = requests.get(
        f"{SUPABASE_URL}/rest/v1/pages?id=eq.{page_id}&select=*",
        headers=headers
    )
    
    # Récupérer tous les items
    items_response = requests.get(
        f"{SUPABASE_URL}/rest/v1/items?page_id=eq.{page_id}&select=*&order=order_index.asc",
        headers=headers
    )
    
    return {
        "page": page_response.json()[0],
        "items": items_response.json()
    }
```

#### 2. Ajouter un élément

```python
def add_item(page_id, item_data):
    """
    Ajoute un nouvel élément à une page
    item_data: dict avec les valeurs pour chaque colonne
    """
    response = requests.post(
        f"{SUPABASE_URL}/rest/v1/items",
        headers=headers,
        json={
            "page_id": page_id,
            "data": item_data,
            "order_index": 999
        }
    )
    return response.json()
```

#### 3. Mettre à jour une cellule

```python
def update_cell(item_id, column_id, value):
    """
    Met à jour une cellule spécifique
    """
    # D'abord récupérer l'item actuel
    current_item = requests.get(
        f"{SUPABASE_URL}/rest/v1/items?id=eq.{item_id}&select=*",
        headers=headers
    ).json()[0]
    
    # Mettre à jour la donnée
    current_item["data"][column_id] = value
    
    # Sauvegarder
    response = requests.patch(
        f"{SUPABASE_URL}/rest/v1/items?id=eq.{item_id}",
        headers=headers,
        json={"data": current_item["data"]}
    )
    return response.json()
```

#### 4. Rechercher des éléments

```python
def search_items(page_id, column_id, value):
    """
    Recherche des éléments par valeur dans une colonne
    """
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/items?page_id=eq.{page_id}&data->>{column_id}=eq.{value}&select=*",
        headers=headers
    )
    return response.json()
```

## 📊 Types de Colonnes

### Text (texte)
```json
{
  "id": "1",
  "name": "Titre",
  "type": "text",
  "width": 200
}
```
**Valeurs** : Chaînes de caractères

### Number (nombre)
```json
{
  "id": "2",
  "name": "Quantité",
  "type": "number",
  "width": 100
}
```
**Valeurs** : Nombres (entiers ou décimaux)

### Checkbox (case à cocher)
```json
{
  "id": "3",
  "name": "Terminé",
  "type": "checkbox",
  "width": 80
}
```
**Valeurs** : `true` ou `false`

### Select (choix multiple)
```json
{
  "id": "4",
  "name": "État",
  "type": "select",
  "options": ["Neuf", "Bon état", "Usagé", "Abîmé"],
  "width": 120
}
```
**Valeurs** : Une des chaînes définies dans `options`

## ⚠️ Gestion d'erreurs

### Codes de réponse HTTP
- `200` : Succès
- `201` : Créé avec succès
- `400` : Requête invalide
- `401` : Non autorisé (vérifiez vos clés API)
- `404` : Ressource non trouvée
- `500` : Erreur serveur

### Exemples d'erreurs

```json
{
  "code": "PGRST116",
  "details": "The result contains 0 rows",
  "hint": null,
  "message": "JSON object requested, multiple (or no) rows returned"
}
```

## 🔍 Filtres et requêtes avancées

### Filtrer par valeur JSON
```http
GET /items?page_id=eq.{page_id}&data->>column_id=eq.value
```

### Filtrer par plage de nombres
```http
GET /items?page_id=eq.{page_id}&data->>column_id=gte.10&data->>column_id=lte.100
```

### Recherche textuelle
```http
GET /items?page_id=eq.{page_id}&data->>column_id=ilike.*search_term*
```

### Trier les résultats
```http
GET /items?page_id=eq.{page_id}&order=created_at.desc
```

### Limiter les résultats
```http
GET /items?page_id=eq.{page_id}&limit=10&offset=20
```

---

**Note** : Cette API est construite sur Supabase PostgREST. Pour des requêtes plus avancées, consultez la [documentation PostgREST](https://postgrest.org/en/stable/api.html).