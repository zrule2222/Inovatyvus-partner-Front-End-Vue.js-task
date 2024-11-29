<template>
  <div class="flex flex-col md:flex-row gap-4 mb-4">
    <!-- Search input -->
    <input
      v-model="query" 
      type="text"
      placeholder="Search tasks by title" 
      class="border rounded-md p-2 flex-1" 
      @input="updateQuery"
    />

    <!-- Author filter dropdown -->
    <select
      v-model="selectedAuthor" 
      @change="onAuthorChange" 
      class="border rounded-md p-2 flex-1" 
    >
      <!-- Option to select all authors -->
      <option value="">All Authors</option>

      <!-- Loop through the authors and display each one as an option -->
      <option v-for="author in authors" :key="author.id" :value="author.id">
        {{ author.display_name }}
      </option>
    </select>

    <button
      @click="clearFilters" 
      class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition" 
    >
      Clear Filters
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTaskStore } from '../store/taskStore';

// Accessing the task store
const taskStore = useTaskStore();

// Declaring reactive references for query and selected author
const query = ref(taskStore.searchQuery); 
const selectedAuthor = ref(taskStore.selectedAuthor);

// Using computed to get authors from the store
const authors = computed(() => taskStore.authors);

// Method to update the search query in the store
function updateQuery() {
  taskStore.updateSearchQuery(query.value);
}

// Method to handle author selection change
function onAuthorChange() {
  taskStore.setSelectedAuthor(selectedAuthor.value);
}

// Method to clear the search query and author filter
function clearFilters() {
  query.value = ''; 
  selectedAuthor.value = ''; 
  taskStore.updateSearchQuery(''); 
  taskStore.setSelectedAuthor('');

  // Emit an event to notify the parent that the filters were cleared
  emit('filtersCleared');
}
</script>
