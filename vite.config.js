import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://asmeninis.lt',
        changeOrigin: true,
        secure: false, // Disable SSL verification if needed
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
