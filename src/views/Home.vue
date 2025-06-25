<template>
  <div>
    <!-- En-tête avec bouton de création -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Mes Inventaires</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Gérez vos collections et inventaires personnels</p>
      </div>
      <button 
        @click="showCreateModal = true" 
        class="btn btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Nouvelle Page</span>
      </button>
    </div>

    <!-- Statistiques d'accueil -->
    <div v-if="!loading && pages.length > 0" class="mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Nombre total de collections -->
        <div class="card p-4">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Collections</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalPages }}</p>
            </div>
          </div>
        </div>

        <!-- Nombre total d'entrées -->
        <div class="card p-4">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Entrées totales</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalItems }}</p>
            </div>
          </div>
        </div>

        <!-- Moyenne d'entrées par collection -->
        <div class="card p-4">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Moyenne/collection</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ averageItemsPerPage }}</p>
            </div>
          </div>
        </div>

        <!-- Collection la plus populaire -->
        <div class="card p-4">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Type populaire</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ mostPopularCategory }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Activité récente -->
      <div v-if="stats.recentPages.length > 0" class="card p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Activité récente
        </h3>
        <div class="space-y-3">
          <div v-for="page in stats.recentPages" :key="page.name" class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span class="text-gray-900 dark:text-white font-medium">{{ page.name }}</span>
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(page.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des pages -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="pages.length === 0" class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-4 text-gray-400">
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune page d'inventaire</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Créez votre première page pour commencer à organiser vos données</p>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Créer ma première page
      </button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="page in pages" 
        :key="page.id" 
        class="card p-4 hover:shadow-md transition-shadow cursor-pointer group"
        @click="$router.push(`/page/${page.id}`)"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-3 min-w-0">
            <div class="w-8 h-8 text-primary-600 dark:text-primary-400 flex-shrink-0" v-html="getPageLogo(page.logo)"></div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">
              {{ page.name }}
            </h3>
          </div>
          <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <button 
              @click.stop="editPage(page)" 
              class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Renommer"
            >
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button 
              @click.stop="deletePage(page)" 
              class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
              title="Supprimer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="mt-3 flex flex-col space-y-1">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ page.columns?.length || 0 }} colonnes
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-500">
            Créé le {{ formatDate(page.created_at) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2 class="text-xl font-bold mb-4">{{ editingPage ? 'Renommer la page' : 'Nouvelle page d\'inventaire' }}</h2>
        
        <form @submit.prevent="savePage">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Nom de la page</label>
            <input 
              v-model="pageForm.name" 
              type="text" 
              class="input" 
              placeholder="Ex: Ma collection de livres"
              required
              ref="nameInput"
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Logo/Icône</label>
            <div class="grid grid-cols-6 gap-2">
              <button 
                 v-for="logo in availableLogos" 
                 :key="logo.name"
                 type="button"
                 @click="pageForm.logo = logo.name"
                 :class="[
                   'p-3 rounded-lg border-2 transition-all hover:scale-105',
                   pageForm.logo === logo.name 
                     ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                     : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                 ]"
                 :title="logo.label"
               >
                 <div class="w-6 h-6 mx-auto" v-html="logo.svg"></div>
               </button>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary" :disabled="!pageForm.name.trim()">
              {{ editingPage ? 'Renommer' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal" @click.stop>
        <h2 class="text-xl font-bold mb-4 text-red-600">Supprimer la page</h2>
        
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Voulez-vous vraiment supprimer la page <strong>"{{ pageToDelete?.name }}"</strong> ?
        </p>
        
        <div class="flex justify-end space-x-3">
          <button @click="closeDeleteModal" class="btn btn-secondary">
            Annuler
          </button>
          <button @click="confirmFirstDelete" class="btn btn-danger">
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation finale -->
    <div v-if="showFinalDeleteModal" class="modal-overlay" @click="closeFinalDeleteModal">
      <div class="modal" @click.stop>
        <h2 class="text-xl font-bold mb-4 text-red-600">Confirmation finale</h2>
        
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          <strong>Cette action est irréversible.</strong> Confirmez-vous la suppression définitive de la page <strong>"{{ pageToDelete?.name }}"</strong> ?
        </p>
        
        <div class="flex justify-end space-x-3">
          <button @click="closeFinalDeleteModal" class="btn btn-secondary">
            Annuler
          </button>
          <button @click="confirmFinalDelete" class="btn btn-danger">
            Confirmer la suppression
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { pagesService, statsService } from '@/services/supabase'
import { usePages } from '@/composables/usePages'

// État
const loading = ref(true)

// Utiliser le composable global pour les pages
const { pages, loadPages, addPage, updatePage, removePage } = usePages()
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const showFinalDeleteModal = ref(false)
const editingPage = ref(null)
const pageToDelete = ref(null)
const nameInput = ref(null)
const pageForm = ref({
  name: '',
  logo: 'collection'
})
const stats = ref({
  totalPages: 0,
  totalItems: 0,
  recentPages: [],
  logoStats: {}
})

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

// Méthodes
const loadData = async () => {
  try {
    loading.value = true
    await loadPages()
    await loadStats()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const statsData = await statsService.getGlobalStats()
    stats.value = statsData
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

const savePage = async () => {
  console.log('savePage appelée', { editingPage: editingPage.value, pageForm: pageForm.value })
  try {
    if (editingPage.value) {
      console.log('Mise à jour de la page:', editingPage.value.id)
      const updatedPage = await pagesService.updatePage(editingPage.value.id, { 
        name: pageForm.value.name,
        logo: pageForm.value.logo 
      })
      updatePage(editingPage.value.id, updatedPage)
    } else {
      console.log('Création d\'une nouvelle page')
      const newPage = await pagesService.createPage({ 
        name: pageForm.value.name,
        logo: pageForm.value.logo 
      })
      addPage(newPage)
    }
    await loadStats()
    closeModal()
    console.log('Sauvegarde réussie')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

const editPage = async (page) => {
  editingPage.value = page
  pageForm.value.name = page.name
  pageForm.value.logo = page.logo || 'collection'
  showCreateModal.value = true
  await nextTick()
  nameInput.value?.focus()
}

const deletePage = (page) => {
  pageToDelete.value = page
  showDeleteModal.value = true
}

const confirmFirstDelete = () => {
  showDeleteModal.value = false
  showFinalDeleteModal.value = true
}

const confirmFinalDelete = async () => {
  try {
    await pagesService.deletePage(pageToDelete.value.id)
    removePage(pageToDelete.value.id)
    await loadStats()
    closeFinalDeleteModal()
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingPage.value = null
  pageForm.value.name = ''
  pageForm.value.logo = 'collection'
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  pageToDelete.value = null
}

const closeFinalDeleteModal = () => {
  showFinalDeleteModal.value = false
  pageToDelete.value = null
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Propriétés calculées pour les statistiques
const averageItemsPerPage = computed(() => {
  if (stats.value.totalPages === 0) return 0
  return Math.round(stats.value.totalItems / stats.value.totalPages)
})

const mostPopularCategory = computed(() => {
  const logoStats = stats.value.logoStats
  if (!logoStats || Object.keys(logoStats).length === 0) return 'Aucune'
  
  const mostPopular = Object.entries(logoStats).reduce((a, b) => 
    logoStats[a[0]] > logoStats[b[0]] ? a : b
  )
  
  // Capitaliser la première lettre
  return mostPopular[0].charAt(0).toUpperCase() + mostPopular[0].slice(1)
})

// Récupérer le SVG d'un logo
const getPageLogo = (logoName) => {
  const logo = availableLogos.value.find(l => l.name === logoName)
  return logo ? logo.svg : availableLogos.value[0].svg // Fallback vers le premier logo
}

// Initialisation
onMounted(() => {
  loadData()
})
</script>