<template>
  <div>
    <!-- Toast Message: Displays success or error message -->
    <div
      v-if="toastMessage"  
      :class="[  
        'fixed bottom-5 left-1/2 transform -translate-x-1/2 py-3 px-6 rounded-lg shadow-lg text-center',
        toastType === 'success' ? 'bg-green-500' : 'bg-red-500',
        'text-white font-medium'
      ]"
    >
      {{ toastMessage }}
    </div>

    <!-- Task Add Form: Allows users to add a new task -->
    <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-700 mb-6 text-center">Add New Task</h2> <!-- Form title -->

      <!-- Task Form -->
      <form @submit.prevent="addTask">  <!-- Prevent default form submission and trigger addTask method -->
        
        <!-- Task Title Input Field -->
        <div class="mb-5">
          <label for="title" class="block text-sm font-medium text-gray-600 mb-2">
            Task Title
          </label>
          <input
            id="title"
            v-model="newTask.title" 
            type="text"
            class="block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter task title"
            required
          />
        </div>

        <!-- Author Selection Input Field -->
        <div class="mb-5">
          <label for="author" class="block text-sm font-medium text-gray-600 mb-2">
            Author
          </label>
          <select
            id="author"
            v-model="newTask.author_id"
            class="block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="" disabled>Select an author</option>
            <!-- Loop through the authors and display each one as an option -->
            <option v-for="author in getAuthors" :key="author.id" :value="author.id">
              {{ author.display_name }}
            </option>
          </select>
        </div>


        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200"
        >
          Add Task
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { useTaskStore } from "../store/taskStore";

export default {
  name: "AddTask",
  data() {
    return {
      // Initial data for the new task input fields
      newTask: {
        title: "",        
        author_id: null,
      },
    };
  },
  computed: {
    // Computed properties to get data from the task store
    toastMessage() {
      return useTaskStore().toastMessage;
    },
    toastType() {
      return useTaskStore().toastType;
    },
    // Fetch authors from the store
    getAuthors() {
      return useTaskStore().authors;
    },
  },
  methods: {
    // Method to handle the task submission
    addTask() {
      const { title, author_id } = this.newTask; // Destructure the task data

      // Check if both title and author are provided
      if (title && author_id) {
        // Call the store method to create a new task
        useTaskStore().createTask({ title, authorId: author_id });

        // Reset the form fields after successful task addition
        this.newTask.title = "";
        this.newTask.author_id = null;
      }
    },
  },
};
</script>
