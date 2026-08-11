import { defineConfig, type UserConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig(({ mode }): UserConfig => {
const isProd = mode === 'production'
// NOTE: @vitejs/plugin-react reads NODE_ENV when it is *imported*, so it cannot
// be set from here — the build script pins it (cross-env NODE_ENV=production).
// With NODE_ENV=development the build shipped the DEV jsx runtime: an Error
// object allocated per JSX element and +130KB of React.
return ({
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
})})