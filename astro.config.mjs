import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
  },
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'three': ['three'],
            'three-loaders': ['three/examples/jsm/loaders/GLTFLoader.js'],
            'gsap': ['gsap'],
            'gsap-scroll': ['gsap/ScrollTrigger'],
            'embla': ['embla-carousel-react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000, // Aumentar límite para three.js
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
  compressHTML: true,
});

