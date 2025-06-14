import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - À remplacer par vos vraies valeurs
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Service pour les pages
export const pagesService = {
  // Récupérer toutes les pages
  async getPages() {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Récupérer une page par ID
  async getPage(id) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Créer une nouvelle page
  async createPage(page) {
    const { data, error } = await supabase
      .from('pages')
      .insert([{
        name: page.name,
        logo: page.logo || 'collection',
        columns: page.columns || [],
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Mettre à jour une page
  async updatePage(id, updates) {
    console.log('updatePage appelée avec:', { id, updates })
    const { data, error } = await supabase
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    console.log('Résultat updatePage:', { data, error })
    if (error) throw error
    return data
  },

  // Supprimer une page
  async deletePage(id) {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Service pour les statistiques
export const statsService = {
  // Récupérer les statistiques globales
  async getGlobalStats() {
    try {
      // Nombre total de pages
      const { count: pagesCount, error: pagesError } = await supabase
        .from('pages')
        .select('*', { count: 'exact', head: true })
      
      if (pagesError) throw pagesError

      // Nombre total d'items
      const { count: itemsCount, error: itemsError } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
      
      if (itemsError) throw itemsError

      // Pages les plus récentes
      const { data: recentPages, error: recentError } = await supabase
        .from('pages')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (recentError) throw recentError

      // Statistiques par type de logo (collections par catégorie)
      const { data: logoStats, error: logoError } = await supabase
        .from('pages')
        .select('logo')
      
      if (logoError) throw logoError

      // Compter les logos
      const logoCount = logoStats.reduce((acc, page) => {
        const logo = page.logo || 'collection'
        acc[logo] = (acc[logo] || 0) + 1
        return acc
      }, {})

      return {
        totalPages: pagesCount || 0,
        totalItems: itemsCount || 0,
        recentPages: recentPages || [],
        logoStats: logoCount
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
      return {
        totalPages: 0,
        totalItems: 0,
        recentPages: [],
        logoStats: {}
      }
    }
  }
}

// Service pour les items
export const itemsService = {
  // Récupérer tous les items d'une page
  async getItems(pageId) {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('page_id', pageId)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Créer un nouvel item
  async createItem(item) {
    const { data, error } = await supabase
      .from('items')
      .insert([{
        page_id: item.page_id,
        data: item.data || {},
        order_index: item.order_index || 0,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Mettre à jour un item
  async updateItem(id, updates) {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Supprimer un item
  async deleteItem(id) {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Mettre à jour l'ordre des items
  async updateItemsOrder(items) {
    const updates = items.map((item, index) => ({
      id: item.id,
      order_index: index
    }))

    const { error } = await supabase
      .from('items')
      .upsert(updates)
    
    if (error) throw error
  }
}