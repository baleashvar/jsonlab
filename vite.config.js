import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        python: 'tools/python/index.html',
        golang: 'tools/golang/index.html'
      }
    },
    cssMinify: true
  },
  publicDir: 'public'
});
