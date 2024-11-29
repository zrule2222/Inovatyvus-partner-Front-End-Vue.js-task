import { defineStore } from 'pinia';
import axios from 'axios';

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [], // Array of tasks
    authors: [], // Array of authors
    columns: [], // Array of columns
    selectedAuthor: null, // Filter for selected author
    searchQuery: '', // Search query for task filtering
    currentPage: 1, // Current pagination page
    tasksPerPage: 10, // Number of tasks per page for pagination
    authorsPerPage: 10, // Number of authors per page for pagination
    dataFetched: false, // Flag to check if data is fetched
    paginatedTasks: {}, // Object to store tasks by author ID for pagination
    toastMessage: '', // Toast message to show feedback
    toastType: '', // Type of toast message ("success" or "error")
  }),
  getters: {
    // Filters tasks based on search query and selected author
    filteredTasks(state) {
      const tasks = state.selectedAuthor
        ? state.tasks.filter(task => task.author_id === state.selectedAuthor)
        : state.tasks;

      return tasks.filter((task) => {
        const matchesSearch = state.searchQuery
          ? task.title.toLowerCase().includes(state.searchQuery.toLowerCase())
          : true;
        return matchesSearch;
      });
    },



    // Calculates the total number of task pages for the selected author
    totalTaskPages(state) {
      if (!state.selectedAuthor) {
        return 0;
      }
      const authorTasks = state.paginatedTasks[state.selectedAuthor] || [];
      return Math.ceil(authorTasks.length / state.tasksPerPage);
    },
  },
  actions: {
    // Fetches task data from localStorage or an API
    async fetchData() {
      if (this.dataFetched) return;

      const storedData = localStorage.getItem('taskData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        this.columns = parsedData.columns;
        this.authors = parsedData.authors;
        this.tasks = parsedData.tasks.map((task) => ({
          ...task,
          column: task.current_column || 'To do',
        }));
        this.dataFetched = true;
        this.processTasksPagination();
        return;
      }

      let attempts = 3;
      while (attempts > 0) {
        try {
          const { data } = await axios.get('/api/frontend-task-data.json');
          this.columns = data.columns;
          this.authors = data.authors;
          this.tasks = data.tasks.map((task) => ({
            ...task,
            column: task.current_column || 'To do',
          }));

          // Store data in localStorage
          localStorage.setItem('taskData', JSON.stringify({
            columns: this.columns,
            authors: this.authors,
            tasks: this.tasks,
          }));
          localStorage.setItem('lastFetchedTime', Date.now().toString());

          this.dataFetched = true;
          this.processTasksPagination();
          return;
        } catch (error) {
          console.error(`Attempt failed, remaining retries: ${attempts - 1}`, error);
          attempts--;
          if (attempts === 0) {
            console.error('All attempts to fetch data failed');
          }
        }
      }
    },

    // Process tasks and group them by author for pagination
    processTasksPagination() {
      this.tasks.forEach(task => {
        if (!this.paginatedTasks[task.author_id]) {
          this.paginatedTasks[task.author_id] = [];
        }
        this.paginatedTasks[task.author_id].push(task);
      });
    },


    // Set the selected author for filtering tasks
    setSelectedAuthor(authorId) {
      this.selectedAuthor = authorId;
      this.currentPage = 1; // Reset to page 1 when author changes
      if (this.selectedAuthor) {
        this.paginateAuthorTasks();
      }
    },

    // Paginate tasks by selected author
    paginateAuthorTasks() {
      if (this.selectedAuthor) {
        const authorTasks = this.tasks.filter(task => task.author_id === this.selectedAuthor);
        this.paginatedTasks[this.selectedAuthor] = authorTasks;
      }
    },

    // Updates the search query and resets to page 1
    updateSearchQuery(query) {
      this.searchQuery = query;
      this.currentPage = 1; // Reset to page 1 when search changes
    },

    // Create a new task and update the task list
    async createTask({ title, authorId }) {
      try {
        const lastTask = this.tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
        const newId = lastTask + 1;

        const newTask = {
          id: newId,
          title,
          author_id: authorId,
          date_created: new Date().toISOString().split('T')[0],
          column: 'To do',
          current_column: 'To do',
        };

        // Add new task to tasks array and paginatedTasks
        this.tasks.push(newTask);
        if (!this.paginatedTasks[authorId]) {
          this.paginatedTasks[authorId] = [];
        }
        this.paginatedTasks[authorId].push(newTask);

        // Store updated data in localStorage
        localStorage.setItem('taskData', JSON.stringify({
          columns: this.columns,
          authors: this.authors,
          tasks: this.tasks,
        }));

        // Process pagination
        this.processTasksPagination();

        // Show success toast
        this.toastMessage = 'Task added successfully!';
        this.toastType = 'success';

        // Clear the toast message after 3 seconds
        setTimeout(() => {
          this.toastMessage = '';
        }, 3000);

      } catch (error) {
        console.error('Failed to create task');

        // Show error toast
        this.toastMessage = 'Failed to create task';
        this.toastType = 'error';

        // Clear the toast message after 3 seconds
        setTimeout(() => {
          this.toastMessage = '';
        }, 3000);
      }
    },
  },
  persist: true, // Persist store data to localStorage
});
