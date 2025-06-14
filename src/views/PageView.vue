<template>
  <div v-if="loading" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>

  <div v-else-if="!page" class="text-center py-12">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Page non trouvée</h2>
    <router-link to="/" class="btn btn-primary">Retour à l'accueil</router-link>
  </div>

  <div v-else>
    <!-- En-tête de la page -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
      <div class="flex-1">
        <div class="flex items-center space-x-3">
          <router-link to="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </router-link>
          <div class="w-8 h-8 text-primary-600 dark:text-primary-400 flex-shrink-0" v-html="getPageLogo(page.logo)"></div>
          <h1 
            v-if="!editingTitle" 
            @dblclick="startEditTitle" 
            class="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 transition-colors"
            title="Double-cliquez pour renommer"
          >
            {{ page.name }}
          </h1>
          <input 
            v-else
            v-model="titleEdit"
            @blur="saveTitle"
            @keyup.enter="saveTitle"
            @keyup.escape="cancelEditTitle"
            class="text-2xl font-bold bg-transparent border-b-2 border-primary-500 outline-none text-gray-900 dark:text-white"
            ref="titleInput"
          >
        </div>
        <p class="text-gray-600 dark:text-gray-400 mt-1">{{ items.length }} éléments</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Boutons d'import/export -->
        <div class="flex items-center space-x-2">
          <input 
            ref="fileInput" 
            type="file" 
            accept=".csv" 
            @change="importCSV" 
            class="hidden"
          >
          <button @click="$refs.fileInput.click()" class="btn btn-secondary text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
            Importer
          </button>
          <button @click="exportCSV" class="btn btn-secondary text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Exporter
          </button>
        </div>
        
        <button @click="addColumn" class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Ajouter une colonne
        </button>
      </div>
    </div>

    <!-- Grille -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <!-- En-tête des colonnes -->
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="w-12 px-4 py-3 text-left">
                <input 
                  type="checkbox" 
                  v-model="selectAll" 
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                >
              </th>
              <th 
                v-for="(column, index) in page.columns" 
                :key="column.id"
                class="relative px-4 py-3 text-left font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 last:border-r-0"
                :style="{ width: column.width + 'px' }"
              >
                <div class="flex items-center justify-between group">
                  <div class="flex-1">
                    <input 
                      v-if="editingColumn === column.id"
                      v-model="columnEdit.name"
                      @blur="saveColumnName(column)"
                      @keyup.enter="saveColumnName(column)"
                      @keyup.escape="cancelEditColumn"
                      class="bg-transparent border-none outline-none w-full font-medium"
                      ref="columnInput"
                    >
                    <span 
                      v-else
                      @dblclick="startEditColumn(column)"
                      class="cursor-pointer hover:text-primary-600 transition-colors"
                      :title="'Double-cliquez pour renommer - Type: ' + getColumnTypeLabel(column.type)"
                    >
                      {{ column.name }}
                    </span>
                  </div>
                  
                  <!-- Menu des actions de colonne -->
                  <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      @click="editColumn(column)"
                      class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-blue-500"
                      title="Modifier la colonne"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="moveColumn(index, -1)"
                      :disabled="index === 0"
                      class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50"
                      title="Déplacer à gauche"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <button 
                      @click="moveColumn(index, 1)"
                      :disabled="index === page.columns.length - 1"
                      class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50"
                      title="Déplacer à droite"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deleteColumn(column)"
                      class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-red-500"
                      title="Supprimer la colonne"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Redimensionneur de colonne -->
                <div 
                  class="column-resizer"
                  @mousedown="startResize($event, column)"
                ></div>
              </th>
            </tr>
          </thead>
          
          <!-- Corps du tableau -->
          <tbody>
            <tr 
              v-for="(item, itemIndex) in items" 
              :key="item.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              :class="{ 'bg-blue-50 dark:bg-blue-900/20': selectedItems.includes(item.id) }"
            >
              <td class="px-4 py-3">
                <input 
                  type="checkbox" 
                  :value="item.id" 
                  v-model="selectedItems"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                >
              </td>
              <td 
                v-for="column in page.columns" 
                :key="column.id"
                class="px-4 py-3 border-r border-gray-200 dark:border-gray-600 last:border-r-0"
              >
                <CellEditor 
                  :value="item.data[column.id]"
                  :column="column"
                  @update="updateCell(item.id, column.id, $event)"
                />
              </td>
            </tr>
            
            <!-- Ligne vide pour ajouter un nouvel item -->
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <td class="px-4 py-3">
                <button 
                  @click="addItem"
                  class="w-6 h-6 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center"
                  title="Ajouter une ligne"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </td>
              <td 
                v-for="column in page.columns" 
                :key="column.id"
                class="px-4 py-3 border-r border-gray-200 dark:border-gray-600 last:border-r-0 text-gray-400 dark:text-gray-500"
              >
                <span class="text-sm italic">Nouvelle ligne...</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Actions pour les éléments sélectionnés -->
    <div v-if="selectedItems.length > 0" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center space-x-4">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ selectedItems.length }} élément(s) sélectionné(s)
      </span>
      <button 
        @click="deleteSelectedItems"
        class="btn btn-danger btn-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        Supprimer
      </button>
      <button 
        @click="selectedItems = []"
        class="btn btn-secondary btn-sm"
      >
        Annuler
      </button>
    </div>

    <!-- Modal pour ajouter/modifier une colonne -->
    <ColumnModal 
      v-if="showColumnModal" 
      :editingColumn="editingColumnData"
      @close="closeColumnModal" 
      @save="saveColumn"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { pagesService, itemsService } from '@/services/supabase'
import CellEditor from '@/components/CellEditor.vue'
import ColumnModal from '@/components/ColumnModal.vue'
import Papa from 'papaparse'

// Props
const route = useRoute()
const pageId = route.params.id

// État
const page = ref(null)
const items = ref([])
const loading = ref(true)
const selectedItems = ref([])
const showColumnModal = ref(false)
const editingColumnData = ref(null)

// Édition du titre
const editingTitle = ref(false)
const titleEdit = ref('')
const titleInput = ref(null)

// Édition des colonnes
const editingColumn = ref(null)
const columnEdit = ref({ name: '' })
const columnInput = ref(null)

// Redimensionnement des colonnes
const resizing = ref(null)

// Logos disponibles avec SVG
const availableLogos = ref([
  { 
    name: 'collection', 
    label: 'Collection générale', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>' 
  },
  { 
    name: 'manga', 
    label: 'Manga', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>' 
  },
  { 
    name: 'films', 
    label: 'Films', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>' 
  },
  { 
    name: 'games', 
    label: 'Jeux vidéo', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 6.5C15.5 5.66 14.84 5 14 5S12.5 5.66 12.5 6.5 13.16 8 14 8s1.5-.66 1.5-1.5zM19.5 12c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM18 13.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM16.5 12c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM21 9h-3.5c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5H21c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5zM6.5 9H3c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h3.5c.83 0 1.5-.67 1.5-1.5v-3C8 9.67 7.33 9 6.5 9zM5 11.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM6.5 13c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM4.5 13c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM3 11.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z"/></svg>' 
  },
  { 
    name: 'lego', 
    label: 'LEGO', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' 
  },
  { 
    name: 'books', 
    label: 'Livres', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>' 
  },
  { 
    name: 'music', 
    label: 'Musique', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>' 
  },
  { 
    name: 'sports', 
    label: 'Sport', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 4V2C7 1.45 7.45 1 8 1s1 .45 1 1v2h6V2c0-.55.45-1 1-1s1 .45 1 1v2h1c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h1zM6 8v10h12V8H6zm6 7l-3-2v4l3-2z"/></svg>' 
  },
  { 
    name: 'tools', 
    label: 'Outils', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>' 
  },
  { 
    name: 'art', 
    label: 'Art', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-.56 2.5-1.25 0-.34-.13-.65-.35-.89-.22-.24-.35-.55-.35-.89 0-.69 1.12-1.25 2.5-1.25H18c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zM5.5 12c-.83 0-1.5-.67-1.5-1.5S4.67 9 5.5 9s1.5.67 1.5 1.5S6.33 12 5.5 12zm3-4C7.67 8 7 7.33 7 6.5S7.67 5 8.5 5s1.5.67 1.5 1.5S9.33 8 8.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S12.67 5 13.5 5s1.5.67 1.5 1.5S14.33 8 13.5 8zm4.5 2.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/></svg>' 
  },
  { 
    name: 'tech', 
    label: 'Technologie', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>' 
  },
  { 
    name: 'food', 
    label: 'Cuisine', 
    svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07L7.4 15.99c-.78.78-.78 2.05 0 2.83l1.27 1.27c.78.78 2.05.78 2.83 0L12 19.59l.5.5c.78.78 2.05.78 2.83 0l1.27-1.27c.78-.78.78-2.04 0-2.83zm-.78-8.38c-.48-.48-1.28-.48-1.76 0L12 9.67l-2.06-2.06c-.48-.48-1.28-.48-1.76 0-.48.48-.48 1.28 0 1.76l2.06 2.06-2.06 2.06c-.48.48-.48 1.28 0 1.76s1.28.48 1.76 0L12 13.19l2.06 2.06c.48.48 1.28.48 1.76 0s.48-1.28 0-1.76L13.76 11.5l2.06-2.06c.48-.48.48-1.28 0-1.76z"/></svg>' 
  }
])

// Récupérer le SVG d'un logo
const getPageLogo = (logoName) => {
  const logo = availableLogos.value.find(l => l.name === logoName)
  return logo ? logo.svg : availableLogos.value[0].svg // Fallback vers le premier logo
}

// Computed
const selectAll = computed({
  get: () => selectedItems.value.length === items.value.length && items.value.length > 0,
  set: (value) => {
    selectedItems.value = value ? items.value.map(item => item.id) : []
  }
})

// Méthodes
const loadPage = async () => {
  try {
    page.value = await pagesService.getPage(pageId)
    if (!page.value.columns) {
      page.value.columns = []
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la page:', error)
  }
}

const loadItems = async () => {
  try {
    items.value = await itemsService.getItems(pageId)
  } catch (error) {
    console.error('Erreur lors du chargement des items:', error)
  }
}

const loadData = async () => {
  loading.value = true
  await Promise.all([loadPage(), loadItems()])
  loading.value = false
}

// Gestion du titre
const startEditTitle = async () => {
  editingTitle.value = true
  titleEdit.value = page.value.name
  await nextTick()
  titleInput.value?.focus()
}

const saveTitle = async () => {
  if (titleEdit.value.trim() && titleEdit.value !== page.value.name) {
    try {
      await pagesService.updatePage(pageId, { name: titleEdit.value.trim() })
      page.value.name = titleEdit.value.trim()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du titre:', error)
    }
  }
  editingTitle.value = false
}

const cancelEditTitle = () => {
  editingTitle.value = false
  titleEdit.value = ''
}

// Gestion des colonnes
const addColumn = () => {
  editingColumnData.value = null
  showColumnModal.value = true
}

// Modifier une colonne existante
const editColumn = (column) => {
  editingColumnData.value = { ...column }
  showColumnModal.value = true
}

// Fermer le modal
const closeColumnModal = () => {
  showColumnModal.value = false
  editingColumnData.value = null
}

const saveColumn = async (columnData) => {
  try {
    if (editingColumnData.value) {
      // Modification d'une colonne existante
      const columnIndex = page.value.columns.findIndex(col => col.id === columnData.id)
      if (columnIndex !== -1) {
        const updatedColumn = {
          ...page.value.columns[columnIndex],
          name: columnData.name,
          type: columnData.type
        }
        
        if (columnData.type === 'select') {
          updatedColumn.options = columnData.options
        } else {
          delete updatedColumn.options
        }
        
        const updatedColumns = [...page.value.columns]
        updatedColumns[columnIndex] = updatedColumn
        
        // Si le type de colonne a changé, mettre à jour les données existantes
        if (editingColumnData.value.type !== columnData.type) {
          const updatedItems = items.value.map(item => {
            if (item.data[columnData.id] !== undefined) {
              const newData = { ...item.data }
              // Convertir les données selon le nouveau type
              switch (columnData.type) {
                case 'checkbox':
                  newData[columnData.id] = false
                  break
                case 'number':
                  newData[columnData.id] = 0
                  break
                case 'select':
                  newData[columnData.id] = columnData.options?.[0] || ''
                  break
                default:
                  newData[columnData.id] = String(item.data[columnData.id] || '')
              }
              return { ...item, data: newData }
            }
            return item
          })
          
          // Mettre à jour les items dans la base de données
          await Promise.all(
            updatedItems.map(item => 
              itemsService.updateItem(item.id, { data: item.data })
            )
          )
          
          items.value = updatedItems
        }
        
        await pagesService.updatePage(pageId, { columns: updatedColumns })
        page.value.columns = updatedColumns
      }
    } else {
      // Ajout d'une nouvelle colonne
      const newColumn = {
        id: Date.now().toString(),
        name: columnData.name,
        type: columnData.type,
        options: columnData.options || [],
        width: 200
      }
      
      const updatedColumns = [...page.value.columns, newColumn]
      await pagesService.updatePage(pageId, { columns: updatedColumns })
      page.value.columns = updatedColumns
    }
    
    closeColumnModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la colonne:', error)
  }
}

const startEditColumn = async (column) => {
  editingColumn.value = column.id
  columnEdit.value.name = column.name
  await nextTick()
  columnInput.value?.focus()
}

const saveColumnName = async (column) => {
  if (columnEdit.value.name.trim() && columnEdit.value.name !== column.name) {
    try {
      const updatedColumns = page.value.columns.map(col => 
        col.id === column.id ? { ...col, name: columnEdit.value.name.trim() } : col
      )
      await pagesService.updatePage(pageId, { columns: updatedColumns })
      page.value.columns = updatedColumns
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du nom de colonne:', error)
    }
  }
  editingColumn.value = null
}

const cancelEditColumn = () => {
  editingColumn.value = null
  columnEdit.value.name = ''
}

const moveColumn = async (fromIndex, direction) => {
  const toIndex = fromIndex + direction
  if (toIndex < 0 || toIndex >= page.value.columns.length) return
  
  const columns = [...page.value.columns]
  const [movedColumn] = columns.splice(fromIndex, 1)
  columns.splice(toIndex, 0, movedColumn)
  
  try {
    await pagesService.updatePage(pageId, { columns })
    page.value.columns = columns
  } catch (error) {
    console.error('Erreur lors du déplacement de la colonne:', error)
  }
}

const deleteColumn = async (column) => {
  if (confirm(`Voulez-vous vraiment supprimer la colonne "${column.name}" ?`)) {
    try {
      const updatedColumns = page.value.columns.filter(col => col.id !== column.id)
      await pagesService.updatePage(pageId, { columns: updatedColumns })
      page.value.columns = updatedColumns
      
      // Supprimer les données de cette colonne dans tous les items
      const updatedItems = items.value.map(item => {
        const newData = { ...item.data }
        delete newData[column.id]
        return { ...item, data: newData }
      })
      
      await Promise.all(
        updatedItems.map(item => 
          itemsService.updateItem(item.id, { data: item.data })
        )
      )
      
      items.value = updatedItems
    } catch (error) {
      console.error('Erreur lors de la suppression de la colonne:', error)
    }
  }
}

const getColumnTypeLabel = (type) => {
  const labels = {
    text: 'Texte',
    number: 'Nombre',
    checkbox: 'Case à cocher',
    select: 'Choix multiple'
  }
  return labels[type] || 'Texte'
}

// Gestion des items
const addItem = async () => {
  try {
    const newItem = {
      page_id: pageId,
      data: {},
      order_index: items.value.length
    }
    
    const createdItem = await itemsService.createItem(newItem)
    items.value.push(createdItem)
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'item:', error)
  }
}

const updateCell = async (itemId, columnId, value) => {
  try {
    const item = items.value.find(i => i.id === itemId)
    if (item) {
      const newData = { ...item.data, [columnId]: value }
      await itemsService.updateItem(itemId, { data: newData })
      item.data = newData
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la cellule:', error)
  }
}

const toggleSelectAll = () => {
  selectedItems.value = selectAll.value ? [] : items.value.map(item => item.id)
}

const deleteSelectedItems = async () => {
  if (confirm(`Voulez-vous vraiment supprimer ${selectedItems.value.length} élément(s) ?`)) {
    try {
      await Promise.all(
        selectedItems.value.map(id => itemsService.deleteItem(id))
      )
      items.value = items.value.filter(item => !selectedItems.value.includes(item.id))
      selectedItems.value = []
    } catch (error) {
      console.error('Erreur lors de la suppression des items:', error)
    }
  }
}

// Import/Export
const exportCSV = () => {
  const headers = page.value.columns.map(col => col.name)
  const data = items.value.map(item => 
    page.value.columns.map(col => item.data[col.id] || '')
  )
  
  const csv = Papa.unparse([headers, ...data])
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${page.value.name}.csv`
  link.click()
}

const importCSV = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  Papa.parse(file, {
    header: true,
    complete: async (results) => {
      try {
        const newItems = results.data.filter(row => 
          Object.values(row).some(value => value && value.trim())
        ).map((row, index) => {
          const data = {}
          page.value.columns.forEach(col => {
            if (row[col.name] !== undefined) {
              data[col.id] = row[col.name]
            }
          })
          
          return {
            page_id: pageId,
            data,
            order_index: items.value.length + index
          }
        })
        
        const createdItems = await Promise.all(
          newItems.map(item => itemsService.createItem(item))
        )
        
        items.value.push(...createdItems)
      } catch (error) {
        console.error('Erreur lors de l\'import:', error)
      }
    }
  })
  
  // Reset input
  event.target.value = ''
}

// Redimensionnement des colonnes
const startResize = (event, column) => {
  event.preventDefault()
  resizing.value = {
    column,
    startX: event.clientX,
    startWidth: column.width || 200
  }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (event) => {
  if (!resizing.value) return
  
  const diff = event.clientX - resizing.value.startX
  const newWidth = Math.max(100, resizing.value.startWidth + diff)
  resizing.value.column.width = newWidth
}

const stopResize = async () => {
  if (resizing.value) {
    try {
      await pagesService.updatePage(pageId, { columns: page.value.columns })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la largeur:', error)
    }
  }
  
  resizing.value = null
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// Initialisation
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.btn-sm {
  @apply px-3 py-1 text-sm;
}
</style>