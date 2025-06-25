<template>
  <!-- Notification de mise à jour -->
  <div v-if="showUpdatePrompt" class="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:w-96">
    <div class="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-lg border border-green-200 dark:border-green-700 p-4">
      <div class="flex items-start space-x-3">
        <div class="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-green-900 dark:text-green-100">
            Mise à jour disponible
          </h3>
          <p class="text-sm text-green-700 dark:text-green-300 mt-1">
            Une nouvelle version d'Inventory est disponible
          </p>
          <div class="flex space-x-2 mt-3">
            <button 
              @click="updatePWA" 
              class="text-sm bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors"
            >
              Mettre à jour
            </button>
            <button 
              @click="dismissUpdatePrompt" 
              class="text-sm text-green-700 dark:text-green-300 px-3 py-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
        <button 
          @click="dismissUpdatePrompt" 
          class="text-green-400 hover:text-green-600 dark:hover:text-green-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showUpdatePrompt = ref(false)
let updateSW = null

onMounted(() => {
  // Désactiver complètement tous les pop-ups d'installation PWA
  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher le pop-up d'installation du navigateur
    e.preventDefault()
    console.log('📱 PWA: Pop-up d\'installation désactivé')
  })
  
  // Écouter les mises à jour du service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
        showUpdatePrompt.value = true
        updateSW = event.data.updateSW
      }
    })
  }
})

const updatePWA = () => {
  if (updateSW) {
    updateSW()
  } else {
    // Recharger la page pour appliquer la mise à jour
    window.location.reload()
  }
  showUpdatePrompt.value = false
}

const dismissUpdatePrompt = () => {
  showUpdatePrompt.value = false
}
</script> 