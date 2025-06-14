<template>
  <div class="min-h-screen transition-colors duration-200" :class="{ 'dark': isDark }">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo et titre -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">FlexiList</h1>
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

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view :developerMode="developerMode" />
    </main>
    
    <!-- Modal des paramètres -->
    <SettingsModal 
      :isOpen="showSettings" 
      @close="showSettings = false"
      @themeChange="handleThemeChange"
      @developerModeChange="handleDeveloperModeChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SettingsModal from './components/SettingsModal.vue'

// État
const isDark = ref(false)
const showSettings = ref(false)
const themePreference = ref('system')
const developerMode = ref(false)

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

const handleDeveloperModeChange = (newMode) => {
  developerMode.value = newMode
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

// Initialisation
onMounted(() => {
  const savedThemePreference = localStorage.getItem('themePreference') || 'system'
  themePreference.value = savedThemePreference
  
  const savedDeveloperMode = localStorage.getItem('developerMode') === 'true'
  developerMode.value = savedDeveloperMode
  
  applyTheme()
  
  // Écouter les changements de préférence système
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themePreference.value === 'system') {
      applyTheme()
    }
  })
})
</script>