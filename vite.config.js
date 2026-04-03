import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting - split large chunks automatically
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'mui': ['@mui/material', '@mui/icons-material', '@mui/lab', '@mui/system'],
          'leaflet': ['leaflet', 'leaflet-draw', 'react-leaflet', 'react-leaflet-draw'],
          'charts': ['recharts'],
          'animations': ['framer-motion'],
          'lottie-vendor': ['lottie-react', 'lottie-web'],
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        }
      }
    },
    // Increase chunk size warning limit (optional)
    chunkSizeWarningLimit: 1500,
    // Optimize CSS
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    sourcemap: false, // Disable for production
  },
  server: {
    // Optimize dev server
    middlewareMode: false,
    hmr: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material', 'react', 'react-dom', 'framer-motion'],
    exclude: ['lottie-react', '@tsparticles/react', 'tsparticles'] // Lazy load these
  }
})
