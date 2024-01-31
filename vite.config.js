import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/annual/',
  resolve: {
    alias: {
      '@/assets/': '/src/assets/',
      '@/utils/': '/src/utils/',
    },
    extensions: [
      '.ts',
      '.vue',
    ]
  },
})
