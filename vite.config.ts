import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [
            './src/scss'
          ],
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    server: {
      open: true,
      host: 'localhost',
      port: 3000,
    },
    define: {
      'process.env.DEVELOPMENT': JSON.stringify(mode !== 'production'),
      'process.env.API_ORIGIN': JSON.stringify(env.VITE_API_ORIGIN ?? ''),
    },
  }
})
