<template>
  <div class="cell-editor">
    <!-- Texte -->
    <input 
      v-if="column.type === 'text' || !column.type"
      v-model="localValue"
      @blur="save"
      @keyup.enter="save"
      type="text"
      class="inline-edit"
      :placeholder="'Saisir ' + column.name.toLowerCase()"
    >
    
    <!-- Nombre -->
    <input 
      v-else-if="column.type === 'number'"
      v-model.number="localValue"
      @blur="save"
      @keyup.enter="save"
      type="number"
      class="inline-edit"
      :placeholder="'0'"
    >
    
    <!-- Case à cocher -->
    <div v-else-if="column.type === 'checkbox'" class="flex items-center">
      <input 
        v-model="localValue"
        @change="save"
        type="checkbox"
        class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      >
    </div>
    
    <!-- Choix multiple -->
    <select 
      v-else-if="column.type === 'select'"
      v-model="localValue"
      @change="save"
      class="inline-edit bg-transparent"
    >
      <option value="">Choisir...</option>
      <option 
        v-for="option in column.options" 
        :key="option" 
        :value="option"
      >
        {{ option }}
      </option>
    </select>
    
    <!-- Type non reconnu - fallback vers texte -->
    <input 
      v-else
      v-model="localValue"
      @blur="save"
      @keyup.enter="save"
      type="text"
      class="inline-edit"
      :placeholder="'Saisir ' + column.name.toLowerCase()"
    >
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Props
const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: ''
  },
  column: {
    type: Object,
    required: true
  }
})

// Émissions
const emit = defineEmits(['update'])

// État local
const localValue = ref('')

// Initialiser la valeur locale
const initializeValue = () => {
  if (props.column.type === 'checkbox') {
    localValue.value = Boolean(props.value)
  } else if (props.column.type === 'number') {
    localValue.value = props.value || 0
  } else {
    localValue.value = props.value || ''
  }
}

// Sauvegarder la valeur
const save = () => {
  let valueToSave = localValue.value
  
  // Conversion selon le type
  if (props.column.type === 'number') {
    valueToSave = Number(localValue.value) || 0
  } else if (props.column.type === 'checkbox') {
    valueToSave = Boolean(localValue.value)
  } else if (props.column.type === 'text' || !props.column.type) {
    valueToSave = String(localValue.value || '').trim()
  }
  
  // Émettre seulement si la valeur a changé
  if (valueToSave !== props.value) {
    emit('update', valueToSave)
  }
}

// Watcher pour les changements de props
watch(() => props.value, () => {
  initializeValue()
}, { immediate: true })

watch(() => props.column, () => {
  initializeValue()
})

// Initialisation
onMounted(() => {
  initializeValue()
})
</script>

<style scoped>
.cell-editor {
  @apply w-full;
}

.inline-edit {
  @apply w-full min-w-0;
}

.inline-edit:focus {
  @apply bg-white dark:bg-gray-700 border border-primary-500 rounded px-2 py-1;
}

select.inline-edit {
  @apply cursor-pointer;
}

select.inline-edit:focus {
  @apply bg-white dark:bg-gray-700;
}
</style>