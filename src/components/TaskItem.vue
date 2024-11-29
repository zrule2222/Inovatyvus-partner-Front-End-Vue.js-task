<template>
  <!-- Container for the task item with a border and shadow -->
  <div class="border border-gray-300 rounded-md p-4 shadow-sm bg-white">
    

    <h3 class="font-bold text-lg">{{ task.title }}</h3>
    

    <p class="text-sm text-gray-600">Author: {{ author }}</p>
    

    <p class="text-xs text-gray-400">Date Created: {{ task.date_created }}</p>
  </div>
</template>

<script setup>

defineProps({ 
  task: Object,
  author: String
});
</script>
