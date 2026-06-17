import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'mui';
            if (id.includes('recharts') || id.includes('d3-')) return 'charts';
            if (id.includes('@reduxjs') || id.includes('react-redux')) return 'redux';
            if (id.includes('react-dom') || id.includes('react-router')) return 'vendor';
          }
        },
      },
    },
  },
})
