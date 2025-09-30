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

// Log de inicialização
if (isDevelopment) {
  console.log('🚀 MindQuest v1.1 iniciando...');
  console.log('🔗 Modo:', isDevelopment ? 'Desenvolvimento' : 'Produção');
  console.log('🌐 API Base:', 'https://mindquestr-n8n.cloudfy.live/webhook');
}

// Renderização principal
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
