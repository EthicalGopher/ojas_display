import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    // three.js lands in its own lazy chunk; it only loads with the 3D scenes.
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (/node_modules\/(react|react-dom|scheduler)\/|vite\/preload-helper/.test(id)) return 'react';
          if (/node_modules\/(three|@react-three|postprocessing|three-stdlib|maath|camera-controls)/.test(id)) {
            return 'three';
          }
          return undefined;
        },
      },
    },
  },
});
