import { db } from './database'

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
    const pagesCount = await db.query('pages', 'select', { select: 'count(*) as count' })
    const itemsCount = await db.query('items', 'select', { select: 'count(*) as count' })
    const logoStats = await db.query('pages', 'select', { select: 'logo' })

    // Compter les logos
    const logoCount = logoStats.reduce((acc, page) => {
      const logo = page.logo || 'collection'
      acc[logo] = (acc[logo] || 0) + 1
      return acc
    }, {})

    return {
      totalPages: parseInt(pagesCount[0]?.count || 0),
      totalItems: parseInt(itemsCount[0]?.count || 0),
      logoStats: logoCount
    }
  }
}

// Service pour les items
export const itemsService = {
  // Récupérer tous les items d'une page
  async getItems(pageId) {
    return await db.query('items', 'select', {
      where: { page_id: pageId }
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