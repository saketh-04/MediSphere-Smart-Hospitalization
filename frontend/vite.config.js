// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set envDir to one level up to load .env from the main folder
  envDir: '../'
})
