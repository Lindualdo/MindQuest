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
            // Excluir endpoints que são handlers do Vercel (não devem passar pelo proxy)
            const vercelHandlers = ['/concluir-quest'];
            const pathWithoutApi = path.replace(/^\/api/, '');
            
            // Se for um handler do Vercel, não fazer rewrite (deixa passar para o handler)
            if (vercelHandlers.includes(pathWithoutApi)) {
              return path; // Retorna o path original para o handler do Vercel processar
            }
            
            const suffix = pathWithoutApi;
            const prefix = basePathname ? basePathname : '';
            return `${prefix}${suffix}`;
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
