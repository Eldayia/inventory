<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Paramètres</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Thème -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Thème
          </label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input 
                type="radio" 
                v-model="themePreference" 
                value="system" 
                class="mr-3 text-primary-600"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">Système</span>
            </label>
            <label class="flex items-center">
              <input 
                type="radio" 
                v-model="themePreference" 
                value="light" 
                class="mr-3 text-primary-600"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">Clair</span>
            </label>
            <label class="flex items-center">
              <input 
                type="radio" 
                v-model="themePreference" 
                value="dark" 
                class="mr-3 text-primary-600"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">Sombre</span>
            </label>
          </div>
        </div>

        <!-- Import/Export -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Sauvegarde complète
          </label>
          <div class="space-y-3">
            <button 
              @click="exportData" 
              :disabled="isExporting"
              class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg v-if="!isExporting" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isExporting ? 'Export en cours...' : 'Exporter toutes les données' }}
            </button>
            
            <div class="relative">
              <input 
                ref="fileInput"
                type="file" 
                accept=".json"
                @change="importData"
                class="hidden"
              >
              <button 
                @click="$refs.fileInput.click()"
                :disabled="isImporting"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg v-if="!isImporting" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
                <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isImporting ? 'Import en cours...' : 'Importer des données' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Message de statut -->
        <div v-if="statusMessage" class="p-3 rounded-lg" :class="{
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': statusType === 'success',
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': statusType === 'error'
        }">
          {{ statusMessage }}
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { supabase } from '../services/supabase'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'themeChange'])

// État
const themePreference = ref('system')
const isExporting = ref(false)
const isImporting = ref(false)
const statusMessage = ref('')
const statusType = ref('success')

// Charger les préférences
onMounted(() => {
  const savedTheme = localStorage.getItem('themePreference') || 'system'
  themePreference.value = savedTheme
})

// Surveiller les changements de thème
watch(themePreference, (newTheme) => {
  localStorage.setItem('themePreference', newTheme)
  emit('themeChange', newTheme)
})

// Export des données
const exportData = async () => {
  try {
    isExporting.value = true
    statusMessage.value = ''
    
    // Récupérer toutes les pages
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
    
    if (pagesError) throw pagesError
    
    // Récupérer tous les items
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
    
    if (itemsError) throw itemsError
    
    // Créer l'objet d'export
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      pages: pages || [],
      items: items || []
    }
    
    // Télécharger le fichier
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flexilist-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    statusMessage.value = 'Export réussi !'
    statusType.value = 'success'
    
  } catch (error) {
    console.error('Erreur lors de l\'export:', error)
    statusMessage.value = 'Erreur lors de l\'export: ' + error.message
    statusType.value = 'error'
  } finally {
    isExporting.value = false
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
  }
}

// Import des données
const importData = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    isImporting.value = true
    statusMessage.value = ''
    
    const text = await file.text()
    const data = JSON.parse(text)
    
    // Vérifier la structure
    if (!data.pages || !data.items) {
      throw new Error('Format de fichier invalide')
    }
    
    // Confirmer l'import
    if (!confirm('Cette action va remplacer toutes vos données existantes. Êtes-vous sûr ?')) {
      return
    }
    
    // Supprimer les données existantes
    await supabase.from('items').delete().neq('id', 0)
    await supabase.from('pages').delete().neq('id', 0)
    
    // Importer les pages
    if (data.pages.length > 0) {
      const { error: pagesError } = await supabase
        .from('pages')
        .insert(data.pages.map(page => ({
          title: page.title,
          columns: page.columns,
          created_at: page.created_at
        })))
      
      if (pagesError) throw pagesError
    }
    
    // Importer les items
    if (data.items.length > 0) {
      const { error: itemsError } = await supabase
        .from('items')
        .insert(data.items.map(item => ({
          page_id: item.page_id,
          data: item.data,
          created_at: item.created_at
        })))
      
      if (itemsError) throw itemsError
    }
    
    statusMessage.value = `Import réussi ! ${data.pages.length} pages et ${data.items.length} éléments importés.`
    statusType.value = 'success'
    
    // Recharger la page après un délai
    setTimeout(() => {
      window.location.reload()
    }, 2000)
    
  } catch (error) {
    console.error('Erreur lors de l\'import:', error)
    statusMessage.value = 'Erreur lors de l\'import: ' + error.message
    statusType.value = 'error'
  } finally {
    isImporting.value = false
    event.target.value = ''
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
  }
}
</script>