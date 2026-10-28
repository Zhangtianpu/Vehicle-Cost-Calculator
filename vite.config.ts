import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild, mode }) => ({
  base: '/',
  build: {
    sourcemap: 'hidden',
    modulePreload: {
      resolveDependencies: (_filename, dependencies, context) =>
        context.hostType === 'html'
          ? dependencies.filter((dependency) => !dependency.includes('/recharts-'))
          : dependencies,
    },
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              react: ['react', 'react-dom', 'react-router-dom'],
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
