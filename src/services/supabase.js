import db from './database.js'

// Service pour les pages
export const pagesService = {
  // Récupérer toutes les pages
  async getPages() {
    return await db.query('pages', 'select', {
      order: {
        column: 'created_at',
        options: { ascending: false }
      }
    })
  },

  // Récupérer une page par ID
  async getPage(id) {
    return await db.query('pages', 'select', {
      where: { id },
      single: true
    })
  },

  // Créer une nouvelle page
  async createPage(page) {
    return await db.query('pages', 'insert', {
      data: {
        name: page.name,
        logo: page.logo || 'collection',
        columns: page.columns || [],
        created_at: new Date().toISOString()
      },
      single: true
    })
  },

  // Mettre à jour une page
  async updatePage(id, updates) {
    return await db.query('pages', 'update', {
      where: { id },
      data: updates,
      single: true
    })
  },

  // Supprimer une page
  async deletePage(id) {
    return await db.query('pages', 'delete', {
      where: { id }
    })
  },

  // Récupérer les statistiques globales
  async getGlobalStats() {
    // Utiliser une approche simple en récupérant toutes les données
    const pages = await db.query('pages', 'select', { select: 'id,name,logo,created_at' })
    const items = await db.query('items', 'select', { select: 'id' })
    
    const logoCount = pages.reduce((acc, page) => {
      const logo = page.logo || 'collection'
      acc[logo] = (acc[logo] || 0) + 1
      return acc
    }, {})

    // Récupérer les pages récentes (5 dernières)
    const recentPages = pages
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map(page => ({
        id: page.id,
        name: page.name,
        logo: page.logo || 'collection',
        created_at: page.created_at
      }))

    return {
      totalPages: pages.length || 0,
      totalItems: items.length || 0,
      recentPages: recentPages,
      logoStats: logoCount
    }
  }
}

// Service pour les statistiques
export const statsService = {
  async getGlobalStats() {
    return await pagesService.getGlobalStats()
  }
}

// Export du client Supabase pour compatibilité
export const supabase = {
  // Méthodes de base pour compatibilité
  from: (table) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: [], error: null }),
    update: () => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null })
  })
}

// Service pour les items
export const itemsService = {
  // Récupérer tous les items d'une page
  async getItems(pageId) {
    return await db.query('items', 'select', {
      where: { page_id: pageId },
      order: {
        column: 'created_at',
        options: { ascending: false }
      }
    })
  },

  // Créer un nouvel item
  async createItem(item) {
    return await db.query('items', 'insert', {
      data: {
        page_id: item.page_id,
        data: item.data,
        created_at: new Date().toISOString()
      },
      single: true
    })
  },

  // Mettre à jour un item
  async updateItem(id, updates) {
    return await db.query('items', 'update', {
      where: { id },
      data: updates,
      single: true
    })
  },

  // Supprimer un item
  async deleteItem(id) {
    return await db.query('items', 'delete', {
      where: { id }
    })
  }
}