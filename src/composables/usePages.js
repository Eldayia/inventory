import { ref, computed } from 'vue'
import { pagesService } from '@/services/supabase'

// État global des pages
const pages = ref([])
const loadingPages = ref(false)

export function usePages() {
  // Charger les pages
  const loadPages = async () => {
    try {
      loadingPages.value = true
      const data = await pagesService.getPages()
      pages.value = data || []
    } catch (error) {
      console.error('Erreur lors du chargement des pages:', error)
      pages.value = []
    } finally {
      loadingPages.value = false
    }
  }

  // Ajouter une page
  const addPage = (page) => {
    pages.value.push(page)
  }

  // Mettre à jour une page
  const updatePage = (pageId, updates) => {
    const index = pages.value.findIndex(p => p.id === pageId)
    if (index !== -1) {
      pages.value[index] = { ...pages.value[index], ...updates }
    }
  }

  // Supprimer une page
  const removePage = (pageId) => {
    pages.value = pages.value.filter(p => p.id !== pageId)
  }

  // Trouver une page par ID
  const findPage = (pageId) => {
    return pages.value.find(p => p.id === pageId)
  }

  return {
    pages: computed(() => pages.value),
    loadingPages: computed(() => loadingPages.value),
    loadPages,
    addPage,
    updatePage,
    removePage,
    findPage
  }
} 