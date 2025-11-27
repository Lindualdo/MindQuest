import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const defaultRemoteBase = 'https://mindquest-n8n.cloudfy.live/webhook'
  const rawRemoteBase = (env.VITE_API_BASE_URL || defaultRemoteBase).trim()

  let targetOrigin = 'https://mindquest-n8n.cloudfy.live'
  let basePathname = '/webhook'

  try {
    const parsed = new URL(rawRemoteBase)
    targetOrigin = `${parsed.protocol}//${parsed.host}`
    basePathname = parsed.pathname.replace(/\/$/, '') || ''
  } catch {
    // Mantém valores padrão caso a URL seja inválida
  }

  const isDevMode = mode === 'development'
  const shouldUseProxy =
    typeof env.VITE_API_USE_PROXY === 'string'
      ? env.VITE_API_USE_PROXY.toLowerCase() === 'true'
      : isDevMode && !env.VITE_API_BASE_URL

  const proxyConfig = shouldUseProxy
    ? {
        '/api': {
          target: targetOrigin,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => {
            // Em dev, fazer proxy direto para o n8n (handlers do Vercel não funcionam localmente)
            // Em produção, os handlers do Vercel interceptam antes do proxy
            const pathWithoutApi = path.replace(/^\/api/, '');
            const suffix = pathWithoutApi.startsWith('/') ? pathWithoutApi : `/${pathWithoutApi}`;
            const prefix = basePathname ? basePathname : '';
            const finalPath = `${prefix}${suffix}`;
            console.log('[Vite Proxy] Rewrite:', { original: path, final: finalPath });
            return finalPath;
          },
        },
      }
    : undefined

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: proxyConfig,
    },
    preview: {
      proxy: proxyConfig,
    },
  }
})
