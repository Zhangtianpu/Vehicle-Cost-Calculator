import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild, mode }) => ({
  base: '/',
  build: {
    sourcemap: 'hidden',
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              recharts: ['recharts'],
            },
          },
        },
  },
  plugins: [
    react({
      babel: {
        plugins: mode === 'development' ? ['react-dev-locator'] : [],
      },
    }),
    tsconfigPaths()
  ],
}))
