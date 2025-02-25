import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Build-specific configurations
  build: {
    sourcemap: true, // Enable source maps for debugging
    minify: 'Terser', // Use Terser for minification (default)
    /*terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements in production
        drop_debugger: true, // Remove debugger statements in production
      },
    },
    outDir: 'dist', // Output directory (default is 'dist')
    emptyOutDir: true, // Empty the output directory before building*/
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled'], // Ensure Emotion is optimized
  },
})
