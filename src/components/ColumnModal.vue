<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal max-w-lg" @click.stop>
      <h2 class="text-xl font-bold mb-6">{{ editingColumn ? 'Modifier la colonne' : 'Ajouter une nouvelle colonne' }}</h2>
      
      <form @submit.prevent="save">
        <!-- Nom de la colonne -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Nom de la colonne</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="input" 
            placeholder="Ex: État, Quantité, Catégorie..."
            required
            ref="nameInput"
          >
        </div>
        
        <!-- Type de propriété -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Type de propriété</label>
          <select v-model="form.type" class="input">
            <option value="text">Texte</option>
            <option value="number">Nombre</option>
            <option value="checkbox">Case à cocher</option>
            <option value="select">Choix multiple</option>
          </select>
        </div>
        
        <!-- Options pour le choix multiple -->
        <div v-if="form.type === 'select'" class="mb-4">
          <label class="block text-sm font-medium mb-2">Options disponibles</label>
          <div class="space-y-2">
            <div 
              v-for="(option, index) in form.options" 
              :key="index"
              class="flex items-center space-x-2"
            >
              <input 
                v-model="form.options[index]" 
                type="text" 
                class="input flex-1" 
                :placeholder="'Option ' + (index + 1)"
              >
              <button 
                type="button"
                @click="removeOption(index)"
                class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                title="Supprimer cette option"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <button 
            type="button"
            @click="addOption"
            class="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Ajouter une option</span>
          </button>
          
          <p class="text-xs text-gray-500 mt-2">
            Ajoutez les différentes valeurs possibles pour cette colonne (ex: "Bon état", "Moyen", "Mauvais état")
          </p>
        </div>
        
        <!-- Description du type sélectionné -->
        <div class="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <strong>{{ getTypeDescription().title }}</strong><br>
            {{ getTypeDescription().description }}
          </p>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-end space-x-3">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Annuler
          </button>
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="!isFormValid"
          >
            {{ editingColumn ? 'Modifier la colonne' : 'Ajouter la colonne' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'

// Props
const props = defineProps({
  editingColumn: {
    type: Object,
    default: null
  }
})

// Émissions
const emit = defineEmits(['close', 'save'])

// Références
const nameInput = ref(null)

// Formulaire
const form = ref({
  name: '',
  type: 'text',
  options: ['Option 1', 'Option 2']
})

// Computed
const isFormValid = computed(() => {
  if (!form.value.name.trim()) return false
  
  if (form.value.type === 'select') {
    return form.value.options.some(option => option.trim())
  }
  
  return true
})

// Méthodes
const getTypeDescription = () => {
  const descriptions = {
    text: {
      title: 'Texte',
      description: 'Permet de saisir du texte libre (noms, descriptions, commentaires, etc.)'
    },
    number: {
      title: 'Nombre',
      description: 'Permet de saisir des valeurs numériques (quantités, prix, scores, etc.)'
    },
    checkbox: {
      title: 'Case à cocher',
      description: 'Permet de marquer un élément comme vrai/faux (terminé/non terminé, disponible/indisponible, etc.)'
    },
    select: {
      title: 'Choix multiple',
      description: 'Permet de choisir une valeur parmi une liste prédéfinie (état, catégorie, priorité, etc.)'
    }
  }
  
  return descriptions[form.value.type] || descriptions.text
}

const addOption = () => {
  form.value.options.push(`Option ${form.value.options.length + 1}`)
}

const removeOption = (index) => {
  if (form.value.options.length > 1) {
    form.value.options.splice(index, 1)
  }
}

const save = () => {
  if (!isFormValid.value) return
  
  const columnData = {
    name: form.value.name.trim(),
    type: form.value.type
  }
  
  if (form.value.type === 'select') {
    columnData.options = form.value.options
      .filter(option => option.trim())
      .map(option => option.trim())
  }
  
  // Si on édite une colonne existante, inclure l'ID
  if (props.editingColumn) {
    columnData.id = props.editingColumn.id
  }
  
  emit('save', columnData)
}

// Initialiser le formulaire avec les données de la colonne à éditer
const initializeForm = () => {
  if (props.editingColumn) {
    form.value.name = props.editingColumn.name
    form.value.type = props.editingColumn.type
    if (props.editingColumn.type === 'select' && props.editingColumn.options) {
      form.value.options = [...props.editingColumn.options]
    } else {
      form.value.options = ['Option 1', 'Option 2']
    }
  } else {
    form.value.name = ''
    form.value.type = 'text'
    form.value.options = ['Option 1', 'Option 2']
  }
}

// Surveiller les changements de la prop editingColumn
watch(() => props.editingColumn, () => {
  initializeForm()
}, { immediate: true })

// Initialisation
onMounted(async () => {
  await nextTick()
  nameInput.value?.focus()
})
</script>