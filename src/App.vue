<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <BoardView />
  </div>
</template>

<script>
import BoardView from './views/BoardView.vue';

export default {
  components: {
    BoardView,
  },
};
</script>
