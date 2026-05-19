import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

const firebaseShimPath = fileURLToPath(new URL('./src/firebase', import.meta.url))
const hasFirebasePackage = existsSync(fileURLToPath(new URL('./node_modules/firebase/package.json', import.meta.url)))

export default defineConfig({
  resolve: {
    alias: hasFirebasePackage ? {} : {
      firebase: firebaseShimPath,
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
