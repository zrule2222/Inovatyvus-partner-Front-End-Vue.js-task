<template>
  <div class="flex flex-col md:flex-row">
    <!-- Left side for adding tasks -->
    <AddTask class="w-full md:w-1/3" />

    <!-- Vertical line divider between add task section and task list -->
    <div class="hidden md:block w-px bg-gray-300"></div>

    <!-- Right side for displaying tasks -->
    <div class="flex-1 p-4">
      
      <!-- Filters section with TaskFilters component, emits event when filters are cleared -->
      <TaskFilters :authors="getAuthors" @filtersCleared="onFiltersCleared" />

      <!-- Pagination controls, only visible if filtering is applied and there are more than 10 tasks -->
      <div
        v-if="isFiltering && getFilteredTasks.length > 10"
        class="mt-4 flex justify-between items-center"
      >

        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        

        <span class="text-gray-700 font-semibold">
          Page {{ currentPage }} of {{ totalTaskPages }}
        </span>
        

        <button
          @click="nextPage"
          :disabled="currentPage === totalTaskPages"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <!-- Task list -->
      <div v-if="getFilteredTasks.length > 0" class="mt-6">
        <TaskList
          :tasks="shouldPaginate ? getPaginatedTasks : getFilteredTasks"
          :columns="getColumns"
          :authors="getAuthors"
        />
      </div>
      
      <!-- Message when no tasks match the filters -->
      <div v-else class="text-center text-gray-500 mt-6">
        <p>No tasks found.</p>
      </div>

      <!-- Loading indicator when tasks are being fetched -->
      <div v-if="isLoading" class="text-center mt-6 text-blue-500">Loading tasks...</div>
    </div>
  </div>
</template>

<script>
import { useTaskStore } from '../store/taskStore'; 
import TaskFilters from '../components/TaskFilters.vue';
import TaskList from '../components/TaskList.vue';
import AddTask from '../components/AddTask.vue';

export default {
  name: 'BoardView',
  components: { TaskFilters, TaskList, AddTask },
  
  computed: {
    // Check if tasks are still loading (based on whether store has tasks or not)
    isLoading() {
      return this.store.tasks.length === 0;
    },

    // Get filtered tasks based on search query and selected author
    getFilteredTasks() {
      const store = this.store;
      const tasks = store.selectedAuthor
        ? store.tasks.filter((task) => task.author_id === store.selectedAuthor)
        : store.tasks;
      return tasks.filter((task) => {
        const matchesSearch = store.searchQuery
          ? task.title.toLowerCase().includes(store.searchQuery.toLowerCase())
          : true;
        return matchesSearch;
      });
    },

    // Check if any filters are applied (search query or selected author)
    isFiltering() {
      const store = this.store;
      return store.searchQuery !== '' || !!store.selectedAuthor;
    },

    // Determine if pagination should be applied based on filtering and task count
    shouldPaginate() {
      return this.isFiltering && this.getFilteredTasks.length > 10;
    },

    // Calculate the total number of pages for paginated tasks
    totalTaskPages() {
      return this.shouldPaginate
        ? Math.max(Math.ceil(this.getFilteredTasks.length / 10), 1)
        : 1;
    },

    // Get the current page number from the store
    currentPage() {
      return this.store.currentPage;
    },

    // Get paginated tasks for the current page
    getPaginatedTasks() {
      const store = this.store;
      const start = (this.currentPage - 1) * 10;
      const end = start + 10;
      return this.getFilteredTasks.slice(start, end); // Return the tasks for the current page
    },

    // Get authors from the store
    getAuthors() {
      return this.store.authors;
    },

    // Get columns from the store
    getColumns() {
      return this.store.columns;
    }
  },
  
  data() {
    return {
      store: useTaskStore(), // Initialize store to manage task data
    };
  },

  mounted() {
    this.store.fetchData();
  },

  methods: {
    nextPage() {
      if (this.currentPage < this.totalTaskPages) {
        this.store.currentPage++;
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.store.currentPage--;
      }
    },

    // Reset page to 1 when filters are cleared
    onFiltersCleared() {
      this.store.currentPage = 1;
    },
  },
};
</script>
