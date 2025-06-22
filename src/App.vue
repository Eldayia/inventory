<template>
  <div class="min-h-screen flex flex-col transition-colors duration-200" :class="{ 'dark': isDark }">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 relative z-30">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Menu hamburger (mobile) et Logo -->
          <div class="flex items-center">
            <!-- Bouton menu hamburger (visible sur mobile uniquement) -->
            <button 
              @click="toggleSidebar" 
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-3"
              :title="sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
            >
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <router-link to="/" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Inventory</h1>
            </router-link>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <!-- Bouton de thème -->
            <button 
              @click="toggleTheme" 
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :title="isDark ? 'Mode clair' : 'Mode sombre'"
            >
              <svg v-if="isDark" class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>
            
            <!-- Bouton paramètres -->
            <button 
              @click="showSettings = true" 
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Paramètres"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Layout avec sidebar -->
    <div class="flex">
      <!-- Overlay pour mobile -->
      <div 
        v-if="sidebarOpen" 
        @click="closeSidebar" 
        class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
      ></div>

      <!-- Sidebar -->
      <aside 
        :class="[
          'fixed lg:static left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-lg lg:shadow-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
        class="top-0 lg:top-0 h-screen lg:h-auto lg:min-h-screen"
      >
        <!-- Espace pour le header sur mobile -->
        <div class="h-16 lg:hidden bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
          <div class="flex items-center space-x-3">
            <div class="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span class="text-lg font-semibold text-gray-900 dark:text-white">Inventory</span>
          </div>
        </div>
        
        <nav class="h-full lg:h-auto px-4 py-6 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800">
          <!-- Navigation principale -->
          <div class="space-y-1">
            <router-link 
              to="/" 
              @click="closeSidebar"
              class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 group backdrop-blur-sm"
              :class="{ 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40': $route.path === '/' }"
            >
              <div class="p-1.5 rounded-lg mr-3 transition-colors" :class="$route.path === '/' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
                </svg>
              </div>
              <span class="font-medium">Accueil</span>
            </router-link>
          </div>

          <!-- Section Collections -->
          <div class="mt-8">
            <div class="px-4 mb-4">
              <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Collections
              </h3>
              <div class="h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
            </div>
            <div class="space-y-1">
              <div v-if="loadingPages" class="px-4 py-2">
                <div class="animate-pulse space-y-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
              <div v-else-if="pages.length === 0" class="px-4 py-6 text-center">
                <div class="text-gray-400 dark:text-gray-500 mb-2">
                  <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Aucune collection</p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Créez votre première collection</p>
              </div>
              <router-link 
                v-else
                v-for="page in pages" 
                :key="page.id" 
                :to="`/page/${page.id}`"
                @click="closeSidebar"
                class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 group backdrop-blur-sm mx-2"
                :class="{ 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40': $route.path === `/page/${page.id}` }"
              >
                <div class="p-1.5 rounded-lg mr-3 flex-shrink-0 transition-colors" :class="$route.path === `/page/${page.id}` ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'">
                  <div class="w-4 h-4" v-html="getPageLogo(page.logo || 'collection')"></div>
                </div>
                <span class="truncate text-sm font-medium">{{ page.name }}</span>
                <div v-if="$route.path === `/page/${page.id}`" class="ml-auto">
                  <div class="w-2 h-2 bg-white rounded-full opacity-60"></div>
                </div>
              </router-link>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Contenu principal -->
      <main class="flex-1 lg:ml-0 flex flex-col">
        <div class="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <router-view />
        </div>
      </main>
    </div>
    
    <!-- Pied de page fixe en bas -->
    <footer class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 mt-auto">
      <div class="px-4 sm:px-6 lg:px-8 py-4">
        <div class="text-center text-sm text-gray-500 dark:text-gray-400">
          <span>Inventory by EldaDev - </span>
          <a 
            href="https://github.com/Eldayia" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors underline"
          >
            https://github.com/Eldayia
          </a>
        </div>
      </div>
    </footer>
    
    <!-- Modal des paramètres -->
    <SettingsModal 
      :isOpen="showSettings" 
      @close="showSettings = false"
      @themeChange="handleThemeChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePages } from './composables/usePages'
import SettingsModal from './components/SettingsModal.vue'

// État
const isDark = ref(false)
const showSettings = ref(false)
const themePreference = ref('system')
const sidebarOpen = ref(false)
const route = useRoute()

// Utiliser le composable global pour les pages
const { pages, loadingPages, loadPages } = usePages()

// Gestion du thème
const toggleTheme = () => {
  // Cycle entre les modes: system -> light -> dark -> system
  if (themePreference.value === 'system') {
    themePreference.value = 'light'
  } else if (themePreference.value === 'light') {
    themePreference.value = 'dark'
  } else {
    themePreference.value = 'system'
  }
  
  localStorage.setItem('themePreference', themePreference.value)
  applyTheme()
}

const handleThemeChange = (newTheme) => {
  themePreference.value = newTheme
  applyTheme()
}

const applyTheme = () => {
  let shouldBeDark = false
  
  if (themePreference.value === 'dark') {
    shouldBeDark = true
  } else if (themePreference.value === 'light') {
    shouldBeDark = false
  } else {
    // Mode système
    shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  isDark.value = shouldBeDark
  updateDocumentClass()
}

const updateDocumentClass = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Gestion de la sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

// Les pages sont maintenant gérées par le composable global

// Fonction pour obtenir le logo d'une page
const getPageLogo = (logoName) => {
  const availableLogos = {
    'collection': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>',
    'manga': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
    'films': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"></path></svg>',
    'jeux vidéo': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 000 1.788l4 2z"></path><path d="M15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path></svg>',
    'lego': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',
    'livres': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path></svg>',
    'musique': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path></svg>',
    'sport': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"></path></svg>',
    'outils': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',
    'art': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"></path></svg>',
    'technologie': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',
    'cuisine': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',
    'manette de jeu': '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 000 1.788l4 2z"></path><path d="M15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path></svg>'
  }
  return availableLogos[logoName] || availableLogos['collection']
}

// Fermer la sidebar lors du changement de route sur mobile
watch(route, () => {
  if (window.innerWidth < 1024) {
    closeSidebar()
  }
})

// Initialisation
onMounted(() => {
  const savedThemePreference = localStorage.getItem('themePreference') || 'system'
  themePreference.value = savedThemePreference
  
  applyTheme()
  loadPages()
  
  // Écouter les changements de préférence système
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themePreference.value === 'system') {
      applyTheme()
    }
  })
  
  // Fermer la sidebar lors du redimensionnement vers desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeSidebar()
    }
  })
})
</script>