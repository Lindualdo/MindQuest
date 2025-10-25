/**
 * ARQUIVO: src/main.tsx
 * AÇÃO: SUBSTITUIR arquivo existente (se existir) ou CRIAR
 * 
 * Ponto de entrada da aplicação com ErrorBoundary
 * Configuração inicial e renderização do App
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';

// Configurações globais
const isDevelopment = import.meta.env.DEV;
const defaultApiBase = 'https://mindquest-n8n.cloudfy.live/webhook';
const rawApiBase =
  typeof import.meta.env.VITE_API_BASE_URL === 'string' && import.meta.env.VITE_API_BASE_URL.trim()
    ? import.meta.env.VITE_API_BASE_URL.trim()
    : defaultApiBase;
const normalizedApiBase = rawApiBase.replace(/\/$/, '');
const shouldUseProxy =
  typeof import.meta.env.VITE_API_USE_PROXY === 'string'
    ? import.meta.env.VITE_API_USE_PROXY.toLowerCase() === 'true'
    : (isDevelopment && !import.meta.env.VITE_API_BASE_URL);

// Log de inicialização
if (isDevelopment) {
  console.log('🚀 MindQuest v1.1 iniciando...');
  console.log('🔗 Modo:', isDevelopment ? 'Desenvolvimento' : 'Produção');
  console.log('🌐 API Base:', normalizedApiBase);
  console.log('🔁 Proxy ativo:', shouldUseProxy ? 'sim' : 'não');
}

// Renderização principal
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
