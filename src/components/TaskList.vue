<template>
  <!-- Container for the task columns -->
  <div class="flex flex-wrap flex-col xl:flex-row md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4">
    
    <!-- Loop through grouped tasks and render them in their respective columns -->
    <div
      v-for="(tasksInColumn, column) in groupedTasks"
      :key="column"
      class="flex-1 p-4 bg-gray-100 rounded-lg"
      @dragover.prevent
      @drop="onDrop(column)"
    >
      <h2 class="text-xl font-semibold mb-4 text-center md:text-left">{{ column }}</h2>
      
      <!-- Loop through tasks in each column and render them -->
      <div
        v-for="task in tasksInColumn"
        :key="task.id"
        class="mb-4 p-4 bg-white rounded shadow-md"
        draggable="true"
        @dragstart="startDrag(task)"
      >
        <!-- TaskItem component for displaying task details -->
        <TaskItem :task="task" :author="getAuthorById(task.author_id)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import TaskItem from './TaskItem.vue';


const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  authors: {
    type: Array,
    required: true,
  },
});

// Reactive reference for the currently dragged task
let draggedTask = null;

// Group tasks by their respective columns
const groupedTasks = computed(() => {
  const grouped = props.columns.reduce((acc, column) => {
    acc[column] = [];
    return acc;
  }, {});

  // Assign tasks to their respective columns
  props.tasks.forEach((task) => {
    const column = task.current_column || 'Uncategorized';
    if (!grouped[column]) {
      grouped[column] = [];
    }
    grouped[column].push(task); // Add task to the correct column
  });

  return grouped;
});

// Get the author's display name by their ID
function getAuthorById(authorId) {
  const author = props.authors.find((author) => author.id === authorId);
  return author ? author.display_name : 'Unknown'; // Return 'Unknown' if the author is not found
}

// Drag-and-drop functionality

// Store the dragged task when dragging starts
function startDrag(task) {
  draggedTask = task;
}

// Update the task's column when dropped into a new column
function onDrop(newColumn) {
  if (draggedTask && draggedTask.current_column !== newColumn) {
    // Change the task's current column to the new column
    draggedTask.current_column = newColumn;

    // Update the task in local storage
    const taskData = JSON.parse(localStorage.getItem('taskData')) || { tasks: [] };
    const taskIndex = taskData.tasks.findIndex((t) => t.id === draggedTask.id);

    if (taskIndex !== -1) {
      taskData.tasks[taskIndex].current_column = newColumn;  // Update column in task data
      localStorage.setItem('taskData', JSON.stringify(taskData)); // Save updated data to local storage
    }

    draggedTask = null; // Clear the dragged task reference
  }
}
</script>
