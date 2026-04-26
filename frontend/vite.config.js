import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

const version = fs.readFileSync(path.resolve(__dirname, '../VERSION'), 'utf-8').trim();

export default defineConfig({
  base: '/llm_robot_medical/',
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  server: {
    port: parseInt(process.env.PORT || '5173', 10),
    proxy: {
      '/api': {
        target: 'http://localhost:8042',
        changeOrigin: true,
        timeout: 0,
        proxyTimeout: 0,
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:8042',
        changeOrigin: true,
        timeout: 0,
        proxyTimeout: 0,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: function(id) {
          if (id.includes('node_modules')) {
            if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) {
              return 'vendor-react';
            }
            if (id.includes('/react-router') || id.includes('/react-i18next/') || id.includes('/i18next/')) {
              return 'vendor-router-i18n';
            }
            if (
              id.includes('/three/') || id.includes('/@react-three/') ||
              id.includes('/troika-') || id.includes('/@mediapipe/') ||
              id.includes('/meshline/') || id.includes('/maath/') ||
              id.includes('/three-mesh-bvh/') || id.includes('/three-stdlib/') ||
              id.includes('/camera-controls/') || id.includes('/detect-gpu/') ||
              id.includes('/suspend-react/') || id.includes('/tunnel-rat/') ||
              id.includes('/zustand/') || id.includes('/stats-gl/') ||
              id.includes('/stats.js/') || id.includes('/hls.js/') ||
              id.includes('/@use-gesture/') || id.includes('/@monogrid/') ||
              id.includes('/glsl-noise/') || id.includes('/cross-env/')
            ) {
              return 'vendor-three';
            }
            if (id.includes('/lucide-react/')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
})
