import { defineConfig, type UserConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig((): UserConfig => ({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  define: {
    VITE_NODE_ENV: JSON.stringify(process.env.VITE_NODE_ENV),
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
    minify: isProd ? 'terser' : 'esbuild',
    ...(isProd && {
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
      },
    }),
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-router')
          ) {
            return 'react-vendor'
          }
        },
      },
    },
  },
}))
